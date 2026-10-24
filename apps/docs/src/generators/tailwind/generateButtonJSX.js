import { iconSvgSource, hasIcon } from '../../config/buttonIcons.js';
import { buttonVariables } from '../shared/variables.js';

/*
  generateButtonTailwindJSX(config) -> a self-contained Tailwind component.

  The root inline style is the exact same config -> variable map used by the
  semantic-CSS generator, so both exports resolve to identical values. Every
  utility is static and reads those variables; no class name is built from a
  runtime value.
*/

function styleLiteral(variables) {
  const entries = Object.entries(variables).map(
    ([name, value]) => `'${name}': ${JSON.stringify(value)}`,
  );
  return `{{ ${entries.join(', ')} }}`;
}

export function generateButtonTailwindJSX(config) {
  const { content, layout } = config;
  const { base, variants } = buttonVariables(config);
  const variables = { ...base, ...variants[config.variant] };

  const classes = [
    'inline-flex',
    'items-center',
    'justify-center',
    'select-none',
    'whitespace-nowrap',
    'box-border',
    'cursor-pointer',
    'rounded-[var(--nq-btn-radius)]',
    'gap-[var(--nq-btn-gap)]',
    'px-[var(--nq-btn-padding-x)]',
    'py-[var(--nq-btn-padding-y)]',
    'text-[length:var(--nq-btn-font-size)]',
    'min-h-[var(--nq-btn-min-height)]',
    '[font-family:var(--nq-btn-font-family)]',
    '[font-weight:var(--nq-btn-font-weight)]',
    '[letter-spacing:var(--nq-btn-letter-spacing)]',
    'bg-[color:var(--nq-btn-bg)]',
    'text-[color:var(--nq-btn-fg)]',
    'hover:bg-[color:var(--nq-btn-bg-hover)]',
    'border-[length:var(--nq-btn-border-width)]',
    '[border-style:var(--nq-btn-border-style)]',
    'border-[color:var(--nq-btn-border-color)]',
    '[box-shadow:var(--nq-btn-shadow)]',
    'transition-[background-color,border-color,color,box-shadow,transform]',
    'duration-[var(--nq-btn-duration)]',
    'ease-[var(--nq-btn-easing)]',
    'active:translate-y-px',
    'focus-visible:outline-none',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'focus-visible:outline-[color:var(--color-focus)]',
    'disabled:cursor-not-allowed',
    'disabled:opacity-60',
  ];

  if (layout.fullWidth) classes.push('w-full');
  else if (layout.align === 'center') classes.push('mx-auto');
  else if (layout.align === 'end') classes.push('ms-auto');

  const className = classes.join(' ');
  const iconAttrs = 'className="h-[var(--nq-btn-icon-size)] w-[var(--nq-btn-icon-size)]"';
  const label = content.label ? `      <span>${content.label}</span>` : '';

  const leading = content.loading
    ? '      <span className="h-[var(--nq-btn-icon-size)] w-[var(--nq-btn-icon-size)] animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />'
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
    `      style=${styleLiteral(variables)}`,
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
