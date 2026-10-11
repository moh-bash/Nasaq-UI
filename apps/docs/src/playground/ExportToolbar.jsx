import { useEffect, useState } from 'react';
import { Check, Copy, Download } from 'lucide-react';
import { STYLING_MODES, STYLING_MODE_LABELS } from '../generators/index.js';
import { useClipboard } from '../hooks/useClipboard.js';
import styles from './ExportToolbar.module.css';

function bundle(output) {
  return output.files
    .map((file) => `${file.language === 'css' ? '/*' : '//'} ${file.filename}\n${file.code}`)
    .join('\n\n');
}

function download(filename, code) {
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/* Styling-mode selector plus copy / download of the whole generator output. */
export default function ExportToolbar({ output, mode, onMode }) {
  const { copy, status } = useClipboard();
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (!downloaded) return undefined;
    const timer = setTimeout(() => setDownloaded(false), 1600);
    return () => clearTimeout(timer);
  }, [downloaded]);

  const downloadAll = () => {
    output.files.forEach((file) => download(file.filename, file.code));
    setDownloaded(true);
  };

  return (
    <div className={styles.toolbar} aria-label="Export options">
      <div className={styles.mode} role="group" aria-label="Styling mode">
        {STYLING_MODES.map((entry) => (
          <button
            key={entry}
            type="button"
            aria-pressed={mode === entry}
            onClick={() => onMode(entry)}
          >
            {STYLING_MODE_LABELS[entry]}
          </button>
        ))}
      </div>

      <button type="button" className={styles.action} onClick={() => copy(bundle(output))}>
        {status === 'copied' ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
        {status === 'copied' ? 'Copied' : 'Copy all'}
      </button>

      <button type="button" className={styles.action} onClick={downloadAll}>
        {downloaded ? <Check size={12} aria-hidden="true" /> : <Download size={12} aria-hidden="true" />}
        {downloaded ? 'Saved' : 'Download'}
      </button>
    </div>
  );
}
