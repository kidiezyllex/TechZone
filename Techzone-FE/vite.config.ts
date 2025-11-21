import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

import path from 'path'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,

    watch: {
      usePolling: true,
    },

    hmr: {
      protocol: 'ws',
      host: process.env.REPLIT_DOMAIN || 'localhost',
      port: 5000
    },

    allowedHosts: ['*.replit.dev', 'localhost', '127.0.0.1', '0.0.0.0', '*'],
    middlewareMode: false,
  },

  plugins: [
    react(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  base: '/',
})
