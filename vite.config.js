import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: ['.trycloudflare.com'],
    proxy: {
      // Proxy API calls (OAuth token exchange + webhook) to the Express backend
      '/api': {
        target: mode === 'production'
          ? 'https://ikpokecatch-production.up.railway.app'
          : 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  envPrefix: 'VITE_',
}));
