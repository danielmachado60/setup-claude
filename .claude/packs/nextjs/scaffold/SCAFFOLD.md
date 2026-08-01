# Next.js scaffold

How to create a Next.js project from scratch with the agency's conventions. Commands confirmed for **Next 16.2.12 (July 2026)** — always `@latest`, never a pinned version. Complements the `PACK.md` (read it before writing code).

## 1. Create the project

The only open decision: **Tailwind**. Decide with the project owner BEFORE running — the CLI will ask exactly that (all other options are already fixed by flags):

```bash
npx create-next-app@latest PROJECT_NAME --ts --eslint --app --src-dir --import-alias "@/*" --no-react-compiler --agents-md --turbopack
```

- The CLI only asks about what didn't come as a flag; here only "Would you like to use Tailwind CSS?" should appear.
- If an unexpected prompt shows up or `--no-react-compiler` is not accepted, use the 100% non-interactive variant, swapping in the decided answer (`--tailwind` or `--no-tailwind`):

```bash
npx create-next-app@latest PROJECT_NAME --ts --eslint --app --src-dir --import-alias "@/*" --tailwind --no-react-compiler --agents-md --turbopack
```

Next 16 changes that catch people coming from 14/15:

- TypeScript and Tailwind are now the CLI **default**.
- `next lint` was **removed** — lint runs directly through the ESLint CLI (`npx eslint .`); the `eslint` option in `next.config` no longer exists either.
- `--agents-md` generates `AGENTS.md` + `CLAUDE.md` inside the new project. In the agency's flow these two generated files are disposable: the project context lives in the `ABOUT.md` at the root (line 2: `Active pack: nextjs`), and the template's CLAUDE.md is static — it is never edited per project.
- With `--src-dir`, the alias becomes `"@/*": ["./src/*"]` in the tsconfig (automatic, don't touch it).

## 2. Copy from this scaffold over the generated project

Copy to the root of the new project:

| Scaffold file                                      | Destination       | Purpose                                                                                                                           |
| -------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `.prettierrc`                                      | root              | The agency's minimal Prettier config                                                                                              |
| `.prettierignore`                                  | root              | Ignores generated files and lockfiles                                                                                             |
| `.editorconfig`                                    | root              | Consistency across editors                                                                                                        |
| `src/components/` and `src/lib/` (with `.gitkeep`) | `src/`            | Skeleton of the PACK.md structure — subfolders (`ui/`, `<domain>/`, `actions/`, `validations/`) created on demand, not in advance |
| `src/components/example-button.tsx`                | `src/components/` | Code style reference (typing, states, accessibility). **Deletable** — remove it when the first real component lands               |

Do not copy this `SCAFFOLD.md` into the project.

## 3. Install lint/format devDeps

`eslint` and `eslint-config-next` already come from create-next-app. Still missing:

```bash
npm i -D prettier eslint-config-prettier
```

If the project uses Tailwind, also add the class-sorting plugin:

```bash
npm i -D prettier-plugin-tailwindcss
```

and replace the `.prettierrc` with:

```json
{
  "singleQuote": true,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

## 4. Replace `eslint.config.mjs`

Flat config is the only format supported in ESLint 10 / Next 16. Replace the generated one with this (it is the same + Prettier last):

```js
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier, // always last — turns off conflicting formatting rules
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
```

Anti-pattern: installing `eslint-plugin-react`/`react-hooks` separately — `eslint-config-next` already includes both plus `@next/eslint-plugin-next`.

## 5. Harden the `tsconfig.json` (diff over the generated one)

The generated one already comes with `"strict": true` — that's not enough. Apply this diff in `compilerOptions` (the rest stays as generated):

```diff
 {
   "compilerOptions": {
-    "target": "ES2017",
+    "target": "ES2022",
     "lib": ["dom", "dom.iterable", "esnext"],
     ...
     "strict": true,
+    "noUncheckedIndexedAccess": true,
+    "noImplicitOverride": true,
+    "noFallthroughCasesInSwitch": true,
```

- `noUncheckedIndexedAccess` is hardening measure #1: `arr[i]` becomes `T | undefined` and forces a check. It demands discipline with `?.` — don't work around it with `!`.
- `target ES2022` is safe for the browsers/Node supported by Next 16; the template's `ES2017` is inherited conservatism.
- `noUnusedLocals`/`noUnusedParameters` stay in ESLint, **not** in the compiler — breaking the build during WIP hurts more than it helps.
- Do NOT enable by default: `exactOptionalPropertyTypes` (frequently breaks libs) and `verbatimModuleSyntax` (only if the team already has the `import type` habit).

## 6. Scripts in `package.json`

Add/ensure in `"scripts"`:

```json
{
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write .",
  "format:check": "prettier --check .",
  "typecheck": "tsc --noEmit"
}
```

Then record the commands the team uses day to day (`npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`) in the `## Project commands` section of `ABOUT.md` — that is where the template's commands and hooks discover how to run the project.

## 7. Post-scaffold checklist

- [ ] `npm run dev` — home page opens with no errors in the terminal or the browser console
- [ ] `npm run format` (once, to normalize the generated code) and then `npm run format:check` clean
- [ ] `npm run lint` — zero errors
- [ ] `npm run typecheck` — zero errors (confirms the tsconfig hardening broke nothing)
- [ ] `npm run build` — clean build, no type warnings
- [ ] `ABOUT.md` with `Active pack: nextjs` on line 2 and the commands recorded under `## Project commands`
- [ ] `src/components/example-button.tsx` deleted as soon as the first real component exists
