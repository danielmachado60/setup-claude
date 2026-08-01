# Tier 2 — Project components and architecture

> **TEMPLATE — fill in per project.** This file is tier 2 of the docs system: the living
> portrait of THIS project (tier 1, `.claude/docs/tier1-foundation.md`, holds the agency
> standards and is not edited per project). The **`/sync-docs` command maintains this
> file**: run it after any change to architecture, a main component, a decision or an
> integration. Fill in the sections below by replacing the examples; delete this note and
> the fill-in instructions once the file is active. If a section does not apply, write
> "Not applicable" — do not delete it, `/sync-docs` expects all sections.
>
> **This file is architecture, not briefing.** Project data lives in the root **ABOUT.md**:
> client and goal, audience and tone, active pack (line 2), commands and constraints. Do
> not duplicate any of that here — reference ABOUT.md when needed.

## Product spec

> **How to fill in:** WHAT the product does, in its current state — settled scope, main
> user flows and business acceptance criteria. THIS is where the spec produced in
> kickoff/brainstorming (e.g. superpowers skills) gets consolidated: merge the approved
> decisions into this section and delete the source draft. No changelog, no future plans —
> only what holds today.

_(fill in)_

## Project architecture

> **How to fill in:** 3–8 lines: project type (landing, institutional, e-commerce, web
> system), stack and active pack, how the code is organized at a high level, where it runs
> (hosting/deploy) and how the environments split (dev/staging/prod). A simple mermaid
> diagram helps when there are more than two services.

_(fill in)_

## Components / main modules

> **How to fill in:** one line per component or module someone would need to know about to
> work on the project without breaking anything. "Where" is a real path in the repo. Do
> not list trivial components (button, icon) — only what carries rules or is reused in
> several places.

| Component/Module | Where | What it does | Care when changing |
|---|---|---|---|
| _(e.g. ContactForm)_ | _(e.g. src/components/contact-form.tsx)_ | _(e.g. captures a lead and sends it to the CRM)_ | _(e.g. validation mirrored in the /api/leads endpoint)_ |

> **Large system/monorepo:** a module with its own `CLAUDE.md` (e.g. `apps/web/CLAUDE.md`)
> gets only ONE line here pointing to it — the detail lives in the module's CLAUDE.md,
> which Claude Code loads on its own when working there. This file keeps the MAP, not the
> detail.

## Decisions and trade-offs

> **How to fill in:** chronological log (most recent on top). One entry per decision that
> someone will question in the future: library choice, rendering strategy, data modeling,
> scope cut. The value is in the "why" and in what was discarded — a decision with no
> discarded alternative probably didn't need to be here.

### YYYY-MM-DD — _(short title of the decision)_

- **Context:** _(what problem required a decision)_
- **Decision:** _(what was chosen)_
- **Discarded alternatives:** _(what was considered and why it lost)_
- **Consequences:** _(what gets easier, what gets harder, what to revisit)_

## External integrations

> **How to fill in:** one line per external service the project depends on. "Env vars"
> lists the NAMES of the variables (never values). Also include what breaks if the
> service goes down — that is what saves an on-call shift.

| Service | For what | Auth | Env vars | If it goes down, what breaks |
|---|---|---|---|---|
| _(e.g. Resend)_ | _(e.g. transactional e-mail)_ | _(e.g. API key)_ | _(e.g. RESEND_API_KEY)_ | _(e.g. order confirmation not sent; order still created)_ |

---

_Last sync via `/sync-docs`: (date) — do not edit this line by hand._
