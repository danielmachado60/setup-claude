---
description: Delivery gate — runs code review, tests, a11y/performance and lint/build over the current work and issues an APPROVED or BLOCKED verdict. Run before any client delivery or merge.
argument-hint: [optional branch or scope]
---

You are going to act as the delivery quality gate. Nothing leaves here without an explicit verdict. Scope provided (may be empty): $ARGUMENTS

## Step 0 — Delimit the scope

1. If $ARGUMENTS names a branch, the scope is `git diff <base>..<branch>` (base = main/master, confirm with `git branch`). If it names a path/feature, restrict the checks to those files.
2. No arguments: scope = current branch changes against the base (`git diff main...HEAD`) plus whatever is uncommitted (`git status --short`, `git diff`).
3. **If the directory is not a git repository:** record that as a Medium finding ("delivery without version control"), ask the user for the scope (list of files/pages in the delivery) or, absent an answer, use all of the project's code files as the scope, and proceed with the gate normally.
4. List the files in scope and classify: is there UI (pages, components, templates, CSS)? Does the project have tests (test folder, test script)? Are there public pages or meta/sitemap/robots files? This decides which subagents run.
5. Empty scope (no changes)? Say so and stop — there is nothing to review.

## Step 1 — Dispatch the subagents

Consult the `## Project commands` section of ABOUT.md for the lint/build/test commands before dispatching. Run the subagents via Task; dispatch the independent ones in parallel:

1. **code-reviewer** (always): pass the list of files in scope and the instruction to review the current diff against the CLAUDE.md rules, the ABOUT.md constraints and the active PACK.md conventions. Ask for findings classified by severity (table below) with file:line and a suggested fix.
2. **qa-tester** (if the project has a test suite): ask it to run the suite defined in the `## Project commands` section of ABOUT.md and report failures with a summarized stack trace. No suite defined → record "no automated tests" as a Medium finding.
3. **a11y-performance** (if the scope contains UI): ask for an accessibility and performance audit of the touched screens/components, with findings by severity.
4. **seo-specialist** (if the scope contains new/changed public pages or meta/sitemap/robots files): ask for an audit of titles/metas, headings, canonicals, sitemap/robots and JSON-LD, with findings by severity.

If any of these agents does not exist in .claude/agents/, record "agent <name> unavailable — check skipped" and treat it as a Medium finding (the gate ran partially).

## Step 2 — Lint and build

If ABOUT.md defines lint and/or build commands (`## Project commands` section), run them yourself via Bash:

- Lint failed → each error is a finding (High if it is an error, Medium for bulk warnings).
- Build failed → automatic Critical finding.
- Commands not defined in ABOUT.md → record "lint/build not configured" as a Medium finding and move on.

Do not invent commands: if it is not in ABOUT.md nor in package.json/pyproject.toml, it does not exist.

## Step 3 — Consolidate findings by severity

Gather EVERYTHING (subagents + lint/build) into a single table, deduplicating findings repeated across sources:

| Severity | Criterion |
|---|---|
| **Critical** | Functional breakage, red build, security vulnerability, exposed client data, data loss |
| **High** | Bug in a main flow, failing test, a11y that prevents use (no keyboard, below minimum contrast), severe performance regression |
| **Medium** | Bug in a secondary flow, debt that hinders maintenance, missing coverage on new code, relevant warning |
| **Low** | Style, naming, optional improvement, polish |

Each table row: severity, file:line, one-sentence description, suggested fix, source (which check found it).

Ignore the subagents' textual verdicts (e.g. "APPROVED WITH RESERVATIONS" from code-reviewer, "GO WITH RESERVATIONS" from qa-tester) — the gate's verdict derives EXCLUSIVELY from the consolidated severity table (any Critical or High → BLOCKED).

## Step 4 — Verdict

Hard rule, no exceptions and no "approved with reservations":

- **Any Critical or High finding → BLOCKED.**
- Only Mediums and Lows → **APPROVED**, listing the Mediums as recommendations for the next iteration.

Final output format:

```
VERDICT: APPROVED | BLOCKED

[if BLOCKED]
Fix before resubmitting (in severity order):
1. [Critical] file:line — problem — suggested fix
2. [High] ...

[if APPROVED]
Non-blocking recommendations:
- [Medium] ...
```

If BLOCKED, offer: "Want me to fix items 1..N now?" — but do NOT fix anything unless the user asks, and after fixing, run /review again from scratch (a fix does not inherit approval).

## Anti-patterns — never do

- Soften the verdict ("almost approved", "blocked, but you can ship if in a hurry").
- Skip an applicable subagent without recording it as a finding.
- Take a subagent's word for "tests passing" without the command's real output.
- Run the review on a scope different from what will actually be delivered.
