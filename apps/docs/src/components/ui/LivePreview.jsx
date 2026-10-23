import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/*
  LivePreview — renders a component inside a shadow root.

  The generated component CSS targets semantic classes (.acc, .btn). Injecting
  that stylesheet into the document would leak into the studio chrome, so it is
  scoped to a shadow root instead: the preview is byte-for-byte the exported CSS,
  isolated from the host page. Theme custom properties (--color-*) inherit across
  the shadow boundary, so the preview still follows the live theme.
*/

const BASE = `
:host { display: block; }
*, *::before, *::after { box-sizing: border-box; }
`;

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
              <style>{css}</style>
              {children}
            </>,
            root,
          )
        : null}
    </div>
  );
}
