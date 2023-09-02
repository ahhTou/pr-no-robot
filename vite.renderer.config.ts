import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config
export default defineConfig({
  root: path.resolve(__dirname, './src/renderer'),
  plugins: [react()],
  resolve: {
    alias: {
      '@r': path.join(__dirname, './src/renderer'),
    },
  },
  build: {
    outDir: path.join(__dirname, './dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, './src/renderer/index.html'),
        success: path.resolve(__dirname, './src/renderer/success.html'),
      },
    },
  },
});
