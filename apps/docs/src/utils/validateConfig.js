import { defaultAccordionConfig, CONFIG_VERSION, DEFAULT_ITEMS } from '../config/accordionDefaults.js';

/* Validation + sanitisation of a (possibly malformed) configuration object.
   Always returns a complete, safe config — never throws. */

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export const ENUMS = {
  'layout.align': ['start', 'center', 'end'],
  'layout.textAlign': ['left', 'center', 'right'],
  'borders.style': ['solid', 'dashed', 'dotted'],
  'borders.answerBorder': ['none', 'top', 'separate'],
  'borders.shadow': ['none', 'sm', 'md', 'lg'],
  'typography.fontFamily': ['system', 'humanist', 'geometric', 'serif', 'slab', 'mono'],
  'typography.fontWeight': [400, 500, 600, 700],
  'icons.style': ['chevron', 'plus', 'arrow', 'number', 'none'],
  'icons.position': ['start', 'end'],
  'animation.easing': [
    'cubic-bezier(0.2, 0, 0, 1)',
    'ease',
    'ease-out',
    'ease-in-out',
    'linear',
  ],
};

const RANGES = {
  'layout.widthPercent': [25, 100],
  'layout.maxWidth': [320, 1400],
  'layout.itemGap': [0, 48],
  'layout.questionPaddingY': [0, 48],
  'layout.questionPaddingX': [0, 48],
  'layout.answerPadding': [0, 48],
  'layout.contentGap': [0, 40],
  'layout.sectionGap': [0, 64],
  'borders.width': [0, 8],
  'borders.radius': [0, 40],
  'borders.itemRadius': [0, 40],
  'borders.questionRadius': [0, 40],
  'borders.dividerThickness': [1, 8],
  'typography.headingSize': [14, 48],
  'typography.questionSize': [12, 28],
  'typography.answerSize': [11, 24],
  'typography.lineHeight': [1, 2.2],
  'typography.letterSpacing': [-0.04, 0.12],
  'icons.size': [12, 32],
  'animation.duration': [0, 1200],
};

