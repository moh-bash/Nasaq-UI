/* WCAG 2.2 relative luminance / contrast helpers for the inspector. */

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export function parseHex(value) {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(HEX_RE);
  if (!match) return null;
  let hex = match[1];
  if (hex.length === 3) hex = hex.split('').map((char) => char + char).join('');
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

function channel(value) {
  const srgb = value / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex) {
  const rgb = parseHex(hex);
  if (!rgb) return null;
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

export function contrastRatio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  if (la === null || lb === null) return null;
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

export function readableOn(hex) {
  const white = contrastRatio(hex, '#ffffff') ?? 0;
  const ink = contrastRatio(hex, '#14161a') ?? 0;
  return ink >= white ? '#14161a' : '#ffffff';
}

export function contrastGrade(ratio) {
  if (ratio === null) return null;
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}
