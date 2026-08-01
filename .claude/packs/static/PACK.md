# PACK: Static sites (vanilla HTML/CSS/JS)

Agency conventions for sites without a framework: landing pages, institutional sites, hotsites. This file is the pack's source of conventions — universal agents must read it before any task in a project whose ABOUT.md declares `Active pack: static`. The `vanilla-specialist` agent resides in `.claude/agents/` and activates when ABOUT.md points to this pack. Wherever the project's ABOUT.md diverges, ABOUT.md wins.

## Pack philosophy

- **Zero dependencies by default.** No bundler, no CSS framework, no jQuery. Every dependency requires a written justification in the project's ABOUT.md, under `## Constraints and notes` (what it solves, why vanilla is not enough, cost in KB). An `npm install` "to speed things up" is debt, not a shortcut.
- **Progressive enhancement.** The site works without JS: content is readable, links navigate, forms submit (native POST to the endpoint). JS improves the experience, it is never a prerequisite for it.
- **The platform first.** Before writing JS, ask whether HTML/CSS solves it: `<details>` for accordions, `<dialog>` for modals, `:has()`/`:checked` for states, `scroll-behavior: smooth` for anchors, `loading="lazy"` for images.

## File structure

```
/
  index.html  about.html  contact.html   # one page = one file, clean URLs via the server
  404.html
  css/main.css                           # one file; @layer to organize (reset, base, components, utilities)
  js/main.js                             # ESM: <script type="module" src="/js/main.js">
  img/                                   # optimized BEFORE entering the repo
  favicon.svg  favicon.ico  apple-touch-icon.png
  robots.txt  sitemap.xml
```

## HTML — semantics are mandatory

- Landmarks on every page: `<header>`, `<nav>`, `<main>` (only one), `<footer>`; `<section>` with its own heading; `<article>` for self-contained content. `<div>` only when no semantic element fits.
- Strict heading hierarchy: **one** `<h1>` per page; no skipped levels (h2 → h3, never h2 → h4). Headings are structure, not font size — size is handled in CSS.
- `<html lang="...">` set to the project language (line 4 of ABOUT.md — e.g. `en`, `pt-BR`). `<meta charset="utf-8">` and viewport on every page.
- Forms: every input with a `<label for>` (a placeholder is not a label); correct `type` (`email`, `tel`); `autocomplete` filled in (`name`, `email`, `tel` — form conversion matters); native validation (`required`, `pattern`) before any JS; error messages associated via `aria-describedby`.
- Links: descriptive text ("View portfolio", never "click here"); external with `rel="noopener"`; a button that navigates is an `<a>`, an on-page action is a `<button>` — never a `<div onclick>`.
- Minimum accessibility for delivery: AA contrast (4.5:1 normal text), visible focus (never `outline: none` without a replacement), full keyboard navigation, `alt` on every image (empty `alt=""` if decorative).

## CSS — modern, no preprocessor

- No Sass/Less/PostCSS: custom properties, native nesting and `@layer` cover what preprocessors used to do. If the project needs a CSS build, the stack is wrong for this pack.
- Design tokens in `:root`: colors, spacing (scale: `--space-1` to `--space-8`), typography. A hardcoded color outside the tokens is a review error.
- Layout with grid and flexbox: grid for the macro (page, cards), flex for the micro (aligning items of a component). Floats/tables for layout: never.
- **Container queries for components** (`container-type: inline-size` + `@container`): a component responds to its own space, not to the viewport. Media queries only for the page's macro layout.
- Mobile-first responsive: base styles = mobile, `@media (min-width)` for larger screens. Prefer intrinsic design (`clamp()` for fluid type, `minmax()`/`auto-fit` in grid) over multiplying breakpoints.
- Units: `rem` for font/spacing, `px` only for borders/details; respect `prefers-reduced-motion` in every animation; animate only `transform` and `opacity`.
- Organization via `@layer reset, base, components, utilities;` — specificity controlled without `!important` (forbidden except in a documented utility).

## JavaScript — progressive vanilla

