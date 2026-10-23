import { COLOR_TOKEN_MAP } from '../../config/accordionDefaults.js';
import { FONT_STACKS } from '../../config/typography.js';
import { THEME_TOKEN_DEFAULTS } from '../shared/colors.js';
import {
  NQ,
  NQ_STATE,
  accIconPosition,
  accIconStyle,
} from '../shared/classNames.js';

/* generateAccordionCSS(config, theme) -> Accordion.css source string.
   Every value comes from the config, so the panel and the preview can never
   drift apart. Inherited colours become theme variable references with the
   current theme value as a fallback, so the file also works standalone.
   Selectors come from generators/shared/classNames.js. */

const SHADOWS = {
  sm: '0 1px 2px rgba(20, 22, 26, 0.06)',
  md: '0 2px 6px rgba(20, 22, 26, 0.07), 0 14px 28px -14px rgba(20, 22, 26, 0.2)',
  lg: '0 8px 18px -8px rgba(20, 22, 26, 0.16), 0 28px 56px -24px rgba(20, 22, 26, 0.3)',
};

const sel = (name) => `.${name}`;

/** Resolve one accordion colour to a CSS value (hex or theme var + fallback). */
export function colorRef(config, prop, theme) {
  const value = config.colors?.[prop];
  if (typeof value === 'string' && value) return value;
  const token = (COLOR_TOKEN_MAP[prop] || '--color-text').replace('--color-', '');
  const fallback = theme?.[token] || THEME_TOKEN_DEFAULTS[token] || '#14161a';
  return `var(--color-${token}, ${fallback})`;
}

/** The theme tokens this component currently depends on. */
export function inheritedTokens(config) {
  return Object.keys(config.colors || {})
    .filter((prop) => config.colors[prop] === null)
    .map((prop) => (COLOR_TOKEN_MAP[prop] || '').replace('--color-', ''))
    .filter(Boolean);
}

