/*
  Button presets. Appearance-only partial configs — applying one never touches
  the written label or icon choices.
*/

import { defaultButtonConfig, validateButtonConfig } from './buttonDefaults.js';
import { applyPresetWith, presetModifiedWith } from './presetUtils.js';

export const buttonPresets = [
  {
    id: 'solid',
    name: 'Solid Primary',
    description: 'The default filled action. Brand colour, white label, medium size.',
    config: {
      variant: 'primary',
      size: 'md',
      layout: { radius: 10, fullWidth: false, align: 'start', gap: 8 },
      colors: { background: null, text: null, border: null, hoverBackground: null },
      borders: { width: 1, style: 'solid', shadow: 'none' },
      typography: { fontWeight: 600, letterSpacing: 0 },
      animation: { duration: 160, easing: 'ease' },
    },
  },
  {
    id: 'outline',
    name: 'Quiet Outline',
    description: 'Transparent fill with a hairline border. Pairs next to a solid button.',
    config: {
      variant: 'outline',
      size: 'md',
      layout: { radius: 8, gap: 8 },
      colors: { background: null, text: null, border: null, hoverBackground: null },
      borders: { width: 1, style: 'solid', shadow: 'none' },
      typography: { fontWeight: 500, letterSpacing: 0 },
      animation: { duration: 140, easing: 'ease' },
    },
  },
  {
    id: 'ghost',
    name: 'Baré Ghost',
    description: 'No fill, no border — a text action that tints on hover.',
    config: {
      variant: 'ghost',
      size: 'md',
      layout: { radius: 6, gap: 6 },
      colors: { background: null, text: null, border: null, hoverBackground: null },
      borders: { width: 0, style: 'solid', shadow: 'none' },
      typography: { fontWeight: 500, letterSpacing: 0 },
      animation: { duration: 120, easing: 'ease' },
    },
  },
  {
    id: 'destructive',
    name: 'Destructive',
    description: 'Danger fill for delete and other irreversible actions.',
    config: {
      variant: 'danger',
      size: 'md',
      layout: { radius: 8, gap: 8 },
      colors: { background: null, text: null, border: null, hoverBackground: null },
      borders: { width: 1, style: 'solid', shadow: 'none' },
      typography: { fontWeight: 600, letterSpacing: 0 },
      animation: { duration: 140, easing: 'ease' },
    },
  },
  {
    id: 'pill',
    name: 'Pill',
    description: 'Fully rounded ends and generous padding. Casual and friendly.',
    config: {
      variant: 'primary',
      size: 'lg',
      layout: { radius: 999, gap: 10, fullWidth: false, align: 'start' },
      colors: { background: null, text: null, border: null, hoverBackground: null },
      borders: { width: 1, style: 'solid', shadow: 'sm' },
      typography: { fontWeight: 600, letterSpacing: 0 },
      animation: { duration: 180, easing: 'ease' },
    },
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Small, square-cornered action for toolbars and table rows.',
    config: {
      variant: 'secondary',
      size: 'sm',
      layout: { radius: 4, gap: 6, fullWidth: false, align: 'start' },
      colors: { background: null, text: null, border: null, hoverBackground: null },
      borders: { width: 1, style: 'solid', shadow: 'none' },
      typography: { fontWeight: 500, letterSpacing: 0 },
      animation: { duration: 120, easing: 'ease' },
    },
  },
  {
    id: 'cta',
    name: 'Lifted CTA',
    description: 'Large, shadowed call to action built to sit alone.',
    config: {
      variant: 'primary',
      size: 'lg',
      layout: { radius: 12, gap: 10, fullWidth: true, align: 'center' },
      colors: { background: null, text: null, border: null, hoverBackground: null },
      borders: { width: 1, style: 'solid', shadow: 'md' },
      typography: { fontWeight: 700, letterSpacing: 0 },
      animation: { duration: 200, easing: 'ease' },
    },
  },
];

export const buttonPresetById = Object.fromEntries(buttonPresets.map((p) => [p.id, p]));

export function applyButtonPreset(preset, currentConfig) {
  return applyPresetWith(validateButtonConfig, preset, currentConfig);
}

export function buttonPresetIsModified(preset, config) {
  return presetModifiedWith(defaultButtonConfig, preset, config);
}
