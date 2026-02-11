import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@hub-central/ui-design-system': path.resolve(__dirname, '../../packages/ui-design-system/src/index.tsx'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/v1': { target: 'http://localhost:3001', changeOrigin: true },
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
});
