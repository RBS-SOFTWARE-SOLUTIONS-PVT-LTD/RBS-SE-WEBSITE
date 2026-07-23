import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures relative paths for GitHub Pages static hosting
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 3000,
    open: true
  }
});
