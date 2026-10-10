import { defaultTabsConfig, validateTabsConfig } from './tabsDefaults.js';
import { applyPresetWith, presetModifiedWith } from './presetUtils.js';

export const tabsPresets = [
  {
    id: 'underline',
    name: 'Quiet underline',
    description: 'A restrained navigation row with a precise active marker.',
    config: { variant: 'underline', layout: { align: 'start', radius: 10, gap: 24 } },
  },
  {
    id: 'pill',
    name: 'Soft pills',
    description: 'Friendly rounded tabs for settings and compact dashboards.',
    config: { variant: 'pill', layout: { align: 'start', radius: 999, gap: 20 } },
  },
  {
    id: 'boxed',
    name: 'Framed tabs',
    description: 'Clear boundaries for denser information architecture.',
    config: { variant: 'boxed', layout: { align: 'stretch', radius: 10, gap: 20 } },
  },
];

export const tabsPresetById = Object.fromEntries(tabsPresets.map((preset) => [preset.id, preset]));
export function applyTabsPreset(preset, currentConfig) {
  return applyPresetWith(validateTabsConfig, preset, currentConfig);
}
export function tabsPresetIsModified(preset, config) {
  return presetModifiedWith(defaultTabsConfig, preset, config);
}
