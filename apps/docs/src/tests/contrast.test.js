import { describe, expect, it } from 'vitest';
import { contrastGrade, contrastRatio, parseHex, readableOn } from '../utils/contrast.js';

describe('contrast helpers', () => {
  it('parses short and long hex values', () => {
    expect(parseHex('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHex('#1e3ae0')).toEqual({ r: 30, g: 58, b: 224 });
    expect(parseHex('rgb(0,0,0)')).toBeNull();
  });

  it('computes WCAG ratios and grades', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 1);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 1);
    expect(contrastGrade(21)).toBe('AAA');
    expect(contrastGrade(4.6)).toBe('AA');
    expect(contrastGrade(3.1)).toBe('AA Large');
    expect(contrastGrade(2.9)).toBe('Fail');
  });

  it('chooses the readable foreground for a swatch', () => {
    expect(readableOn('#ffffff')).toBe('#14161a');
    expect(readableOn('#1e3ae0')).toBe('#ffffff');
    expect(readableOn('#7d92ff')).toBe('#14161a');
  });
});
