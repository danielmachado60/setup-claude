# Agency MCP catalog

Configs verified against the official docs in Jul/2026. Two layers:

- **Base** — already enabled in the template's `.mcp.json` (every project).
- **Per project** — copy the snippet into `mcpServers` in the project's `.mcp.json` as
  needed. `/new-project` suggests which ones to enable based on the ABOUT.md group.

How activation works: a new server in `.mcp.json` loads on the **next session**
(`enableAllProjectMcpServers: true` in settings already auto-approves). OAuth servers ask
for login a single time: run `/mcp` and authorize in the browser. To remove an MCP,
delete its block from `.mcp.json`.

Agency security rule: always the LEAST-privilege credential — `read_only=true` on
Supabase, restricted key (`rk_...`) on Stripe, fine-grained PAT on GitHub, read-only
service account on Google. Tokens are NEVER hardcoded in `.mcp.json`: use `${ENV_VAR}`
(Claude Code expands it) and export the variable in the machine's shell.

---

## Base (already active in every project)

| Server | Auth | For what |
|---|---|---|
| `playwright` | none | Claude's eyes: navigates, screenshots, /design-review |
| `context7` | none | Up-to-date framework docs right in the session |
| `github` | env `GITHUB_PAT` (fine-grained) | PRs, issues, code search |
| `supabase` | OAuth via `/mcp` + env `SUPABASE_PROJECT_REF` | Schema, data and migrations (read-only by default) |
| `sentry` | OAuth via `/mcp` | Production errors, stack traces, triage |

Per-machine setup (once): export `GITHUB_PAT`; per project: export
`SUPABASE_PROJECT_REF` (or remove the server if the project doesn't use Supabase — a
server without its env configured shows as "failed" in `/mcp` without breaking the rest).

> GitHub note: in Claude Code the official remote authenticates via PAT in the header
> (interactive OAuth for this server is not supported here). Supabase note:
> `read_only=true` is deliberate — remove it only with a justification recorded in
> ABOUT.md.

---

## Per project — infra and deploy

### Vercel — deploys, build/runtime logs, analytics (OAuth via /mcp) — official
```json
"vercel": { "type": "http", "url": "https://mcp.vercel.com" }
```

### Cloudflare — Workers/Pages, KV/R2/D1, logs (docs is public; the rest OAuth via /mcp) — official
```json
"cloudflare-docs": { "type": "http", "url": "https://docs.mcp.cloudflare.com/mcp" },
"cloudflare-bindings": { "type": "http", "url": "https://bindings.mcp.cloudflare.com/mcp" },
"cloudflare-observability": { "type": "http", "url": "https://observability.mcp.cloudflare.com/mcp" },
"cloudflare-builds": { "type": "http", "url": "https://builds.mcp.cloudflare.com/mcp" }
```
Enable only the ones the project uses (docs + bindings cover most cases). Others exist
(browser rendering, radar, ai-gateway...) — URL pattern: `<name>.mcp.cloudflare.com/mcp`.

### Railway — backend deploys, variables, logs (OAuth via /mcp) — official
```json
"railway": { "type": "http", "url": "https://mcp.railway.com" }
```
Do NOT use `npx @railway/mcp-server` — deprecated. Local alternative (requires a
logged-in CLI, and is safer: it excludes destructive operations):
`{ "command": "railway", "args": ["mcp"] }`.

### Chrome DevTools — performance trace, console, network (no auth; requires Chrome) — official
```json
"chrome-devtools": { "command": "npx", "args": ["-y", "chrome-devtools-mcp@latest"] }
```
Complements Playwright when the problem is performance/network, not layout.

---

## Per project — design

### Figma — extract specs, tokens and components from the approved layout (OAuth via /mcp; any plan) — official
```json
"figma": { "type": "http", "url": "https://mcp.figma.com/mcp" }
```
The desktop variant (`http://127.0.0.1:3845/mcp`, no OAuth) requires the app open + Dev
Mode + a paid plan — only worth it for live selection on the canvas.

---

## Per project — e-commerce and e-mail

### Stripe — customers, payment links, invoices, refunds (OAuth via /mcp) — official
```json
"stripe": { "type": "http", "url": "https://mcp.stripe.com" }
```
Connect accounts don't support OAuth — use the header
`Authorization: Bearer ${STRIPE_RESTRICTED_KEY}` (restricted key `rk_...`, never `sk_...`).

### Resend — transactional e-mail: sending, domains, contacts (OAuth via /mcp) — official
```json
"resend": { "type": "http", "url": "https://mcp.resend.com/mcp" }
```
The client's domain must be verified in Resend beforehand.

---

## Per project — marketing and data

### Meta Ads — FB/IG campaigns: budget, pause, ROAS, pixel (Business OAuth via /mcp) — official (beta)
```json
"meta-ads": { "type": "http", "url": "https://mcp.facebook.com/ads" }
```
Open and free beta (Jul/2026); final pricing not announced. If the beta stalls, a
well-maintained community alternative (Meta Business Partner): Pipeboard —
`https://meta-ads.mcp.pipeboard.co/?token=...`.

### Google Ads — GAQL reports (Google Cloud ADC + developer token; requires pipx) — official, READ-ONLY
```json
"google-ads": {
  "command": "pipx",
  "args": ["run", "--spec", "git+https://github.com/googleads/google-ads-mcp.git", "google-ads-mcp"],
  "env": {
    "GOOGLE_APPLICATION_CREDENTIALS": "${GOOGLE_APPLICATION_CREDENTIALS}",
    "GOOGLE_PROJECT_ID": "${GOOGLE_PROJECT_ID}",
    "GOOGLE_ADS_DEVELOPER_TOKEN": "${GOOGLE_ADS_DEVELOPER_TOKEN}"
  }
}
```
Only 3 read tools — good for reporting and diagnostics, NOT for campaign management
(pause/bid/create = Google Ads API directly).

### Google Analytics 4 — traffic, conversion, funnel (ADC; requires pipx) — official (experimental), read-only
```json
"analytics-mcp": {
  "command": "pipx",
  "args": ["run", "analytics-mcp"],
  "env": {
    "GOOGLE_APPLICATION_CREDENTIALS": "${GOOGLE_APPLICATION_CREDENTIALS}",
    "GOOGLE_PROJECT_ID": "${GOOGLE_PROJECT_ID}"
  }
}
```

### Search Console — queries, CTR, position (service account JSON) — NO official server; most maintained community option
```json
"gsc": {
  "command": "npx",
  "args": ["-y", "mcp-server-gsc"],
  "env": { "GOOGLE_APPLICATION_CREDENTIALS": "${GOOGLE_APPLICATION_CREDENTIALS}" }
}
```
Google confirmed GSC was left out of the official MCPs. This one (`ahonn/mcp-server-gsc`)
is the most used, but it is an individual's project — for a critical SEO pipeline, use
the API directly. Add the service account e-mail as a user on each client's GSC property.

---

## Suggestion by project group (line 3 of ABOUT.md)

| Group | MCPs to consider |
|---|---|
| Site & content | analytics-mcp, gsc, vercel OR cloudflare, figma (if there's a layout) |
| E-commerce & sales | stripe, resend, meta-ads/google-ads (if paid traffic), vercel |
| Web system & logged-in areas | resend, vercel OR railway, figma (if there's a layout) |
| API & integrations | railway OR cloudflare, stripe (if payments) |
| Automation & bots | resend, meta-ads/google-ads/analytics-mcp (if marketing automation) |
| Internal agency use | per the tool |

Sync: this table also drives the MCP step in `.claude/commands/new-project.md`.
