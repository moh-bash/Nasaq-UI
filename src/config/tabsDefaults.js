import { createValidator } from '../utils/createValidator.js';

export const TABS_CONFIG_VERSION = 1;

export const defaultTabsConfig = {
  version: TABS_CONFIG_VERSION,
  content: {
    items: [
      { id: 'overview', label: 'Overview', content: 'A clear starting point for your product story.', disabled: false },
      { id: 'details', label: 'Details', content: 'Keep supporting information close without leaving the page.', disabled: false },
      { id: 'activity', label: 'Activity', content: 'Show recent changes and useful context in one calm surface.', disabled: false },
    ],
    defaultActiveId: 'overview',
  },
  variant: 'underline',
  layout: { align: 'start', radius: 10, gap: 24 },
  colors: { active: null, text: null, muted: null, border: null, panel: null },
  animation: { duration: 160, easing: 'ease-out' },
};

export function validateTabsConfig(raw) {
  const config = {
    ...defaultTabsConfig,
    ...raw,
    content: { ...defaultTabsConfig.content, ...(raw?.content || {}) },
    layout: { ...defaultTabsConfig.layout, ...(raw?.layout || {}) },
    colors: { ...defaultTabsConfig.colors, ...(raw?.colors || {}) },
    animation: { ...defaultTabsConfig.animation, ...(raw?.animation || {}) },
  };
  config.content.items = (Array.isArray(config.content.items) ? config.content.items : defaultTabsConfig.content.items)
    .slice(0, 8)
    .map((item, index) => ({
      id: typeof item.id === 'string' && item.id ? item.id : `tab-${index + 1}`,
      label: typeof item.label === 'string' ? item.label.slice(0, 48) : `Tab ${index + 1}`,
      content: typeof item.content === 'string' ? item.content.slice(0, 240) : '',
      disabled: Boolean(item.disabled),
    }));
  return createValidator({
    defaults: defaultTabsConfig,
    version: TABS_CONFIG_VERSION,
    colorPaths: ['colors.active', 'colors.text', 'colors.muted', 'colors.border', 'colors.panel'],
    enums: {
      variant: ['underline', 'pill', 'boxed'],
      'layout.align': ['start', 'center', 'end', 'stretch'],
      'animation.easing': ['ease', 'ease-out', 'ease-in-out', 'linear'],
    },
    ranges: { 'layout.radius': [0, 999], 'layout.gap': [0, 80], 'animation.duration': [0, 800] },
    maxLengths: { 'content.defaultActiveId': 48 },
  })(config);
}
