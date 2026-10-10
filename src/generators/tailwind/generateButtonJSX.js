import { BUTTON_SIZE_TOKENS } from '../../config/buttonDefaults.js';
import { FONT_STACKS } from '../../config/typography.js';
import { iconSvgSource, hasIcon } from '../../config/buttonIcons.js';
import { variantToken } from '../shared/colors.js';

/*
  generateButtonTailwindJSX(config, theme) -> a self-contained Tailwind
  component.

  Every class name is a static string. Colours that inherit a token use
  semantic utilities (bg-primary, text-white, border-border, hover:bg-hover);
  user-selected overrides use static arbitrary values (bg-[#hex]); dimensions
  that come from the config are emitted as literal arbitrary values
  (rounded-[10px], gap-[8px]). No class name is constructed by interpolating
  values at runtime.
*/

const WEIGHT_CLASS = {
  400: 'font-normal',
  500: 'font-medium',
  600: 'font-semibold',
  700: 'font-bold',
  800: 'font-extrabold',
};

const EASING_CLASS = {
  ease: 'ease-out',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
  linear: 'ease-linear',
};

const SHADOW_CLASS = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

function colorUtility(prefix, variantValue, override) {
  if (override) return `${prefix}-[${override}]`;
  if (variantValue === 'WHITE') return `${prefix}-white`;
  if (variantValue === 'TRANSPARENT' || !variantValue) return `${prefix}-transparent`;
  return `${prefix}-${variantValue}`;
}

function hoverBackgroundClass(config) {
  const hoverOverride = config.colors?.hoverBackground;
  if (typeof hoverOverride === 'string') {
    return `hover:bg-[color-mix(in_srgb,${hoverOverride}_88%,black)]`;
  }
  const bgOverride = config.colors?.background;
  if (typeof bgOverride === 'string') {
    return `hover:bg-[color-mix(in_srgb,${bgOverride}_88%,black)]`;
  }
  const token = variantToken(config.variant, 'background');
  if (token === 'TRANSPARENT' || !token) return 'hover:bg-hover';
  if (token !== 'WHITE') return `hover:bg-${token}/90`;
  return '';
}

export function generateButtonTailwindJSX(config) {
  const { content, layout, typography, icons, borders } = config;
  const size = BUTTON_SIZE_TOKENS[config.size] || BUTTON_SIZE_TOKENS.md;
  const variant = config.variant;

  const classes = ['inline-flex', 'items-center', 'justify-center', 'select-none', 'whitespace-nowrap'];
  classes.push(size.tailwind);
  classes.push(WEIGHT_CLASS[typography.fontWeight] || 'font-semibold');

  if (layout.radius >= 999) classes.push('rounded-full');
  else classes.push(`rounded-[${layout.radius}px]`);
  classes.push(`gap-[${layout.gap}px]`);

  if (layout.fullWidth) classes.push('w-full');
  else if (layout.align === 'center') classes.push('mx-auto');
  else if (layout.align === 'end') classes.push('ml-auto');

  if (borders.width <= 0) classes.push('border-0');
  else classes.push(`border-[${borders.width}px]`, `border-${borders.style}`);

  classes.push(colorUtility('bg', variantToken(variant, 'background'), config.colors?.background));
  classes.push(colorUtility('text', variantToken(variant, 'text'), config.colors?.text));
  classes.push(colorUtility('border', variantToken(variant, 'border'), config.colors?.border));
  classes.push(hoverBackgroundClass(config));

  classes.push('transition-colors', `duration-[${config.animation.duration}ms]`);
  classes.push(EASING_CLASS[config.animation.easing] || 'ease-out');
  if (SHADOW_CLASS[borders.shadow]) classes.push(SHADOW_CLASS[borders.shadow]);

  classes.push('focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-focus', 'focus-visible:ring-offset-2');
  classes.push('disabled:cursor-not-allowed', 'disabled:opacity-60');

  const className = classes.join(' ');

  const styleEntries = [`fontFamily: ${JSON.stringify(FONT_STACKS[typography.fontFamily] || FONT_STACKS.system)}`];
  styleEntries.push(`letterSpacing: ${JSON.stringify(`${typography.letterSpacing}em`)}`);
  const style = `{{ ${styleEntries.join(', ')} }}`;

  const iconAttrs = `className="h-[${icons.size}px] w-[${icons.size}px]"`;
  const label = content.label ? `      <span>${content.label}</span>` : '';

  const leading = content.loading
    ? `      <span className="h-[${icons.size}px] w-[${icons.size}px] animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />`
    : hasIcon(content.leadingIcon)
      ? `      ${iconSvgSource(content.leadingIcon, iconAttrs)}`
      : '';

  const trailing =
    !content.loading && hasIcon(content.trailingIcon)
      ? `      ${iconSvgSource(content.trailingIcon, iconAttrs)}`
      : '';

  const disabledAttr = content.disabled || content.loading;
  const busyAttr = content.loading;

  const attrLines = [
    '    <button',
    '      type="button"',
    `      className="${className}"`,
    `      style=${style}`,
  ];
  if (disabledAttr) attrLines.push('      disabled');
  if (busyAttr) attrLines.push('      aria-busy="true"');
  attrLines.push('    >');

  const out = [
    'export default function ActionButton() {',
    '  return (',
    ...attrLines,
    ...[leading, label, trailing].filter(Boolean),
    '    </button>',
    '  );',
    '}',
    '',
  ];

  return out.join('\n');
}

export const USAGE_FILENAME = 'ActionButton.jsx';
