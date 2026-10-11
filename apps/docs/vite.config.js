import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const root = dirname(fileURLToPath(import.meta.url));

// Resolve the released package to its source during development and tests so
// the docs always exercise the real implementation without a pre-build.
const nasaq = resolve(root, '../../packages/react/src');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: 'nasaq/styles.css', replacement: resolve(nasaq, 'styles/index.css') },
      { find: 'nasaq', replacement: resolve(nasaq, 'index.js') },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    include: ['src/**/*.test.{js,jsx}'],
    css: false,
  },
})