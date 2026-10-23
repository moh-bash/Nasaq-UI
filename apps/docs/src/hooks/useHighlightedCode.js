import { useEffect, useState } from 'react';

/*
  Prism is the largest single dependency in the docs bundle, so it is loaded
  on demand and cached for the session. The first paint shows escaped plain
  text; the highlighted markup replaces it once the grammar is ready.
*/

let prismPromise = null;

function loadPrism() {
  if (!prismPromise) {
    prismPromise = Promise.all([
      import('prismjs'),
      import('prismjs/components/prism-jsx'),
      import('prismjs/components/prism-bash'),
      import('prismjs/components/prism-css'),
    ]).then(([prism]) => prism.default || prism);
  }
  return prismPromise;
}

function escapeHtml(code) {
  return code.replace(/[&<>]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[char]);
}

export async function highlight(code, language) {
  const safeCode = typeof code === 'string' ? code : '';
  try {
    const Prism = await loadPrism();
    const grammar = Prism.languages[language] || Prism.languages.markup;
    return Prism.highlight(safeCode, grammar, language);
  } catch {
    return escapeHtml(safeCode);
  }
}

export function useHighlightedCode(code, language) {
  const safeCode = typeof code === 'string' ? code : '';
  const [html, setHtml] = useState(() => escapeHtml(safeCode));

  useEffect(() => {
    let active = true;
    highlight(safeCode, language).then((next) => {
      if (active) setHtml(next);
    });
    return () => {
      active = false;
    };
  }, [language, safeCode]);

  return html;
}
