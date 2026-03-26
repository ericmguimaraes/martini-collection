import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/martini-collection/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-nivo': [
            '@nivo/bar',
            '@nivo/line',
            '@nivo/pie',
            '@nivo/treemap',
            '@nivo/heatmap',
            '@nivo/radar',
            '@nivo/core',
          ],
        },
      },
    },
  },
})
