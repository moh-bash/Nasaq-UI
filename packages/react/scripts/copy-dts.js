import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const source = resolve('dist/index.d.ts');
const target = resolve('dist/index.d.cts');

if (!existsSync(source)) {
  console.error('Missing dist/index.d.ts — run vite build first.');
  process.exit(1);
}

copyFileSync(source, target);
