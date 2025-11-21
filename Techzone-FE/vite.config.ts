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
    middlewareMode: false,
    allowedHosts: 'all',
    fs: {
      cachedChecks: false
    }
  },

  plugins: [
    react(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    chunkSizeWarningLimit: 5000,
    minify: 'esbuild',
    cssMinify: true
  },

  optimize: {
    esbuild: {
      drop: ['console', 'debugger']
    }
  },

  base: '/',
})
