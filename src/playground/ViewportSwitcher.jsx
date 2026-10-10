import { Monitor, Smartphone, Tablet } from 'lucide-react';
import styles from './controls.module.css';

const VIEWPORTS = [
  { id: 'desktop', label: 'Desktop', icon: Monitor },
  { id: 'tablet', label: 'Tablet, 768px', icon: Tablet },
  { id: 'mobile', label: 'Mobile, 390px', icon: Smartphone },
];

export default function ViewportSwitcher({ value, onChange }) {
  return (
    <div className={styles.segmented} role="group" aria-label="Preview viewport">
      {VIEWPORTS.map((viewport) => {
        const Icon = viewport.icon;
        return (
          <button
            key={viewport.id}
            type="button"
            aria-pressed={value === viewport.id}
            title={viewport.label}
            onClick={() => onChange(viewport.id)}
          >
            <Icon size={14} aria-hidden="true" />
            <span className="visually-hidden">{viewport.label}</span>
          </button>
        );
      })}
    </div>
  );
}
