import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),  // ← AGREGAR ESTO (es obligatorio para React)
    tailwindcss(),
  ],
 
})