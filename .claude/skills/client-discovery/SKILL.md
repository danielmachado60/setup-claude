---
name: client-discovery
description: Market research before any copy or strategy — mines customer voice (real reviews), competitors and a defensible differentiator, producing docs/discovery.md. Use PROACTIVELY when writing site/landing copy and docs/discovery.md does not exist, when the user asks for "discovery", "market research", "customer voice", or when the ABOUT.md brief is too shallow to support copy that converts.
---

# Client discovery — raw material before copy

Killer copy is not born from imagination: it is born from the audience's real phrases, real
objections and a real differentiator. This skill turns the 5-line brief from ABOUT.md into
`docs/discovery.md` — the mandatory input for the copywriter and the landing blueprint.

**Timebox: 60–90 min of research.** Endless discovery is procrastination dressed up as
diligence. Collect, synthesize, move on.

## Step 0 — Inputs

1. Read ABOUT.md: client, segment, audience, primary conversion, tone.
2. Ask the user (AskUserQuestion, one round only):
   - Who are the top 3 competitors? (if unknown, you find them in Step 2)
   - Is there existing client material? (testimonials, surveys, sales-call recordings, current site)
   - What does the client THINK their differentiator is?

## Step 1 — Customer voice (the heart of the skill)

Mine LITERAL phrases from the audience. Sources, via WebSearch/WebFetch:

- The client's own reviews: Google Maps, Trustpilot, G2, app stores.
- Competitors' reviews (their unmet pains are your argument).
- Reddit, forums, YouTube comments in the niche — search "[niche] worth it",
  "[niche] experience", "how to solve [problem]".
- Market-specific sources: see `.claude/locales/<language>.md` when the project Language
  has one — it lists the review platforms and channels that matter in that market.

What to extract from each source (with literal quote + link):
- **Pains** — what they complain about, in their exact words ("slow to reply", "hidden pricing").
- **Desires** — the dream outcome, as they describe it.
- **Objections** — why they hesitate before buying ("will this work for my case?").
- **Language** — what they call things (does the audience say "consultation" or "assessment"? "site" or "page"?).

Golden rule: **literal quote > paraphrase**. The headline that converts has almost always
already been written by a customer in a review.

Client with no online presence (new business)? Replace with a guided interview with the user:
5 questions — who is the ideal customer who would buy today; what have they tried before;
what would make them say no; what do competitors promise; what concrete result in 90 days.

## Step 2 — Competitors (3 to 5)

For each one, open the landing/site (Playwright if available, otherwise WebFetch) and record:

| Field | What to note |
|---|---|
| Hero promise | Literal headline |
| Offer and CTA | What they ask for and how |
| Social proof | Which kind they use (numbers, logos, testimonials) and how specific |
| Pricing | If visible, how much and how they anchor it |
| Apparent weakness | What's missing, what's generic, recurring complaint in the reviews |

## Step 3 — Defensible differentiator

Cross-reference: what the client has × what the audience wants × what competitors don't deliver.
A differentiator only counts if it passes the test: **a competitor could NOT say the same
sentence tomorrow**. "Quality and service" fails; "48-hour delivery with tracking" passes.

If no real differentiator exists, SAY SO in the document: the strategy becomes competing on
clarity, proof and response speed — never inventing a fake differentiator.

## Output — docs/discovery.md (fixed format)

```markdown
# Discovery — [client] ([date])
## Audience
Who they are + how they talk (3-5 lines, with the niche-term glossary)
## Pains (top 5, with literal quotes and source)
## Desires / dream outcome (with quotes)
## Objections (top 5) + honest answer to each
## Competitors (Step 2 table)
## Defensible differentiator (or "parity — compete on clarity and proof")
## Candidate copy angles (3, one paragraph each)
```

## Anti-patterns

- Inventing a pain or testimonial the research didn't find — the document only contains what has a source.
- Paraphrasing everything into "marketing language" — kills exactly the value of the research.
- Copying the strongest competitor's promise (if they already own it, you arrive second).
- Researching for 4 hours — timebox blown = synthesize with what you have and note the gaps.
