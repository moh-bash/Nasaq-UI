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

## Layout rules

- Each ready component lives in its own folder under
  `packages/react/src/components/<Component>/` with a `Component.jsx` that has
  **no CSS import** — appearance lives in `packages/react/src/styles/index.css`.
- The token system is the single source of visual truth:
  `packages/react/src/theme/` (tokens, defaults, resolver). The published
  stylesheet and the docs generators both read from it.
- The docs registry (`apps/docs/src/registry/componentRegistry.js`) is the one
  place that wires a component to its inspector schema, presets, validator,
  preview and CSS/Tailwind generators. Add a component by appending an entry.
- Preview components in the playground (`apps/docs/src/playground`) and the
  `ComponentPreview` render the real library components inside a shadow root
  with the generated CSS injected.

## Conventions

- Prefer native semantics (buttons, regions, roving tab index) and WAI-ARIA
  patterns over synthetic widgets.
- Colours come from tokens (`var(--color-*, fallback)`); only hand-pinned
  overrides may use literal hex.
- Exported JSX and the generated stylesheet must always render the same thing
  as the shadow-DOM preview.

## Checks

Run all of these before opening a change:

```bash
npm run lint      # ESLint (docs app)
npm run test      # package + docs suites
npm run check     # package gate: build, tests, npm pack --dry-run
npm run build     # full production build
```

## Releasing `nasaq`

1. Bump `version` in `packages/react/package.json` (keep it in sync with the
   changelog and theme `THEME_VERSION` when the token set changes).
2. Update `CHANGELOG.md` under an `Unreleased` heading.
3. Run `npm run check -w nasaq` and confirm `npm pack --dry-run` contents.
4. Before publishing, ensure the `LICENSE` file exists in
   `packages/react/` (it is required for the MIT `license` field).