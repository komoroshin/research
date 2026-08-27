import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' — приложение работает из любой подпапки статического хостинга (/research/catalog/).
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
          if (id.includes('/generated/client-cases.json')) return 'cases-data';
          if (id.includes('node_modules')) return 'vendor';
          return undefined;
        },
      },
    },
  },
});
