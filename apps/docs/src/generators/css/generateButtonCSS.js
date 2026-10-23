import { FONT_STACKS } from '../../config/typography.js';
import { BUTTON_VARIANTS, BUTTON_SIZE_TOKENS } from '../../config/buttonDefaults.js';
import { buttonVariantVars, themeRef } from '../shared/colors.js';
import {
  NQ,
  NQ_STATE,
  btnAlign,
  btnFull,
  btnSize,
  btnVariant,
} from '../shared/classNames.js';

/* generateButtonCSS(config, theme) -> Button.css source string (CSS mode).
   The reusable Button.jsx carries structure/behaviour; every appearance value
   lives here. Variant colours inherit theme tokens so the file still adapts to
   a host theme, while the configured variant carries any explicit overrides.
   Selectors come from generators/shared/classNames.js so the preview and the
   exported file can never disagree on names. */

const SHADOWS = {
  sm: '0 1px 2px rgba(20, 22, 26, 0.08)',
  md: '0 2px 6px rgba(20, 22, 26, 0.1), 0 12px 24px -12px rgba(20, 22, 26, 0.25)',
  lg: '0 8px 18px -8px rgba(20, 22, 26, 0.18), 0 26px 52px -22px rgba(20, 22, 26, 0.32)',
};

const sel = (name) => `.${name}`;

export function generateButtonCSS(config, theme = {}) {
  const { layout, typography, icons, borders, animation } = config;
  const font = FONT_STACKS[typography.fontFamily] || FONT_STACKS.system;
  const duration = `${animation.duration}ms`;
  const boxShadow = borders.shadow !== 'none' ? SHADOWS[borders.shadow] : null;

  const out = [];
  const push = (line = '') => out.push(line);

  push('/* Button.css');
  push('   Generated from the Component Playground configuration.');
  push('   Pairs with Button.jsx. Import both:');
  push("     import Button from './Button';");
  push("     import './Button.css';");
  push('   Variant colours inherit the --color-* theme tokens, with fallbacks,');
  push('   so this file also works standalone.');
  push('*/');
  push();

  push(`${sel(NQ.btn)} {`);
  push(`  --btn-dur: ${duration};`);
  push(`  --btn-ease: ${animation.easing};`);
  push(`  --btn-gap: ${layout.gap}px;`);
  push(`  --btn-icon: ${icons.size}px;`);
  push('  box-sizing: border-box;');
  push('  display: inline-flex;');
  push('  align-items: center;');
  push('  justify-content: center;');
  push('  gap: var(--btn-gap);');
  push(`  font-family: ${font};`);
  push(`  font-weight: ${typography.fontWeight};`);
  push(`  letter-spacing: ${typography.letterSpacing}em;`);
  push('  line-height: 1;');
  push('  text-decoration: none;');
  push('  white-space: nowrap;');
  push(`  border-radius: ${layout.radius}px;`);
  push(`  border: ${borders.width}px ${borders.style} var(--btn-border);`);
  push('  background: var(--btn-bg);');
  push('  color: var(--btn-fg);');
  push('  cursor: pointer;');
  push('  -webkit-appearance: none;');
  push('  appearance: none;');
  push('  user-select: none;');
  if (boxShadow) push(`  box-shadow: ${boxShadow};`);
  push(`  transition: background-color var(--btn-dur) var(--btn-ease),`);
  push('    border-color var(--btn-dur) var(--btn-ease), color var(--btn-dur) var(--btn-ease),');
  push('    box-shadow var(--btn-dur) var(--btn-ease), transform var(--btn-dur) var(--btn-ease);');
  push('}');
  push();
  push(`${sel(NQ.btn)}:hover:not(:disabled):not(.${NQ_STATE.loading}) {`);
  push('  background: var(--btn-bg-hover);');
  push('}');
  push();
  push(`${sel(NQ.btn)}:active:not(:disabled):not(.${NQ_STATE.loading}) {`);
  push('  transform: translateY(1px);');
  push('}');
  push();
  push(`${sel(NQ.btn)}:focus-visible {`);
  push(`  outline: 2px solid ${themeRef('focus', theme)};`);
  push('  outline-offset: 2px;');
  push('}');
  push();
  push(`${sel(NQ.btn)}:disabled,`);
  push(`${sel(NQ.btn)}.${NQ_STATE.loading} {`);
  push('  cursor: not-allowed;');
  push('  opacity: 0.6;');
  push('}');
  push();

  /* sizes */
  for (const [size, token] of Object.entries(BUTTON_SIZE_TOKENS)) {
    push(`${sel(btnSize(size))} {`);
    push(`  padding: ${token.paddingY}px ${token.paddingX}px;`);
    push(`  font-size: ${token.fontSize}px;`);
    push(`  min-height: ${token.height}px;`);
    push('}');
    push();
  }

  /* width + alignment */
  push(`${sel(btnFull())} {`);
  push('  width: 100%;');
  push('}');
  push();
  for (const align of ['start', 'center', 'end']) {
    const margin = align === 'center' ? 'margin-inline: auto;' : align === 'end' ? 'margin-inline: auto 0;' : 'margin-inline: 0;';
    push(`${sel(btnAlign(align))} {`);
    push(`  ${margin}`);
    push('}');
    push();
  }

  /* variants */
  for (const variant of BUTTON_VARIANTS) {
    const vars = buttonVariantVars(config, variant, theme);
    push(`${sel(btnVariant(variant))} {`);
    push(`  --btn-bg: ${vars.background};`);
    push(`  --btn-fg: ${vars.text};`);
    push(`  --btn-border: ${vars.border};`);
    push(`  --btn-bg-hover: ${vars.hoverBackground};`);
    push('}');
    push();
  }

  /* parts */
  push(`${sel(NQ.btnIcon)} {`);
  push('  display: inline-flex;');
  push('  align-items: center;');
  push('  justify-content: center;');
  push('  flex: none;');
  push('  width: var(--btn-icon);');
  push('  height: var(--btn-icon);');
  push('}');
  push();
  push(`${sel(NQ.btnIcon)} svg {`);
  push('  width: 100%;');
  push('  height: 100%;');
  push('}');
  push();
  push(`${sel(NQ.btnLabel)} {`);
  push('  display: inline-block;');
  push('}');
  push();
  push(`${sel(NQ.btnSpinner)} {`);
  push('  flex: none;');
  push('  width: var(--btn-icon);');
  push('  height: var(--btn-icon);');
  push('  border-radius: 50%;');
  push('  border: 2px solid currentColor;');
  push('  border-top-color: transparent;');
  push('  animation: nq-btn-spin 640ms linear infinite;');
  push('}');
  push();
  push('@keyframes nq-btn-spin {');
  push('  to {');
  push('    transform: rotate(360deg);');
  push('  }');
  push('}');
  push();

  push('@media (prefers-reduced-motion: reduce) {');
  push(`  ${sel(NQ.btn)} {`);
  push('    transition-duration: 0.01ms;');
  push('  }');
  push(`  ${sel(NQ.btnSpinner)} {`);
  push('    animation-duration: 1.6s;');
  push('  }');
  push('}');

  return ['@layer nasaq {', ...out, '}'].join('\n');
}
