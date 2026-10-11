import { defaultAccordionConfig } from './accordionDefaults.js';
import { applyPresetWith, presetModifiedWith } from './presetUtils.js';
import { validateConfig } from '../utils/validateConfig.js';

/*
  Visual presets. A preset is a partial configuration that only touches
  appearance + behavior — content (questions, title) is never reset, so
  applying a preset mid-edit cannot destroy the user's writing.
*/

export const accordionPresets = [
  {
    id: 'editorial',
    name: 'Editorial Minimal',
    description: 'Hairline rules, wide measure, old-style serif. Reads like a printed index.',
    config: {
      layout: {
        widthPercent: 100,
        maxWidth: 720,
        itemGap: 0,
        questionPaddingY: 20,
        questionPaddingX: 4,
        answerPadding: 4,
        contentGap: 8,
        sectionGap: 20,
        dividers: true,
        textAlign: 'left',
      },
      colors: {
        background: null,
        questionBackground: null,
        answerBackground: null,
        hoverBackground: null,
        openBackground: null,
        iconColor: null,
      },
      borders: {
        enabled: false,
        radius: 0,
        itemRadius: 0,
        questionRadius: 0,
        answerBorder: 'none',
        dividerThickness: 1,
        shadow: 'none',
      },
      typography: {
        fontFamily: 'serif',
        headingSize: 30,
        questionSize: 18,
        answerSize: 16,
        fontWeight: 400,
        lineHeight: 1.6,
        letterSpacing: 0,
      },
      icons: { style: 'arrow', size: 16, position: 'start', rotateWhenOpen: true },
      animation: { enabled: true, duration: 340, easing: 'ease-out' },
      behavior: { hoverEffect: true, wholeRow: true },
    },
  },
  {
    id: 'soft',
    name: 'Soft Surface',
    description: 'Tinted panels, a resting shadow, rounded shoulders. Friendly and calm.',
    config: {
      layout: {
        itemGap: 14,
        questionPaddingY: 16,
        questionPaddingX: 20,
        answerPadding: 8,
        contentGap: 10,
        sectionGap: 24,
        dividers: false,
        maxWidth: 640,
      },
      colors: {
        background: null,
        questionBackground: null,
        answerBackground: null,
        hoverBackground: null,
        openBackground: null,
        borderColor: null,
        iconColor: null,
      },
      borders: {
        enabled: false,
        radius: 16,
        itemRadius: 12,
        questionRadius: 12,
        answerBorder: 'none',
        dividerThickness: 1,
        shadow: 'md',
      },
      typography: {
        fontFamily: 'system',
        headingSize: 26,
        questionSize: 16,
        answerSize: 15,
        fontWeight: 500,
        lineHeight: 1.6,
        letterSpacing: 0,
      },
      icons: { style: 'plus', size: 18, position: 'end', rotateWhenOpen: false },
      animation: { enabled: true, duration: 300, easing: 'cubic-bezier(0.2, 0, 0, 1)' },
      behavior: { hoverEffect: true, wholeRow: true },
    },
  },
  {
    id: 'outline',
    name: 'Geometric Outline',
    description: 'Square corners, two-pixel rules, plus indicators. Technical and blunt.',
    config: {
      layout: {
        itemGap: 10,
        questionPaddingY: 14,
        questionPaddingX: 16,
        answerPadding: 4,
        contentGap: 6,
        sectionGap: 22,
        dividers: false,
        maxWidth: 620,
      },
      colors: {
        background: null,
        questionBackground: null,
        answerBackground: null,
        hoverBackground: null,
        openBackground: null,
        borderColor: null,
        iconColor: null,
      },
      borders: {
        enabled: true,
        width: 2,
        style: 'solid',
        radius: 0,
        itemRadius: 0,
        questionRadius: 0,
        answerBorder: 'top',
        dividerThickness: 1,
        shadow: 'none',
      },
      typography: {
        fontFamily: 'geometric',
        headingSize: 24,
        questionSize: 15,
        answerSize: 14,
        fontWeight: 600,
        lineHeight: 1.5,
        letterSpacing: 0.01,
      },
      icons: { style: 'plus', size: 16, position: 'end', rotateWhenOpen: false },
      animation: { enabled: true, duration: 160, easing: 'linear' },
      behavior: { hoverEffect: true, wholeRow: true },
    },
  },
  {
    id: 'cards',
    name: 'Floating Cards',
    description: 'Separated items with depth — each answer sits in its own tray.',
    config: {
      layout: {
        itemGap: 18,
        questionPaddingY: 18,
        questionPaddingX: 22,
        answerPadding: 10,
        contentGap: 8,
        sectionGap: 28,
        dividers: false,
        maxWidth: 660,
      },
      colors: {
        background: null,
        questionBackground: null,
        answerBackground: null,
        hoverBackground: null,
        openBackground: null,
        borderColor: null,
        iconColor: null,
      },
      borders: {
        enabled: false,
        radius: 10,
        itemRadius: 10,
        questionRadius: 10,
        answerBorder: 'none',
        dividerThickness: 1,
        shadow: 'lg',
      },
      typography: {
        fontFamily: 'humanist',
        headingSize: 25,
        questionSize: 16,
        answerSize: 15,
        fontWeight: 600,
        lineHeight: 1.55,
        letterSpacing: 0,
      },
      icons: { style: 'chevron', size: 18, position: 'end', rotateWhenOpen: true },
      animation: { enabled: true, duration: 320, easing: 'ease-out' },
      behavior: { hoverEffect: true, wholeRow: true },
    },
  },
  {
    id: 'noir',
    name: 'Studio Noir',
    description: 'Ink block, square edges, and an open row that floods vermilion. Loud on purpose.',
    config: {
      layout: {
        itemGap: 0,
        questionPaddingY: 18,
        widthPercent: 100,
        questionPaddingX: 18,
        answerPadding: 6,
        contentGap: 10,
        sectionGap: 26,
        dividers: true,
        dividerThickness: 1,
        maxWidth: 640,
      },
      colors: {
        background: '#14161a',
        questionBackground: '#14161a',
        answerBackground: '#14161a',
        questionText: '#edefec',
        answerText: '#b9beba',
        headingText: '#edefec',
        borderColor: '#3a3f45',
        dividerColor: '#3a3f45',
        iconColor: '#e8461e',
        hoverBackground: '#1e2126',
        openBackground: '#2a1410',
        focusColor: '#ff8a5c',
      },
      borders: {
        enabled: true,
        width: 1,
        style: 'solid',
        radius: 0,
        itemRadius: 0,
        questionRadius: 0,
        answerBorder: 'none',
        dividerThickness: 1,
        shadow: 'none',
      },
      typography: {
        fontFamily: 'system',
        headingSize: 28,
        questionSize: 17,
        answerSize: 15,
        fontWeight: 600,
        lineHeight: 1.55,
        letterSpacing: -0.005,
      },
      icons: { style: 'chevron', size: 18, position: 'end', rotateWhenOpen: true },
      animation: { enabled: true, duration: 240, easing: 'ease-out' },
      behavior: { hoverEffect: true, wholeRow: true },
    },
  },
];

/* the open row inverts its text when flooded with vermilion */
export const presetById = Object.fromEntries(accordionPresets.map((p) => [p.id, p]));

export { mergeConfig } from './presetUtils.js';

/** Build the full config a preset produces when applied to the current one. */
export function applyPreset(preset, currentConfig) {
  return applyPresetWith(validateConfig, preset, currentConfig);
}

/** True when the current config no longer matches the active preset. */
export function presetIsModified(preset, config) {
  return presetModifiedWith(defaultAccordionConfig, preset, config);
}
