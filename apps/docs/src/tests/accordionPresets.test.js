import { describe, it, expect } from 'vitest';
import {
  accordionPresets,
  presetById,
  mergeConfig,
  applyPreset,
  presetIsModified,
} from '../config/accordionPresets.js';
import { validateConfig } from '../utils/validateConfig.js';
import { defaultAccordionConfig } from '../config/accordionDefaults.js';

describe('preset catalogue', () => {
  it('exposes five presets with unique ids', () => {
    expect(accordionPresets.length).toBe(5);
    const ids = accordionPresets.map((preset) => preset.id);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => expect(presetById[id].id).toBe(id));
  });

  it('does not carry content overrides in any preset', () => {
    accordionPresets.forEach((preset) => {
      expect(preset.config.content).toBeUndefined();
    });
  });
});

describe('mergeConfig', () => {
  it('deep-merges plain objects', () => {
    const result = mergeConfig({ a: { x: 1, y: 2 }, b: 1 }, { a: { y: 9, z: 3 } });
    expect(result).toEqual({ a: { x: 1, y: 9, z: 3 }, b: 1 });
  });

  it('replaces arrays instead of merging them', () => {
    const result = mergeConfig({ list: [1, 2, 3] }, { list: [9] });
    expect(result.list).toEqual([9]);
  });
});

describe('applyPreset', () => {
  it('changes appearance while preserving content', () => {
    const start = validateConfig({
      content: { title: 'My FAQ', items: [{ id: 'a', question: 'Keep me?', answer: 'yes' }] },
    });
    const soft = presetById.soft;
    const next = applyPreset(soft, start);
    expect(next.content.title).toBe('My FAQ');
    expect(next.content.items[0].question).toBe('Keep me?');
    expect(next.borders.radius).toBe(16);
    expect(next.borders.shadow).toBe('md');
  });

  it('produces a valid config for every preset', () => {
    accordionPresets.forEach((preset) => {
      const next = applyPreset(preset, defaultAccordionConfig);
      expect(next.version).toBe(defaultAccordionConfig.version);
      expect(Array.isArray(next.content.items)).toBe(true);
    });
  });
});

describe('presetIsModified', () => {
  it('is false for no preset', () => {
    expect(presetIsModified(null, defaultAccordionConfig)).toBe(false);
  });

  it('is false right after applying a preset', () => {
    const preset = presetById.outline;
    const applied = applyPreset(preset, defaultAccordionConfig);
    expect(presetIsModified(preset, applied)).toBe(false);
  });

  it('becomes true after a visual edit', () => {
    const preset = presetById.outline;
    const applied = applyPreset(preset, defaultAccordionConfig);
    const edited = { ...applied, borders: { ...applied.borders, radius: 12 } };
    expect(presetIsModified(preset, edited)).toBe(true);
  });

  it('ignores content edits the preset does not own', () => {
    const preset = presetById.outline;
    const applied = applyPreset(preset, defaultAccordionConfig);
    const edited = {
      ...applied,
      content: { ...applied.content, title: 'Renamed by the user' },
    };
    expect(presetIsModified(preset, edited)).toBe(false);
  });
});
