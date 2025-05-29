import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', // Añade esta línea si tu app está en un subdirectorio
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
