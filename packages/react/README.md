# nasaq

A tightened React component kit: accessible **Accordion**, **Button** and **Tabs** with a theme-first `--color-*` token system.

```
npm install nasaq react
```

## Usage

Import the components you need and the stylesheet **once**:

```jsx
import { Button, Accordion, Tabs } from 'nasaq';
import 'nasaq/styles.css';

<Button variant="primary" size="lg" onSubmit={handleSubmit}>
  Create project
</Button>

<Accordion
  items={[{ id: 'a', question: 'What is Nasaq?', answer: 'A small, theme-first React kit.' }]}
  allowMultiple
/>

<Tabs
  items={[{ id: 'overview', label: 'Overview', content: 'Overview content' }]}
/>
```

Components render unstyled until `nasaq/styles.css` is imported. All three are dependency-free and follow the WAI-ARIA authoring patterns.

## Theming

The stylesheet declares every token as a `--color-*` custom property on `:root`, with coordinated dark-mode values under `[data-theme-mode='dark']`:

```css
:root {
  --color-primary: #1e3ae0;
  --color-surface: #ffffff;
  --color-text: #14161a;
  /* … */
}
```

Override any token on `:root` to re-theme the whole kit — no provider needed:

```css
:root {
  --color-primary: #0ea5e9;
  --color-text: #0f172a;
}
```

The theme model is exported as an API if you want to manage the palette in code:

```js
import { themeDefaults, resolveTheme, THEME_TOKENS } from 'nasaq';

const palette = resolveTheme({ mode: 'dark', overrides: { primary: '#7dd3fc' } });
```

## Components

| Component | Props | Notes |
| --- | --- | --- |
| `Button` | `variant`, `size`, `fullWidth`, `align`, `loading`, `disabled`, `leadingIcon`, `trailingIcon` | Five variants, three sizes, busy state |
| `Accordion` | `items`, `title`, `description`, `numbered`, `icon`, `iconPosition`, `allowMultiple`, `allowCollapse`, `defaultOpenId` | Disclosure list with `grid-rows` animation |
| `Tabs` | `items`, `defaultActiveId`, `variant`, `align` | Roving tabindex, arrow/Home/End keyboard support |

## Development

```
npm install
npm run build   # vite library build → dist/{nasaq.js,nasaq.cjs,styles.css}
npm test
npm run check   # build + test + npm pack --dry-run
```