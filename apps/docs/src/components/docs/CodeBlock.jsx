import { Check, Copy } from 'lucide-react';
import { useHighlightedCode } from '../../hooks/useHighlightedCode.js';
import { useClipboard } from '../../hooks/useClipboard.js';
import styles from './CodeBlock.module.css';

function lineCount(code) {
  return Math.max(1, String(code).split('\n').length);
}

export default function CodeBlock({
  code = '',
  language = 'jsx',
  filename = '',
  showLineNumbers = false,
}) {
  const safeCode = typeof code === 'string' ? code : '';
  const html = useHighlightedCode(safeCode, language);
  const { copy, status } = useClipboard();
  const lines = lineCount(safeCode);

  return (
    <figure className={styles.block}>
      <figcaption className={styles.bar}>
        <span className={styles.filename}>{filename || language}</span>
        <button
          type="button"
          className={styles.copy}
          onClick={() => copy(safeCode)}
          aria-label={`Copy ${filename || language} code to the clipboard`}
        >
          {status === 'copied' ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
          {status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Copy'}
        </button>
      </figcaption>
      <pre className={styles.pre} tabIndex={0} aria-label={`${filename || language} code`}>
        {showLineNumbers ? (
          <span className={styles.gutter} aria-hidden="true">
            {Array.from({ length: lines }, (_, index) => `${index + 1}\n`).join('')}
          </span>
        ) : null}
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  );
}
