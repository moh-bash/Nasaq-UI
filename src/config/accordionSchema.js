/*
  Property schema for the Accordion inspector.
  This file describes controls only — it never stores values.
  The inspector, the preview, the generators and the tests all read the same
  paths, so a control can only exist if the generators support it.

  Field types: text | textarea | toggle | select | range | color | items
*/

import { FONT_STACKS, FONT_STACK_LABELS } from './typography.js';

export { FONT_STACKS, FONT_STACK_LABELS };

export const accordionSections = [
  {
    id: 'content',
    label: 'Content',
    fields: [
      { path: 'content.title', label: 'Section title', type: 'text', placeholder: 'Section title' },
      {
        path: 'content.showDescription',
        label: 'Show description',
        type: 'toggle',
        help: 'Hide the descriptive line under the title.',
      },
      {
        path: 'content.description',
        label: 'Description',
        type: 'textarea',
        rows: 3,
        dependsOn: 'content.showDescription',
      },
      {
        path: 'content.numbering',
        label: 'Number the questions',
        type: 'toggle',
        help: 'Adds a two-digit index before each question.',
      },
      { path: 'content.items', label: 'Questions', type: 'items' },
      {
        path: 'content.initialOpenId',
        label: 'Open on load',
        type: 'select',
        dynamicOptions: 'items',
        help: 'Which item is expanded the first time the component mounts.',
      },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    fields: [
      {
        path: 'layout.widthPercent',
        label: 'Width',
        type: 'range',
        min: 25,
        max: 100,
        step: 1,
        unit: '%',
      },
      {
        path: 'layout.maxWidth',
        label: 'Max width',
        type: 'range',
        min: 320,
        max: 1400,
        step: 10,
        unit: 'px',
      },
      {
        path: 'layout.align',
        label: 'Horizontal alignment',
        type: 'select',
        options: [
          { value: 'start', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'end', label: 'Right' },
        ],
      },
      {
        path: 'layout.textAlign',
        label: 'Text alignment',
        type: 'select',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Center' },
          { value: 'right', label: 'Right' },
        ],
      },
      {
        path: 'layout.sectionGap',
        label: 'Title to list',
        type: 'range',
        min: 0,
        max: 64,
        step: 1,
        unit: 'px',
      },
      {
        path: 'layout.itemGap',
        label: 'Space between items',
        type: 'range',
        min: 0,
        max: 48,
        step: 1,
        unit: 'px',
      },
      {
        path: 'layout.questionPaddingY',
        label: 'Question padding, vertical',
        type: 'range',
        min: 0,
        max: 48,
        step: 1,
        unit: 'px',
      },
      {
        path: 'layout.questionPaddingX',
        label: 'Question padding, horizontal',
        type: 'range',
        min: 0,
        max: 48,
        step: 1,
        unit: 'px',
      },
      {
        path: 'layout.answerPadding',
        label: 'Answer padding',
        type: 'range',
        min: 0,
        max: 48,
        step: 1,
        unit: 'px',
      },
      {
        path: 'layout.contentGap',
        label: 'Question to answer',
        type: 'range',
        min: 0,
        max: 40,
        step: 1,
        unit: 'px',
      },
      { path: 'layout.dividers', label: 'Dividers between items', type: 'toggle' },
    ],
  },
  {
    id: 'colors',
    label: 'Colors',
    fields: [
      { path: 'colors.background', label: 'Component background', type: 'color', token: 'surface' },
      { path: 'colors.questionBackground', label: 'Question row', type: 'color', token: 'surface' },
      { path: 'colors.answerBackground', label: 'Answer panel', type: 'color', token: 'background' },
      { path: 'colors.questionText', label: 'Question text', type: 'color', token: 'text' },
      { path: 'colors.answerText', label: 'Answer text', type: 'color', token: 'text-muted' },
      { path: 'colors.headingText', label: 'Section title', type: 'color', token: 'text' },
      { path: 'colors.borderColor', label: 'Border', type: 'color', token: 'border' },
      { path: 'colors.dividerColor', label: 'Divider', type: 'color', token: 'border' },
      { path: 'colors.iconColor', label: 'Icon', type: 'color', token: 'primary' },
      { path: 'colors.hoverBackground', label: 'Row hover', type: 'color', token: 'hover' },
      { path: 'colors.openBackground', label: 'Open row', type: 'color', token: 'active' },
      { path: 'colors.focusColor', label: 'Focus ring', type: 'color', token: 'focus' },
    ],
  },
  {
    id: 'borders',
    label: 'Borders & shape',
    fields: [
      { path: 'borders.enabled', label: 'Outer border', type: 'toggle' },
      { path: 'borders.width', label: 'Border width', type: 'range', min: 0, max: 8, step: 1, unit: 'px' },
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
      { path: 'colors.borderColor', label: 'Border color', type: 'color', token: 'border' },
      { path: 'borders.radius', label: 'Component radius', type: 'range', min: 0, max: 40, step: 1, unit: 'px' },
      { path: 'borders.itemRadius', label: 'Item radius', type: 'range', min: 0, max: 40, step: 1, unit: 'px' },
      { path: 'borders.questionRadius', label: 'Question row radius', type: 'range', min: 0, max: 40, step: 1, unit: 'px' },
      {
        path: 'borders.answerBorder',
        label: 'Answer edge',
        type: 'select',
        options: [
          { value: 'none', label: 'None' },
          { value: 'top', label: 'Top rule' },
          { value: 'separate', label: 'Outlined answer' },
        ],
      },
      {
        path: 'borders.dividerThickness',
        label: 'Divider thickness',
        type: 'range',
        min: 1,
        max: 8,
        step: 1,
        unit: 'px',
        dependsOn: 'layout.dividers',
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
        options: Object.keys(FONT_STACKS).map((value) => ({
          value,
          label: FONT_STACK_LABELS[value],
        })),
      },
      { path: 'typography.headingSize', label: 'Title size', type: 'range', min: 14, max: 48, step: 1, unit: 'px' },
      { path: 'typography.questionSize', label: 'Question size', type: 'range', min: 12, max: 28, step: 1, unit: 'px' },
      { path: 'typography.answerSize', label: 'Answer size', type: 'range', min: 11, max: 24, step: 1, unit: 'px' },
      {
        path: 'typography.fontWeight',
        label: 'Question weight',
        type: 'select',
        options: [
          { value: 400, label: 'Regular' },
          { value: 500, label: 'Medium' },
          { value: 600, label: 'Semibold' },
          { value: 700, label: 'Bold' },
        ],
      },
      { path: 'typography.lineHeight', label: 'Line height', type: 'range', min: 1, max: 2.2, step: 0.05 },
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
    fields: [
      {
        path: 'icons.style',
        label: 'Indicator',
        type: 'select',
        options: [
          { value: 'chevron', label: 'Chevron' },
          { value: 'plus', label: 'Plus / minus' },
          { value: 'arrow', label: 'Arrow' },
          { value: 'number', label: 'Numbered' },
          { value: 'none', label: 'No icon' },
        ],
        help: 'Numbered indicators turn question numbering on.',
      },
      { path: 'icons.size', label: 'Icon size', type: 'range', min: 12, max: 32, step: 1, unit: 'px' },
      { path: 'colors.iconColor', label: 'Icon color', type: 'color', token: 'primary' },
      {
        path: 'icons.position',
        label: 'Position',
        type: 'select',
        options: [
          { value: 'start', label: 'Before the question' },
          { value: 'end', label: 'After the question' },
        ],
      },
      {
        path: 'icons.rotateWhenOpen',
        label: 'Rotate when open',
        type: 'toggle',
        help: 'Chevrons and arrows turn to face the open item.',
        dependsOnValue: { path: 'icons.style', values: ['chevron', 'arrow'] },
      },
    ],
  },
  {
    id: 'animation',
    label: 'Motion',
    fields: [
      { path: 'animation.enabled', label: 'Animate expansion', type: 'toggle' },
      { path: 'animation.duration', label: 'Duration', type: 'range', min: 0, max: 1200, step: 10, unit: 'ms', dependsOn: 'animation.enabled' },
      {
        path: 'animation.easing',
        label: 'Easing',
        type: 'select',
        options: [
          { value: 'cubic-bezier(0.2, 0, 0, 1)', label: 'Out ease (press)' },
          { value: 'ease-out', label: 'Ease out' },
          { value: 'ease', label: 'Ease' },
          { value: 'ease-in-out', label: 'Ease in-out' },
          { value: 'linear', label: 'Linear' },
        ],
        dependsOn: 'animation.enabled',
      },
    ],
  },
  {
    id: 'behavior',
    label: 'Behavior',
    fields: [
      {
        path: 'behavior.allowMultiple',
        label: 'Keep several open',
        type: 'toggle',
        help: 'Off = one open item at a time.',
      },
      {
        path: 'behavior.allowCollapse',
        label: 'Allow closing every item',
        type: 'toggle',
        help: 'Off keeps at least one answer visible.',
      },
      { path: 'behavior.hoverEffect', label: 'Highlight on hover', type: 'toggle' },
      {
        path: 'behavior.wholeRow',
        label: 'Whole row is clickable',
        type: 'toggle',
        help: 'Off: only the question text and icon respond.',
      },
    ],
  },
];

export const sectionById = Object.fromEntries(accordionSections.map((s) => [s.id, s]));
