import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, 'index.html'),
        animator: resolve(rootDir, 'animator.html'),
        physicsLab: resolve(rootDir, 'physics-lab.html'),
      },
    },
  },
});
