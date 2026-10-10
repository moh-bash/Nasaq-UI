/*
  Generic preset algebra. A preset is a partial configuration that only touches
  appearance + behaviour — content is never reset, so applying a preset mid-edit
  cannot destroy the user's writing. Shared by every registry component.
*/

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Deep-merge a partial config over a base config (arrays are replaced). */
export function mergeConfig(base, patch) {
  const out = { ...base };
  for (const [key, value] of Object.entries(patch || {})) {
    if (isPlainObject(value) && isPlainObject(base[key])) {
      out[key] = mergeConfig(base[key], value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

/** Build the full config a preset produces when applied to the current one. */
export function applyPresetWith(validate, preset, currentConfig) {
  return validate(mergeConfig(currentConfig, preset.config));
}

/** True when the current config no longer matches the active preset. */
export function presetModifiedWith(defaults, preset, config) {
  if (!preset) return false;
  const reference = mergeConfig(defaults, preset.config);
  for (const section of Object.keys(preset.config)) {
    if (JSON.stringify(reference[section]) !== JSON.stringify(config[section])) return true;
  }
  return false;
}

export function indexById(list) {
  return Object.fromEntries(list.map((entry) => [entry.id, entry]));
}
