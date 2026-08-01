# Setup Claude — universal agency rules

Claude Code template for a web development agency. Typical projects: landing pages,
institutional sites, e-commerce, web systems. TypeScript is the default whenever the
stack allows. The language of deliverables is per-project config — see "Project
language" below.

This file is STATIC: it applies equally to every project and is NEVER edited per project.
Everything that varies per project lives exclusively in the root ABOUT.md.

## Project source of truth

ABOUT.md defines what is project-specific: active pack, client and goal, audience and
tone of voice, dev/build/test commands, process and constraints. Lines 2–4 are parseable:
`Active pack: none|static|nextjs|node-api|python` — accepting a LIST separated by ` + `
for monorepo/multi-stack (e.g. `Active pack: nextjs + node-api`) — plus `Type:` and
`Language:`.

- Pack(s) declared → reading `.claude/packs/<pack>/PACK.md` for EACH one before the first
  task is MANDATORY: that is where stack, conventions and anti-patterns live. Precedence:
  ABOUT.md > PACK.md > agent.
- `Active pack: none` or ABOUT.md still in placeholders → do NOT assume a stack. Inspect
  the project or ask; to fill it in, point to `wizard.html` (browser) or `/new-project`.
- Large systems/monorepos may have a PER-MODULE `CLAUDE.md` (e.g. `apps/web/CLAUDE.md`) —
  Claude Code loads them on its own when working in that area; they are generated at
  adoption and maintained by `/sync-docs`. They detail the module; this file and ABOUT.md
  remain the general rules.

## Project language

All client-facing deliverables — site copy, UI strings, error messages, form texts,
client docs — MUST be written in the project language declared on line 4 of ABOUT.md.
Technical artifacts (code identifiers, comments, commit messages) default to English
unless ABOUT.md Constraints say otherwise. If `.claude/locales/<language>.md` exists,
read it before client-facing work — it holds market-specific knowledge (review sources,
legal, payment rails, cultural CTA norms).

## Session start

The SessionStart hook injects ABOUT.md (and the active PACK.md reminder) into context
automatically — there is no manual opening ritual. `/prime` is a DEEP context reload
(tier1 + full PACK.md + filled-in tier2): use it in a long working session or when
context has been compacted, not as a per-session obligation.

## Non-negotiable quality

- WCAG 2.1 AA accessibility and performance budgets are ACCEPTANCE CRITERIA, not future
  improvements. Checklists and concrete numbers: `.claude/docs/tier1-foundation.md` — do
  not duplicate them here.
- No delivery is "done" without passing `/review`.
- Conversion projects (new landing/site) follow the creative pipeline BEFORE copy and UI:
  skill `client-discovery` → `landing-blueprint` → `design-direction`. Copy without
  discovery and screens without an approved direction are rework, not a head start.

## Security

- NEVER read, print, copy or commit `.env`, `.env.*` or the contents of `secrets/`.
  `settings.json` blocks reading/editing those files via the file tools and denies the
  obvious shell patterns (`cat`/`type`/`Get-Content`); shell patterns can be bypassed, so
  the shell prohibition is above all a behavioral rule of this section — do not work
  around it.
- Secrets in examples and docs: always placeholders (`YOUR_KEY_HERE`), never real values.

## Autonomy limits — always ask for confirmation before

- `git commit` / `git push` and any destructive git operation.
- Deleting files or directories.
- Breaking changes to an API contract or data schema.
- Touching deploy/CI configuration or installing a new dependency.

## Agents — when to trigger

| Agent | Trigger |
|---|---|
| ui-designer | Visual spec (tokens, states, layout, handoff) — BEFORE coding new UI |
| frontend-dev | Implement UI: components, pages, forms, responsive, loading/empty/error states |
| backend-dev | API, endpoints, data modeling/migrations, auth, external integrations, jobs |
| copywriter | Copy in the project language: headlines, CTAs, microcopy, error messages, form texts |
| seo-specialist | Titles/metas, heading hierarchy, canonicals, sitemap/robots, JSON-LD, keywords |
| a11y-performance | New or changed UI (WCAG 2.1 AA gate) and suspected slowness (Core Web Vitals) |
| qa-tester | Test plan, run the suite, edge cases, GO/NO-GO verdict before release |
| code-reviewer | Diff ready, always before commit/merge — also covers the security sweep (auth, payments, uploads, user input, data privacy) |
| nextjs-specialist | ABOUT.md says `Active pack: nextjs` — work on the Next.js App Router stack |
| vanilla-specialist | ABOUT.md says `Active pack: static` — vanilla HTML/CSS/JS sites |
| node-specialist | ABOUT.md says `Active pack: node-api` — Node.js/TypeScript APIs |
| python-specialist | ABOUT.md says `Active pack: python` — Python services and scripts |

The 4 pack specialists live permanently in `.claude/agents/` and ONLY activate when line 2
of ABOUT.md CONTAINS the matching pack — no file copying, no session restart. Multi-stack:
the line accepts a list (`nextjs + node-api`) and each specialist handles only its part.
Switching/adding a pack = editing that single line of ABOUT.md.

## Commands

- `/prime` — deep context reload: tier1, the active pack's PACK.md and `.claude/docs/tier2-components.md` (if filled in); accepts an optional focus (e.g. `/prime checkout`).
- `/new-project` — sets up the project: reads ABOUT.md (or helps fill it in via wizard.html/questions), applies the pack scaffold and verifies the MCPs.
- `/sync-docs` — after a structural change, proposes updates to `.claude/docs/tier2-components.md` and ABOUT.md based on the diff, always confirming before writing.
- `/review` — delivery gate (code, tests, a11y, performance, security) scoped to what the session changed; APPROVED/BLOCKED verdict.
- `/design-review` — visual loop via Playwright MCP: every page at 3 widths + accessibility snapshot, fixes iterated with re-screenshots.
- `/audit` — conversion diagnosis of an EXISTING page against discovery/blueprint/design/a11y/SEO; delivers a prioritized plan and changes NOTHING without approval.

Quick reference for humans: `COMMANDS.md` at the root.
