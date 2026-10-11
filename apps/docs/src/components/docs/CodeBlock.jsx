import { useMemo } from 'react';
import { Check, Copy } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import { useClipboard } from '../../hooks/useClipboard.js';
import styles from './CodeBlock.module.css';

function highlight(code, language) {
  try {
    const grammar = Prism.languages[language] || Prism.languages.markup;
    return Prism.highlight(code, grammar, language);
  } catch {
    return code.replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]);
  }
}

export default function CodeBlock({ code = '', language = 'jsx', filename = '' }) {
  const { copy, status } = useClipboard();
  const safeCode = typeof code === 'string' ? code : '';
  const html = useMemo(() => highlight(safeCode, language), [safeCode, language]);

  return (
    <figure className={styles.block}>
      <figcaption className={styles.bar}>
        <span className={styles.filename}>{filename}</span>
        <button
          type="button"
          className={styles.copy}
          onClick={() => copy(safeCode)}
          aria-label="Copy code to the clipboard"
        >
          {status === 'copied' ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
          {status === 'copied' ? 'Copied' : 'Copy'}
        </button>
      </figcaption>
      <pre className={styles.pre}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  );
}