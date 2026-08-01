---
description: Syncs the documentation (.claude/docs/tier2-components.md and ABOUT.md) with what the code actually says today. Run after significant changes — new modules, routes, integrations or structural decisions.
---

You are going to compare the current code with the documentation and propose updates — never writing anything before the user's explicit confirmation.

## Step 1 — Delimit the diff

Find the range of changes to analyze:

1. Find the last commit that touched docs/: `git log -1 --format=%H -- docs/`
2. If it exists, the scope is `git diff <that-commit>..HEAD --stat` (then the full diff of the relevant files).
3. If docs/ was never touched (or the command above returns nothing), use the last 10 commits: `git log --oneline -10` + `git diff HEAD~10..HEAD --stat` (adjust if the repository has fewer than 10 commits).
4. Also include changes not yet committed: `git status --short` + `git diff --stat`.

## Step 2 — Triviality filter

Discard from the scope everything trivial: typo fixes, formatting, local variable renames, import adjustments, dependency version bumps with no API impact. If NOTHING remains after the filter, say "Nothing structural has changed since the last sync — docs remain valid" and stop. Do not touch docs over a trivial change; the cost is not worth it.

## Step 3 — Identify STRUCTURAL changes

From what remains, classify what is structural. Counts as structural:

- New module, component, page or route (including API routes).
- New external integration (payment gateway, CRM, email, analytics, CMS).
- Contract change: request/response shape, public props, data schema.
- New dependency with an architectural role (ORM, state library, test framework).
- A decision that constrains future work (adopted folder pattern, naming convention, cache/auth strategy).
- Removal of any item above (documentation for something that no longer exists is the worst debt).

For each structural item, READ the corresponding code before writing any doc text. **Non-negotiable rule: you only document what you verified in the code. Never deduce, never fill gaps with what was "probably" done, never describe behavior you did not read.** If something is ambiguous, ask the user instead of inventing.

## Step 4 — Propose the updates

Route each structural change to the right destination:

- **.claude/docs/tier2-components.md** → map of modules, routes, integrations, contracts, dependencies.
- **Per-module CLAUDE.md** (`apps/*/CLAUDE.md`, `services/*/CLAUDE.md`...) → if they exist and the diff touches that module, propose updating ITS CLAUDE.md too (commands, conventions, entry points that changed). New module without its own doc in a repo that already uses per-module docs → propose creating one (format from Step 2.0.6 of /new-project).
- **ABOUT.md** → only what is a rule or decision every future session needs to know. Changed dev/build/test commands/URL → `## Project commands` section; new convention or constraint → `## Constraints and notes` section. ABOUT.md is injected into every session by the SessionStart hook — every line costs context, so only cross-cutting content goes there. NEVER propose an edit to CLAUDE.md: it is static and receives no project content.

Writing rules (density-first):

- Write the current state, in the present tense: "The checkout uses X", never "we migrated from Y to X".
- FORBIDDEN: changelogs, "it used to be like this", migration narratives, future plans.
- If an existing doc passage became obsolete, the proposal must DELETE the passage, not annotate that it changed.
- When in doubt between keeping and deleting text: delete.

## Step 5 — Show the diff and ask for confirmation (mandatory)

Before writing ANY file:

1. Show, per affected file, the proposed diff in a clear format (current passage → new passage, or "add section X", or "remove passage Y").
2. Explain in one line per diff the code evidence that justifies it (file/route you read).
3. Ask explicitly: "Apply these updates? I can apply all, only some (say which) or none."
4. Only write with Edit/Write after the user confirms — and write only what they approved.

## Anti-patterns — never do

- Write docs without showing the diff and getting confirmation.
- Document by inference ("an endpoint must have been created for this").
- Turn docs into history ("last sprint we...").
- Update docs over a trivial change just to "keep the habit".
- Create new doc files on your own — the destinations are tier2-components.md, ABOUT.md and already existing per-module CLAUDE.md files (creating a NEW per-module CLAUDE.md ONLY with explicit approval); if something fits none of them, ask the user where it should live.
- Edit CLAUDE.md — it is static; project rules/decisions live in ABOUT.md.
