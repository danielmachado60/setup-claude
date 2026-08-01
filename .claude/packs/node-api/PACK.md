# Pack node-api — Node.js APIs and backends

> **How this file works:** this PACK.md defines the pack's conventions. The project's ABOUT.md
> is the local source of truth — in any conflict, ABOUT.md wins. Read both before any task.
> Wherever this file says "per ABOUT.md", the decision is per project and must be recorded
> there (under `## Constraints and notes`); if it isn't, ask before assuming. The
> `node-specialist` agent resides in `.claude/agents/` and activates when ABOUT.md points to
> this pack (`Active pack: node-api`).

## Pack scope

REST APIs, backend services, queue workers and CLIs in Node.js. Frontend does not go through
this pack. If the project is full-stack Next.js, the Next.js pack covers the route handlers —
this pack only comes in when there is a separate Node service.

## Default stack

| Role | Pack default | Note |
|---|---|---|
| Language | TypeScript in strict mode | plain JavaScript is forbidden in new code under this pack |
| Runtime | Active Node.js LTS | version pinned in `.nvmrc` or the `engines` field |
| HTTP framework | Fastify | Express accepted if the project already uses it — record it in ABOUT.md |
| Validation | Zod | the schema is the single source of truth; types via `z.infer` |
| Data access | Prisma or Drizzle | per ABOUT.md; never loose SQL in a controller |
| Logs | Pino (structured JSON) | `console.log` forbidden outside throwaway scripts |
| Tests | Vitest + request injection (`app.inject` / Supertest) | integration first |
| Auth | JWT or session | per ABOUT.md — see the Auth section |

## Layered structure (mandatory)

```
src/
  server.ts        # bootstrap: validate env → connect dependencies → listen → shutdown
  app.ts           # assembles the app (plugins, hooks, routes) WITHOUT listen — this is what tests import
  config/
    env.ts         # Zod schema for the environment variables (see the Env section)
  routes/          # HTTP layer: parsing, input validation, status codes, serialization
  services/        # pure business logic: receives validated data, returns a result or a domain error
  repositories/    # data access: queries, DB ↔ domain mapping
  schemas/         # shared Zod schemas (request, response, entities)
  errors/          # domain error classes + error → HTTP response mapping
  lib/             # infrastructure: logger, queue client, external HTTP client
tests/
  integration/     # boots the real app (without listen) and exercises endpoints end to end
  unit/            # services and pure functions
```

Dependency rules between layers — violating them is grounds for failing review:

- `routes` calls `services`. It **never** calls `repositories` nor contains business logic.
- `services` calls `repositories`. It **never** imports anything HTTP (request, reply, status code).
- `repositories` knows neither business logic nor HTTP. Data only.
- Domain `errors` don't know their HTTP status — the mapping lives in a central error handler
  in the HTTP layer.

## Input validation (at the edge)

- **All** external input (body, params, query, relevant headers) goes through a Zod schema
  before touching a service. No exceptions — including internal endpoints and webhooks.
- The TypeScript type comes from the schema (`z.infer<typeof schema>`), never hand-written in
  parallel.
- A validation failure returns **422** in the problem details format (below), listing each
  invalid field. Never leak Zod's raw message to the client — translate it to the project
  language (line 4 of ABOUT.md).
- Responses of public endpoints also have a schema: it prevents leaking internal fields
  (password hashes, admin flags) through object spreading.

## Errors — problem details format (RFC 9457)

Every API error response uses this format, with `Content-Type: application/problem+json`:

```json
{
  "type": "https://api.example.com/errors/validation",
  "title": "Invalid data",
  "status": 422,
  "detail": "The email field is not a valid email address.",
  "instance": "/users",
  "errors": [{ "field": "email", "message": "invalid format" }]
}
```

Rules:

- `errors[]` (extension) only appears on validation errors, one item per field.
- `title`/`detail` messages in the project language (line 4 of ABOUT.md) — they are read by
  the client's developers.
- Distinguish an **operational error** (invalid input, resource not found, conflict — respond
  4xx and the application carries on) from a **bug** (impossible state — log with stack,
  respond a generic 500 with no internal details, and on `unhandledRejection`/
  `uncaughtException` terminate the process).
- A single central error handler does the `domain error → status + problem details` mapping.
  No route builds an error response by hand.
