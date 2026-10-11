/*
  Generic, defensive config validator shared by every component.
  A component describes its defaults once; this engine walks that shape and
  repairs arbitrary input (from localStorage or elsewhere) into a complete,
  safe config. It never throws and never drops a key.

  spec = {
    defaults,                 // full default config (nested plain objects)
    version,                  // stamped onto the result
    ranges:   { 'a.b': [min,max] },
    enums:    { 'a.b': [allowed...] },
    colorPaths: ['colors.x'], // hex | null
    stringPaths: ['content.label'], // force string handling for null defaults
    maxLengths: { 'content.label': 80 },
    decimals: { 'typography.letterSpacing': 3 },
    sanitize: (config, raw) => config, // optional post-pass
  }
*/

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function colorOr(value, fallback) {
  if (value === null) return null;
  if (typeof value === 'string' && HEX_RE.test(value.trim())) return value.trim().toLowerCase();
  return fallback;
}

function enumOf(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

export function isHexColor(value) {
  return typeof value === 'string' && HEX_RE.test(value.trim());
}

export function createValidator(spec) {
  const {
    defaults,
    version,
    ranges = {},
    enums = {},
    colorPaths = [],
    stringPaths = [],
    maxLengths = {},
    decimals = {},
    sanitize,
  } = spec;

  function walk(raw, base, prefix) {
    const source = isPlainObject(raw) ? raw : {};
    const out = { ...base };

    for (const key of Object.keys(base)) {
      const path = prefix ? `${prefix}.${key}` : key;
      const fallback = base[key];
      const value = source[key];

      if (isPlainObject(fallback)) {
        out[key] = walk(value, fallback, path);
        continue;
      }

      if (colorPaths.includes(path) || (fallback === null && !stringPaths.includes(path))) {
        out[key] = colorOr(value, fallback);
      } else if (typeof fallback === 'string') {
        out[key] = str(value, fallback, maxLengths[path] ?? 240);
      } else if (typeof fallback === 'number') {
        let next = num(value, fallback);
        const range = ranges[path];
        if (range) next = clamp(next, range[0], range[1]);
        const places = decimals[path];
        if (places != null) {
          const factor = 10 ** places;
          next = Math.round(next * factor) / factor;
        }
        out[key] = next;
      } else if (typeof fallback === 'boolean') {
        out[key] = bool(value, fallback);
      } else {
        out[key] = value === undefined ? fallback : value;
      }

      if (enums[path]) out[key] = enumOf(value, enums[path], fallback);
    }

    return out;
  }

  return function validate(raw) {
    const source = isPlainObject(raw) ? raw : {};
    const out = walk(source, defaults, '');
    out.version = version ?? defaults.version;
    return sanitize ? sanitize(out, source) : out;
  };
}
