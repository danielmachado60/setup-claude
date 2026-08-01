# ABOUT — [PROJECT NAME]
Active pack: none
Type: [GROUP — SPECIFIC TYPE, e.g., Site & content — Landing page]
Language: en

> **This is the ONLY file edited per project.** CLAUDE.md is static — never change it
> per project. Fill this file in by hand or generate it ready-made by opening the root
> `wizard.html` in a browser (double click). Lines 2–4 above are read by automation: keep
> the exact formats `Active pack: none|static|nextjs|node-api|python`, `Type: ...` and
> `Language: ...`, and never move them from position. Multi-stack/monorepo: line 2 accepts
> a LIST separated by ` + ` (e.g. `Active pack: nextjs + node-api`) — each pack specialist
> activates for its own part. Line 3 records what the project IS (group — specific type);
> the groups are: Site & content · E-commerce & sales · Web system & logged-in areas ·
> API & integrations · Automation & bots · Internal agency use. The wizard suggests the
> right pack from the type. Line 4 sets the language of every client-facing deliverable
> (copy, UI strings, error messages, client docs — e.g. `en`, `pt-BR`, `es`); when
> `.claude/locales/<language>.md` exists, agents read it for market-specific knowledge.
> Switching packs = editing line 2; pack agents activate on their own in the next session.

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
