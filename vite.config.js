// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // অথবা অন্য কিছু চাইলে, যেমন: 'build'
  },
});
