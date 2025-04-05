import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // 相対パスを使用
  build: {
    outDir: 'build'
  },
  server: {
    port: 5173,
    open: true,
    hmr: { overlay: false }
  }
});
