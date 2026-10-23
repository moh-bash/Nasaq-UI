import { useState } from 'react';
import { Check, Copy, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { STYLING_MODES, STYLING_MODE_LABELS } from '../generators/index.js';
import { useClipboard } from '../hooks/useClipboard.js';
import styles from './ExportToolbar.module.css';

function bundle(output) {
  return output.files
    .filter((file) => !file.optional)
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

/* Styling-mode selector plus copy / share / download of the generator output. */
export default function ExportToolbar({ output, mode, onMode, onShare }) {
  const { copy, status } = useClipboard();
  const [downloaded, setDownloaded] = useState(false);

  const copyAll = async () => {
    const ok = await copy(bundle(output));
    if (ok) toast.success('Copied every generated file');
    else toast.error('Copy failed — check clipboard permissions');
  };

  const downloadAll = () => {
    output.files.filter((file) => !file.optional).forEach((file) => download(file.filename, file.code));
    setDownloaded(true);
    toast.success(`Downloaded ${output.files.filter((file) => !file.optional).length} files`);
    setTimeout(() => setDownloaded(false), 1600);
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

      <button
        type="button"
        className={styles.action}
        onClick={copyAll}
        aria-label="Copy all generated code"
        title="Copy all generated code"
      >
        {status === 'copied' ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
        <span className={styles.label}>{status === 'copied' ? 'Copied' : 'Copy'}</span>
      </button>

      <button
        type="button"
        className={styles.action}
        onClick={onShare}
        aria-label="Copy a link to this exact configuration"
        title="Copy a link to this exact configuration"
      >
        <Share2 size={12} aria-hidden="true" />
        <span className={styles.label}>Share</span>
      </button>

      <button
        type="button"
        className={styles.action}
        onClick={downloadAll}
        aria-label="Download generated files"
        title="Download generated files"
      >
        {downloaded ? <Check size={12} aria-hidden="true" /> : <Download size={12} aria-hidden="true" />}
        <span className={styles.label}>{downloaded ? 'Saved' : 'Download'}</span>
      </button>
    </div>
  );
}
