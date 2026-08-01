---
description: Configures the template for a real client project — reads ABOUT.md (or helps fill it in), applies the pack scaffold and verifies the MCPs. Run once, right after cloning the template.
argument-hint: [short project description]
---

You are going to configure this template for a real client project. The root ABOUT.md is the ONLY file edited per project — CLAUDE.md is static and is NEVER changed here. There is no agent copying and no session restart: the pack specialists already live in `.claude/agents/` and activate on their own when line 2 of ABOUT.md points to the pack. Initial description provided (may be empty): $ARGUMENTS

## Step 1 — Read ABOUT.md

Read the root ABOUT.md and classify it:

- **FILLED** — the title does not contain `[PROJECT NAME]`, there are no `[FILL IN]` tokens or `[BRACKETED]` placeholders in the sections, and line 2 has valid pack(s) (`Active pack: static|nextjs|node-api|python`, list with ` + ` allowed) or an intentional `none`. Typical of files generated via `wizard.html`. → Also validate line 3 and line 4: line 3 must exist in the format `Type: <group label> — <specific type>` (taxonomy in Step 2) and line 4 in the format `Language: <code>` (project deliverable language, e.g. `en`, `pt-BR`, `es`). If line 3 or line 4 is missing or still a placeholder, do NOT redo the briefing: deduce the value from what ABOUT.md itself describes (type from the stated goal; language defaults to `en` unless the file's own content clearly indicates another market), confirm with ONE single question (AskUserQuestion) and write the line(s) with Edit. Then skip STRAIGHT to Step 3, without redoing any other question.
- **TEMPLATE / PARTIAL** — the title is still `[PROJECT NAME]`, or placeholders remain in the sections. → Go to Step 2.
- **MISSING** — the file does not exist (warn the user; the template should ship it). → Go to Step 2 and recreate the file in the canonical format when writing.

## Step 2 — Fill in ABOUT.md (only if needed)

**Step 2.0 — Existing codebase? REVERSE wizard first.** Before asking anything, check whether the directory already contains project code beyond the template files (package.json, pyproject.toml, composer.json, src/, app/, index.html with real content...). If it does, the code answers most of the briefing — explore first, ask only for the rest:

1. **Stack → pack(s)**: detect from evidence — `next` in dependencies → `nextjs`; HTML/CSS/JS without a framework → `static`; Express/Fastify/Hono → `node-api`; FastAPI/Django/Flask → `python`. **Monorepo/multi-stack** (e.g. apps/web Next + services/api Express + workers Python): write the LIST on line 2 separated by ` + ` — `Active pack: nextjs + node-api + python` — and note in `## Constraints and notes` which directory belongs to which pack. Stack OUTSIDE the packs (WordPress, Laravel, Vue/Nuxt...) → `Active pack: none` and record the stack + observed conventions in `## Constraints and notes` — the 8 universal agents work normally; only the pack specialist stays dormant. Mixed (Next + Laravel): list only the recognized packs and document the rest in the constraints.
2. **Type → taxonomy**: deduce group and type from the existing pages/routes (a single sales page → Site & content — Landing page; cart/checkout → E-commerce; logged-in area → Web system...).
3. **Commands**: extract from the real scripts (package.json, Makefile, project README) and VERIFY that they run before recording them.
4. **Draft**: assemble the ABOUT.md with everything you discovered and present it to the user as a proposal.
5. **Ask ONLY what the code cannot tell** (AskUserQuestion, one round): client and business goal, audience and tone of voice, main conversion, deadline, deliverable language (deduce from existing UI copy when possible — line 4 `Language:`; default `en`), superpowers (recommendation by group). Confirming a deduction ≠ redoing a question: "I detected X, correct?".
6. **Large system? Per-module docs.** If the repo has 2+ clear modules/areas (monorepo workspaces, apps/ + services/, separate domains under src/), offer to generate one `CLAUDE.md` PER MODULE in the key folders (e.g. `apps/web/CLAUDE.md`, `services/api/CLAUDE.md`) — Claude Code loads each one automatically when working in that area. Content of each (max ~40 lines, only what exploration CONFIRMED): what the module does (2-3 lines); its own commands (workspace dev/test); observed conventions (structure, naming, error patterns); main entry points (key files); known pitfalls if detected. NEVER invent — a barely explored module gets a short stub with a "complete via /sync-docs" note. Record the index in tier2 (`## Main components / modules` section): module → path to its CLAUDE.md.

Write the ABOUT.md in the canonical format and skip to Step 3 (via "existing codebase"). Project from scratch (no code) → follow the two paths below.

Offer the user the two paths, in this order:

1. **wizard.html (recommended)** — ask them to open the root `wizard.html` in the browser (double click works; runs via file://), fill in the form, download the generated ABOUT.md and save it at the root replacing the current one. When the user confirms it is saved, RE-READ the ABOUT.md and go back to Step 1.
2. **Questions right here** — use AskUserQuestion, in the SAME order as wizard.html (use $ARGUMENTS to pre-fill and confirm instead of asking from scratch). Classification happens in 2 STAGES and the pack is NEVER asked blindly:
   - **Stage 1 — "What is the project?"**: offer the 6 groups with the EXACT labels from the table below — Site & content, E-commerce & sales, Web system & logged-in areas, API & integrations, Automation & bots, Internal agency use.
   - **Stage 2 — Specific type**: offer ONLY the types of the chosen group ("Types" column of the table).
   - **Pack — confirm, don't ask**: the table gives the pack suggested by the type. Propose "suggested: `<pack>` — accept or swap?" and only list the alternatives (`static`, `nextjs`, `node-api`, `python`, `none`) if the user wants to swap.
   - **Client, segment and goal** — what the project must deliver + main conversion + deadline.
   - **Audience and tone of voice** — who visits and ONE of the 3 reference tones: sober institutional / persuasive e-commerce / conversion landing; voice notes if any.
   - **Language** — the language of the project deliverables (site copy, UI strings, error messages, client docs). Default `en`; sets line 4 as `Language: <code>`. If `.claude/locales/<code>.md` exists, it holds market-specific knowledge and must be read before client-facing work.
   - **Superpowers?** — the recommendation comes from the GROUP ("Superpowers" column of the table): YES for E-commerce & sales and Web system & logged-in areas; NO for the others. Present the recommendation inside the question itself and let the user decide.

   Then write the answers into ABOUT.md with Edit, following the canonical format to the letter: line 1 `# ABOUT — <NAME>`, line 2 EXACTLY `Active pack: <pack>` (no suffixes), line 3 EXACTLY `Type: <group label> — <specific type>` (separator ` — `; e.g. `Type: Site & content — Landing page`), line 4 EXACTLY `Language: <code>`, headings `## Client and goal`, `## Audience and tone of voice`, `## Project commands`, `## Process`, `## Constraints and notes`. Tone of voice becomes a single bullet; unanswered fields become "none for now" — never leave a `[...]` placeholder behind.

### Taxonomy: group → type → suggested pack

Synchronized copy of the `wizard.html` taxonomy (the `GROUPS` object in its script): the two copies ALWAYS move together — whoever changes one must replicate it in the other.

| Group (exact label) | Superpowers | Types → suggested pack |
|---|---|---|
| Site & content | no | Institutional site → `static` · Landing page → `static` · Hotsite / one-pager → `static` · Blog / content portal → `nextjs` · Event site → `static` |
| E-commerce & sales | yes | B2C online store → `nextjs` · B2B / quote catalog → `nextjs` · Delivery / digital menu → `nextjs` · Subscription club → `nextjs` |
| Web system & logged-in areas | yes | Admin panel / dashboard → `nextjs` · Client / members area → `nextjs` · Scheduling / bookings → `nextjs` · CRM / sales management → `nextjs` · Niche system (clinic, real estate, gym...) → `nextjs` · Help desk / tickets → `nextjs` |
| API & integrations | no | REST API for site/app → `node-api` · Payment gateway integration → `node-api` · WhatsApp / ERP / CRM integration → `node-api` · Middleware / data sync → `python` |
| Automation & bots | no | WhatsApp / support bot → `python` · AI chatbot → `python` · Routine automation (billing, reports, spreadsheets) → `python` · Authorized data collection / scraping → `python` |
| Internal agency use | no | Internal tool → `nextjs` · Utility script → `python` · Template / boilerplate → `none` |

## Step 3 — Scaffold (project from scratch) or record (existing codebase)

Ask (or deduce from the directory): does the project start from scratch or does code already exist?

- **From scratch, with an active pack**: read `.claude/packs/<pack>/scaffold/SCAFFOLD.md` and follow ITS steps in order — it defines what to copy/generate, the setup commands and what to record in the `## Project commands` section of ABOUT.md. Do not improvise a scaffold on your own; if the pack folder does not exist, STOP and warn.
- **Existing codebase**: do NOT apply a scaffold. Discover the real commands (package.json, pyproject.toml, Makefile, project README) and record them in the `## Project commands` section of ABOUT.md, including the local dev URL. A command you have not verified does not go in — never invent commands that don't run.
- **`Active pack: none`**: no scaffold; just record the real commands as above.

## Step 4 — MCPs (base + project optionals)

**4a. Verify the base** — the template's `.mcp.json` ships 5 servers. Confirm in this session:

- **playwright** → `browser_*` tools (e.g. `browser_navigate`) — without them `/design-review` cannot run.
- **context7** → `resolve-library-id` / `query-docs` tools.
- **github** → requires the `GITHUB_PAT` env var exported on the machine; if the server shows as failed, guide the user to configure it (or continue without it).
- **supabase** → requires the project's `SUPABASE_PROJECT_REF` env var + login via `/mcp`; if the project does NOT use Supabase, offer to remove the block from `.mcp.json`.
- **sentry** → one-time login via `/mcp`; if the project has no Sentry, offer to remove it.

If something does not show up, guide the user: `/mcp` to authenticate the OAuth ones, or `claude mcp reset-project-choices` and reopen. Do not try to install anything yourself.

**4b. Suggest optionals by group** — open `.claude/mcp-catalog.md` ("Suggestion by project group" table) and propose via AskUserQuestion (multiSelect) the MCPs for the group on line 3 of ABOUT.md — e.g. E-commerce → stripe, resend, meta-ads; Site → analytics-mcp, gsc. For each accepted one: copy the EXACT snippet from the catalog into `mcpServers` in the project's `.mcp.json` and warn: new servers load on the NEXT session; OAuth is resolved with `/mcp`; the ones requiring env vars are flagged in the catalog. None accepted = move on, they can be added later.

## Step 5 — Superpowers (if the `## Process` section of ABOUT.md says ACTIVE)

Plugins are installed by the user, not by you. Guide them: run `/plugin install superpowers@claude-plugins-official` (alternatives in .claude/README.md) and confirm before you depend on any skill from the plugin. If the recorded decision is "declined", do not insist.

## Step 6 — Final checklist

Finish by showing a checklist with real status (done / skipped / pending):

- [ ] ABOUT.md filled in — line 2 with `Active pack: <pack>`, line 3 with `Type: <group> — <type>` and line 4 with `Language: <code>` (via wizard / via questions / already ready)
- [ ] Scaffold applied per `.claude/packs/<pack>/scaffold/SCAFFOLD.md` — or skipped (existing codebase / pack none)
- [ ] `## Project commands` section of ABOUT.md with real commands and local URL
- [ ] Base MCPs verified (playwright, context7, github, supabase, sentry — the ones the project doesn't use removed) and group optionals added to `.mcp.json` (or pending item noted)
- [ ] Superpowers: installed by the user / declined / waiting — per the `## Process` section of ABOUT.md
- [ ] Client project? Delete the template's .github/ folder (issue templates belong to Setup Claude, not to the client repo) and replace the root README.md with the project's own
- [ ] Next step: start working — the SessionStart hook injects ABOUT.md by itself every session; `/prime` only for a deep context reload

## Anti-patterns — never do

- Edit CLAUDE.md — it is static; EVERYTHING project-specific goes into ABOUT.md.
- Copy agents from .claude/packs/ into .claude/agents/ or ask for a session restart — extinct mechanic; the specialists already live in `.claude/agents/` and activate via line 2 of ABOUT.md.
- Edit files inside .claude/packs/ — they are the template's mold.
- Redo briefing questions when ABOUT.md is already filled in.
- Fill ABOUT.md with your own assumptions instead of the user's answers.
- Break the canonical ABOUT.md format (parseable lines 2-4, exact headings) — hooks and commands depend on it.
- Ask for the pack directly, without going through group → type — the pack is suggested by the taxonomy and only confirmed.
