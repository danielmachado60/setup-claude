# ABOUT — [PROJECT NAME]
Active pack: none
Type: [GROUP — SPECIFIC TYPE, e.g., Site & content — Landing page]
Language: en

> **The only file you ever edit — one per project.** The easy way: open the root
> `wizard.html` in a browser (double click) and it generates this file filled in.
>
> Lines 2–4 above are machine-read — keep their exact format and position:
>
> - **Line 2 · `Active pack:`** — `none | static | nextjs | node-api | python`.
>   Monorepo? Use a ` + ` list (`nextjs + node-api`). Switching stacks = editing this
>   one line; the pack specialists activate on their own next session.
> - **Line 3 · `Type:`** — what the project IS: `<group> — <specific type>`
>   (groups: Site & content · E-commerce & sales · Web system & logged-in areas ·
>   API & integrations · Automation & bots · Internal agency use).
> - **Line 4 · `Language:`** — every client-facing deliverable (copy, UI text, error
>   messages, client docs) is written in this language. If `.claude/locales/<code>.md`
>   exists, agents also read it for market-specific knowledge.
>
> CLAUDE.md is static — project facts live here, never there.

## Client and goal

_Who the client is and what result the project must produce — 1 line per item, no prose._

- Client: [FILL IN]
- Segment: [FILL IN, e.g., dental clinic in Austin]
- Project goal: [FILL IN, e.g., institutional site that generates quote requests]
- Primary conversion: [FILL IN, e.g., quote form submission]
- Delivery deadline: [FILL IN, e.g., 2026-09-15]

## Audience and tone of voice

_Describe who visits the site and pick ONE of the copywriter's 3 reference tones (delete the other two)._

- Audience: [FILL IN, e.g., small-business owners, 30–55, decide over the phone]
- Tone of voice: [PICK ONE BELOW AND DELETE THE REST]
  - sober institutional — trustworthy, no slang, no artificial urgency (professional offices, clinics, industry, B2B)
  - persuasive e-commerce — direct, value- and trust-driven; urgency only when it is real (online stores)
  - conversion landing — one promise, one offer, one repeated CTA; zero escape navigation (campaign landing pages)
- Voice notes: [TERMS THE CLIENT USES, FORBIDDEN WORDS — or "none"]

## Project commands

_How to run the project — agents and commands (e.g. /design-review) read the commands FROM HERE; format `name: command`._

- dev: [FILL IN, e.g., dev: npm run dev]
- build: [FILL IN, e.g., build: npm run build]
- test: [FILL IN, e.g., test: npm run test — or "none"]
- Local URL: [FILL IN, e.g., http://localhost:3000]

## Process

_Process decisions for this delivery — hooks and commands respect what is recorded here._

- Superpowers: [ACTIVE or declined] — ACTIVE for e-commerce/systems (1+ week, interdependent features); declined for short-deadline landings
- Decided on: [FILL IN, e.g., 2026-07-31]

## Constraints and notes

_Everything Claude needs to know to not get it wrong: settled decisions, technical limits, integrations, legacy._

- [FILL IN, e.g., hosting only serves static files — no backend]
- [FILL IN, e.g., brand colors #0A3D62 / #F5F5F5 — do not invent a palette]
- [or "none for now"]
