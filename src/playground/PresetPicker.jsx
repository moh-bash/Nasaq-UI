import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, RotateCcw } from 'lucide-react';
import styles from './PresetPicker.module.css';

export default function PresetPicker({ presets, activeId, modified, onSelect, onRestore }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const active = presets.find((preset) => preset.id === activeId);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((state) => !state)}
      >
        <span className={styles.triggerText}>
          <span className={styles.triggerLabel}>{active ? active.name : 'Custom'}</span>
          {modified ? <span className={styles.modified}>edited</span> : null}
        </span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {modified && active ? (
        <button
          type="button"
          className={styles.restore}
          onClick={onRestore}
          title="Reapply every value from this preset"
        >
          <RotateCcw size={12} aria-hidden="true" />
          Restore
        </button>
      ) : null}

      {open ? (
        <ul className={styles.menu} role="listbox" aria-label="Presets">
          {presets.map((preset) => (
            <li key={preset.id}>
              <button
                type="button"
                role="option"
                aria-selected={preset.id === activeId}
                className={styles.option}
                onClick={() => {
                  onSelect(preset.id);
                  setOpen(false);
                }}
              >
                <span className={styles.optionHead}>
                  <span className={styles.optionName}>{preset.name}</span>
                  {preset.id === activeId ? <Check size={13} aria-hidden="true" /> : null}
                </span>
                <span className={styles.optionDesc}>{preset.description}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
