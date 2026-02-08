import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Local dev should run from "/" while production build targets GitHub Pages path.
  base: command === 'serve' ? '/' : '/situation-monitor/',
  build: {
    // Increase chunk size warning limit (we're code-splitting appropriately)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Manual chunks for better caching and parallel loading
        manualChunks: {
          // Vendor chunks - split heavy dependencies
          'vendor-react': ['react', 'react-dom'],
          'vendor-map': ['leaflet', 'react-leaflet'],
          'vendor-viz': ['d3', 'topojson-client'],
          'vendor-motion': ['framer-motion'],
          'vendor-media': ['react-player'],
          'vendor-ui': ['lucide-react', 'zustand'],
        },
      },
    },
    // Minification options
    minify: 'esbuild',
    // Target modern browsers for smaller bundle
    target: 'es2020',
    // Source maps only in dev
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'leaflet', 'react-leaflet', 'zustand'],
  },
}))
