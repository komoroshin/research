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
    // Чанк с базой кейсов большой по своей природе: это содержимое библиотеки,
    // а не разросшийся код. Порог поднят, чтобы предупреждение не заглушало
    // настоящие регрессии размера в коде приложения.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        // База кейсов весит больше самого приложения и меняется гораздо чаще.
        // Отдельные чанки для данных и для React дают пользователю кэш,
        // который не сбрасывается при каждом пополнении библиотеки.
        manualChunks(id) {
          if (id.includes('/data/cases.json')) return 'cases-data';
          if (id.includes('/data/taxonomy.json')) return 'taxonomy';
          if (id.includes('node_modules')) return 'vendor';
          return undefined;
        },
      },
    },
  },
});
