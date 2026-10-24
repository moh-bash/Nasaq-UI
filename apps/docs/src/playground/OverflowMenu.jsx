import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import styles from './OverflowMenu.module.css';

/*
  Small action menu for secondary toolbar options. Buttons only, so the
  keyboard model is simple: open focuses the first item, Escape closes and
  returns focus to the trigger, Tab leaves and closes.
*/
export default function OverflowMenu({ label = 'More actions', children }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = [...(menuRef.current?.querySelectorAll('button') || [])];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    const frame = requestAnimationFrame(() => {
      menuRef.current?.querySelector('button')?.focus();
    });
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      cancelAnimationFrame(frame);
    };
  }, [open]);

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <button
        type="button"
        ref={triggerRef}
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        title={label}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal size={15} aria-hidden="true" />
      </button>
      {open ? (
        <div
          className={styles.menu}
          role="menu"
          aria-label={label}
          ref={menuRef}
          onClick={(event) => {
            if (event.target.closest('button')) setOpen(false);
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
