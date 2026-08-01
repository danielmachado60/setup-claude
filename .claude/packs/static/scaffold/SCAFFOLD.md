# Static scaffold (vanilla HTML/CSS/JS)

Starting point for a landing page/institutional site without a framework. Complements the static pack's `PACK.md` (read it before writing code). Zero build, zero dependencies: copy, serve and edit.

## 1. Use the scaffold

Copy the **contents** of this folder to the root of the new project — everything except this `SCAFFOLD.md` (it does not go into the project):

| File                            | Purpose                                                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`                    | Home page with skip link, landmarks, OG tags and placeholders named `[LIKE THIS]`/`YOUR_*`                                      |
| `404.html`                      | Error page (must be configured on the host to actually answer the 404s)                                                         |
| `css/main.css`                  | Tokens in `:root` (colors `[REPLACE]`, scale `--space-1..8`, fluid typography), minimal reset, `@layer`, the index's components |
| `js/main.js`                    | Accessible mobile menu (`aria-expanded`) + footer year — **deletable example**, the pack's style reference                      |
| `robots.txt`                    | Allows production and points to the sitemap (domain placeholder)                                                                |
| `.editorconfig` / `.prettierrc` | Formatting consistency across editors                                                                                           |

In the project's `ABOUT.md`, line 2 must read `Active pack: static` — that is what activates this pack's conventions and agent. Also set the `lang` attribute in every `.html` to the project language (line 4 of ABOUT.md — e.g. `pt-BR`).

## 2. Run locally

The absolute paths (`/css/main.css`) and the `<script type="module">` **do not work via `file://`** — always a static server, from the project root:

```bash
npx serve .
# opens at http://localhost:3000
```

Record that command in the `## Project commands` section of `ABOUT.md` — that is where the template's commands (e.g. `/design-review`) discover how to serve the site.

## 3. Customize (suggested order)

1. **Tokens** in `css/main.css` (`:root`): replace all the `[REPLACE]` colors with the brand's and validate AA contrast (4.5:1). Own font: self-hosted WOFF2, never a CDN.
2. **Content** of `index.html`: fill in the `[LIKE THIS]` and `YOUR_*` placeholders. No lorem ipsum — if the final text doesn't exist yet, write the question the client needs to answer.
3. **Menu**: if the project has no mobile menu, delete `initMenu` from `js/main.js`, the `[data-menu-button]` button from the HTML and the corresponding CSS block.
4. **New pages** (`about.html`, `contact.html`...): copy the structure of `index.html` — one `<h1>` per page, landmarks, own `title`/`description`/canonical/OG.

## 4. Delivery checklist

Summary of the essentials — the full, mandatory checklist is the one in `PACK.md`:

- [ ] Placeholders cleared: grep for `YOUR_` and `[` in every `.html` — nothing may remain
- [ ] Real favicons in place (`favicon.svg`, `favicon.ico`, `apple-touch-icon.png` 180x180) and `img/og.png` 1200x630 (test the share preview on the apps the client's audience uses)
- [ ] Form `action` pointing to the real endpoint; submission tested end to end **without JS**
- [ ] `sitemap.xml` created with the final URLs; `robots.txt` with the real domain (no `YOUR_DOMAIN`)
- [ ] `404.html` configured on the host (Netlify/Vercel/Cloudflare Pages or the client's server)
- [ ] `npx prettier --check .` clean
- [ ] Lighthouse mobile: Performance ≥ 95, Accessibility ≥ 95, SEO = 100 (the PACK.md targets)
- [ ] `ABOUT.md` with `Active pack: static` on line 2 and the serve command recorded under `## Project commands`
