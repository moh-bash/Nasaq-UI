import { describe, it, expect } from 'vitest';
import { themeDefaults } from '../src/index';

/*
  WCAG 2.2 contrast gate for the shipped palettes. Text tokens must clear
  4.5:1 on every surface they can appear on; non-text focus indicators must
  clear 3:1.
*/

function channel(value: number): number {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const [r, g, b] = hex.replace('#', '').match(/../g)!.map((part) => channel(parseInt(part, 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground: string, background: string): number {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const SURFACES = ['background', 'surface', 'hover', 'active'] as const;
const TEXT_TOKENS = ['text', 'text-muted', 'success', 'warning', 'danger'] as const;
const SOLID_PAIRS = [
  ['on-primary', 'primary'],
  ['on-secondary', 'secondary'],
  ['on-danger', 'danger'],
] as const;

describe.each(['light', 'dark'] as const)('%s palette contrast', (mode) => {
  const palette = themeDefaults[mode];

  it.each(SURFACES)('text tokens clear 4.5:1 on %s', (surface) => {
    for (const token of TEXT_TOKENS) {
      const ratio = contrast(palette[token], palette[surface]);
      expect(ratio, `${token} on ${surface} (${mode})`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(SOLID_PAIRS)('%s text clears 4.5:1 on its solid fill', (foreground, background) => {
    const ratio = contrast(palette[foreground], palette[background]);
    expect(ratio, `${foreground} on ${background} (${mode})`).toBeGreaterThanOrEqual(4.5);
  });

  it.each(['background', 'surface'] as const)('focus clears 3:1 on %s', (surface) => {
    const ratio = contrast(palette.focus, palette[surface]);
    expect(ratio, `focus on ${surface} (${mode})`).toBeGreaterThanOrEqual(3);
  });
});
