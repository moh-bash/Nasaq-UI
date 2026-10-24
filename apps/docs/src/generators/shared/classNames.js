/*
  The single source of class names shared by every generator.

  The library components render `nq-` prefixed classes. Generators must emit
  selectors for those exact names, otherwise the Shadow-DOM preview and the
  exported stylesheet drift apart. Nothing in `generators/` may hard-code a
  component selector: import it from here instead.
*/

export const CLASS_PREFIX = 'nq-';

/** Prefix a component part name, e.g. `nq('btn') === 'nq-btn'`. */
export function nq(name) {
  return `${CLASS_PREFIX}${name}`;
}

/** Prefix a modifier name, e.g. `nqMod('btn', 'primary') === 'nq-btn--primary'`. */
export function nqMod(block, value, separator = '--') {
  return `${CLASS_PREFIX}${block}${separator}${value}`;
}

/** Every structural class the three ready components render. */
export const NQ = Object.freeze({
  // Button
  btn: nq('btn'),
  btnIcon: nq('btn__icon'),
  btnLabel: nq('btn__label'),
  btnSpinner: nq('btn__spinner'),

  // Accordion
  acc: nq('acc'),
  accHead: nq('acc-head'),
  accTitle: nq('acc-title'),
  accDesc: nq('acc-desc'),
  accList: nq('acc-list'),
  accItem: nq('acc-item'),
  accItemHeader: nq('acc-item__header'),
  accTrigger: nq('acc-trigger'),
  accQuestion: nq('acc-question'),
  accIndex: nq('acc-index'),
  accIcon: nq('acc-icon'),
  accPlus: nq('acc-plus'),
  accPlusBar: nq('acc-plus__bar'),
  accPlusBarH: nq('acc-plus__bar--h'),
  accPlusBarV: nq('acc-plus__bar--v'),
  accNumeral: nq('acc-numeral'),
  accPanel: nq('acc-panel'),
  accPanelInner: nq('acc-panel__inner'),
  accAnswer: nq('acc-answer'),
  accEmpty: nq('acc-empty'),

  // Tabs
  tabs: nq('tabs'),
  tabsList: nq('tabs-list'),
  tabsPanel: nq('tabs-panel'),
  tabsEmpty: nq('tabs-empty'),
});

/** State classes emitted by the components. */
export const NQ_STATE = Object.freeze({
  open: nq('is-open'),
  loading: nq('is-loading'),
  disabled: nq('is-disabled'),
});

export const btnVariant = (variant) => nqMod('btn', variant);
export const btnSize = (size) => nqMod('btn', size);
export const btnAlign = (align) => nqMod('btn', `align-${align}`);
export const btnFull = () => nqMod('btn', 'full');
export const accIconPosition = (position) => nqMod('acc', `icon-${position}`);
export const accMode = (allowMultiple) => nqMod('acc', allowMultiple ? 'multi' : 'single');
export const accIconStyle = (style) => nqMod('acc-icon', style);
export const tabsVariant = (variant) => nqMod('tabs', variant);
export const tabsAlign = (align) => nqMod('tabs', `align-${align}`);

/*
  Classes that deliberately have no standalone rule. They are semantic hooks
  used only in compound selectors, or they encode the default state (so there
  is nothing to override). The coverage test treats these as expected.
*/
export const NO_RULE_CLASSES = Object.freeze([
  nqMod('acc', 'icon-end'), // default order
  nqMod('acc', 'single'), // spacing is carried by .nq-acc-list
  nqMod('acc', 'multi'), // spacing is carried by .nq-acc-list
]);

/** Strip comments so selector extraction never reads prose. */
export function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** All class selectors (without the leading dot) found in a stylesheet. */
export function extractClassSelectors(css) {
  const found = new Set();
  const text = stripComments(css).replace(/@import[^;]+;/g, '');
  const re = /\.(-?[_a-zA-Z][\w-]*)/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    found.add(match[1]);
  }
  return [...found];
}

/** Class selectors that are not `nq-` prefixed. Empty means the CSS is clean. */
export function unprefixedClassSelectors(css) {
  return extractClassSelectors(css).filter((name) => !name.startsWith(CLASS_PREFIX));
}

/** True when the whole component stylesheet is scoped to `@layer nasaq`. */
export function isLayerWrapped(css) {
  const trimmed = stripComments(css)
    .replace(/^@import[^;]+;\s*/gm, '')
    .trim();
  return trimmed.startsWith('@layer nasaq {') && trimmed.endsWith('}');
}
