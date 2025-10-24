import { defineConfig } from 'vite'

export default defineConfig({
  base: './',  //ensures all links and assets are relative paths
  build: {
    outDir: 'dist', //default output folder
  },
  server: {
    port: 5173, //optional: for local dev
    open: true,
  },
})
