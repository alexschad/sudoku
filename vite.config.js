// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic', // <- important for React 16
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
});
