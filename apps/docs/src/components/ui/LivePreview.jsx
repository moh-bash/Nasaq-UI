import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import libraryCss from '../../../../../packages/react/src/styles/index.css?raw';

/*
  LivePreview — renders a component inside a shadow root.

  Generated component CSS imports the structural library stylesheet and only
  overrides --nq-* variables. The shadow root cannot fetch that import, so the
  same library source is injected first and the import line is stripped from the
  generated file. This keeps the preview byte-for-byte equivalent to the export
  while isolating it from the studio chrome.
*/

const BASE = `
:host { display: block; }
*, *::before, *::after { box-sizing: border-box; }
`;

const withoutImport = (css) =>
  typeof css === 'string'
    ? css.replace(/@import\s+(?:url\()?['"]?nasaq\/styles\.css['"]?\)?;?/g, '')
    : '';

export default function LivePreview({ css, className, style, children, background }) {
  const hostRef = useRef(null);
  const [root, setRoot] = useState(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
    setRoot(shadow);
  }, []);

  return (
    <div ref={hostRef} className={className} data-preview-bg={background} data-live-preview="" style={style}>
      {root
        ? createPortal(
            <>
              <style>{BASE}</style>
              <style>{libraryCss}</style>
              <style>{withoutImport(css)}</style>
              {children}
            </>,
            root,
          )
        : null}
    </div>
  );
}
