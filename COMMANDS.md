# 🧭 Pocket guide

> **Prefer the visual version:** open `wizard.html` in your browser → **📖 Guide** tab.
> Same content, nicer to read (and bilingual). This file is the plain-text fallback.

### 🆕 Brand-new project?

1. Open `wizard.html` → fill in the briefing
2. Save `ABOUT.md` in the project root
3. Run `claude` → type `/new-project`

### 📦 Existing codebase?

1. Copy `.claude/`, `CLAUDE.md`, `.mcp.json` and `ABOUT.md` into the repo
2. Run `claude` → `/new-project`
3. It reads the stack from the code and asks only the rest

### 🔍 A live page that needs improving?

Run `/audit <url or route>` — you get a prioritized plan *before* anything is touched.

### 💬 While you work: mostly, just talk

Describe what you want in plain words. The right specialist picks it up on its own.
You only drive four moments:

- `/design-review` — after building or changing UI. Claude *looks* at every page on 3 screen sizes.
- `/review` — before delivering anything. Verdict APPROVED or BLOCKED, no in-between.
- `/sync-docs` — after a big structural change. Docs catch up (asks before writing).
- `/prime` — long session losing the thread. Deep context reload.

### ✨ Happens without you asking

- Open a session → the briefing loads into context by itself
- Edit a file → formatting runs by itself
- Finish with unreviewed code → one gentle "/review?" nudge per session

### 🎯 Conversion pages follow an order

Research → strategy → visual direction → copy → build → review.
The copywriter and designer *refuse* to skip steps. Trust the pipeline.

### 🧷 The 3 rules that save you

1. **ABOUT.md is the only file you ever edit.** Stack switch = line 2 (`Active pack:` — lists allowed).
2. Nothing ships without `/review` saying APPROVED.
3. `.env` is never read, pasted or committed. No exceptions.

MCP showing ⚠ failed? `/mcp` and log in (one time). Lost? Full manual: `.claude/README.md`.
