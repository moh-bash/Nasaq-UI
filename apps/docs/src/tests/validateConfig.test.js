import { describe, it, expect } from 'vitest';
import {
  validateConfig,
  getPath,
  setPath,
  clamp,
  clampField,
  isHexColor,
} from '../utils/validateConfig.js';
import { defaultAccordionConfig, CONFIG_VERSION, DEFAULT_ITEMS } from '../config/accordionDefaults.js';

describe('validateConfig', () => {
  it('returns a complete config from garbage input without throwing', () => {
    for (const input of [null, undefined, 'nope', 42, [], { layout: 'x' }]) {
      const config = validateConfig(input);
      expect(config.version).toBe(CONFIG_VERSION);
      expect(config.content.items.length).toBe(DEFAULT_ITEMS.length);
      expect(config.layout.maxWidth).toBe(defaultAccordionConfig.layout.maxWidth);
    }
  });

  it('clamps numbers into their schema range', () => {
    const config = validateConfig({ layout: { maxWidth: 99999, itemGap: -10 } });
    expect(config.layout.maxWidth).toBe(1400);
    expect(config.layout.itemGap).toBe(0);
  });

  it('falls back when a number is not finite', () => {
    const config = validateConfig({ typography: { questionSize: 'abc' } });
    expect(config.typography.questionSize).toBe(defaultAccordionConfig.typography.questionSize);
  });

  it('keeps only valid hex overrides and normalises case', () => {
    const config = validateConfig({
      colors: { iconColor: '#ABC', background: 'red', questionText: '#112233' },
    });
    expect(config.colors.iconColor).toBe('#abc');
    expect(config.colors.questionText).toBe('#112233');
    expect(config.colors.background).toBeNull();
  });

  it('respects an explicit null (inherit) colour', () => {
    const config = validateConfig({ colors: { iconColor: null } });
    expect(config.colors.iconColor).toBeNull();
  });

  it('rejects unknown enum values', () => {
    const config = validateConfig({ icons: { style: 'sparkle' }, layout: { textAlign: 'justify' } });
    expect(config.icons.style).toBe(defaultAccordionConfig.icons.style);
    expect(config.layout.textAlign).toBe(defaultAccordionConfig.layout.textAlign);
  });

  it('sanitises items and de-duplicates ids', () => {
    const config = validateConfig({
      content: {
        items: [
          { id: 'dup', question: 'A', answer: 'a' },
          { id: 'dup', question: 'B' },
          { question: 'C' },
        ],
      },
    });
    const ids = config.content.items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(config.content.items[1].answer).toBe('');
    expect(config.content.items[2].question).toBe('C');
  });

  it('drops an initialOpenId that does not match any item', () => {
    const config = validateConfig({ content: { items: [{ id: 'x' }], initialOpenId: 'ghost' } });
    expect(config.content.initialOpenId).toBe('');
  });

  it('keeps a valid initialOpenId', () => {
    const config = validateConfig({ content: { items: [{ id: 'x' }], initialOpenId: 'x' } });
    expect(config.content.initialOpenId).toBe('x');
  });

  it('turns numbering on when the numbered indicator is selected', () => {
    const config = validateConfig({ icons: { style: 'number' }, content: { numbering: false } });
    expect(config.content.numbering).toBe(true);
  });
});

describe('path + numeric helpers', () => {
  it('getPath reads nested values', () => {
    expect(getPath({ a: { b: { c: 3 } } }, 'a.b.c')).toBe(3);
    expect(getPath({}, 'a.b')).toBeUndefined();
  });

  it('setPath returns a new object without mutating the source', () => {
    const source = { a: { b: 1 } };
    const next = setPath(source, 'a.b', 2);
    expect(next.a.b).toBe(2);
    expect(source.a.b).toBe(1);
  });

  it('clamp bounds a value', () => {
    expect(clamp(12, 0, 10)).toBe(10);
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clampField clamps only known numeric paths', () => {
    expect(clampField('borders.width', 99)).toBe(8);
    expect(clampField('unknown.path', 99)).toBe(99);
  });

  it('isHexColor recognises 3/6/8 digit hex', () => {
    expect(isHexColor('#fff')).toBe(true);
    expect(isHexColor('#1E3AE0')).toBe(true);
    expect(isHexColor('#11223344')).toBe(true);
    expect(isHexColor('blue')).toBe(false);
    expect(isHexColor('#12345')).toBe(false);
  });
});
