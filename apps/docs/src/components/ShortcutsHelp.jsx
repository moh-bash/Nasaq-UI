import { useEffect, useRef } from 'react';
import { useShellStore } from '../stores/shellStore.js';
import styles from './ShortcutsHelp.module.css';

const SHORTCUTS = [
  ['⌘ / Ctrl + K', 'Open the command palette'],
  ['/', 'Search components'],
  ['[', 'Collapse or expand the component sidebar'],
  [']', 'Show or hide the properties inspector'],
  ['⌘ / Ctrl + Shift + C', 'Copy the current generated file'],
  ['?', 'Open this shortcut list'],
  ['Esc', 'Close dialogs, menus, and the mobile inspector'],
];

export default function ShortcutsHelp() {
  const open = useShellStore((state) => state.helpOpen);
  const setOpen = useShellStore((state) => state.setHelpOpen);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="shortcuts-title"
      onClose={() => setOpen(false)}
      onClick={(event) => {
        if (event.target === dialogRef.current) setOpen(false);
      }}
    >
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 id="shortcuts-title" className={styles.title}>
            Keyboard shortcuts
          </h2>
          <button
            type="button"
            className={styles.close}
            onClick={() => setOpen(false)}
            aria-label="Close keyboard shortcuts"
          >
            ×
          </button>
        </div>
        <dl className={styles.list}>
          {SHORTCUTS.map(([keys, description]) => (
            <div key={keys} className={styles.row}>
              <dt>
                <kbd>{keys}</kbd>
              </dt>
              <dd>{description}</dd>
            </div>
          ))}
        </dl>
        <p className={styles.note}>
          Shortcuts are ignored while you are typing in a field, except ⌘/Ctrl + K.
        </p>
      </div>
    </dialog>
  );
}
