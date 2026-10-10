# Nasaq UI — Premium React component playground

Nasaq UI is a polished component studio for designing, theming, and exporting
production-ready React interfaces. Configure a component in a live preview,
refine its tokens, and copy matching JSX + CSS — or a self-contained Tailwind v4
build — without design-tool round-trips or stylesheet drift.

<img src="./src/assets/cover.png" alt="Nasaq UI" />

Three components are ready today: an accessible **Accordion**, **Button**, and
keyboard-friendly **Tabs**. More share the same token set, inspector and
generators.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Vitest in watch mode |
| `npm run coverage` | Vitest with V8 coverage |
| `npm run lint` | ESLint over the whole project |

## Routes

| Path | Page |
| --- | --- |
| `/` | Marketing home — what the studio is and what is in the kit |
| `/components` | Library index, grouped by category |
| `/components/:componentId` | Docs: live preview, props, notes, usage |
| `/playground` → `/playground/accordion` | Redirect into the studio |
| `/playground/:componentId` | Full-screen studio for one component |
| `/theme` | Theme editor with a live response across every component |
| `*` | Not found |

The playground is a full-screen route of its own (no marketing header).

## How it works

Every page is driven by the **component registry**
(`src/registry/componentRegistry.js`). Each entry carries:

- `defaultConfig` — the single source of truth for one component,
- `sections` / `sectionById` — the inspector schema,
- `presets` + `applyPreset` — appearance swaps that never touch written content,
- `validate` — a defensive repairer for stored/edited config,
- `generators.css` / `generators.tailwind` — the two output layers, and
- `Preview` — the exact component rendered in the live preview.

Because the preview and the copied code read the same generator, they cannot
drift apart. The JSX carries only **content and behaviour**; every appearance
value lives in the generated stylesheet.

### Styling modes

A global selector picks the export format; the live preview always renders the
semantic-CSS component:

- **CSS** — semantic class names (`.acc`, `.btn`) plus a generated
  `Accordion.css` / `Button.css`. Inherited colours are emitted as
  `var(--color-token, fallback)` so a file also works standalone.
- **Tailwind v4** — a self-contained JSX component using static utility classes
  and arbitrary values, plus an `@theme` CSS block that maps the tokens. No
  runtime class-name interpolation.

The chosen mode is persisted at `cp.styling.v1`.

### Live preview isolation

The preview renders inside a **Shadow DOM** (`src/components/ui/LivePreview.jsx`).
The generated CSS targets semantic classes, so injecting it into the document
would leak into the studio chrome; scoping it to a shadow root keeps the preview
byte-for-byte the exported stylesheet while theme custom properties (`--color-*`)
still inherit across the boundary.

### Persistence

Component configuration, active preset, theme and styling mode are saved to
`localStorage` (`cp.<componentId>.config.v2`, `cp.<componentId>.preset.v2`,
`cp.theme.v1`, `cp.styling.v1`). Malformed or outdated values are validated and
repaired on load — the app never crashes on bad storage.

## Using a generated component

Open a component in the playground and copy from the code panel.

**CSS mode** — two files:

```jsx
// FaqAccordion.jsx  (generated usage example)
import Accordion from './Accordion';
import './Accordion.css';

const faqItems = [
  { id: 'shipping', question: 'When will my order ship?', answer: 'Within two days.' },
];

export default function FaqAccordion() {
  return <Accordion items={faqItems} title="Shipping" icon="chevron" />;
}
```

**Tailwind mode** — one self-contained file plus the theme block:

```jsx
import FaqAccordion from './FaqAccordion';
// and paste the generated @theme block into your global stylesheet
```

Both modes expose the same component API, so switching the export format never
changes how you use it.

## Project structure

```
src/
  app/                 App shell, site header, routing
  components/ui/       Library components + LivePreview (Shadow DOM) + ComponentPreview
  config/              config models, inspector schemas, presets, icon geometry
  generators/          css/ and tailwind/ layers over shared/ helpers
  hooks/               clipboard, media query, per-component config
  pages/               Home, Components, Docs, Theme, Playground, NotFound
  playground/          studio: sidebar, preview, code panel, inspector, theme editor
  providers/           ThemeProvider, StylingModeProvider
  registry/            component catalogue (drives every page)
  styles/              design tokens + global reset
  theme/               theme tokens, light/dark defaults, resolveTheme
  utils/               validation + sanitisation, ids, clipboard
  tests/               Vitest suites
```

### Design tokens

Two token families live in `src/styles/designTokens.css`:

- `--ui-*` — the studio chrome (a letterpress "proof room": ink, paper, press
  blue, registration vermilion).
- `--color-*` — the library theme consumed by previews and generated code, with
  coordinated light and dark palettes.

Type: **Fraunces** for the wordmark, **Archivo** for UI, **IBM Plex Mono** for
code only.

## Adding another component

1. Create `src/components/ui/<Name>/<Name>.jsx` (plain class names) plus a
   `Preview` that maps a config to its props.
2. Add its config model, schema, presets and validators under `src/config/`.
3. Add a `css` and a `tailwind` generator under `src/generators/`.
4. Register it in `src/registry/componentRegistry.js` — the sidebar, docs, theme
   page and code panel light up from the same primitives.

## Tech

Vite 8 · React 19 · React Router 7 · plain JavaScript · Vitest + Testing Library.
No UI framework and no CSS-in-JS: styling is generated CSS, kept intentionally
portable.
