import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['apexcharts', 'react-apexcharts', 'leaflet', 'react-leaflet'],
    force: false,
    // 병렬 처리 최적화
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    rollupOptions: {
      external: []
    }
  },
  esbuild: {
    target: 'es2020'
  },
  define: {
    global: 'globalThis'
  }
}) 