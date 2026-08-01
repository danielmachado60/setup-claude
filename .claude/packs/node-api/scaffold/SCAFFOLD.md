# node-api scaffold

How to create a Node.js API from scratch with the agency's conventions. Commands confirmed for **Node 24 LTS + TypeScript 6.x + ESLint 10 + Vitest 4 (July 2026)**. Complements the pack's `PACK.md` — read both before writing code.

## 0. Prerequisite: Node 24 LTS

`node --version` must show **24.x** (active LTS). The `dev` script runs `.ts` directly via Node 24's **native type stripping** — no tsx, no ts-node. Consequences:

- No `enum`, `namespace` or parameter properties — the tsconfig locks this via `erasableSyntaxOnly` (PACK.md already forbids enums anyway).
- Relative imports with an explicit `.ts` extension (`./routes/health.ts`); `rewriteRelativeImportExtensions` rewrites them to `.js` at build time.
- If the project requires decorators or tsconfig path aliases, install `tsx` (`npm i -D tsx`) and change dev to `tsx watch --env-file=.env src/server.ts`.

## 1. Create the base

1. Create the project folder and run `git init`.
2. Copy **everything** from this scaffold to the root of the new project — except this `SCAFFOLD.md`:

| File                                 | Purpose                                                                                       |
| ------------------------------------ | --------------------------------------------------------------------------------------------- |
| `package.json`                       | ready-made scripts — **change the `name` field**                                              |
| `tsconfig.json`                      | hardened strict typecheck of `src/` + `tests/` (does not emit)                                |
| `tsconfig.build.json`                | production build — emits only `src/` to `dist/`                                               |
| `eslint.config.mjs`                  | flat config (the only format in ESLint 10) with type-checked rules                            |
| `.prettierrc` / `.editorconfig`      | formatting                                                                                    |
| `.env.example`                       | env template                                                                                  |
| `src/server.ts`                      | bootstrap + `createApp()` exported for the tests                                              |
| `src/routes/health.ts`               | health check `GET /health`                                                                    |
| `src/services/`, `src/repositories/` | empty layers (`.gitkeep`) pinning the routes → services → repositories structure from PACK.md |
| `tests/health.test.ts`               | health check integration test — deletable when a real test lands                              |

3. Create at the root (the scaffold does not ship these two):

`.gitignore`

```
node_modules/
dist/
.env
```

`.nvmrc`

```
24
```

4. Copy `.env.example` to `.env` and fill it in. `npm run dev` uses `--env-file=.env` and **fails if the file does not exist** — this step is not optional.

## 2. Install dependencies (exact order)

```bash
npm i fastify zod
npm i -D typescript@~6.0.3 @types/node@24 eslint @eslint/js typescript-eslint vitest prettier
```

State of the ecosystem (Jul 2026) — warnings that save hours:

- **Never `typescript@latest`.** Latest is TS 7.x (native Go compiler, no stable programmatic API) and typescript-eslint does not support it (peer `<6.1.0`). Pin `~6.0.3` until TS 7.1 ships with support.
- **`@types/node@24`**, not `@latest` — latest tracks Node 26 Current, not the production LTS.
- `typescript-eslint` is the current umbrella package — do **not** install `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` separately.
- Fastify's built-in logger is already Pino — do not install `pino` separately. Readable logs in dev come via pipe (`npm run dev | npx pino-pretty`), never in code (PACK.md).
- Zod goes in from day one because every edge validates with a schema (PACK.md). Prisma/Drizzle only when there is a real database — record the choice in ABOUT.md.

## 3. Scripts

| Command                                   | What it does                                                                           |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `npm run dev`                             | starts in watch mode with `.env` loaded — `http://localhost:3000`                      |
| `npm test` / `npm run test:watch`         | Vitest (imports `createApp()` and injects requests, no port)                           |
| `npm run lint` / `npm run lint:fix`       | ESLint flat config, type-checked rules                                                 |
| `npm run typecheck`                       | `tsc --noEmit` over `src/` + `tests/`                                                  |
| `npm run format` / `npm run format:check` | Prettier                                                                               |
| `npm run build` → `npm start`             | compiles to `dist/` and runs production (env comes from the platform, not from `.env`) |

If `format:check` complains about `package-lock.json`, create a `.prettierignore` containing `package-lock.json`.

## 4. Post-scaffold checklist

- [ ] `npm run dev` starts with no errors and `GET http://localhost:3000/health` responds `{"status":"ok",...}`
- [ ] `npm test` green (`/health` integration)
- [ ] `npm run lint` — zero errors
- [ ] `npm run typecheck` — zero errors
- [ ] `npm run build` followed by `npm start` runs the compiled version
- [ ] ABOUT.md updated (section below)

## 5. Record in ABOUT.md

The ABOUT.md at the project root is the only file edited per project:

1. Line 2 becomes: `Active pack: node-api`
2. Under the `## Project commands` section, record:

```md
## Project commands

- `npm run dev` — API at http://localhost:3000 (watch)
- `npm test` — tests (Vitest)
- `npm run lint` — ESLint
- `npm run typecheck` — tsc --noEmit
- `npm run build` + `npm start` — production build and run
```

3. Any stack decision outside the pack default (Express instead of Fastify, Prisma vs Drizzle, JWT vs session) goes under `## Constraints and notes`.

## 6. Next architecture steps (when the project grows)

- Extract `createApp()` from `src/server.ts` to `src/app.ts` (the test then imports from there).
- Create `src/config/env.ts` with a Zod schema for **all** env vars (fail fast at boot) — mandatory from the second variable on; no loose `process.env.X` outside it.
- Layers: the route validates and delegates → the service decides → the repository accesses data. The `src/services/` and `src/repositories/` folders already exist empty.
- Central error handler with problem details (RFC 9457) before the second endpoint — no route builds an error response by hand.
