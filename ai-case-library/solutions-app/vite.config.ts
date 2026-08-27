import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' — приложение работает из любой подпапки статического хостинга (/research/solutions/).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/data/offers.json')) return 'offers-data';
          if (id.includes('node_modules')) return 'vendor';
          return undefined;
        },
      },
    },
  },
});
