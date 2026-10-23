import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('nq prefix regression', () => {
  it('all selectors in styles/index.css use nq- prefix except :root and [data-theme*]', () => {
    const css = fs.readFileSync(path.resolve(__dirname, '../src/styles/index.css'), 'utf8');
    const lines = css.split(/\r?\n/);
    const bad = [];
    for (const line of lines) {
      if (line.includes(':root')) continue;
      if (line.includes('[data-theme')) continue;
      if (line.trim().startsWith('@')) continue;
      if (line.trim().startsWith('/*')) continue;
      if (line.trim().startsWith('*')) continue;
      if (line.includes("import 'nasaq/styles.css'")) continue;
      if (line.match(/\.[a-zA-Z][a-zA-Z0-9_-]*/)) {
        const matches = line.matchAll(/\.[a-zA-Z][a-zA-Z0-9_-]*/g);
        for (const m of matches) {
          const cls = m[0];
          if (cls.startsWith('.nq-')) continue;
          if (cls === '.btn-spin' || cls.startsWith('.btn-spin')) continue;
          bad.push(line.trim());
        }
      }
    }
    expect(bad).toEqual([]);
  });
});
