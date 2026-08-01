# Setup Claude — Claude Code agency template

Reusable Claude Code base template for agency projects: landing pages, institutional
sites, e-commerce and web systems. It standardizes agents, commands, hooks and the
documentation policy so every new project starts from the same quality floor (a11y AA,
performance budgets, secrets safety) with zero configuration rework. The deliverable
language is per-project configuration — declared in ABOUT.md, not baked into the core.

## 3-layer architecture

1. **Universal layer** (`.claude/` + `CLAUDE.md`) — agents, commands and hooks, 100% static.
   CLAUDE.md is NEVER edited per project; universal rules apply the same everywhere.
2. **Packs** (`.claude/packs/<stack>/`) — PACK.md (stack conventions and anti-patterns) +
   `scaffold/` (starter files and commands). Each pack's specialist agents live permanently
   in `.claude/agents/` and activate on their own via line 2 of ABOUT.md.
3. **ABOUT.md** — the ONLY file edited per project: active pack, project type, language,
   client, goal, tone of voice, commands and constraints. It is the local source of truth,
   injected into every session by a hook.

## How to start a project

1. Clone or copy this folder into the new project's directory.
2. Open `wizard.html` in the browser (double click), fill in the form and save the
   generated ABOUT.md at the root — or edit the ABOUT.md template directly in your editor.
3. Run `claude` in the directory and execute `/new-project`: it detects the filled-in
   ABOUT.md, skips the questions, applies the pack scaffold
   (`.claude/packs/<pack>/scaffold/SCAFFOLD.md`) and verifies the MCPs.
4. Work. No session restarts, no file copying: the SessionStart hook injects ABOUT.md
   into every session and the pack agents are already active.

Quick cheat sheet of commands and scenarios for day-to-day work: `COMMANDS.md` at the root.

Your project will get its own README — replacing the template's showcase README at the
root is expected and encouraged.

## Adopting an EXISTING repo (the client's repo already has code)

The template also drops into a repository that already exists — it is a 4-item overlay:

1. Copy into the existing repo's root: `.claude/` (the whole folder), `CLAUDE.md`,
   `.mcp.json` and `ABOUT.md` (`wizard.html` and `COMMANDS.md` are optional).
   PowerShell, from the template folder:
   `Copy-Item .claude, CLAUDE.md, .mcp.json, ABOUT.md, COMMANDS.md -Destination C:\path\to\repo -Recurse`
2. **Collisions**: does the repo already have its own `CLAUDE.md`? Rename the old one to
   `CLAUDE-legacy.md` and, in step 3, migrate its useful content into
   `## Constraints and notes` of ABOUT.md. Already has `.claude/` or `.mcp.json`? Merge
   manually (do not overwrite hooks/servers the repo already uses).
3. Run `claude` → `/new-project`: on detecting existing code, it enters **reverse wizard**
   mode — it discovers stack, commands and type from the code itself, proposes a
   pre-filled ABOUT.md and asks only what code cannot tell (client, audience, conversion,
   deliverable language). Stack outside the packs (WordPress, Laravel, Vue...)?
   `Active pack: none` — the 8 universal agents work exactly the same; only the
   specialist stays dormant.
4. Sales page/landing already live and needing improvement? `/audit <route or URL>` —
   a prioritized improvement plan (impact × effort) before touching anything.

**Robust/complex system (monorepo, 200k+ lines, several modules):** two extra features
come into play at adoption — (a) line 2 of ABOUT.md becomes a list (`Active pack: nextjs +
node-api + python`) and each specialist handles its own part; (b) `/new-project` offers to
generate a PER-MODULE `CLAUDE.md` (`apps/web/CLAUDE.md`, `services/api/CLAUDE.md`...),
which Claude Code loads automatically when working in each area — tier2 holds the map, the
module's CLAUDE.md holds the detail, and `/sync-docs` maintains both.

## ABOUT.md + wizard.html

