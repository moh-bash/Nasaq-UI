/*
  Nasaq UI — public entry point.

  Components render unstyled until you import the stylesheet once:

    import 'nasaq/styles.css';

  The theme module exports the token metadata and the light/dark default
  palettes so apps can generate their own --color-* token blocks.
*/

export { default as Button } from './components/Button/Button.jsx';
export { default as Accordion } from './components/Accordion/Accordion.jsx';
export { default as Tabs } from './components/Tabs/Tabs.jsx';

export { THEME_TOKENS, TOKEN_KEYS, tokenVar } from './theme/tokens.js';
export {
  THEME_VERSION,
  themeDefaults,
  defaultTheme,
  resolveTheme,
} from './theme/themeDefaults.js';

import './styles/index.css';