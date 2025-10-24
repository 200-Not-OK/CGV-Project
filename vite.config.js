import { defineConfig } from 'vite'

export default defineConfig({
  base: './',  //ensures all links and assets are relative paths
  build: {
    outDir: 'dist', //default output folder
  }
})
