---
description: Visual review loop — opens each page in the browser via Playwright MCP at 3 widths (mobile/tablet/desktop), critiques against concrete criteria, runs an accessibility snapshot and iterates fixes with re-screenshots (max 3 rounds).
argument-hint: [pages or routes, e.g. / /pricing /contact]
---

You are going to run the agency's visual loop: actually look at the pages, in the browser, at 3 widths, and critique against concrete criteria — not against general impressions. Pages provided (may be empty): $ARGUMENTS

Prerequisite: the Playwright MCP `browser_*` tools must be available. If they are not, tell the user to approve the servers in `.mcp.json` (or run `claude mcp reset-project-choices`) and stop. The browser downloads itself on first use; if the automatic download fails, run `npx playwright install chromium` as a fallback.

## Step 0 — Discover the dev URL

1. Read the `## Project commands` section of the root ABOUT.md: that is where the dev server command and the "Local URL" line live.
2. If the command exists and the server is NOT running (test the URL first), start it in the background via Bash and wait for it to respond.
3. Static project with no server defined (plain HTML, static pack): start a local server in the background (e.g. `npx serve .` or the project's equivalent) and use the localhost URL it prints. Do not use `file://` — relative paths and headers behave differently from the real environment.
4. Nothing defined and not obviously static: ask the user which URL to use. Do NOT guess a port.

## Step 1 — Define the pages

1. If $ARGUMENTS lists pages/routes, use them.
2. Empty: ask which pages to review, offering the home (`/`) as the default. If the user does not specify, review only the home — do not go sweeping the whole site on your own.

## Step 2 — Screenshots: each page × 3 widths

Fixed widths of the loop:

| Alias | Viewport |
|---|---|
| mobile | 360x740 |
| tablet | 768x1024 |
| desktop | 1280x800 |

For EACH page:

1. `browser_navigate` to the page URL.
2. For each width: `browser_resize` to the viewport and then `browser_take_screenshot`.
3. **Actually look at each screenshot** before moving to the next: mentally describe what is on screen and compare it against the Step 3 criteria. An unexamined screenshot = a review not done.

If the page requires interaction to reveal a relevant state (mobile menu, dropdown, modal), use `browser_click` / `browser_type` and screenshot that state too.

## Step 3 — Critique criteria (concrete, not vibes)

Evaluate each screenshot against this list — cite the violated criterion in every finding:

- **Visual hierarchy**: one focus per fold; if two elements fight for attention in the same fold, that is a finding.
- **Spacing**: consistent with the project's token scale; visible magic values (unequal gaps between sibling sections) are a finding.
- **Alignment**: grid respected; elements that almost align are worse than elements clearly detached.
- **Contrast**: WCAG AA minimum (4.5:1 normal text, 3:1 large text/UI). When in doubt, check the actual color pair, do not estimate.
- **Horizontal overflow**: FORBIDDEN at any width — sideways scroll on mobile is a maximum-severity finding.
- **Text**: cut off, truncated without intentional ellipsis, or orphaned (lone word on a headline's last line).
- **Images**: distorted (wrong aspect ratio) or without reserved space (visible layout shift — collapsed/jumping area).
- **Consistency with the spec**: if a ui-designer spec exists in `docs/design/`, compare against it; also compare against the active PACK.md conventions. Divergence from the spec is a finding, even if it "looks nice".
- **States**: hover/focus visible where applicable (use `browser_hover` and Tab via `browser_press_key` to verify; invisible focus is a finding).

## Step 4 — Accessibility snapshot

For each page (desktop width is enough), run `browser_snapshot` and check the accessibility tree:

1. Controls without an accessible label (icon-only buttons, inputs without a `label`).
2. Landmarks: is there a `main`? Are `nav` and `footer` identified? Content outside a landmark?
3. Heading order: a single `h1`, no level skips (h2 → h4).

Findings from here go into the SAME list as Step 3.

## Step 5 — Report and confirmation

Consolidate everything into a table ordered by severity:

| Severity | Criterion |
|---|---|
| **Visual break** | Horizontal overflow, cut-off text, distorted image, layout broken at a width, invisible focus, contrast below AA |
| **Inconsistency** | Divergence from spec/PACK.md, spacing off the scale, grid misalignment, wrong landmark/heading |
| **Polish** | Orphans, micro-adjustments of hierarchy, state refinement |

Each row: **page + width + problem (violated criterion) + proposed fix (file/selector when known)**.

End by asking: "Apply the fixes? (all / visual breaks only / pick items / no)". Do NOT fix anything before the answer.

## Step 6 — Fix and re-verify (max 3 iterations)

If approved:

1. Apply the agreed fixes.
2. **RE-screenshot only the changed pages**, at the 3 widths, and re-evaluate against the same criteria — a fix without a re-screenshot does not count as fixed.
3. Problem persisted or a fix created a new problem → new iteration (fix → re-screenshot).
4. After **3 iterations**, stop and report what remains open, with your hypothesis of why — do not enter an infinite adjustment loop.

At the end, close the browser (`browser_close`) and report whether any dev server you started in the background is still running.

## Anti-patterns — never do

- Approve a page without having looked at its screenshot (all 3 widths, not just desktop).
- Fix a local, single-page problem with global CSS (reset, `!important`, touching a token) — the scope of the fix = the scope of the problem.
- Iterate a fix without a re-screenshot: "it should be solved now" does not exist in this loop.
- Invent a spec: with no `docs/design/` and no PACK.md, critique using the Step 3 criteria and say there was no spec — do not presume design intentions.
- Screenshot via `file://` or at a width outside the 3 defined ones (unless the user explicitly asks for an extra width).
