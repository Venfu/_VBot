import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: rootDir,
  plugins: [react()],
  publicDir: path.join(rootDir, 'public'),
  build: {
    outDir: path.join(rootDir, 'dist', 'frontend'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.join(rootDir, 'public', 'index.html'),
    },
  },
  server: {
    port: 3000,
  },
});
