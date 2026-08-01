---
name: design-direction
description: Art direction before the first screen — real references, 3 DISTINCT visual directions for the user to choose from, tokens with personality and anti-generic-design rules. Use PROACTIVELY on a new project with UI (or a redesign) BEFORE creating tokens or designing the first screen; also when the user asks for "art direction", "site visual identity", or complains the design looks generic / "AI-looking".
---

# Design direction — kill the generic before the first screen

Claude without direction produces competent, forgettable design: purple gradient, Inter,
identical cards with a soft shadow. This skill decides the LOOK of the project before any
token or screen. Output: `docs/design/direction.md` + tokens — the ui-designer and the dev
execute on top of them.

## Step 1 — Inputs

1. ABOUT.md: segment, audience, tone of voice (the visual direction translates the verbal tone).
2. `docs/discovery.md` if it exists (what the audience is like, what competitors look like).
3. Ask the user: is there a brand? (logo, mandatory colors, brand font,
   brand manual?) Constraints outrank preferences — record what is non-negotiable.

## Step 2 — Real references (not from memory)

Collect 4–6 VISIBLE references (Playwright for screenshots; without Playwright, WebFetch +
honest description):

- 2–3 from the niche that perform (find via discovery/competitors — including to DIVERGE from them).
- 2–3 from outside the niche with high craft — search galleries (awwwards, godly.website,
  land-book, minimal.gallery) for adjacent segments.

From each one note: what to steal (type pairing, spacing rhythm, use of color, a layout
pattern) and what to avoid. A reference without notes is decoration.

## Step 3 — Propose 3 DISTINCT directions

Each direction is a coherent package. The three must genuinely diverge — three variations
of blue are not three directions. Format per direction:

- **Name** (e.g. "Sober editorial", "Soft brutalism", "Classic premium")
- **Intent** — 1 paragraph: what feeling it delivers and why it fits THIS audience/tone
- **Palette** — 3–5 colors with hex and role (dominant, signature, surface, text).
  Rule: 1 dominant + 1 memorable signature color. No rainbow.
- **Type pairing** — display + text, real and available fonts (Google Fonts is fine).
  Display with personality: Inter/Roboto/Open Sans/Lato/Montserrat only as TEXT, never
  as display without a written justification.
- **Distinctive layout rule** — the structural signature: giant hero typography,
  grid with a deliberate break, full-bleed photo, hard borders with no shadow, alternating
  solid-color sections... ONE clear rule the dev can follow.
- **Anchor reference** — which of the Step 2 references anchors this direction.

Present via AskUserQuestion (one option per direction, with a textual preview). Hybrids are
allowed ("palette from 1 with typography from 3") — record the final choice.

## Step 4 — Materialize the chosen direction

1. `docs/design/direction.md`: the full direction (intent, palette, typography, layout
   rule, references with notes, what is FORBIDDEN in this project).
2. Tokens in the active pack's format (custom properties in static, project tokens in
   nextjs): colors by role, type scale with the display font, spacing, radius,
   shadow — all consistent with the direction (a "hard borders" direction with `border-radius: 12px`
   is incoherence, not a detail).
3. From here on, precedence applies: direction.md > one-off screen preference. Direction
   changed mid-project? Update the document first, screens after.

## Anti-generic rules (apply to ANY direction)

- No default-AI purple/blue gradient as identity.
- No display type in Inter/Roboto/system without a justification recorded in direction.md.
- No emoji as icons on a client site.
- No grid of 3 identical cards with soft shadows as the default solution for every section.
- Minimum 1 personality element PER PAGE (expressive typography, signature color used
  boldly, characteristic shape/pattern) — without turning into a circus: 1 is the floor, 3 is the ceiling.
- AA contrast always (personality never justifies illegible text).
- Generic stock photos (handshake, smiling call center) don't go in; prefer real product,
  real results, or custom illustration/composition.

## Process anti-patterns

- Jumping straight to the screen "because the deadline is tight" — direction takes 1 hour and saves 3 rounds of "I don't like it".
- 3 directions that are the same one with a swapped palette.
- Choosing the direction yourself without presenting all 3 — the choice belongs to the user/client.
- Copying the anchor reference 1:1 — a reference is a starting point, not a template.
