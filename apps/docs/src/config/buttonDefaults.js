/*
  Button configuration model — the single source of truth for the second
  registry component. One config object drives the inspector, the live preview,
  the generated JSX and the generated CSS / Tailwind output.

  Colour values are either `null` (inherit a variant-derived theme token) or an
  explicit `#hex` override. See VARIANT_TOKENS.
*/

import { createValidator } from '../utils/createValidator.js';

export const BUTTON_CONFIG_VERSION = 1;

export const BUTTON_VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'danger'];
export const BUTTON_SIZES = ['sm', 'md', 'lg'];
export const BUTTON_ICONS = ['none', 'plus', 'arrow-right', 'check', 'download', 'chevron-down'];

/*
  Variant -> theme token mapping.
  'WHITE' is a literal (solid variants read on a dark fill);
  'TRANSPARENT' removes the fill/border; any other string is a theme token key.
*/
export const VARIANT_TOKENS = {
  primary: { background: 'primary', text: 'on-primary', border: 'primary' },
  secondary: { background: 'secondary', text: 'on-secondary', border: 'secondary' },
  danger: { background: 'danger', text: 'on-danger', border: 'danger' },
  outline: { background: 'TRANSPARENT', text: 'text', border: 'border' },
  ghost: { background: 'TRANSPARENT', text: 'text', border: 'TRANSPARENT' },
};

/*
  Size bundles. A size sets the geometry; radius, gap and icon size stay
  individually editable so a "size" always means the same thing in both the
  CSS and Tailwind outputs.
*/
export const BUTTON_SIZE_TOKENS = {
  sm: { paddingX: 12, paddingY: 6, fontSize: 13, height: 32, tailwind: 'h-8 px-3 text-[13px]' },
  md: { paddingX: 18, paddingY: 10, fontSize: 15, height: 40, tailwind: 'h-10 px-4 text-[15px]' },
  lg: { paddingX: 24, paddingY: 13, fontSize: 16, height: 48, tailwind: 'h-12 px-6 text-[16px]' },
};

export const defaultButtonConfig = {
  version: BUTTON_CONFIG_VERSION,
  content: {
    label: 'Create project',
    leadingIcon: 'none',
    trailingIcon: 'arrow-right',
    loading: false,
    disabled: false,
  },
  variant: 'primary',
  size: 'md',
  layout: {
    fullWidth: false,
    align: 'start',
    radius: 10,
    gap: 8,
  },
  typography: {
    fontFamily: 'system',
    fontWeight: 600,
    letterSpacing: 0,
  },
  icons: {
    size: 18,
  },
  colors: {
    background: null,
    text: null,
    border: null,
    hoverBackground: null,
  },
  borders: {
    width: 1,
    style: 'solid',
    shadow: 'none',
  },
  animation: {
    duration: 160,
    easing: 'ease',
  },
};

export function createEmptyButtonConfig() {
  return { ...defaultButtonConfig, content: { ...defaultButtonConfig.content, label: '' } };
}

export const validateButtonConfig = createValidator({
  defaults: defaultButtonConfig,
  version: BUTTON_CONFIG_VERSION,
  colorPaths: ['colors.background', 'colors.text', 'colors.border', 'colors.hoverBackground'],
  maxLengths: { 'content.label': 80 },
  decimals: { 'typography.letterSpacing': 3 },
  enums: {
    variant: BUTTON_VARIANTS,
    size: BUTTON_SIZES,
    'content.leadingIcon': BUTTON_ICONS,
    'content.trailingIcon': BUTTON_ICONS,
    'layout.align': ['start', 'center', 'end'],
    'typography.fontFamily': ['system', 'humanist', 'geometric', 'serif', 'slab', 'mono'],
    'typography.fontWeight': [400, 500, 600, 700, 800],
    'borders.style': ['solid', 'dashed', 'dotted'],
    'borders.shadow': ['none', 'sm', 'md', 'lg'],
    'animation.easing': ['ease', 'ease-out', 'ease-in-out', 'linear'],
  },
  ranges: {
    'layout.radius': [0, 999],
    'layout.gap': [0, 24],
    'typography.letterSpacing': [-0.04, 0.12],
    'icons.size': [12, 28],
    'borders.width': [0, 4],
    'animation.duration': [0, 800],
  },
});
