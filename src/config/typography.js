/* Shared font stacks. Both the Accordion and Button inspectors offer the same
   family choices, and both CSS generators resolve them to the same stacks. */

export const FONT_STACKS = {
  system: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  humanist: "'Segoe UI', Frutiger, 'Frutiger Linotype', 'DejaVu Sans', 'Trebuchet MS', sans-serif",
  geometric: "Futura, 'Century Gothic', 'Apple Gothic', Tahoma, Verdana, sans-serif",
  serif: "Georgia, 'Iowan Old Style', 'Times New Roman', serif",
  slab: "'Rockwell', 'Courier Bold', 'Roboto Slab', 'DejaVu Serif', 'Bitstream Charter', serif",
  mono: "ui-monospace, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
};

export const FONT_STACK_LABELS = {
  system: 'System UI',
  humanist: 'Humanist sans',
  geometric: 'Geometric sans',
  serif: 'Old-style serif',
  slab: 'Slab serif',
  mono: 'Monospace',
};

export const FONT_FAMILY_OPTIONS = Object.keys(FONT_STACKS).map((value) => ({
  value,
  label: FONT_STACK_LABELS[value],
}));