- A 500 response **never** includes a stack trace, SQL query or internal message.

## Auth

The mechanism (stateless JWT vs cookie session) is a per-project decision, recorded in
ABOUT.md. Regardless of the mechanism:

- Passwords with Argon2id (or bcrypt cost ≥ 12 if the project already uses it). Never SHA/MD5.
- JWT: short expiry on the access token (≤ 15 min) + refresh token with rotation; secret/key
  via env; algorithm pinned at verification (never accept the token's own `alg`).
- Session: cookie `httpOnly`, `secure`, `sameSite=lax` at minimum; external store (Redis) if
  there is more than one instance.
- Authorization (what the user may do) is checked in the **service**, not just the route —
  the route protects the transport, the service protects the rule.
- Rate limiting on login, password recovery and any public write endpoint.

## Structured logs

- Pino with JSON output; in development, `pino-pretty` only via pipe (not in code).
- Every request has a `requestId` (generated or propagated from the header) present in **all**
  logs of that request — use `AsyncLocalStorage` or the framework's child logger, never pass
  a logger as a parameter through the whole stack.
- Never log: passwords, tokens, full request bodies with personal data, card numbers.
  Personal identifiers (national ID numbers, email) only masked. Data-protection law applies
  to logs too (the market's specific law lives in the locale file).
- Levels: `info` for business events, `warn` for a recoverable abnormal condition, `error`
  only for what requires action. An expected operational error (404, validation) is not
  `error`.

## Environment variables

- `src/config/env.ts` defines a Zod schema for **all** env vars and parses them at boot.
  Missing or invalid config → the process exits with a clear message before accepting traffic
  (fail fast). No loose `process.env.X` outside this file.
- `.env` always in `.gitignore`; `.env.example` committed with all keys and fake values.
- A secret that was ever committed is compromised: rotate it, don't just remove it.

## Process lifecycle

- Graceful shutdown is mandatory: `SIGTERM`/`SIGINT` → stop accepting connections → drain
  in-flight requests (force timeout ~10s) → close the DB pool and queue connections → exit 0.
- Health check endpoint (`/health`) that verifies critical dependencies, for the orchestrator.
- Keep the event loop free: CPU-bound work (batch hashing, PDF generation, parsing a large
  file) goes to a Worker Thread or a queue; large files/payloads via stream (`pipeline` from
  `stream/promises`), never `fs.readFile` of a large file inside a route.

## Tests

Priority: **integration tests of the endpoints** — that is what proves the API works.

- Integration: imports the `app` (without `listen`), injects real requests (`app.inject` on
  Fastify / Supertest on Express) and verifies status, body and side effects on the test
  database.
- Cover per endpoint at minimum: happy path, invalid input (422), unauthenticated (401),
  unauthorized (403) when applicable, missing resource (404).
- Isolated test database (own container/schema), reset between suites. Never mock the
  repository in an integration test — mock only **external** services (payment gateway,
  email).
- Unit: services with non-trivial business logic, tested without HTTP and without a database.

## Acceptance checklist (before calling it done)

- [ ] `tsc --noEmit` clean with strict; zero `any` without a justifying comment
- [ ] Layers respected (no queries in routes, no HTTP in services)
- [ ] Every new endpoint with input and output Zod schemas
- [ ] Errors in the problem details format; central error handler covering the new case
- [ ] Logs with `requestId`; no sensitive data logged
- [ ] New env vars added to the `env.ts` schema **and** to `.env.example`
- [ ] Integration tests of the changed endpoints passing (happy + 422 + 401/403 + 404)
- [ ] Rate limiting and auth verified if the endpoint is public
- [ ] `npm audit` with no high/critical vulnerability introduced

## Anti-patterns (fail review)

- Business logic in a route/controller, or SQL/ORM queries outside a repository.
- `try/catch` that swallows the error or responds in a format other than problem details.
- "The client already validates" — the server validates always.
- `await` in a loop for parallelizable work — use `Promise.all` (or bounded concurrency with
  `p-limit` when there are many).
- Floating promise (async call without `await`/handling) — enable
  `@typescript-eslint/no-floating-promises`.
- Creating a DB connection per request instead of using a pool.
- TS enum in new code — prefer a union of literals or an `as const` object.
- Hardcoded secret, even a "temporary" one.