- ESM always (`type="module"` is already deferred, no redundant `defer`). No bundler by default; 2–4 small modules imported by `main.js` are fine over HTTP/2.
- Initialization pattern: each behavior is a function `initX(el)`; `main.js` does `document.querySelectorAll('[data-menu]').forEach(initMenu)`. A component finds its elements via `data-*`, never via a styling class (CSS and JS stay decoupled).
- Event delegation on lists: one listener on the container, `event.target.closest('[data-action]')` — never one listener per item.
- `IntersectionObserver` for lazy/reveal/scroll analytics — never a `scroll` listener computing positions. Debounce on `resize`/`input`.
- `fetch` with `AbortController` and explicit error handling; no floating promises. `async` in `forEach` is a bug (it does not await) — `for...of` with `await`, or `map` + `Promise.all`.
- Cleanup: every module that adds a listener/observer/interval exposes a way to remove it (or uses `{ once: true }`); observers disconnected after single use.
- **`innerHTML` with any external data is forbidden** (user input, API response, querystring) — use `textContent` or build nodes. XSS on an institutional site is unacceptable.
- Typing via JSDoc + `// @ts-check` at the top of modules; public APIs with full JSDoc.

## Images and assets

- Format: AVIF with WebP fallback via `<picture>`; JPEG only as a last fallback if the audience requires it. SVG for logos/icons (inline if it needs CSS styling).
- `srcset` + `sizes` on every content image; generate 2–3 widths (e.g. 480/960/1440). Hero at higher quality, the rest compressed aggressively (quality 70–80 is enough).
- `width` and `height` (or `aspect-ratio` in CSS) on EVERY image — zero CLS is an acceptance criterion. `loading="lazy"` on everything below the fold; the hero image with `fetchpriority="high"`, never lazy.
- Fonts: self-hosted WOFF2 (never the Google Fonts CDN — privacy regulations and performance), `font-display: swap`, `preload` for the main heading's font, at most 2 families / 4 files.
- Page budget: HTML+CSS+JS < 100 KB compressed; full page with images < 1 MB on first visit. Over budget → cut, don't justify.

## Anti-patterns (reject in code review)

| Anti-pattern | Fix |
|---|---|
| `<div class="button" onclick=...>` | `<button>` / `<a>` |
| Placeholder as a field's label | Visible `<label for>` |
| jQuery/CSS framework "just for this one component" | The platform solves it; justify in ABOUT.md or remove |
| `innerHTML` with external data | `textContent` / `createElement` |
| `scroll` listener to reveal elements | `IntersectionObserver` |
| Image without dimensions (CLS) | `width`/`height` or `aspect-ratio` |
| Google Fonts via CDN | Self-hosted WOFF2 |
| `outline: none` without a focus replacement | Styled `:focus-visible` |
| One listener per list item | Event delegation on the container |
| Heading chosen by visual size | Level by structure; size in CSS |
| Modal/accordion in pure JS | `<dialog>` / `<details>` as the base |

## Delivery checklist

- [ ] HTML of every page validated (validator.w3.org / `html-validate`) with no errors
- [ ] All internal and external links verified (no 404s; external with `rel="noopener"`)
- [ ] Heading hierarchy checked page by page (one h1, no skips)
- [ ] Complete favicon set: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png` (180x180)
- [ ] Meta tags per page: unique `title`, `description`, canonical, OG (`og:title`, `og:description`, `og:image` 1200x630) — test the share preview on the messaging/social apps the client's audience uses (market specifics live in the locale file)
- [ ] Custom `404.html` configured on the host (Netlify/Vercel/Cloudflare Pages or the client's server)
- [ ] `sitemap.xml` and `robots.txt` present and consistent with the final URLs
- [ ] Forms tested end to end in the final environment (real submission reaches its destination; validation error shows; works without JS)
- [ ] Site navigable by keyboard from start to finish; visible focus everywhere
- [ ] Lighthouse mobile: Performance ≥ 95, Accessibility ≥ 95, SEO = 100 (a static site has no excuse)
- [ ] Real test on a small screen (~360px) and 200% text zoom without breakage
- [ ] Orphan pages, `console.log` and dead CSS/JS removed before deploy
