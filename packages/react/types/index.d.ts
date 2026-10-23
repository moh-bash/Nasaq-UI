import type {
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  ElementType,
  ForwardRefExoticComponent,
  ReactElement,
  ReactNode,
  RefAttributes,
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

export interface ButtonBaseProps {
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
  className?: string;
  children?: ReactNode;
  as?: ElementType;
}

export type ButtonProps<T extends ElementType = 'button'> = ButtonBaseProps &
  Omit<
    T extends 'a'
      ? AnchorHTMLAttributes<HTMLAnchorElement>
      : ButtonHTMLAttributes<HTMLButtonElement>,
    keyof ButtonBaseProps | 'disabled'
  > &
  (T extends 'a' ? { as?: 'a' } : { as?: 'button'; type?: 'button' | 'submit' | 'reset' });

export declare const Button: ForwardRefExoticComponent<
  ButtonProps<ElementType> & RefAttributes<HTMLElement>
>;

/* ------------------------------------------------------------------ */
/* Accordion                                                          */
/* ------------------------------------------------------------------ */

export interface AccordionItem {
  id: string;
  question: string;
  answer: ReactNode;
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
  /** Item id to open on mount (uncontrolled). */
  defaultOpenId?: string;
  /** Controlled open item ids. */
  value?: string[];
  /** Called when open item ids change. */
  onValueChange?: (value: string[]) => void;
  /** Optional content shown when `items` is empty. Renders nothing by default. */
  emptyState?: ReactNode;
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
  /** Tab selected on first render (uncontrolled). */
  defaultActiveId?: string;
  /** Controlled active tab id. */
  value?: string;
  /** Called when the active tab changes. */
  onValueChange?: (id: string) => void;
  /** Visual treatment. Default `underline`. */
  variant?: TabsVariant;
  /** Tab row alignment. Default `start`. */
  align?: TabsAlign;
  /** Accessible label for the tablist. */
  label?: string;
  /** Orientation. Default `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** Optional content shown when `items` is empty. Renders nothing by default. */
  emptyState?: ReactNode;
  className?: string;
}

export declare function Tabs(props: TabsProps): ReactElement;