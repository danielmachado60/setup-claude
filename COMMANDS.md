# 🧭 Pocket guide

> You don't need to memorize anything. This file answers one question —
> **"what do I do now?"** Keep it around on day one; you'll stop needing it fast.

## Starting something?

| Your situation | Do this |
|---|---|
| 🆕 **Brand-new project** | Open `wizard.html` in your browser → fill in the briefing → save `ABOUT.md` at the root → run `claude` → type `/new-project` |
| 📦 **Existing codebase** | Copy `.claude/`, `CLAUDE.md`, `.mcp.json` and `ABOUT.md` into the repo → `claude` → `/new-project` (it figures out the stack from the code by itself) |
| 🔍 **A live page that needs improving** | `/audit <url or route>` — you get a prioritized action plan *before* anything is touched |

## While you work: mostly, just talk

Describe what you want in plain words — *"build the pricing section"*, *"the form
doesn't submit"*, *"write the hero headline"*. The right specialist picks it up on
its own. The commands below are the few moments YOU drive:

| Type this | When | What you get |
|---|---|---|
| `/design-review` | UI built or changed | Claude *looks* at every page on 3 screen sizes and fixes what's off |
| `/review` | Before delivering anything | Full inspection — verdict **APPROVED** or **BLOCKED**, no in-between |
| `/sync-docs` | After a big structural change | Docs catch up with reality (always asks before writing) |
| `/prime` | Long session losing the thread | Deep context reload |

## Things that happen without you asking

- 🚪 **Open a session** → the briefing (ABOUT.md) loads into context by itself.
- ✍️ **Edit a file** → formatting runs by itself (when the project has Prettier).
- 🔔 **Finish with unreviewed code** → one gentle "/review?" nudge per session. Just one.

## Conversion pages (landing / sales) follow an order

**Research → strategy → visual direction → copy → build → review.**
You don't have to trigger it: the copywriter and the designer *refuse* to skip
steps — that's what separates a page that converts from a pretty one. Trust the pipeline.

## If an MCP server shows ⚠ failed

One-time fixes: run `/mcp` and log in (Sentry, Supabase) · export `GITHUB_PAT` on
your machine (GitHub) · not using that server in this project? Just remove its block
from `.mcp.json`.

## The 3 rules that save you

1. **ABOUT.md is the only file you ever edit.** Switching stacks = editing line 2
   (`Active pack:` — lists allowed: `nextjs + node-api`).
2. Nothing ships without `/review` saying APPROVED.
3. `.env` is never read, pasted or committed. No exceptions.

Lost? The full manual lives in [`.claude/README.md`](.claude/README.md).
