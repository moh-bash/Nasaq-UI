# Nasaq UI

A React component system: accessible building blocks, a theme-first token set,
and a live playground that exports matching JSX, semantic CSS and Tailwind —
without stylesheet drift.

| Package | Description |
| --- | --- |
| [`packages/react`](packages/react) | **`nasaq`** — the published component library (Button, Accordion, Tabs + theme) |
| [`apps/docs`](apps/docs) | **`@nasaq-ui/docs`** — the documentation site and playground (private) |

This repository is an [npm workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
monorepo.

## Install the library

```bash
npm install nasaq
```

Requires **React 18 or 19**. Import the stylesheet once, then the components:

```jsx
import 'nasaq/styles.css';
import { Button } from 'nasaq';

export default function App() {
  return <Button>Save changes</Button>;
}
```

## Developing this repo

```bash
npm install      # hoists all workspaces
npm run dev      # the docs site + playground at http://localhost:5173
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the docs dev server |
| `npm run build` | Build `nasaq`, then the docs site |
| `npm run build:lib` | Build only `packages/react` into `dist/` |
| `npm run build:docs` | Build only the docs app |
| `npm test` | Run the package and docs test suites |
| `npm run lint` | ESLint over the docs app |
| `npm run check` | Package gate: build + tests + `npm pack --dry-run` |
| `npm run coverage` | Docs tests with V8 coverage |

See [CONTRIBUTING.md](CONTRIBUTING.md) for structure and conventions, and
[CHANGELOG.md](CHANGELOG.md) for releases.

## Structure

```
.
├── packages/react        # nasaq library
│   ├── src/index.js      # public entry
│   ├── src/styles        # published stylesheet (tokens + component styles)
│   ├── src/components    # Accordion, Button, Tabs
│   ├── src/theme         # THEME_TOKENS, themeDefaults, resolveTheme
│   ├── types/index.d.ts  # hand-written declarations
│   └── tests
└── apps/docs             # documentation + playground (private)
    └── src
        ├── app           # routes, shell, header
        ├── layouts       # docs shell (header + sidebar)
        ├── pages         # landing, docs, component docs, theming
        ├── playground    # live component studio
        ├── registry      # single index of components + generators
        ├── generators    # CSS / Tailwind exporters
        └── tests
```

## License

MIT