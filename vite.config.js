import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte({
    emitCss: false
  })],
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'MySvelteApp',
      fileName: 'bundle',
      formats: ['iife']
    },
    outDir: 'dist',
    cssCodeSplit: false, // Ngăn tách CSS thành file riêng
    rollupOptions: {
      output: {
        inlineDynamicImports: true // Nhúng tất cả import động vào một file
      }
    }
  }
});