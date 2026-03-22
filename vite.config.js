import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// vite.config.js
export default defineConfig({
   plugins: [vue()],
  server: {
    host: 'localhost',  // fuerza siempre localhost, nunca 127.0.0.1
    port: 5173
  }
})