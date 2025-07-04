import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true,
    // 개발 서버 최적화
    hmr: {
      overlay: false
    },
    // 캐시 최적화
    headers: {
      'Cache-Control': 'public, max-age=31536000'
    },
    // 파일 시스템 최적화
    fs: {
      strict: false
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['apexcharts', 'react-apexcharts', 'leaflet', 'react-leaflet'],
    force: false,
    // 병렬 처리 최적화
    esbuildOptions: {
      target: 'es2020'
    }
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        // 청크 분할 최적화
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    },
    // 빌드 최적화
    minify: 'esbuild',
    target: 'es2020',
    // 청크 크기 최적화
    chunkSizeWarningLimit: 1000,
    // 소스맵 비활성화
    sourcemap: false
  },
  esbuild: {
    target: 'es2020'
  },
  define: {
    global: 'globalThis'
  },
  // CSS 최적화
  css: {
    devSourcemap: false
  },
  // 성능 최적화
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` }
      } else {
        return { relative: true }
      }
    }
  },
  // 로깅 최소화
  logLevel: 'error'
}) 