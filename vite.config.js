import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { devBookingApiPlugin } from './scripts/dev-booking-api.js'

export default defineConfig({
  plugins: [react(), devBookingApiPlugin()],
  server: {
    host: true,
    port: 5173,
    strictPort: false,
  },
})