export function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function setPath(obj, path, value) {
  const keys = path.split('.');
  const next = { ...obj };
  let cursor = next;
  for (let i = 0; i < keys.length - 1; i += 1) {
    cursor[keys[i]] = { ...cursor[keys[i]] };
    cursor = cursor[keys[i]];
  }
  cursor[keys[keys.length - 1]] = value;
  return next;
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function num(value, fallback) {
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function bool(value, fallback) {
  return typeof value === 'boolean' ? value : fallback;
}

function str(value, fallback, max = 400) {
  return typeof value === 'string' ? value.slice(0, max) : fallback;
}

function enumOf(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

export function isHexColor(value) {
  return typeof value === 'string' && HEX_RE.test(value.trim());
}

function colorOr(value, fallback) {
  if (value === null) return null;
  if (typeof value === 'string' && HEX_RE.test(value.trim())) return value.trim().toLowerCase();
  return fallback;
}

function sanitizeItems(rawItems) {
  if (!Array.isArray(rawItems)) return DEFAULT_ITEMS.map((item) => ({ ...item }));
  const used = new Set();
  const items = rawItems.slice(0, 40).map((raw, index) => {
    const item = raw && typeof raw === 'object' ? raw : {};
    let id = typeof item.id === 'string' && item.id.trim() ? item.id.slice(0, 64) : `item-${index + 1}`;
    while (used.has(id)) id = `${id}-${index + 1}`;
    used.add(id);
    return {
      id,
      question: str(item.question, 'Untitled question', 300),
      answer: str(item.answer, '', 4000),
      disabled: bool(item.disabled, false),
    };
  });
  return items;
}

function sanitizeSection(raw, defaults, section) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const out = { ...defaults };

  for (const key of Object.keys(defaults)) {
    const path = `${section}.${key}`;
    const fallback = defaults[key];
    const value = source[key];

    if (section === 'colors') {
      out[key] = colorOr(value, fallback);
    } else if (fallback === null) {
      out[key] = colorOr(value, fallback);
    } else if (typeof fallback === 'string') {
      out[key] = str(value, fallback, 200);
    } else if (typeof fallback === 'number') {
      let next = num(value, fallback);
      const range = RANGES[path];
      if (range) next = clamp(next, range[0], range[1]);
      if (path === 'typography.lineHeight' || path === 'typography.letterSpacing') {
        next = Math.round(next * 1000) / 1000;
      }
      out[key] = next;
    } else if (typeof fallback === 'boolean') {
      out[key] = bool(value, fallback);
    } else {
      out[key] = value === undefined ? fallback : value;
    }
  }

  return out;
}

function applyEnum(out, section, key, value, fallback) {
  const path = `${section}.${key}`;
  if (ENUMS[path]) out[key] = enumOf(value, ENUMS[path], fallback);
}

/**
 * Validate an arbitrary object into a full accordion config.
 * @param {unknown} raw stored/user-supplied config
 * @returns complete config object
 */
export function validateConfig(raw) {
  const base = defaultAccordionConfig;
  const source = raw && typeof raw === 'object' ? raw : {};

  const layout = sanitizeSection(source.layout, base.layout, 'layout');
  const colors = sanitizeSection(source.colors, base.colors, 'colors');
  const borders = sanitizeSection(source.borders, base.borders, 'borders');
  const typography = sanitizeSection(source.typography, base.typography, 'typography');
  const icons = sanitizeSection(source.icons, base.icons, 'icons');
  const animation = sanitizeSection(source.animation, base.animation, 'animation');
  const behavior = sanitizeSection(source.behavior, base.behavior, 'behavior');

  applyEnum(layout, 'layout', 'align', source.layout?.align, base.layout.align);
  applyEnum(layout, 'layout', 'textAlign', source.layout?.textAlign, base.layout.textAlign);
  applyEnum(borders, 'borders', 'style', source.borders?.style, base.borders.style);
  applyEnum(borders, 'borders', 'answerBorder', source.borders?.answerBorder, base.borders.answerBorder);
  applyEnum(borders, 'borders', 'shadow', source.borders?.shadow, base.borders.shadow);
  applyEnum(typography, 'typography', 'fontFamily', source.typography?.fontFamily, base.typography.fontFamily);
  applyEnum(typography, 'typography', 'fontWeight', source.typography?.fontWeight, base.typography.fontWeight);
  applyEnum(icons, 'icons', 'style', source.icons?.style, base.icons.style);
  applyEnum(icons, 'icons', 'position', source.icons?.position, base.icons.position);
  applyEnum(animation, 'animation', 'easing', source.animation?.easing, base.animation.easing);

  const rawContent = source.content && typeof source.content === 'object' ? source.content : {};
  const items = sanitizeItems(rawContent.items);
  const allowedInitial = ['', ...items.map((i) => i.id)];
  const initialOpenId = allowedInitial.includes(rawContent.initialOpenId)
    ? rawContent.initialOpenId
    : base.content.initialOpenId;

  const content = {
    title: str(rawContent.title, base.content.title, 200),
    description: str(rawContent.description, base.content.description, 600),
    showDescription: bool(rawContent.showDescription, base.content.showDescription),
    numbering: bool(rawContent.numbering, base.content.numbering),
    initialOpenId,
    items,
  };

  /* keep open-state coherent: numbering + icon style "number" imply no extra icon */
  const resolvedIcons = { ...icons };
  if (resolvedIcons.style === 'number' && !content.numbering) {
    content.numbering = true;
  }

  return {
    version: CONFIG_VERSION,
    content,
    layout,
    colors,
    borders,
    typography,
    icons: resolvedIcons,
    animation,
    behavior,
  };
}

/** Clamp a single value by its schema path — used while the user drags sliders. */
export function clampField(path, value) {
  const range = RANGES[path];
  if (range && typeof value === 'number') return clamp(value, range[0], range[1]);
  return value;
}
