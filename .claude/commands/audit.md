---
description: Conversion audit of an EXISTING page (sales page, landing, home) — compares the real page against discovery, blueprint, design, a11y/performance and SEO, and delivers an improvement plan prioritized by impact × effort. Changes nothing without approval.
argument-hint: [page URL or route, e.g. /sales or https://client.com]
---

You are going to audit a page that ALREADY EXISTS and produce a prioritized improvement plan. This command does NOT change the page — diagnosis first, execution only after the user approves the plan. Target page (may be empty): $ARGUMENTS

## Step 0 — Target and context

1. Define the page: $ARGUMENTS, or ask. Find a reachable URL: production (if the user provides it) or local dev (`## Project commands` section of ABOUT.md — start the server if needed).
2. Read ABOUT.md (client, audience, conversion, tone, language on line 4). If ABOUT.md is not filled in (freshly adopted repo), run `/new-project` first — the audit needs to know what the expected conversion is.

## Step 1 — Raw material (the skills become the rubric)

- **Discovery**: does `docs/discovery.md` exist? If not, trigger the `client-discovery` skill — auditing copy without knowing the audience's real pain is guesswork. An existing page changes nothing: the customer's voice is the same.
- **Structure rubric**: the `landing-blueprint` skill is used here as a RULER, not as a generator — its anatomy (hero, proof, agitation, mechanism, objections, offer, CTA) is the standard the real page will be compared against.

## Step 2 — Capture the real page

With the Playwright MCP tools: navigate to the page and capture screenshots at 360×740, 768×1024 and 1280×800 + an accessibility snapshot. Also extract the real HTML/copy (headlines, CTAs, sections in the order they appear). ACTUALLY look at the screenshots — the audit is about what the visitor sees.

## Step 3 — Audit across 5 dimensions

For each finding: evidence (screenshot/excerpt) + why it loses conversion + concrete fix.

1. **Copy vs discovery** — is the hero promise an outcome or a feature? Does it use the audience's words (discovery glossary) or internal jargon? Is the proof specific (number, name) or vague ("quality and trust")? Do the 5 objections from discovery get answered somewhere on the page? Is the copy in the project language declared on line 4 of ABOUT.md?
2. **Structure vs blueprint** — above-the-fold rule at 360px (promise + CTA + proof without scrolling)? Section order consistent with the traffic's awareness level? Single CTA repeated with the same verb, or competing CTAs? Escape navigation?
3. **Design** — hierarchy (is what the eye sees first what matters?), spacing/alignment consistency, contrast, personality vs generic. If `docs/design/direction.md` exists, compare against it.
4. **A11y + performance** — trigger the `a11y-performance` agent scoped to the page: WCAG AA on the snapshot, Core Web Vitals against the tier1 budgets (run Lighthouse/audits if the project has them).
5. **SEO** — trigger the `seo-specialist` agent: title/meta, headings, schema, images, indexing — focused on what affects the audited page.

## Step 4 — Prioritized report (impact × effort)

Write it to `docs/audit-<page>-<date>.md` and present:

```markdown
# Audit — [page] ([date])
Expected conversion: [from ABOUT.md]  |  Rubrics: discovery from [date], landing-blueprint
## Quick wins (high impact, low effort) — do first
1. [finding + evidence + fix] ...
## Structural (high impact, medium/high effort)
## Polish (low impact)
## What is GOOD (don't touch)
```

Report rules: max 15 findings in total (more than that is a dump, not prioritization); each one with evidence; the "what is good" section is mandatory — it protects what works from well-intentioned rework.

## Step 5 — Execution gate

Present the report and STOP. If the user approves execution (all or part of it): quick wins first, one at a time, re-screenshot after each visual change (/design-review on the changed pages at the end) and `/review` before delivering.

## Anti-patterns

- Start fixing during the audit — diagnosis and execution are separate phases.
- A finding without evidence ("the design feels weak") — no screenshot/excerpt, no entry.
- Rewriting the whole page when 3 quick wins solve 80% — prioritization is the product.
- Auditing without discovery — it becomes designer opinion, not conversion diagnosis.
- Ignoring what works: if the page converts reasonably, the cost of a wrong change is real.
