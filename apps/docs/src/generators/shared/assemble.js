/*
  File-list builders shared by the registry generator functions.

  Both modes return the same contract the generator facade (and therefore the
  CodePanel) consumes:

      { files: [{ id, label, language, filename, code, optional? }], primary }
*/

export function buildCssOutput({ usage, css, componentSource, componentFileName, usageFileName, cssFileName, themeCss }) {
  return {
    files: [
      { id: 'usage', label: 'Usage', language: 'jsx', filename: usageFileName, code: usage },
      { id: 'css', label: 'CSS', language: 'css', filename: cssFileName, code: css },
      {
        id: 'component',
        label: componentFileName,
        language: 'jsx',
        filename: componentFileName,
        code: componentSource,
        optional: true,
      },
      { id: 'theme', label: 'theme.css', language: 'css', filename: 'theme.css', code: themeCss, optional: true },
    ],
    primary: 'css',
  };
}

export function buildTailwindOutput({ component, themeCss, componentFileName }) {
  return {
    files: [
      { id: 'component', label: componentFileName, language: 'jsx', filename: componentFileName, code: component },
      { id: 'theme', label: 'theme.css', language: 'css', filename: 'theme.css', code: themeCss },
    ],
    primary: 'component',
  };
}
