/*
  Design-token metadata for the Nasaq UI theme.
*/

export interface ThemeToken {
  key: string;
  label: string;
  role: string;
  cssVar: string;
}

export interface ComponentVariable {
  variable: string;
  control: string;
  defaultValue: string;
}

export interface ComponentProp {
  name: string;
  type: string;
  default: string;
  description: string;
}

export interface DesignToken {
  cssVar: string;
  default: string;
}

export const THEME_TOKENS: ThemeToken[] = [
  { key: 'primary', label: 'Primary', role: 'Brand actions, links, focus', cssVar: '--color-primary' },
  { key: 'on-primary', label: 'On primary', role: 'Text and icons on primary fills', cssVar: '--color-on-primary' },
  { key: 'secondary', label: 'Secondary', role: 'Alternate brand surface', cssVar: '--color-secondary' },
  { key: 'on-secondary', label: 'On secondary', role: 'Text and icons on secondary fills', cssVar: '--color-on-secondary' },
  { key: 'accent', label: 'Accent', role: 'Highlights and markers', cssVar: '--color-accent' },
  { key: 'background', label: 'Background', role: 'Page canvas', cssVar: '--color-background' },
  { key: 'surface', label: 'Surface', role: 'Cards and raised panels', cssVar: '--color-surface' },
  { key: 'text', label: 'Text', role: 'Primary copy', cssVar: '--color-text' },
  { key: 'text-muted', label: 'Text muted', role: 'Secondary copy', cssVar: '--color-text-muted' },
  { key: 'border', label: 'Border', role: 'Rules and outlines', cssVar: '--color-border' },
  { key: 'hover', label: 'Hover surface', role: 'Pointer-over surface', cssVar: '--color-hover' },
  { key: 'active', label: 'Active surface', role: 'Selected / pressed surface', cssVar: '--color-active' },
  { key: 'success', label: 'Success', role: 'Positive status', cssVar: '--color-success' },
  { key: 'warning', label: 'Warning', role: 'Caution status', cssVar: '--color-warning' },
  { key: 'danger', label: 'Danger', role: 'Destructive status', cssVar: '--color-danger' },
  { key: 'on-danger', label: 'On danger', role: 'Text and icons on danger fills', cssVar: '--color-on-danger' },
  { key: 'focus', label: 'Focus ring', role: 'Keyboard focus outline', cssVar: '--color-focus' },
];

export const TOKEN_KEYS = THEME_TOKENS.map((token) => token.key);