export function generateAccordionCSS(config, theme = {}) {
  const { content, layout, borders, typography, icons, animation, behavior } = config;
  const c = (prop) => colorRef(config, prop, theme);

  const font = FONT_STACKS[typography.fontFamily] || FONT_STACKS.system;
  const duration = animation.enabled ? `${animation.duration}ms` : '0ms';
  const easing = animation.easing;
  const titleWeight = Math.min(700, Math.max(400, typography.fontWeight + 100));

  const boxShadow = borders.shadow !== 'none' ? SHADOWS[borders.shadow] : null;
  const shadowOnItems = layout.itemGap > 0;
  const hasBorder = borders.enabled && borders.width > 0;
  const singleContainer = layout.itemGap === 0;
  const margin =
    layout.align === 'center' ? 'margin-inline: auto;' : layout.align === 'end' ? 'margin-inline: auto 0;' : 'margin-inline: 0;';

  const out = [];
  const push = (line = '') => out.push(line);

  push('/* Accordion.css');
  push('   Generated from the Component Playground configuration.');
  push('   Pairs with Accordion.jsx. Import both:');
  push("     import Accordion from './Accordion';");
  push("     import './Accordion.css';");
  const inherited = inheritedTokens(config);
  if (inherited.length && inherited.length < Object.keys(config.colors).length) {
    push('   Colours marked as inherited reference these theme variables:');
    push(`     ${[...new Set(inherited)].map((t) => `--color-${t}`).join(', ')}`);
  } else if (inherited.length) {
    push('   Colours reference the --color-* theme variables, with fallbacks.');
  }
  push('*/');
  push();

  push(`${sel(NQ.acc)} {`);
  push(`  --acc-dur: ${duration};`);
  push(`  --acc-ease: ${easing};`);
  push(`  --acc-icon: ${icons.size}px;`);
  push('  box-sizing: border-box;');
  push(`  font-family: ${font};`);
  push(`  width: ${layout.widthPercent}%;`);
  push(`  max-width: ${layout.maxWidth}px;`);
  push(`  ${margin}`);
  push(`  text-align: ${layout.textAlign};`);
  push(`  color: ${c('questionText')};`);
  push(`  background: ${c('background')};`);
  if (hasBorder) {
    push(`  border: ${borders.width}px ${borders.style} ${c('borderColor')};`);
  } else {
    push('  border: 0;');
  }
  push(`  border-radius: ${borders.radius}px;`);
  if (boxShadow && !shadowOnItems) push(`  box-shadow: ${boxShadow};`);
  if (singleContainer) push('  overflow: hidden;');
  push('}');
  push();
  push(`${sel(NQ.acc)},`);
  push(`${sel(NQ.acc)} *,`);
  push(`${sel(NQ.acc)} *::before,`);
  push(`${sel(NQ.acc)} *::after {`);
  push('  box-sizing: border-box;');
  push('}');
  push();

  /* heading block */
  push(`${sel(NQ.accHead)} {`);
  push(`  margin: 0 0 ${layout.sectionGap}px;`);
  push('}');
  push();
  push(`${sel(NQ.accTitle)} {`);
  push('  margin: 0;');
  push(`  font-size: ${typography.headingSize}px;`);
  push(`  font-weight: ${titleWeight};`);
  push('  line-height: 1.2;');
  push(`  letter-spacing: ${typography.letterSpacing}em;`);
  push(`  color: ${c('headingText')};`);
  push('}');
  push();
  push(`${sel(NQ.accDesc)} {`);
  push('  margin: 8px 0 0;');
  push(`  font-size: ${Math.max(12, typography.answerSize)}px;`);
  push('  line-height: 1.5;');
  push(`  color: ${c('answerText')};`);
  push('}');
  push();

  /* list + items */
  push(`${sel(NQ.accList)} {`);
  push('  display: flex;');
  push('  flex-direction: column;');
  push(`  gap: ${layout.itemGap}px;`);
  push('  margin: 0;');
  push('  padding: 0;');
  push('}');
  push();
  push(`${sel(NQ.accItem)} {`);
  push(`  background: ${c('background')};`);
  push(`  border-radius: ${borders.itemRadius}px;`);
  push('  overflow: hidden;');
  if (boxShadow && shadowOnItems) push(`  box-shadow: ${boxShadow};`);
  push('}');
  push();
  if (layout.dividers) {
    push(`${sel(NQ.accItem)} + ${sel(NQ.accItem)} {`);
    push(`  border-top: ${borders.dividerThickness}px solid ${c('dividerColor')};`);
    push('}');
    push();
  }

  push(`${sel(NQ.accItemHeader)} {`);
  push(`  background: ${c('questionBackground')};`);
  push(`  border-radius: ${borders.questionRadius}px;`);
  if (!behavior.wholeRow) push(`  padding: ${layout.questionPaddingY}px ${layout.questionPaddingX}px;`);
  push('}');
  push();

  push(`${sel(NQ.accTrigger)} {`);
  push('  display: flex;');
  push('  align-items: center;');
  push('  gap: 12px;');
  push('  width: 100%;');
  if (behavior.wholeRow) push(`  padding: ${layout.questionPaddingY}px ${layout.questionPaddingX}px;`);
  else push('  padding: 0;');
  push('  margin: 0;');
  push('  background: none;');
  push('  border: 0;');
  push(`  border-radius: ${borders.questionRadius}px;`);
  push('  font: inherit;');
  push(`  font-size: ${typography.questionSize}px;`);
  push(`  font-weight: ${typography.fontWeight};`);
  push(`  line-height: ${typography.lineHeight};`);
  push(`  letter-spacing: ${typography.letterSpacing}em;`);
  push(`  color: ${c('questionText')};`);
  push('  text-align: inherit;');
  push('  cursor: pointer;');
  push('  -webkit-appearance: none;');
  push('  appearance: none;');
  push('  transition: background-color var(--acc-dur) var(--acc-ease);');
  push('}');
  push();
  push(`${sel(NQ.accTrigger)}:focus-visible {`);
  push(`  outline: 2px solid ${c('focusColor')};`);
  push('  outline-offset: -2px;');
  push('}');
  push();
  if (behavior.hoverEffect) {
    push(`${sel(NQ.accItem)}:not(.${NQ_STATE.disabled}) ${sel(NQ.accItemHeader)}:hover {`);
    push(`  background: ${c('hoverBackground')};`);
    push('}');
    push();
  }
  push(`${sel(NQ.accItem)}.${NQ_STATE.open} ${sel(NQ.accItemHeader)} {`);
  push(`  background: ${c('openBackground')};`);
  push('}');
  push();

  /* question + numbers + icon */
  push(`${sel(NQ.accQuestion)} {`);
  push('  flex: 1 1 auto;');
  push('}');
  push();
  if (content.numbering && icons.style !== 'number') {
    push(`${sel(NQ.accIndex)} {`);
    push('  flex: none;');
    push(`  font-size: ${Math.max(11, typography.questionSize - 4)}px;`);
    push('  font-variant-numeric: tabular-nums;');
    push(`  color: ${c('answerText')};`);
    push('}');
    push();
  }
  push(`${sel(NQ.accIcon)} {`);
  push('  flex: none;');
  push('  display: inline-flex;');
  push('  align-items: center;');
  push('  justify-content: center;');
  push('  width: var(--acc-icon);');
  push('  height: var(--acc-icon);');
  push(`  color: ${c('iconColor')};`);
  push('  transition: transform var(--acc-dur) var(--acc-ease);');
  push('}');
  push();
  push(`${sel(accIconPosition('start'))} ${sel(NQ.accIcon)} {`);
  push('  order: -1;');
  push('}');
  push();
  if (icons.style === 'chevron' && icons.rotateWhenOpen) {
    push(`${sel(NQ.accItem)}.${NQ_STATE.open} ${sel(accIconStyle('chevron'))} {`);
    push('  transform: rotate(180deg);');
    push('}');
    push();
  }
  if (icons.style === 'arrow' && icons.rotateWhenOpen) {
    push(`${sel(NQ.accItem)}.${NQ_STATE.open} ${sel(accIconStyle('arrow'))} {`);
    push('  transform: rotate(90deg);');
    push('}');
    push();
  }
  if (icons.style === 'plus') {
    push(`${sel(NQ.accPlus)} {`);
    push('  position: relative;');
    push('  display: block;');
    push('  width: 100%;');
    push('  height: 100%;');
    push('}');
    push();
    push(`${sel(NQ.accPlusBar)} {`);
    push('  position: absolute;');
    push('  background: currentColor;');
    push('  border-radius: 2px;');
    push('  transition: transform var(--acc-dur) var(--acc-ease), opacity var(--acc-dur) var(--acc-ease);');
    push('}');
    push();
    push(`${sel(NQ.accPlusBarH)} {`);
    push('  top: calc(50% - 1px);');
    push('  left: 0;');
    push('  right: 0;');
    push('  height: 2px;');
    push('}');
    push();
    push(`${sel(NQ.accPlusBarV)} {`);
    push('  left: calc(50% - 1px);');
    push('  top: 0;');
    push('  bottom: 0;');
    push('  width: 2px;');
    push('}');
    push();
    push(`${sel(NQ.accItem)}.${NQ_STATE.open} ${sel(NQ.accPlusBarV)} {`);
    push('  transform: rotate(90deg);');
    push('  opacity: 0;');
    push('}');
    push();
  }
  if (icons.style === 'number') {
    push(`${sel(NQ.accNumeral)} {`);
    push('  font-size: 0.82em;');
    push('  font-weight: 600;');
    push('  letter-spacing: 0.02em;');
    push('  font-variant-numeric: tabular-nums;');
    push('}');
    push();
  }

  /* answer panel + motion */
  push(`${sel(NQ.accPanel)} {`);
  push('  display: grid;');
  push('  grid-template-rows: 0fr;');
  push('  overflow: hidden;');
  push('  transition: grid-template-rows var(--acc-dur) var(--acc-ease);');
  push('}');
  push();
  push(`${sel(NQ.accItem)}.${NQ_STATE.open} ${sel(NQ.accPanel)} {`);
  push('  grid-template-rows: 1fr;');
  push('}');
  push();
  push(`${sel(NQ.accPanelInner)} {`);
  push('  min-height: 0;');
  push('  overflow: hidden;');
  push(`  padding: ${layout.contentGap}px ${layout.questionPaddingX}px ${layout.answerPadding}px;`);
  push(`  background: ${c('answerBackground')};`);
  if (borders.answerBorder === 'top') {
    push(`  border-top: ${borders.dividerThickness}px solid ${c('dividerColor')};`);
  }
  if (borders.answerBorder === 'separate') {
    push(`  border-block: ${borders.dividerThickness}px solid ${c('dividerColor')};`);
  }
  push('  visibility: hidden;');
  push('  transition: visibility 0s linear var(--acc-dur);');
  push('}');
  push();
  push(`${sel(NQ.accItem)}.${NQ_STATE.open} ${sel(NQ.accPanelInner)} {`);
  push('  visibility: visible;');
  push('  transition-delay: 0s;');
  push('}');
  push();
  push(`${sel(NQ.accAnswer)} {`);
  push(`  font-size: ${typography.answerSize}px;`);
  push(`  line-height: ${typography.lineHeight};`);
  push(`  letter-spacing: ${typography.letterSpacing}em;`);
  push(`  color: ${c('answerText')};`);
  push('}');
  push();
  push(`${sel(NQ.accEmpty)} {`);
  push(`  color: ${c('answerText')};`);
  push('  font-size: 14px;');
  push('  padding: 12px 0;');
  push('}');
  push();

  /* disabled */
  push(`${sel(NQ.accItem)}.${NQ_STATE.disabled} ${sel(NQ.accTrigger)} {`);
  push('  cursor: not-allowed;');
  push('  opacity: 0.55;');
  push('}');
  push();

  /* responsive */
  push('@media (max-width: 560px) {');
  push(`  ${sel(NQ.acc)} {`);
  push('    max-width: 100%;');
  push('  }');
  push(`  ${sel(NQ.accHead)} {`);
  push(`    margin-bottom: ${Math.round(layout.sectionGap * 0.75)}px;`);
  push('  }');
  push(`  ${sel(NQ.accTitle)} {`);
  push(`    font-size: ${Math.min(typography.headingSize, 22)}px;`);
  push('  }');
  push('}');
  push();

  /* reduced motion */
  push('@media (prefers-reduced-motion: reduce) {');
  push(`  ${sel(NQ.accPanel)},`);
  push(`  ${sel(NQ.accPanelInner)},`);
  push(`  ${sel(NQ.accIcon)},`);
  push(`  ${sel(NQ.accTrigger)},`);
  push(`  ${sel(NQ.accPlusBar)} {`);
  push('    transition-duration: 0.01ms;');
  push('  }');
  push('}');

  return ['@layer nasaq {', ...out, '}'].join('\n');
}
