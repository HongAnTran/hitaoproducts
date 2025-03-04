import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: "src/main.js",
      name: "MySvelteWidget",
      fileName: "hitao",
      formats: ["iife"],
    },
    rollupOptions: {
      output: {
        assetFileNames: "hitao.css", 
      },
    },
  },
});
