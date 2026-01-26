import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: './', 
  build: {
    outDir: '../dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})
