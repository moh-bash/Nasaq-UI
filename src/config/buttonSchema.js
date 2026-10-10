/*
  Property schema for the Button inspector. Describes controls only — never
  stores values. The inspector, the generators and the docs pages read the same
  paths.

  Field types: text | textarea | toggle | select | range | color
*/

import { FONT_FAMILY_OPTIONS } from './typography.js';
import { BUTTON_ICON_OPTIONS } from './buttonIcons.js';

export const buttonSections = [
  {
    id: 'content',
    label: 'Content',
    fields: [
      {
        path: 'content.label',
        label: 'Label',
        type: 'text',
        placeholder: 'Button label',
        help: 'An icon-only button omits the label automatically when it is empty.',
      },
      {
        path: 'content.leadingIcon',
        label: 'Leading icon',
        type: 'select',
        options: BUTTON_ICON_OPTIONS,
      },
      {
        path: 'content.trailingIcon',
        label: 'Trailing icon',
        type: 'select',
        options: BUTTON_ICON_OPTIONS,
      },
    ],
  },
  {
    id: 'appearance',
    label: 'Variant & size',
    fields: [
      {
        path: 'variant',
        label: 'Variant',
        type: 'select',
        options: [
          { value: 'primary', label: 'Primary' },
          { value: 'secondary', label: 'Secondary' },
          { value: 'outline', label: 'Outline' },
          { value: 'ghost', label: 'Ghost' },
          { value: 'danger', label: 'Danger' },
        ],
      },
      {
        path: 'size',
        label: 'Size',
        type: 'select',
        options: [
          { value: 'sm', label: 'Small' },
          { value: 'md', label: 'Medium' },
          { value: 'lg', label: 'Large' },
        ],
        help: 'Sets the padding, text size and height together.',
      },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    fields: [
      { path: 'layout.fullWidth', label: 'Full width', type: 'toggle' },
      {
        path: 'layout.align',
        label: 'Alignment',
        type: 'select',
        options: [
          { value: 'start', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'end', label: 'Right' },
        ],
        dependsOnFalse: 'layout.fullWidth',
        help: 'Only applies when the button is not full width.',
      },
      { path: 'layout.radius', label: 'Corner radius', type: 'range', min: 0, max: 999, step: 1, unit: 'px' },
      { path: 'layout.gap', label: 'Icon gap', type: 'range', min: 0, max: 24, step: 1, unit: 'px' },
    ],
  },
  {
    id: 'colors',
    label: 'Colors',
    fields: [
      { path: 'colors.background', label: 'Background', type: 'color', token: 'primary' },
      { path: 'colors.text', label: 'Label', type: 'color', token: 'surface' },
      { path: 'colors.border', label: 'Border', type: 'color', token: 'border' },
      { path: 'colors.hoverBackground', label: 'Hover background', type: 'color', token: 'hover' },
    ],
  },
  {
    id: 'borders',
    label: 'Borders & shape',
    fields: [
      { path: 'borders.width', label: 'Border width', type: 'range', min: 0, max: 4, step: 1, unit: 'px' },
      {
        path: 'borders.style',
        label: 'Border style',
        type: 'select',
        options: [
          { value: 'solid', label: 'Solid' },
          { value: 'dashed', label: 'Dashed' },
          { value: 'dotted', label: 'Dotted' },
        ],
      },
      {
        path: 'borders.shadow',
        label: 'Shadow',
        type: 'select',
        options: [
          { value: 'none', label: 'None' },
          { value: 'sm', label: 'Resting' },
          { value: 'md', label: 'Lifted' },
          { value: 'lg', label: 'Floating' },
        ],
      },
    ],
  },
  {
    id: 'typography',
    label: 'Typography',
    fields: [
      {
        path: 'typography.fontFamily',
        label: 'Font family',
        type: 'select',
        options: FONT_FAMILY_OPTIONS,
      },
      {
        path: 'typography.fontWeight',
        label: 'Weight',
        type: 'select',
        options: [
          { value: 400, label: 'Regular' },
          { value: 500, label: 'Medium' },
          { value: 600, label: 'Semibold' },
          { value: 700, label: 'Bold' },
          { value: 800, label: 'Extra bold' },
        ],
      },
      {
        path: 'typography.letterSpacing',
        label: 'Letter spacing',
        type: 'range',
        min: -0.04,
        max: 0.12,
        step: 0.005,
        unit: 'em',
      },
    ],
  },
  {
    id: 'icons',
    label: 'Icons',
    fields: [{ path: 'icons.size', label: 'Icon size', type: 'range', min: 12, max: 28, step: 1, unit: 'px' }],
  },
  {
    id: 'states',
    label: 'States',
    fields: [
      { path: 'content.loading', label: 'Loading', type: 'toggle', help: 'Shows a spinner and disables the button.' },
      { path: 'content.disabled', label: 'Disabled', type: 'toggle' },
    ],
  },
  {
    id: 'animation',
    label: 'Motion',
    fields: [
      { path: 'animation.duration', label: 'Duration', type: 'range', min: 0, max: 800, step: 10, unit: 'ms' },
      {
        path: 'animation.easing',
        label: 'Easing',
        type: 'select',
        options: [
          { value: 'ease', label: 'Ease' },
          { value: 'ease-out', label: 'Ease out' },
          { value: 'ease-in-out', label: 'Ease in-out' },
          { value: 'linear', label: 'Linear' },
        ],
      },
    ],
  },
];

export const buttonSectionById = Object.fromEntries(buttonSections.map((s) => [s.id, s]));
