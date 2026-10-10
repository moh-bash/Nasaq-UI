/*
  Canonical icon geometry for the Button. The React icon component, the CSS-mode
  usage generator and the Tailwind component generator all read this one table,
  so the preview and the copied code can never disagree about an icon.
*/

export const BUTTON_ICON_PATHS = {
  plus: 'M12 5v14M5 12h14',
  'arrow-right': 'M5 12h14M13 6l6 6-6 6',
  check: 'M20 6 9 17l-5-5',
  download: 'M12 3v12m0 0-4-4m4 4 4-4M4 21h16',
  'chevron-down': 'M6 9l6 6 6-6',
};

export const BUTTON_ICON_OPTIONS = [
  { value: 'none', label: 'None' },
  ...Object.keys(BUTTON_ICON_PATHS).map((value) => ({
    value,
    label: value
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  })),
];

export function hasIcon(name) {
  return Boolean(name) && name !== 'none' && Boolean(BUTTON_ICON_PATHS[name]);
}

/**
 * JSX source for one icon. Used by the generators (never at runtime).
 * `attrs` is a raw attribute string appended to the <svg> tag, e.g. a class or
 * explicit width/height for the self-contained Tailwind output.
 */
export function iconSvgSource(name, attrs = '') {
  const path = BUTTON_ICON_PATHS[name];
  if (!path) return '';
  const extra = attrs ? ` ${attrs}` : '';
  return (
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" ` +
    `strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"${extra}>` +
    `<path d="${path}" /></svg>`
  );
}
