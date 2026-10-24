# Contributing to Nasaq UI

Thanks for contributing! This repo is an npm-workspaces monorepo with two
packages:

- `packages/react` — the `nasaq` library that ships to npm.
- `apps/docs` — the private documentation site and playground.

## Setup

```bash
npm install
npm run dev
```

Node 22 or newer is required at the repo root (Vite 8 / Vitest 5). The
published package keeps a permissive `>=18` engine range.

## Layout rules

- Each ready component lives in its own folder under
  `packages/react/src/components/<Component>/` with a TypeScript
  `Component.tsx` that has **no CSS import** — appearance lives in
  `packages/react/src/styles/index.css`.
- The token system is the single source of visual truth:
  `packages/react/src/theme/` (tokens, defaults, resolver, component-variable
  and prop metadata). The published stylesheet and the docs generators both
  read from it.
- The docs registry (`apps/docs/src/registry/componentRegistry.js`) is the one
  place that wires a component to its inspector schema, presets, validator,
  preview and CSS/Tailwind generators. Add a component by appending an entry.
- Preview components in the playground (`apps/docs/src/playground`) and the
  `ComponentPreview` render the real library components inside a shadow root
  with the library stylesheet injected.

## Architecture rules

### `nq-` class prefix

Every class the library renders starts with `nq-`. The shared class map in
`apps/docs/src/generators/shared/classNames.js` is the only place generator
code may build a selector or class name. Do not type `.btn`, `.acc`, `.tabs`
or string-concatenate a new prefix in a generator. The class-coverage test
renders each component and fails when a rendered class has no rule in the
library stylesheet.

### One variable per control

Every Playground control maps to exactly one documented `--nq-*` custom
property (size controls are the deliberate exception: they write the four
size variables listed together in the table). Component CSS reads these
variables with token fallbacks:

```css
.nq-btn {
  --nq-btn-radius: var(--nq-radius, 10px);
  border-radius: var(--nq-btn-radius);
}
```

The config → variable mapping lives in
`apps/docs/src/generators/shared/variables.js`. Both the semantic CSS
generator and the Tailwind generator import that map, so they cannot drift.
When you add a variable:

1. Add it to the library rule and to `COMPONENT_VARIABLES` in
   `packages/react/src/theme/tokens.ts`.
2. Add it to the mapping module and the inspector schema.
3. Update the README and Theming page tables (the Theming page renders the
   metadata, but the README table is checked by review).
4. Run the equivalence test; default output must resolve to the same values as
   the library stylesheet.

### Generated output

Generated CSS starts with `@import 'nasaq/styles.css';` and then one
`@layer nasaq` block containing only variable overrides and conditional
structural rules. Do not re-type the library structure with string pushes.
Tailwind output uses the same variable map in an inline root `style` object and
static variable-reading utilities.

### Adding a component

1. Create `packages/react/src/components/<Name>/<Name>.tsx` with exported prop
   and data interfaces.
2. Export the component and types from `packages/react/src/index.ts`.
3. Add structural rules to `packages/react/src/styles/index.css` under
   `@layer nasaq`, using `nq-` classes and per-component variables.
4. Add `COMPONENT_VARIABLES` and `COMPONENT_PROPS` metadata.
5. Add defaults, schema, presets and the registry entry in `apps/docs`; add a
   preview and both generators.
6. Add unit, coverage, equivalence and Playwright coverage as needed.

## Conventions

- Prefer native semantics (buttons, regions, roving tab index) and WAI-ARIA
  patterns over synthetic widgets.
- Colours come from tokens (`var(--color-*, fallback)`); only hand-pinned
  overrides may use literal hex.
- Exported JSX and the generated stylesheet must always render the same thing
  as the shadow-DOM preview.
- Respect `prefers-reduced-motion` and use logical properties for RTL.

## Checks

Run all of these before opening a change:

```bash
npm run lint      # ESLint (docs app + library)
npm run test      # package + docs suites (includes contrast + equivalence)
npm run check     # package gate: build, tests, npm pack --dry-run, attw
npm run build     # full production build
npm run e2e       # build + Playwright smoke, a11y and visual specs
```

Visual tests use Playwright's screenshot baselines under
`e2e/**-snapshots/`. Baselines are committed without a platform suffix so Linux
CI can reuse them. If a change intentionally alters visuals, run
`npm run e2e:update`, inspect every changed image, and commit the baselines with
the code. Do not update baselines to hide an unintended regression.

## Releasing `nasaq`

Releases are driven by [Changesets](https://github.com/changesets/changesets).

1. Add a changeset with `npm run changeset`. Describe the user-visible change
   and choose the semver bump.
2. Open a pull request. CI runs lint, build, tests, the package check and
   Playwright.
3. Merge to `main`. The release workflow opens a “version packages” pull
   request.
4. Merge that pull request. The workflow publishes `nasaq` to npm with
   provenance using `NPM_CONFIG_PROVENANCE`.
5. When the token set changes, bump `THEME_VERSION` and include migration notes
   in the changeset. Theme state is persisted, so a version bump must be paired
   with a store migration.

Never publish from a local machine and never force-push `main`.
