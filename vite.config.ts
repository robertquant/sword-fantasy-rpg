import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
  resolve: {
    alias: {
      '@scenes': '/src/scenes',
      '@systems': '/src/systems',
      '@data': '/src/data',
    },
  },
});
