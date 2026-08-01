---
name: landing-blueprint
description: Conversion landing page strategy and anatomy — decides offer, awareness level and section-by-section structure BEFORE copy and design, producing docs/blueprint.md. Use PROACTIVELY when the ABOUT.md Type is landing page (or the goal is direct conversion) before writing any section or designing any screen. Also when the user asks for "landing structure", "page strategy".
---

# Landing blueprint — strategy becomes a document

A landing page without strategy is a pile of pretty sections in the wrong order. This skill
decides the sales argument and the structure BEFORE the copywriter writes and the ui-designer
designs. Output: `docs/blueprint.md` — copy and design are executed ON TOP of it, never in
parallel with it.

**Prerequisite:** does `docs/discovery.md` exist? If not, run the `client-discovery` skill
first. A blueprint without discovery is organized guessing.

## Step 1 — Three strategic decisions (before any section)

Decide with the user (AskUserQuestion) whatever is ambiguous:

1. **Single page action** — ONE conversion (the one from ABOUT.md). Everything on the page
   pushes toward it; any link that doesn't push is a leak and goes out.
2. **Audience awareness level** (Schwartz) — defines how much the page educates before selling:
   - Problem-unaware → long page, starts with the pain.
   - Problem-aware, not solution-aware → educate on the mechanism before the offer.
   - Solution-aware → compare and prove why YOURS.
   - Product-aware / hotter → short page, offer and proof up front.
3. **Traffic temperature** — cold paid (the page does ALL the convincing work)
   vs warm organic/referral (less education, more proof and action). Ask where the traffic comes from.

## Step 2 — Anatomy (default order + why)

Build the blueprint by choosing and ordering these sections — cut what the awareness level
makes unnecessary, never cut hero/proof/CTA:

1. **Hero** — single promise stated as an OUTCOME (not a feature), subheadline with mechanism
   or proof, CTA, visual that shows the result (not a generic stock photo).
   Fold rule at 360px: promise + CTA + 1 proof element visible WITHOUT scrolling.
2. **Quick proof bar** — logos, average rating, customer count. A breath of
   credibility before the argument.
3. **Problem / agitation** — the pain IN THE DISCOVERY'S WORDS (adapted quotes). The
   reader must think "that's exactly it".
4. **Solution / mechanism** — how it works in 3 simple steps. Kills the "seems complicated" objection.
5. **Benefits** — 3 to 5, each one: concrete outcome + the feature that delivers it (in that order).
6. **Deep social proof** — testimonials with a specific result, name and photo.
   Hard rule: a vague testimonial ("great service!") does NOT go in. 1 case with a number > 5 compliments.
7. **Objection handling** — the top 5 from discovery, one by one: FAQ or dedicated sections
   (guarantee, price, timeline, "does it work for my case?", "what if I don't like it?").
8. **Offer** (when price is on the page) — honest anchoring, explicit guarantee,
   urgency ONLY if real (fake urgency destroys an agency's brand).
9. **Final CTA** — recaps promise + proof + action. Throughout the page: a CTA every
   1.5–2 screens, ALWAYS the same verb (decided in Step 1).
10. **Minimal footer** — legal + contact. Zero escape navigation menu.

## Step 3 — Variations by offer type

- **Local lead-gen** (clinic, local service): direct-contact CTA on the messaging channel the
  market actually uses (see `.claude/locales/<language>.md` when the project Language has one),
  map/service area, before/after when the niche allows, fast response as proof.
- **Product/SaaS**: demo or trial as CTA, real product screenshot in the hero, comparison
  section if the audience is solution-aware.
- **Event/launch**: agenda, who the speaker is (authority), REAL countdown.

## Output — docs/blueprint.md (fixed format)

```markdown
# Blueprint — [project] ([date])
Single action: [CTA + verb]  |  Awareness: [level]  |  Traffic: [source/temperature]
## Sections (in order)
### 1. Hero
- Goal: ...
- Key content: [points to discovery items: pain X, angle Y]
- CTA: [verb]
### 2. ...
(one entry per section: goal, key content referencing the discovery, CTA if any)
```

## Approval gate

Present the blueprint to the user BEFORE releasing copy/design. Checklist:
- [ ] One single action, same verb in every CTA?
- [ ] Every section references discovery raw material (not invention)?
- [ ] The 5 discovery objections have an answer in some section?
- [ ] Order consistent with the awareness level?
- [ ] No fake urgency, promise without proof, or escape navigation?

## Anti-patterns

- Writing copy "in the meantime" — copy before the approved blueprint becomes rework.
- Structure cloned from the last landing without going through Step 1's 3 decisions.
- Long page for warm traffic / short page for cold traffic (classic mismatch).
- A different CTA per section ("Learn more" / "Buy" / "Contact us" — dilutes the single action).
