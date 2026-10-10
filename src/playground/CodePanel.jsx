import { useMemo, useRef, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import { Check, ChevronDown, ChevronUp, Copy, FileCode2 } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard.js';
import styles from './CodePanel.module.css';

function highlight(code, language) {
  const safeCode = typeof code === 'string' ? code : '';
  try {
    const grammar = Prism.languages[language] || Prism.languages.markup;
    return Prism.highlight(safeCode, grammar, language);
  } catch {
    return safeCode.replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]);
  }
}

export default function CodePanel({ output, jsx, css, componentSource, themeCss, files }) {
  const tabs = useMemo(
    () => {
      const fileList = output?.files || [];
      return fileList.length
        ? fileList
            .filter((file) => !file.optional || file.id === output.primary)
            .map((file) => ({ id: file.id, label: file.label || file.filename || file.id, language: file.language || 'jsx' }))
        : [
            { id: 'usage', label: 'Usage', language: 'jsx' },
            { id: 'css', label: 'CSS', language: 'css' },
          ];
    },
    [output],
  );

  const defaults = { usage: jsx || '', css: css || '', component: componentSource || '', theme: themeCss || '' };
  const fileMap = new Map((output?.files || []).map((file) => [file.id, file]));
  const [tab, setTab] = useState(() => tabs[0]?.id || 'usage');
  const [height, setHeight] = useState(268);
  const [collapsed, setCollapsed] = useState(false);
  const { copy, status } = useClipboard();
  const dragRef = useRef(null);

  const active = tabs.find((entry) => entry.id === tab) || tabs[0];
  const activeFile = fileMap.get(active.id) || output?.files?.[0];
  const code = typeof activeFile?.code === 'string' ? activeFile.code : defaults[active.id] || '';
  const html = useMemo(() => highlight(code, active.language), [code, active.language]);

  const copyAll = () => {
    const snippets = (output?.files || []).filter((file) => !file.optional).map((file) => `// ${file.filename || file.label}\n${file.code}`);
    if (snippets.length) return copy(snippets.join('\n\n'));
    return copy([`// ${files?.jsx || 'usage.jsx'}`, jsx || '', '', `/* ${files?.css || 'styles.css'} */`, css || ''].join('\n'));
  };

  const startResize = (event) => {
    event.preventDefault();
    dragRef.current = { y: event.clientY, height };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onResize = (event) => {
    if (!dragRef.current) return;
    const delta = dragRef.current.y - event.clientY;
    setHeight(Math.min(560, Math.max(120, dragRef.current.height + delta)));
  };

  const endResize = () => {
    dragRef.current = null;
  };

  const nudge = (delta) => setHeight((value) => Math.min(560, Math.max(120, value + delta)));

  const fileName = activeFile?.filename || activeFile?.label || files?.css || files?.jsx || 'code';

  return (
    <section className={styles.panel} aria-label="Generated code">
      <div
        className={styles.resizer}
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize code panel"
        aria-valuenow={height}
        aria-valuemin={120}
        aria-valuemax={560}
        tabIndex={0}
        onPointerDown={startResize}
        onPointerMove={onResize}
        onPointerUp={endResize}
        onPointerCancel={endResize}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            nudge(24);
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            nudge(-24);
          }
        }}
      />

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
              onClick={() => {
                setTab(entry.id);
                setCollapsed(false);
              }}
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
          onClick={() => copy(code)}
        >
          {status === 'copied' ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
          {status === 'copied' ? 'Copied' : status === 'failed' ? 'Copy failed' : 'Copy'}
        </button>
        <button type="button" className={styles.action} onClick={copyAll} title="Copy the generated files together">
          Copy both
        </button>
        <button
          type="button"
          className={styles.action}
          onClick={() => copy(componentSource || defaults.component)}
          title="Copy the reusable component source"
        >
          <FileCode2 size={12} aria-hidden="true" />
          Copy component
        </button>
        <button
          type="button"
          className={styles.action}
          onClick={() => copy(themeCss || defaults.theme)}
          title="Copy the theme tokens this component uses"
        >
          Copy theme CSS
        </button>

        <button
          type="button"
          className={styles.action}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((value) => !value)}
        >
          {collapsed ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
          <span className="visually-hidden">{collapsed ? 'Expand code panel' : 'Collapse code panel'}</span>
        </button>
      </div>

      <div
        className={styles.codeWrap}
        id="code-view"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        style={{ height: collapsed ? 0 : height, overflow: collapsed ? 'hidden' : 'auto' }}
      >
        <pre className={styles.code}>
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      </div>
    </section>
  );
}
