import { BUTTON_ICON_PATHS } from '../../../config/buttonIcons.js';

/* Renders one of the canonical button icons. Geometry comes from
   config/buttonIcons.js so the preview, the CSS generator and the Tailwind
   generator can never disagree. */
export default function ButtonIcon({ name, size = null }) {
  const path = BUTTON_ICON_PATHS[name];
  if (!path) return null;
  const dims = size ? { width: size, height: size } : { width: '100%', height: '100%' };
  return (
    <svg
      viewBox="0 0 24 24"
      focusable="false"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...dims}
    >
      <path d={path} />
    </svg>
  );
}
