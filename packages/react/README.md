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

<Button variant="primary" size="lg" onClick={handleSubmit}>
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

The stylesheet declares every token as a `--color-*` custom property on `:root`, with coordinated dark-mode values under `[data-theme-mode='dark']`. It also exposes non-color design tokens on `:root`:

```css
:root {
  --color-primary: #1e3ae0;
  --color-surface: #ffffff;
  --color-text: #14161a;
  /* … */
  --nq-radius: 10px;
  --nq-font-sans: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  --nq-shadow-md: 0 2px 6px rgba(20, 22, 26, 0.1), 0 12px 24px -12px rgba(20, 22, 26, 0.25);
  --nq-duration: 160ms;
  --nq-easing: ease;
  --nq-space-2: 8px;
}
```

Override any token on `:root` to re-theme the whole kit — no provider needed:

```css
:root {
  --color-primary: #0ea5e9;
  --color-text: #0f172a;
  --nq-radius: 12px;
  --nq-font-sans: Inter, system-ui, sans-serif;
}
```

The theme model is exported as an API if you want to manage the palette in code:

```js
import { themeDefaults, resolveTheme, THEME_TOKENS } from 'nasaq';

const palette = resolveTheme({ mode: 'dark', overrides: { primary: '#7dd3fc' } });
```

## Component variables

Every component reads its appearance from namespaced custom properties. The
Playground writes the same variables, so exported CSS is a short override block
on top of `nasaq/styles.css`.

### Button

| Control | Variable | Default |
| --- | --- | --- |
| Radius | `--nq-btn-radius` | `var(--nq-radius, 10px)` |
| Icon gap | `--nq-btn-gap` | `var(--nq-space-2, 8px)` |
| Font family | `--nq-btn-font-family` | `var(--nq-font-sans, system-ui, sans-serif)` |
| Font weight | `--nq-btn-font-weight` | `600` |
| Letter spacing | `--nq-btn-letter-spacing` | `0em` |
| Icon size | `--nq-btn-icon-size` | `18px` |
| Border width | `--nq-btn-border-width` | `1px` |
| Border style | `--nq-btn-border-style` | `solid` |
| Shadow | `--nq-btn-shadow` | `none` |
| Duration | `--nq-btn-duration` | `var(--nq-duration, 160ms)` |
| Easing | `--nq-btn-easing` | `var(--nq-easing, ease)` |
| Size (block padding) | `--nq-btn-padding-y` | `10px` |
| Size (inline padding) | `--nq-btn-padding-x` | `18px` |
| Size (font size) | `--nq-btn-font-size` | `15px` |
| Size (minimum height) | `--nq-btn-min-height` | `40px` |
| Background | `--nq-btn-bg` | per variant |
| Text | `--nq-btn-fg` | per variant |
| Border colour | `--nq-btn-border-color` | per variant |
| Hover background | `--nq-btn-bg-hover` | per variant |

The size selector writes the four size variables together so the default type
rhythm stays exact; every other option maps to one variable.

### Accordion

| Control | Variable | Default |
| --- | --- | --- |
| Width | `--nq-acc-width` | `100%` |
| Maximum width | `--nq-acc-max-width` | `640px` |
| Alignment | `--nq-acc-margin-inline` | `auto` |
| Text alignment | `--nq-acc-text-align` | `left` |
| Font family | `--nq-acc-font-family` | `var(--nq-font-sans, system-ui, sans-serif)` |
| Radius | `--nq-acc-radius` | `6px` |
| Item radius | `--nq-acc-item-radius` | `6px` |
| Question radius | `--nq-acc-question-radius` | `6px` |
| Border width / style | `--nq-acc-border-width`, `--nq-acc-border-style` | `1px`, `solid` |
| Container / item shadow | `--nq-acc-shadow`, `--nq-acc-item-shadow` | `none` |
| Background / border | `--nq-acc-bg`, `--nq-acc-border-color` | `surface`, `border` |
| Duration / easing | `--nq-acc-duration`, `--nq-acc-easing` | `280ms`, `cubic-bezier(.2,0,0,1)` |
| Icon size | `--nq-acc-icon-size` | `18px` |
| Item gap | `--nq-acc-item-gap` | `0px` |
| Dividers | `--nq-acc-divider-width`, `--nq-acc-divider-color` | `1px`, `border` |
| Section gap | `--nq-acc-section-gap` | `24px` |
| Question padding | `--nq-acc-question-padding-y`, `--nq-acc-question-padding-x` | `16px`, `20px` |
| Content gap / answer padding | `--nq-acc-content-gap`, `--nq-acc-answer-padding` | `8px`, `16px` |
| Heading | `--nq-acc-heading-size`, `--nq-acc-heading-weight`, `--nq-acc-heading-fg` | `26px`, `600`, `text` |
| Question | `--nq-acc-question-fg`, `--nq-acc-question-size`, `--nq-acc-question-weight` | `text`, `16px`, `500` |
| Answer | `--nq-acc-answer-fg`, `--nq-acc-answer-size` | `text-muted`, `15px` |
| Line height / letter spacing | `--nq-acc-line-height`, `--nq-acc-letter-spacing` | `1.55`, `0em` |
| Backgrounds | `--nq-acc-question-bg`, `--nq-acc-answer-bg`, `--nq-acc-hover-bg`, `--nq-acc-open-bg` | `surface`, `background`, `hover`, `active` |
| Icon / focus colour | `--nq-acc-icon-color`, `--nq-acc-focus-color` | `primary`, `focus` |
| Answer border | `--nq-acc-answer-border-top-width`, `--nq-acc-answer-border-block-width` | `0px` |

### Tabs

| Control | Variable | Default |
| --- | --- | --- |
| Active colour | `--nq-tabs-active` | `var(--color-primary, #1e3ae0)` |
| Text / muted | `--nq-tabs-text`, `--nq-tabs-muted` | `text`, `text-muted` |
| Border / panel | `--nq-tabs-border`, `--nq-tabs-panel` | `border`, `surface` |
| Panel gap | `--nq-tabs-gap` | `24px` |
| Radius | `--nq-tabs-radius` | `var(--nq-radius, 10px)` |
| Duration / easing | `--nq-tabs-duration`, `--nq-tabs-easing` | `var(--nq-duration, 160ms)`, `ease-out` |
| Tab padding | `--nq-tabs-padding` | `10px 14px` |

The complete machine-readable list ships as `COMPONENT_VARIABLES` from the
package entry point and is rendered on the docs Theming page.

## Accessibility

`on-primary`, `on-secondary` and `on-danger` are contrast-checked solid-fill
text tokens (AA 4.5:1 in both palettes); components never hard-code white text
on a coloured fill. Focus indicators, reduced motion, logical properties and
the `nq-` class prefix are part of the public contract.

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