export const DESIGN_TOKENS: Record<string, DesignToken> = {
  radius: { cssVar: '--nq-radius', default: '10px' },
  'font-sans': { cssVar: '--nq-font-sans', default: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
  'font-mono': { cssVar: '--nq-font-mono', default: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" },
  'shadow-sm': { cssVar: '--nq-shadow-sm', default: '0 1px 2px rgba(20, 22, 26, 0.08)' },
  'shadow-md': { cssVar: '--nq-shadow-md', default: '0 2px 6px rgba(20, 22, 26, 0.1), 0 12px 24px -12px rgba(20, 22, 26, 0.25)' },
  'shadow-lg': { cssVar: '--nq-shadow-lg', default: '0 8px 18px -8px rgba(20, 22, 26, 0.18), 0 26px 52px -22px rgba(20, 22, 26, 0.32)' },
  duration: { cssVar: '--nq-duration', default: '160ms' },
  easing: { cssVar: '--nq-easing', default: 'ease' },
  'space-1': { cssVar: '--nq-space-1', default: '4px' },
  'space-2': { cssVar: '--nq-space-2', default: '8px' },
  'space-3': { cssVar: '--nq-space-3', default: '12px' },
  'space-4': { cssVar: '--nq-space-4', default: '16px' },
  'space-6': { cssVar: '--nq-space-6', default: '24px' },
};

/*
  The public contract between the Playground and the stylesheet. Each control
  in the inspector maps to one of these variables (a size control writes the
  four size variables listed together because CSS cannot derive a type scale
  from one height without changing the default rhythm).
  Generator output, README tables, and the Theming page all read this list.
*/
export const COMPONENT_VARIABLES: Record<'button' | 'accordion' | 'tabs', ComponentVariable[]> = {
  button: [
    { variable: '--nq-btn-radius', control: 'Radius', defaultValue: 'var(--nq-radius, 10px)' },
    { variable: '--nq-btn-gap', control: 'Icon gap', defaultValue: 'var(--nq-space-2, 8px)' },
    { variable: '--nq-btn-font-family', control: 'Font family', defaultValue: 'var(--nq-font-sans, system-ui, sans-serif)' },
    { variable: '--nq-btn-font-weight', control: 'Font weight', defaultValue: '600' },
    { variable: '--nq-btn-letter-spacing', control: 'Letter spacing', defaultValue: '0em' },
    { variable: '--nq-btn-icon-size', control: 'Icon size', defaultValue: '18px' },
    { variable: '--nq-btn-border-width', control: 'Border width', defaultValue: '1px' },
    { variable: '--nq-btn-border-style', control: 'Border style', defaultValue: 'solid' },
    { variable: '--nq-btn-shadow', control: 'Shadow', defaultValue: 'none' },
    { variable: '--nq-btn-duration', control: 'Duration', defaultValue: 'var(--nq-duration, 160ms)' },
    { variable: '--nq-btn-easing', control: 'Easing', defaultValue: 'var(--nq-easing, ease)' },
    { variable: '--nq-btn-padding-y', control: 'Size (block padding)', defaultValue: '10px' },
    { variable: '--nq-btn-padding-x', control: 'Size (inline padding)', defaultValue: '18px' },
    { variable: '--nq-btn-font-size', control: 'Size (font size)', defaultValue: '15px' },
    { variable: '--nq-btn-min-height', control: 'Size (minimum height)', defaultValue: '40px' },
    { variable: '--nq-btn-bg', control: 'Background', defaultValue: 'transparent' },
    { variable: '--nq-btn-fg', control: 'Text', defaultValue: 'var(--color-text, #14161a)' },
    { variable: '--nq-btn-border-color', control: 'Border colour', defaultValue: 'var(--color-border, #d6d9d4)' },
    { variable: '--nq-btn-bg-hover', control: 'Hover background', defaultValue: 'var(--color-hover, #f1f3ef)' },
  ],
  accordion: [
    { variable: '--nq-acc-width', control: 'Width', defaultValue: '100%' },
    { variable: '--nq-acc-max-width', control: 'Maximum width', defaultValue: '640px' },
    { variable: '--nq-acc-margin-inline', control: 'Alignment', defaultValue: 'auto' },
    { variable: '--nq-acc-text-align', control: 'Text alignment', defaultValue: 'left' },
    { variable: '--nq-acc-font-family', control: 'Font family', defaultValue: 'var(--nq-font-sans, system-ui, sans-serif)' },
    { variable: '--nq-acc-radius', control: 'Radius', defaultValue: '6px' },
    { variable: '--nq-acc-item-radius', control: 'Item radius', defaultValue: '6px' },
    { variable: '--nq-acc-question-radius', control: 'Question radius', defaultValue: '6px' },
    { variable: '--nq-acc-border-width', control: 'Border width', defaultValue: '1px' },
    { variable: '--nq-acc-border-style', control: 'Border style', defaultValue: 'solid' },
    { variable: '--nq-acc-shadow', control: 'Container shadow', defaultValue: 'none' },
    { variable: '--nq-acc-item-shadow', control: 'Item shadow', defaultValue: 'none' },
    { variable: '--nq-acc-bg', control: 'Background', defaultValue: 'var(--color-surface, #ffffff)' },
    { variable: '--nq-acc-border-color', control: 'Border colour', defaultValue: 'var(--color-border, #d6d9d4)' },
    { variable: '--nq-acc-duration', control: 'Duration', defaultValue: '280ms' },
    { variable: '--nq-acc-easing', control: 'Easing', defaultValue: 'cubic-bezier(0.2, 0, 0, 1)' },
    { variable: '--nq-acc-icon-size', control: 'Icon size', defaultValue: '18px' },
    { variable: '--nq-acc-item-gap', control: 'Item gap', defaultValue: '0px' },
    { variable: '--nq-acc-divider-width', control: 'Dividers', defaultValue: '1px' },
    { variable: '--nq-acc-divider-color', control: 'Divider colour', defaultValue: 'var(--color-border, #d6d9d4)' },
    { variable: '--nq-acc-section-gap', control: 'Section gap', defaultValue: '24px' },
    { variable: '--nq-acc-question-padding-y', control: 'Question padding (block)', defaultValue: '16px' },
    { variable: '--nq-acc-question-padding-x', control: 'Question padding (inline)', defaultValue: '20px' },
    { variable: '--nq-acc-content-gap', control: 'Content gap', defaultValue: '8px' },
    { variable: '--nq-acc-answer-padding', control: 'Answer padding', defaultValue: '16px' },
    { variable: '--nq-acc-heading-size', control: 'Heading size', defaultValue: '26px' },
    { variable: '--nq-acc-heading-weight', control: 'Heading weight', defaultValue: '600' },
    { variable: '--nq-acc-heading-fg', control: 'Heading text', defaultValue: 'var(--color-text, #14161a)' },
    { variable: '--nq-acc-question-fg', control: 'Question text', defaultValue: 'var(--color-text, #14161a)' },
    { variable: '--nq-acc-question-size', control: 'Question size', defaultValue: '16px' },
    { variable: '--nq-acc-question-weight', control: 'Question weight', defaultValue: '500' },
    { variable: '--nq-acc-answer-fg', control: 'Answer text', defaultValue: 'var(--color-text-muted, #5c635e)' },
    { variable: '--nq-acc-answer-size', control: 'Answer size', defaultValue: '15px' },
    { variable: '--nq-acc-line-height', control: 'Line height', defaultValue: '1.55' },
    { variable: '--nq-acc-letter-spacing', control: 'Letter spacing', defaultValue: '0em' },
    { variable: '--nq-acc-question-bg', control: 'Question background', defaultValue: 'var(--color-surface, #ffffff)' },
    { variable: '--nq-acc-answer-bg', control: 'Answer background', defaultValue: 'var(--color-background, #edefec)' },
    { variable: '--nq-acc-hover-bg', control: 'Hover background', defaultValue: 'var(--color-hover, #f1f3ef)' },
    { variable: '--nq-acc-open-bg', control: 'Open background', defaultValue: 'var(--color-active, #ecf0ff)' },
    { variable: '--nq-acc-icon-color', control: 'Icon colour', defaultValue: 'var(--color-primary, #1e3ae0)' },
    { variable: '--nq-acc-focus-color', control: 'Focus colour', defaultValue: 'var(--color-focus, #1e3ae0)' },
    { variable: '--nq-acc-answer-border-top-width', control: 'Answer border (top)', defaultValue: '0px' },
    { variable: '--nq-acc-answer-border-block-width', control: 'Answer border (separate)', defaultValue: '0px' },
  ],
  tabs: [
    { variable: '--nq-tabs-active', control: 'Active colour', defaultValue: 'var(--color-primary, #1e3ae0)' },
    { variable: '--nq-tabs-text', control: 'Text', defaultValue: 'var(--color-text, #14161a)' },
    { variable: '--nq-tabs-muted', control: 'Muted text', defaultValue: 'var(--color-text-muted, #5c635e)' },
    { variable: '--nq-tabs-border', control: 'Border', defaultValue: 'var(--color-border, #d6d9d4)' },
    { variable: '--nq-tabs-panel', control: 'Panel', defaultValue: 'var(--color-surface, #ffffff)' },
    { variable: '--nq-tabs-gap', control: 'Panel gap', defaultValue: '24px' },
    { variable: '--nq-tabs-radius', control: 'Radius', defaultValue: 'var(--nq-radius, 10px)' },
    { variable: '--nq-tabs-duration', control: 'Duration', defaultValue: 'var(--nq-duration, 160ms)' },
    { variable: '--nq-tabs-easing', control: 'Easing', defaultValue: 'ease-out' },
    { variable: '--nq-tabs-padding', control: 'Tab padding', defaultValue: '10px 14px' },
  ],
};

/* Runtime prop metadata keeps the docs tables on the same source as the
   component API. Add a prop here when you add it to the corresponding
   TypeScript interface. */
export const COMPONENT_PROPS: Record<'button' | 'accordion' | 'tabs', ComponentProp[]> = {
  button: [
    { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'", default: "'primary'", description: 'Colour role.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding, text and height bundle.' },
    { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Stretch to the container width.' },
    { name: 'align', type: "'start' | 'center' | 'end'", default: "'start'", description: 'Horizontal placement when not full width.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Show a spinner and disable the button.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable interaction.' },
    { name: 'leadingIcon', type: 'ReactNode', default: 'null', description: 'Icon before the label.' },
    { name: 'trailingIcon', type: 'ReactNode', default: 'null', description: 'Icon after the label.' },
    { name: 'as', type: 'ElementType', default: "'button'", description: 'Render as another element, such as an anchor.' },
  ],
  accordion: [
    { name: 'items', type: 'Item[]', default: '[]', description: 'Each item is { id, question, answer, disabled }.' },
    { name: 'title', type: 'string', default: "''", description: 'Optional heading above the list.' },
    { name: 'description', type: 'string', default: "''", description: 'Optional line under the title.' },
    { name: 'numbered', type: 'boolean', default: 'false', description: 'Prefix each question with a two-digit index.' },
    { name: 'icon', type: "'chevron' | 'plus' | 'arrow' | 'number' | 'none'", default: "'chevron'", description: 'Row indicator.' },
    { name: 'iconPosition', type: "'start' | 'end'", default: "'end'", description: 'Indicator side.' },
    { name: 'allowMultiple', type: 'boolean', default: 'false', description: 'Keep several answers open.' },
    { name: 'allowCollapse', type: 'boolean', default: 'true', description: 'Allow closing the last open answer.' },
    { name: 'defaultOpenId', type: 'string', default: "''", description: 'Item id to open on mount.' },
    { name: 'value', type: 'string[]', default: 'undefined', description: 'Controlled list of open item ids.' },
    { name: 'onValueChange', type: '(ids: string[]) => void', default: 'undefined', description: 'Called when the open set changes.' },
    { name: 'emptyState', type: 'ReactNode', default: 'null', description: 'Optional content shown when items is empty.' },
  ],
  tabs: [
    { name: 'items', type: 'Tab[]', default: '[]', description: 'Each item is { id, label, content, disabled }.' },
    { name: 'defaultActiveId', type: 'string', default: "'overview'", description: 'Tab selected on first render.' },
    { name: 'value', type: 'string', default: 'undefined', description: 'Controlled active tab id.' },
    { name: 'onValueChange', type: '(id: string) => void', default: 'undefined', description: 'Called when the active tab changes.' },
    { name: 'variant', type: "'underline' | 'pill' | 'boxed'", default: "'underline'", description: 'Visual treatment.' },
    { name: 'align', type: "'start' | 'center' | 'end' | 'stretch'", default: "'start'", description: 'Tab row alignment.' },
    { name: 'label', type: 'string', default: 'undefined', description: 'Accessible label for the tab list.' },
    { name: 'emptyState', type: 'ReactNode', default: 'null', description: 'Optional content shown when items is empty.' },
  ],
};

/** The CSS custom property a token key resolves to. */
export function tokenVar(key: string): string {
  return `--color-${key}`;
}

export function designTokenVar(key: string): string {
  return DESIGN_TOKENS[key]?.cssVar || `--nq-${key}`;
}
