/*
  Nasaq UI — public entry point.

  Components render unstyled until you import the stylesheet once:

    import 'nasaq/styles.css';

  The theme module exports the token metadata and the light/dark default
  palettes so apps can generate their own --color-* token blocks.
*/

export { default as Button } from './components/Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize, ButtonAlign } from './components/Button/Button';
export { default as Accordion } from './components/Accordion/Accordion';
export type { AccordionProps, AccordionItem, AccordionIcon } from './components/Accordion/Accordion';
export { default as Tabs } from './components/Tabs/Tabs';
export type { TabsProps, TabItem, TabsVariant, TabsAlign } from './components/Tabs/Tabs';

export {
  THEME_TOKENS,
  TOKEN_KEYS,
  DESIGN_TOKENS,
  COMPONENT_VARIABLES,
  COMPONENT_PROPS,
  tokenVar,
  designTokenVar,
} from './theme/tokens';
export type { ThemeToken, ComponentVariable, ComponentProp, DesignToken } from './theme/tokens';
export {
  THEME_VERSION,
  themeDefaults,
  defaultTheme,
  resolveTheme,
} from './theme/themeDefaults';
export type { ThemeMode, ThemeState, ThemePalette } from './theme/themeDefaults';

import './styles/index.css';
