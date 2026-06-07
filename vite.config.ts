import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@scheduling': path.resolve(__dirname, 'src/features/scheduling'),
      '@scheduling/*': path.resolve(__dirname, 'src/features/scheduling/*'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@shared/*': path.resolve(__dirname, 'src/shared/*'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@features/*': path.resolve(__dirname, 'src/features/*'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@app/*': path.resolve(__dirname, 'src/app/*'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})