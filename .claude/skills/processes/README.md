# Agency process skills — index

This file is the **index** of the process skills: operational procedures Claude follows step by step when the right trigger appears. Unlike agents (roles) and commands (user actions), a skill encodes **how the agency works** — loaded on demand.

**ATTENTION — location:** Claude Code only discovers skills that are DIRECT children of `.claude/skills/` (`.claude/skills/<name>/SKILL.md`). This `processes/` folder is only the index/incubator — real skills live one level up.

## Existing skills (the creative pipeline)

In `.claude/skills/`, in the order they run on a conversion project:

1. **client-discovery** — market research before copy: customer voice (real reviews), competitors, defensible differentiator → `docs/discovery.md`.
2. **landing-blueprint** — page strategy: single action, awareness level, section-by-section anatomy → `docs/blueprint.md`.
3. **design-direction** — art direction before the first screen: real references, 3 distinct directions, tokens with personality, anti-generic rules → `docs/design/direction.md`.

Landing pipeline: discovery → blueprint → direction → copy (copywriter) → UI (ui-designer/dev) → /design-review → /review.

## What is yet to be born here

Planned skills, to be created as the processes consolidate in real use:

- **briefing-to-spec** — turn the client's raw briefing (transcribed audio, email, meeting) into an executable spec: closed scope, what is out, acceptance criteria per feature.
- **delivery-checklist** — final checklist per project type (landing, institutional, e-commerce, system): domain/DNS, basic SEO, analytics, tested forms, favicon, 404, responsive, privacy/cookie compliance (market specifics live in the locale file).
- **client-handoff** — package the delivery: credentials transferred, usage documentation in client language (not dev language), video/step-by-step for content editing, maintenance terms.

**Do not create these skills in advance.** The folder's rule is: a process only becomes a skill after it has been executed manually at least twice and has a stable shape. A skill written on speculation becomes dead documentation.

## Mandatory format

Each skill is a **direct subfolder of `.claude/skills/`** with a `SKILL.md` inside:

```
.claude/skills/
├── processes/README.md                    ← this index (not a skill)
├── client-discovery/SKILL.md
├── landing-blueprint/SKILL.md
├── design-direction/SKILL.md
└── briefing-to-spec/SKILL.md              ← example of a next skill
```

The `SKILL.md` has YAML frontmatter with two fields:

- `name` — kebab-case, identical to the subfolder name.
- `description` — **when to activate**, with concrete triggers. The description is what makes Claude decide to load the skill; a vague description = a skill that never fires. Include phrases the user would actually say.

Support files (templates, examples) may live in the subfolder next to the SKILL.md and be referenced by relative path.

## Minimal SKILL.md skeleton

```markdown
---
name: briefing-to-spec
description: Turns a raw client briefing into an executable spec with scope and acceptance criteria. Use when the user says "the briefing arrived", "turn this into a spec", "the client sent what they want", or pastes briefing/meeting text asking to organize the scope.
---

# Briefing → Spec

## When to use
A new client briefing in hand (text, email, transcript) and no spec exists yet.

## Steps
1. Read the entire briefing before asking anything.
2. Extract: business goal, audience, requested features, deadline, cited references.
3. List ambiguities and ask ALL of them at once (never drip question by question).
4. Write the spec: scope included, scope explicitly OUT, acceptance criteria per feature.
5. Present for the user's approval before writing to docs/.

## Acceptance criteria for the skill itself
- Every feature in the spec has a verifiable acceptance criterion.
- The "out of scope" section is never empty — scope without exclusions is open scope.
```

## Folder rules

- Language: skills are written in English (the template's core language); client-facing deliverables they produce follow the project language declared on line 4 of ABOUT.md (market specifics in `.claude/locales/<language>.md`, when it exists).
- One skill = one process. If a SKILL.md covers two processes, split it.
- Skills here are universal (they apply to any stack); stack conventions belong to the active pack's PACK.md.
- When consolidating a new process, update the "What is yet to be born here" list above.
