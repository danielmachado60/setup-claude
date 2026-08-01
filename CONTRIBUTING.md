# Contributing

This is a Claude Code template for web development agencies: a 100% English core plus
per-language locale files. Language is per-project config (ABOUT.md line 4), never a
fork — keep contributions in that shape.

## What to propose

- **Agents** (`.claude/agents/`): one clear responsibility, a frontmatter description in
  English with concrete triggers, minimal-tool permissions (only the tools the agent
  actually needs), and explicit anti-patterns. Model routing matters — justify anything
  above the cheapest model that does the job.
- **Skills** (`.claude/skills/`): an actionable process with a concrete output (a file, a
  verdict, a plan). No generic tutorial prose — if a paragraph could appear in any blog
  post, cut it.
- **Locales** (`.claude/locales/<lang>.md`): very welcome. Market knowledge for one
  language/market — review-mining sources, legal basics for sites/forms, payment rails,
  CTA culture, date/currency/phone formats, tone notes, local SEO. Written in English
  with local terms inline. Use `pt-BR.md` as the reference shape (~60 lines, actionable
  bullets only).
- **Packs** (`.claude/packs/`): stack conventions and anti-patterns, not framework
  documentation. Full path below.

### Adding a stack pack

A pack has three parts, all required:

1. `.claude/packs/<stack>/PACK.md` — the stack's conventions and anti-patterns
   (follow the structure of the existing four).
2. `.claude/packs/<stack>/scaffold/` — a `SCAFFOLD.md` with the exact setup commands
   plus ready config files and a minimal runnable example.
3. `.claude/agents/<stack>-specialist.md` — the specialist agent, gated by the
   ABOUT.md line 2 (description must start with "Activate ONLY when the Active pack
   line of ABOUT.md CONTAINS <stack>").

Also update the taxonomy where the new pack becomes a suggestion: `wizard.html`
(GROUPS object) AND `.claude/commands/new-project.md` (taxonomy table) — the two
copies always move together.

### Adding a locale

Create `.claude/locales/<language-code>.md` following the format of
`.claude/locales/pt-BR.md`: written in English, market terms inline, actionable
bullets only (review sources, legal requirements, payment rails, cultural CTA
norms, formats). ~60 lines max.

## Style rules

- The core stays 100% English. Market-specific knowledge goes in a locale file, not in
  agents or skills.
- Actionable over descriptive: checklists, thresholds, exact commands, file paths.
- Keep verified technical facts intact when editing: WCAG criteria, Core Web Vitals
  budgets, MCP configs, model routing.
- Agency-agnostic: never hardcode a brand, agency or client name in the core.

## Taxonomy changes

The project-type taxonomy (groups, types, suggested packs) lives in TWO places that must
stay in sync: `wizard.html` and `.claude/commands/new-project.md`. If you change one,
change the other in the same PR.

## How to propose

Open a PR with a short rationale: what problem the change solved in a real project.
Improvements battle-tested in client work beat speculative features.
