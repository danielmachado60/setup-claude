---
description: DEEP context reload — full tier1, PACK.md of the active pack(s) and filled-in tier2. Use in a long working session or when context has been compacted; the light context (ABOUT.md) already loads by itself via the SessionStart hook.
argument-hint: [optional session focus]
---

You are going to load this project's deep context. The LIGHT context was already injected automatically by the SessionStart hook (ABOUT.md content + active PACK.md reminder) — do not repeat it; this command's job is the deep reload: foundation (tier1), full PACK.md and filled-in tier2. The goal is to come out knowing what the project is, what state it is in and which conventions apply — spending as little context as possible; anything deeper comes on demand, driven by the task.

Focus provided by the user (may be empty): $ARGUMENTS

## Steps — execute in this order

1. **Foundation (Tier 1).** Read .claude/docs/tier1-foundation.md in full. If the file does not exist, note in the final summary that the foundation has not been created yet.

2. **Active pack(s).** Read the root ABOUT.md; line 2 is "Active pack: <value>" and may list SEVERAL packs separated by " + " (e.g. "nextjs + node-api").
   - If it is "Active pack: none" (or ABOUT.md does not exist / is still in placeholders): move on without loading a pack and note that in the summary.
   - For EACH listed pack (static, nextjs, node-api, python): read .claude/packs/<pack>/PACK.md in full. They define stack and conventions that prevail over any assumption of yours; whatever ABOUT.md pins down (constraints, commands) prevails over the PACK.md.
   - **Project language.** Line 4 of ABOUT.md is "Language: <code>". If it is set and `.claude/locales/<code>.md` exists, do NOT load it now — record in the summary that it is mandatory reading before any client-facing work (site copy, UI strings, error messages, client docs), since it holds market-specific knowledge.
   - Large system with per-module CLAUDE.md files (apps/*/CLAUDE.md, services/*/CLAUDE.md): do NOT read them in bulk — Claude Code loads each one by itself when you work in that area. Just record in the summary which modules have their own doc (Glob for */CLAUDE.md, max 2 levels).
   - IMPORTANT: write file paths as plain text in your replies, never as @-references — @-references are expanded automatically and would destroy the conditional loading this command implements.

3. **Components (Tier 2) — conditional.** Check .claude/docs/tier2-components.md:
   - If it does not exist, or is still a skeleton/placeholder (empty sections, "fill in"-style text, fewer than ~15 lines of real content): do NOT read it in full; just record "tier2 not filled in yet" in the summary.
   - If it is filled in: read it. Keep the module map in mind — it will guide targeted reads during the session.

4. **Repository state.** Run:
   - `git log --oneline -5`
   - `git status --short`
   If it is not a git repository, record that and move on.

5. **Session focus.** If $ARGUMENTS contains a focus (e.g. "checkout", "contact form"), identify in tier2 (if read) the section governing that domain and read ONLY it — nothing else. If the focus does not match any documented section, say so explicitly instead of guessing.

## What NOT to do

- Do NOT read source code in bulk (no Glob + Read across all of src/, no "let me take a general look at the files"). Code is only read when a concrete task requires it.
- Do NOT read auxiliary docs (design, business, legal) — they only come in when the task calls for them.
- Do NOT assert design or architecture facts about sections/files you have not read. If you need to, read first.
- Do NOT start executing any task inside this command.

## Permanent post-prime rule

Before touching any subsystem whose documentation you did not load here, first read the relevant tier2 section (or the PACK.md, if it is a stack convention). If the work turns out to be architectural/cross-cutting, warn the user and propose loading the full documentation before proceeding.

## Final output — mandatory format

End with exactly this:

1. A project state summary in **5 lines**, covering: (a) what the project is and for which client; (b) active pack and stack; (c) repository state (branch, latest commits, dirt in the working tree); (d) what was loaded and what was left out (tier2 empty? focus applied? locale file pending?); (e) visible blockers or open items.
2. The question: **"What is the goal of this session?"** — unless $ARGUMENTS already contains a clear goal; in that case, confirm your understanding of the goal in one sentence and ask if you may start.
