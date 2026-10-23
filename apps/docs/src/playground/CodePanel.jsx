import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, FileCode2 } from 'lucide-react';
import { toast } from 'sonner';
import { useHighlightedCode } from '../hooks/useHighlightedCode.js';
import { useClipboard } from '../hooks/useClipboard.js';
import styles from './CodePanel.module.css';

/* Generated files for the current component. The panel fills its resizable
   slot; height is owned by the preview/code split, not this component. */
export default function CodePanel({ output, jsx, css, componentSource, themeCss, files }) {
  const tabs = useMemo(() => {
    const fileList = output?.files || [];
    return fileList.length
      ? fileList
          .filter((file) => !file.optional || file.id === output.primary)
          .map((file) => ({
            id: file.id,
            label: file.label || file.filename || file.id,
            language: file.language || 'jsx',
          }))
      : [
          { id: 'usage', label: 'Usage', language: 'jsx' },
          { id: 'css', label: 'CSS', language: 'css' },
        ];
  }, [output]);

  const defaults = {
    usage: jsx || '',
    css: css || '',
    component: componentSource || '',
    theme: themeCss || '',
  };
  const fileMap = new Map((output?.files || []).map((file) => [file.id, file]));
  const [tab, setTab] = useState(() => tabs[0]?.id || 'usage');
  const { copy, status } = useClipboard();

  const active = tabs.find((entry) => entry.id === tab) || tabs[0];
  const activeFile = fileMap.get(active.id) || output?.files?.[0];
  const code = typeof activeFile?.code === 'string' ? activeFile.code : defaults[active.id] || '';
  const html = useHighlightedCode(code, active.language);

  const copyWithToast = async (text, label) => {
    const ok = await copy(text);
    if (ok) toast.success(label);
    else toast.error('Copy failed — check clipboard permissions');
  };

  const copyAll = () => {
    const snippets = (output?.files || [])
      .filter((file) => !file.optional)
      .map((file) => `// ${file.filename || file.label}\n${file.code}`);
    if (snippets.length) return copyWithToast(snippets.join('\n\n'), 'Copied every generated file');
    return copyWithToast(
      [
        `// ${files?.jsx || 'usage.jsx'}`,
        jsx || '',
        '',
        `/* ${files?.css || 'styles.css'} */`,
        css || '',
      ].join('\n'),
      'Copied every generated file',
    );
  };

  useEffect(() => {
    const onCopyPrimary = async () => {
      const ok = await copy(code);
      if (ok) toast.success(`Copied ${active.label}`);
      else toast.error('Copy failed — check clipboard permissions');
    };
    window.addEventListener('nq:copy-primary', onCopyPrimary);
    return () => window.removeEventListener('nq:copy-primary', onCopyPrimary);
  }, [active.label, code, copy]);

  const fileName = activeFile?.filename || activeFile?.label || files?.css || files?.jsx || 'code';

  return (
    <section className={styles.panel} aria-label="Generated code">
      <div className={styles.bar}>
        <div className={styles.tabs} role="tablist" aria-label="Code files">
          {tabs.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              className={styles.tab}
              aria-selected={tab === entry.id}
              aria-controls="code-view"
              id={`tab-${entry.id}`}
              onClick={() => setTab(entry.id)}
            >
              {entry.label}
            </button>
          ))}
        </div>
        <span className={styles.fileName}>{fileName}</span>

        <span className={styles.spacer} />

        <button
          type="button"
          className={styles.action}
          data-tone="accent"
          onClick={() => copyWithToast(code, `Copied ${active.label}`)}
          aria-label={`Copy ${active.label}`}
          title={`Copy ${active.label}`}
        >
          {status === 'copied' ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
          {status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Copy'}
        </button>
        <button
          type="button"
          className={styles.action}
          onClick={copyAll}
          title="Copy all generated files"
          aria-label="Copy all generated files"
        >
          Copy all
        </button>
        <button
          type="button"
          className={styles.action}
          onClick={() => copyWithToast(componentSource || defaults.component, 'Copied component source')}
          title="Copy the component source"
          aria-label="Copy the component source"
        >
          <FileCode2 size={12} aria-hidden="true" />
          <span className={styles.actionText}>Component</span>
        </button>
        <button
          type="button"
          className={styles.action}
          onClick={() => copyWithToast(themeCss || defaults.theme, 'Copied theme CSS')}
          title="Copy the theme CSS this component uses"
          aria-label="Copy the theme CSS this component uses"
        >
          <span className={styles.actionText}>Theme CSS</span>
        </button>
      </div>

      <div
        className={styles.codeWrap}
        id="code-view"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
      >
        <pre className={styles.code}>
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>
    </section>
  );
}
