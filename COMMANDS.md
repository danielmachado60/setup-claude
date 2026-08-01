# COMMANDS — Setup Claude cheat sheet

> Quick-reference file for humans. Full details: `.claude/README.md`.

## The 3 entry scenarios

| Scenario | What to do |
|---|---|
| **New project** | Copy the template → open `wizard.html` in a browser → save `ABOUT.md` at the root → `claude` → `/new-project` (applies scaffold, configures MCPs) |
| **Existing project** (client repo already has code) | Copy `.claude/`, `CLAUDE.md`, `.mcp.json` and `ABOUT.md` into the repo → `claude` → `/new-project` (reverse wizard: detects stack/commands on its own and asks only about the rest) |
| **Improve an existing page** (sales page, landing, home) | Adopt the repo (row above) → `/audit <url or route>` → approve the plan → execute the quick wins |

## Commands

| Command | When to use |
|---|---|
| `/new-project` | Once, when starting or adopting a project. Fills in/validates ABOUT.md, scaffold, MCPs |
| `/audit [page]` | Conversion diagnosis of an existing page → prioritized plan (changes nothing without approval) |
| `/design-review [pages]` | After implementing UI: screenshots at 3 widths + critique + fix loop |
| `/review` | ALWAYS before delivering: code review + QA + a11y/perf + SEO → APPROVED or BLOCKED |
| `/sync-docs` | After a structural change: updates tier2 docs + ABOUT.md (asks for confirmation) |
| `/prime [focus]` | Only in a long session that lost context — the essentials load on their own at startup |

## Creative pipeline (fires on its own, but good to know the order)

Landing/conversion page: **client-discovery** (research: customer voice, competitors) → **landing-blueprint** (section-by-section strategy) → **design-direction** (3 visual directions, you choose) → copy → UI → `/design-review` → `/review`.

The copywriter and the ui-designer REFUSE conversion work without these documents — it is not bureaucracy, it is what separates a good page from a generic one.

## What happens on its own (hooks)

- **On session start**: ABOUT.md enters context automatically (nothing to paste).
- **On file edit**: prettier runs on its own (if the project has a config).
- **On finishing a response that touched code**: `/review` reminder (once per session).

## MCPs — reminders

- OAuth pending? → `/mcp` and authorize in the browser (one time only).
- Base setup requires on the machine: `GITHUB_PAT`; per Supabase project: `SUPABASE_PROJECT_REF`.
- Adding an optional one (Stripe, Vercel, ads...): ready-made snippet in `.claude/mcp-catalog.md` → paste into `.mcp.json` → takes effect NEXT session.

## Golden rules

1. **ABOUT.md is the only file that changes per project.** CLAUDE.md is never edited.
2. Switching stacks = editing line 2 of ABOUT.md (`Active pack: ...`). Monorepo/multi-stack: list with ` + ` (`Active pack: nextjs + node-api`).
3. Line 4 of ABOUT.md (`Language: ...`) drives the language of everything client-facing; if `.claude/locales/<language>.md` exists, agents read it before copy/UI work.
4. Nothing is "done" without an approved `/review`. New UI without `/design-review` is not done.
5. `.env` is never read, pasted or committed. No exceptions.



NEW:       gh repo create <client> --template <your-org>/<template-repo> --private --clone
           → wizard.html → ABOUT.md → claude → /new-project
EXISTING:  copy .claude/ + CLAUDE.md + .mcp.json + ABOUT.md into the repo → /new-project (reverse wizard)
IMPROVE:   adopt the repo → /audit <page>
EVOLUTION: improved something in a project? port it back to the template and commit — the template is versioned
