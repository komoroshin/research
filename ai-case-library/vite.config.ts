import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — сборка работает из любой подпапки статического хостинга
// (GitHub Pages, Cloudflare Pages, локальный file server).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1200,
  },
});
