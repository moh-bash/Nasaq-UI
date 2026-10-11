export const tabsSections = [
  {
    id: 'content',
    label: 'Content',
    fields: [
      { path: 'content.items', label: 'Tabs', type: 'items', itemType: 'tabs' },
      { path: 'content.defaultActiveId', label: 'Default tab', type: 'text', placeholder: 'overview' },
    ],
  },
  {
    id: 'appearance',
    label: 'Appearance',
    fields: [
      {
        path: 'variant',
        label: 'Style',
        type: 'select',
        options: [
          { value: 'underline', label: 'Underline' },
          { value: 'pill', label: 'Pill' },
          { value: 'boxed', label: 'Boxed' },
        ],
      },
      {
        path: 'layout.align',
        label: 'Alignment',
        type: 'select',
        options: [
          { value: 'start', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'end', label: 'Right' },
          { value: 'stretch', label: 'Stretch' },
        ],
      },
      { path: 'layout.radius', label: 'Corner radius', type: 'range', min: 0, max: 999, step: 1, unit: 'px' },
      { path: 'layout.gap', label: 'Panel gap', type: 'range', min: 0, max: 80, step: 1, unit: 'px' },
    ],
  },
  {
    id: 'colors',
    label: 'Colors',
    fields: [
      { path: 'colors.active', label: 'Active tab', type: 'color', token: 'primary' },
      { path: 'colors.text', label: 'Tab text', type: 'color', token: 'text' },
      { path: 'colors.muted', label: 'Muted text', type: 'color', token: 'text-muted' },
      { path: 'colors.border', label: 'Border', type: 'color', token: 'border' },
      { path: 'colors.panel', label: 'Panel', type: 'color', token: 'surface' },
    ],
  },
];

export const tabsSectionById = Object.fromEntries(tabsSections.map((section) => [section.id, section]));
