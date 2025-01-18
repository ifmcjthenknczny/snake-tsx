import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
      target: 'esnext',
    },
    plugins: [react(), eslint()],
    esbuild: {
        target: 'esnext'
    }
  };
});