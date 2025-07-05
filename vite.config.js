import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      path:    resolve(__dirname, 'node_modules/path-browserify'),
      events:  resolve(__dirname, 'node_modules/events'),
      
    }
  },
  optimizeDeps: {
    include: ['path-browserify', 'events'],
  },
  define: {
    'process.env': {},
  },
})
