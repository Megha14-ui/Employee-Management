// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export const API_BASE = "http://localhost:5000";

export default defineConfig({
  plugins: [react()], // No customizations
  server: {
    port: 3000
  }
})