ABOUT.md has a canonical format: line 1 `# ABOUT — <NAME>`, line 2 parseable
`Active pack: none|static|nextjs|node-api|python` (read by hooks, agents and commands),
line 3 `Type: <group> — <specific type>` (what the project IS), line 4 `Language: <code>`
(the project's deliverable language, e.g. `en`, `pt-BR`, `es`), and the sections
`## Client and goal`, `## Audience and tone of voice`, `## Project commands`
(dev/build/test + local URL — this is where `/review` and `/design-review` read the
commands from), `## Process` and `## Constraints and notes`.

- **Switching packs = editing 1 line** (line 2). The new pack's specialists activate on
  the next session, with no other change.
- **Multi-stack/monorepo**: line 2 accepts a list with ` + ` — `Active pack: nextjs +
  node-api` activates both specialists, each handling its own part (the `/new-project`
  reverse wizard detects and writes the list on its own).
- `wizard.html` is a static form (zero dependencies, works via `file://`) that generates
  the finished ABOUT.md: fill in → download/copy → save at the root.

### Project language (line 4) and locales

All client-facing deliverables — site copy, UI strings, error messages, form texts,
client docs — are written in the language declared on line 4 of ABOUT.md. Technical
artifacts (code identifiers, comments, commit messages) default to English unless
`## Constraints and notes` says otherwise. If `.claude/locales/<language>.md` exists,
agents read it before client-facing work — it holds market-specific knowledge (review
sources, legal requirements, payment rails, cultural CTA norms). The template ships with
`.claude/locales/pt-BR.md`; new locale files are welcome.

### 2-step classification: group → type → suggested pack

The wizard does not ask about the stack. First you answer **"what is the project?"** (the
group), then pick the **specific type** within the group — and the right pack comes as an
**automatic suggestion** from the type (you can change it before generating). The group
also pre-selects the superpowers recommendation, and group + type become line 3 of
ABOUT.md. The stack is a consequence of the project type, not a separate question.

| Group | Types (→ suggested pack) | Superpowers |
|---|---|---|
| Site & content | Institutional site, Landing page, Hotsite / one-pager, Event site (→ `static`) · Blog / content portal (→ `nextjs`) | no |
| E-commerce & sales | B2C online store, B2B / quote catalog, Delivery / digital menu, Subscription club (→ `nextjs`) | yes |
| Web system & logged-in areas | Admin panel / dashboard, Client / members area, Scheduling / bookings, CRM / sales management, Niche system (clinic, real estate, gym...), Help desk / tickets (→ `nextjs`) | yes |
| API & integrations | REST API for site/app, Payment gateway integration, WhatsApp / ERP / CRM integration (→ `node-api`) · Middleware / data sync (→ `python`) | no |
| Automation & bots | WhatsApp / support bot, AI chatbot, Routine automation (billing, reports, spreadsheets), Authorized data collection / scraping (→ `python`) | no |
| Internal agency use | Internal tool (→ `nextjs`) · Utility script (→ `python`) · Template / boilerplate (→ `none`) | no |

The taxonomy lives in two places — in `wizard.html` (the script's taxonomy object) and in
the table in `.claude/commands/new-project.md` — and the two copies ALWAYS move together:
change one, replicate in the other (this README table is a summary for humans).

## The 12 agents

### The 8 universal agents

| Agent | When it activates | Model | Tools |
|---|---|---|---|
| `ui-designer` | Visual spec (tokens, states, layout, handoff) before coding UI | sonnet | Read, Grep, Glob, Write, Edit |
| `frontend-dev` | Implementing UI: components, pages, forms, states | sonnet | Read, Write, Edit, Bash, Grep, Glob |
| `backend-dev` | APIs, data modeling, auth, integrations, jobs | sonnet | Read, Write, Edit, Bash, Grep, Glob |
| `copywriter` | Conversion copy in the project language (ABOUT.md line 4), UI microcopy, on-page SEO texts | sonnet | Read, Grep, Glob, Write, Edit |
| `seo-specialist` | Technical and on-page SEO: titles/metas, headings, sitemap/robots, JSON-LD | sonnet | Read, Grep, Glob, Write, Edit, WebSearch, WebFetch |
| `a11y-performance` | New/changed UI (WCAG 2.1 AA) and slowness (Core Web Vitals) | sonnet | Read, Grep, Glob, Bash |
| `qa-tester` | Risk-based test plan, running the suite, GO/NO-GO | sonnet | Read, Grep, Glob, Bash |
| `code-reviewer` | Critical diff review before commit/merge — read-only, covers security | opus | Read, Grep, Glob |

Permissions follow least privilege per role: reviewers get Read/Grep/Glob only; web
researchers get WebSearch/WebFetch; only agents that write code get Write/Edit/Bash.

### The 4 pack agents — permanent residency

`nextjs-specialist`, `vanilla-specialist` (static), `node-specialist` (node-api) and
`python-specialist` live in `.claude/agents/` from the moment you clone — **no file
copying, no session restart**. Each one's description starts with "Activate ONLY when
ABOUT.md says Active pack: `<pack>`", and the agent itself checks line 2 of ABOUT.md
before working: if it doesn't match, it declines and points to the right specialist.
Rule precedence: ABOUT.md > PACK.md > agent.

| Agent | Activates when line 2 contains | Model | Tools |
|---|---|---|---|
| `nextjs-specialist` | `nextjs` | sonnet | Read, Write, Edit, Bash, Grep, Glob |
| `vanilla-specialist` | `static` | sonnet | Read, Write, Edit, Bash, Grep, Glob |
| `node-specialist` | `node-api` | sonnet | Read, Write, Edit, Bash, Grep, Glob |
| `python-specialist` | `python` | sonnet | Read, Write, Edit, Bash, Grep, Glob |

## Commands

| Command | What it does |
|---|---|
| `/prime` | DEEP context reload: tier1, the active pack's PACK.md and `.claude/docs/tier2-components.md` (if filled in); accepts an optional focus (e.g. `/prime checkout`). For long sessions or after context compression — the light context (ABOUT.md) already arrives on its own via hook |
| `/new-project` | Configures the project: reads ABOUT.md (or helps fill it in via wizard.html/questions), applies the pack scaffold and verifies the MCPs. Run once, right after cloning |
| `/audit` | Conversion diagnosis of an EXISTING page against discovery/blueprint/design/a11y/SEO; delivers a prioritized plan and changes NOTHING without approval |
| `/sync-docs` | After structural change, proposes updates to `.claude/docs/tier2-components.md` and ABOUT.md from the diff, always confirming before writing |
| `/review` | Delivery gate (code, tests, a11y, performance, security) scoped to what the session changed; APPROVED/BLOCKED verdict |
| `/design-review` | Visual loop via Playwright MCP: every page at 3 widths + accessibility snapshot, fixes iterated with re-screenshot |

## Skills — the creative pipeline

Conversion projects (new landing/site) go through the creative pipeline BEFORE copy and
UI — copy without discovery and screens without an approved direction are rework, not a
head start:

1. **`client-discovery`** — market research before any copy or strategy: mines customer
   voice (real reviews), competitors and a defensible differentiator, producing
   `docs/discovery.md`.
2. **`landing-blueprint`** — landing page strategy and anatomy: decides offer, awareness
   level and section-by-section structure, producing `docs/blueprint.md`.
3. **`design-direction`** — art direction before the first screen: real references,
   3 DISTINCT visual directions for the user to choose from, tokens with personality and
   anti-generic-design rules.

`/audit` uses these same documents as its benchmark when diagnosing an existing page.
`.claude/skills/processes/README.md` is the index/incubator for process skills.

## Automatic hooks

Three automations registered in `settings.json` — none depends on human memory:

| Hook | Event | What it does on its own |
|---|---|---|
| `session-context.js` | SessionStart | Injects ABOUT.md's content into context; if line 2 names a pack, adds the reminder to read `.claude/packs/<pack>/PACK.md`; if ABOUT.md is missing or still placeholders, instructs opening wizard.html or running `/new-project` |
| `post-edit-format.js` | PostToolUse (Edit/Write) | Runs `prettier --write` on the touched file; never blocks the edit |
| `review-reminder.js` | Stop | If the session changed code (git) and hasn't warned yet, reminds once per session: run `/review` (and `/design-review` if UI was touched) |

## MCPs

Two layers — full catalog with ready-to-paste snippets in `.claude/mcp-catalog.md`:

**Base** (already in `.mcp.json`, auto-approved via `enableAllProjectMcpServers`):

| Server | Auth | What for |
|---|---|---|
| playwright | none | Real browser: /design-review, screenshots |
| context7 | none | Up-to-date framework docs |
| github | env `GITHUB_PAT` | PRs, issues, code search |
| supabase | `/mcp` + env `SUPABASE_PROJECT_REF` | Database (read-only by default) |
| sentry | one-time login via `/mcp` | Production errors |

Base server the project doesn't use (e.g. Supabase) → just remove its block from `.mcp.json`.

**Per project** (`/new-project` suggests by the ABOUT.md group; snippets in the catalog):
Vercel, Cloudflare, Railway, Chrome DevTools, Figma, Stripe, Resend, Meta Ads (official,
beta), Google Ads (official, reports only), Google Analytics 4 and Search Console (the
latter has no official server — we use the best-maintained community one, with a caveat
in the catalog).

## Scaffolds per pack

Each pack ships `.claude/packs/<pack>/scaffold/` with a `SCAFFOLD.md` (command order, what
to record in ABOUT.md, and a checklist) that `/new-project` follows to the letter on
greenfield projects:

| Pack | What the scaffold delivers |
|---|---|
| `static` | Accessible `index.html`/`404.html`, `css/main.css` with tokens and `@layer`, progressive `js/main.js` (`// @ts-check`), `robots.txt`, prettier/editorconfig |
| `nextjs` | `create-next-app` (App Router, TS, `src/`) + prettier/editorconfig + example component |
| `node-api` | Fastify + Zod on Node 24 (native type stripping, no tsx), Vitest 4, ESLint flat type-checked, `GET /health` route + integration test |
| `python` | FastAPI via uv, pytest 9, ruff (lint + format), mypy strict, `GET /health` route + test |

## Structure map

Only a handful of files live at the project root — the rest of the template hides inside
`.claude/` so the repository stays dominated by the project's own code:

```text
project/
├── CLAUDE.md                     # STATIC universal rules — never edited per project (fixed location required by the tool)
├── ABOUT.md                      # The ONLY per-project file: pack, type, language, client, tone, commands (lines 2–4 parseable)
├── wizard.html                   # Static form that generates the filled-in ABOUT.md (open in the browser)
├── COMMANDS.md                   # Quick cheat sheet for humans: scenarios, commands, hooks, MCPs
├── .mcp.json                     # 5 base MCPs: playwright, context7, github, supabase, sentry (fixed location required by the tool)
├── .claude/                      # ← the WHOLE template lives in here
│   ├── README.md                 # This file — the human manual; Claude does not read it
│   ├── settings.json             # Deny rules for .env*/secrets + 3 hooks + MCP auto-approval
│   ├── mcp-catalog.md            # Full MCP catalog with ready-to-paste snippets
│   ├── agents/                   # 8 universal agents + 4 pack specialists (permanent)
│   ├── commands/                 # /prime, /new-project, /audit, /sync-docs, /review, /design-review
│   ├── skills/                   # Creative pipeline: client-discovery, landing-blueprint,
│   │   └── ...                   #   design-direction (+ processes/README.md = index/incubator)
│   ├── hooks/
│   │   ├── session-context.js    # SessionStart: injects ABOUT.md + active PACK.md reminder
│   │   ├── post-edit-format.js   # PostToolUse: prettier --write on the touched file
│   │   └── review-reminder.js    # Stop: reminds /review once per session when code changed
│   ├── docs/
│   │   ├── tier1-foundation.md   # Tier 1: a11y AA checklists and performance budgets
│   │   └── tier2-components.md   # Tier 2: spec, modules and decisions — maintained by /sync-docs
│   ├── locales/
│   │   └── pt-BR.md              # Market-specific knowledge per language (reviews, legal, payments, CTA culture)
│   └── packs/
│       ├── static/               # PACK.md + scaffold/ (vanilla HTML/CSS/JS)
│       ├── nextjs/               # PACK.md + scaffold/ (Next.js App Router)
│       ├── node-api/             # PACK.md + scaffold/ (Node.js/TypeScript API)
│       └── python/               # PACK.md + scaffold/ (FastAPI + uv)
└── ...                           # project code (and any README.md the PROJECT creates belongs to it)
```

## Policy: the superpowers plugin

A collection of process skills (brainstorming, plans, TDD, systematic debugging, review).
The decision is recorded in the `## Process` section of ABOUT.md (the wizard already asks,
with the recommendation pre-selected by the project's group).

- **Recommended** on large/complex projects: e-commerce, web systems, anything with more
  than a week of development and multiple interdependent features.
- **Skippable** on landing pages and simple short-deadline sites — the process overhead
  doesn't pay for the benefit.

Installation (official Anthropic marketplace, recommended):

```text
/plugin install superpowers@claude-plugins-official
```

Alternative via the author's marketplace:

```text
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

Notes: install separately per harness if you use more than one; updates are generally
automatic; optional telemetry can be disabled with `SUPERPOWERS_DISABLE_TELEMETRY=1`
(it also honors `DISABLE_TELEMETRY` / `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`).

## Example flows

### 1. Landing page in 5 days (`static` pack, no superpowers)

1. Clone the template → open `wizard.html` in the browser → fill it in (group "Site &
   content" → type "Landing page" → suggested pack `static`, tone "conversion landing",
   superpowers: no) → download the ABOUT.md and save it at the root.
2. `claude` → `/new-project`: detects the finished ABOUT.md, applies the static scaffold
   and records `npx serve .` + local URL under `## Project commands`. The
   `vanilla-specialist` is already active via line 2 — no restart.
3. Day to day: open the session (the hook injects ABOUT.md on its own) → implement
   section by section with the `vanilla-specialist` → `copywriter` for the copy →
   `seo-specialist` for metas/sitemap/schema → as each page closes, `a11y-performance` +
   `/design-review` (3 widths + accessibility snapshot).
4. Before delivery: `/review` → adjustments → final `/design-review` → `/sync-docs` →
   handoff. If `/review` slips through, the Stop hook reminds you.

### 2. Next.js e-commerce (`nextjs` pack, with superpowers)

1. Clone the template → `wizard.html` (group "E-commerce & sales" → type "B2C online
   store" → suggested pack `nextjs`, tone "persuasive e-commerce", superpowers: yes) →
   save the ABOUT.md at the root.
2. `claude` → `/new-project`: scaffold via `create-next-app` per the pack's SCAFFOLD.md,
   real commands recorded in ABOUT.md, MCPs verified. Install superpowers:
   `/plugin install superpowers@claude-plugins-official`.
3. Kickoff: brainstorming + written plan (superpowers skills); consolidate approved
   decisions into `.claude/docs/tier2-components.md` and settled constraints into
   `## Constraints and notes` of ABOUT.md.
4. Per session: context arrives via hook (long session → `/prime` for a deep reload) →
   execute the plan with TDD → `nextjs-specialist` + `frontend-dev` + `backend-dev` →
   `/design-review` on cart/checkout screens → `code-reviewer` on checkout/auth/payment
   (security sweep) → `/review` → `/sync-docs`.
5. Features delivered: merge the feature's doc/plan into tier2 (via `/sync-docs`) and
   delete the source doc.

## Credits

This template stands on the shoulders of open-source work by the Claude Code community:

- [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents)
  — foundation for the agent role definitions (distilled and rewritten for this template,
  not copied).
- [peterkrueck/Claude-Code-Development-Kit](https://github.com/peterkrueck/Claude-Code-Development-Kit)
  — the 3-tier documentation architecture and the `/prime` concept.
- [obra/superpowers](https://github.com/obra/superpowers) — the process methodology; used
  as an official plugin, never vendored.
- [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates) —
  optional accelerator for bootstrapping CLAUDE.md files.

Thank you to all these authors — this template would be far poorer without them.

The template originated in pt-BR for a Brazilian web agency; the core is now 100% English
and the deliverable language is per-project configuration (ABOUT.md line 4). Brazil-specific
knowledge lives in `.claude/locales/pt-BR.md`, and new locale files are welcome.
