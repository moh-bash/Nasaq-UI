import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    dts({
      include: ['src'],
      bundleTypes: true,
      tsconfigPath: resolve(root, 'tsconfig.json'),
    }),
  ],
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    lib: {
      entry: resolve(root, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'nasaq.js' : 'nasaq.cjs'),
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    sourcemap: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.{js,jsx,ts,tsx}'],
  },
});
