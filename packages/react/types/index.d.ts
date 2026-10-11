import type {
  ButtonHTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';

/**
 * Design-token metadata: every `--color-*` custom property the stylesheet
 * defines, its human label, and what it is used for.
 */
export interface ThemeToken {
  key: string;
  label: string;
  role: string;
}

export const THEME_TOKENS: ThemeToken[];
export const TOKEN_KEYS: string[];

/** The CSS custom property a token key resolves to (e.g. `--color-primary`). */
export function tokenVar(key: string): string;

export interface ThemeState {
  version: number;
  mode: 'light' | 'dark';
  overrides: Record<string, string | null>;
}

export const THEME_VERSION: number;

/** Coordinated default palettes for light and dark mode. */
export const themeDefaults: {
  light: Record<string, string>;
  dark: Record<string, string>;
};

export function defaultTheme(): ThemeState;

/**
 * Effective value of every token for the given theme state — the mode palette
 * with string overrides applied on top.
 */
export function resolveTheme(theme?: Partial<ThemeState>): Record<string, string>;

/* ------------------------------------------------------------------ */
/* Button                                                             */
/* ------------------------------------------------------------------ */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonAlign = 'start' | 'center' | 'end';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'type' | 'disabled' | 'children'> {
  /** Colour role. Default `primary`. */
  variant?: ButtonVariant;
  /** Padding, text and height bundle. Default `md`. */
  size?: ButtonSize;
  /** Stretch to the container width. */
  fullWidth?: boolean;
  /** Horizontal placement when not full width. Default `start`. */
  align?: ButtonAlign;
  /** Disable interaction. */
  disabled?: boolean;
  /** Show a spinner and disable the button. */
  loading?: boolean;
  /** Icon rendered before the label. */
  leadingIcon?: ReactNode;
  /** Icon rendered after the label. */
  trailingIcon?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  children?: ReactNode;
}

export declare function Button(props: ButtonProps): ReactElement;

/* ------------------------------------------------------------------ */
/* Accordion                                                          */
/* ------------------------------------------------------------------ */

export interface AccordionItem {
  id: string;
  question: string;
  answer: string;
  disabled?: boolean;
}

export type AccordionIcon = 'chevron' | 'plus' | 'arrow' | 'number' | 'none';
export type AccordionIconPosition = 'start' | 'end';

export interface AccordionProps {
  /** Each row is { id, question, answer, disabled }. */
  items: AccordionItem[];
  /** Optional heading above the list. */
  title?: string;
  /** Optional line under the title. */
  description?: string;
  /** Prefix each question with a two-digit index. Default `false`. */
  numbered?: boolean;
  /** Row indicator. Default `chevron`. */
  icon?: AccordionIcon;
  /** Indicator side. Default `end`. */
  iconPosition?: AccordionIconPosition;
  /** Keep several answers open. Default `false`. */
  allowMultiple?: boolean;
  /** Allow closing the last open answer. Default `true`. */
  allowCollapse?: boolean;
  /** Item id to open on mount. */
  defaultOpenId?: string;
  className?: string;
}

export declare function Accordion(props: AccordionProps): ReactElement;

/* ------------------------------------------------------------------ */
/* Tabs                                                               */
/* ------------------------------------------------------------------ */

export interface TabsItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export type TabsVariant = 'underline' | 'pill' | 'boxed';
export type TabsAlign = 'start' | 'center' | 'end' | 'stretch';

export interface TabsProps {
  /** Each tab is { id, label, content, disabled }. */
  items: TabsItem[];
  /** Tab selected on first render. */
  defaultActiveId?: string;
  /** Visual treatment. Default `underline`. */
  variant?: TabsVariant;
  /** Tab row alignment. Default `start`. */
  align?: TabsAlign;
  className?: string;
}

export declare function Tabs(props: TabsProps): ReactElement;