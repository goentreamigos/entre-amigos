import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration — tells Vite to use React and build for the browser
export default defineConfig({
  plugins: [react()],
})
