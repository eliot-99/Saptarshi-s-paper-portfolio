import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { target: 'es2022', cssCodeSplit: true },
  server: {
    host: '0.0.0.0',
    proxy: {
      // Keep the frontend on Vite while Pages Functions run in Wrangler on 8788.
      // The browser Origin points at Vite (5173), so rewrite it at this trusted
      // local boundary before the same-origin check in the Functions runtime.
      '/api': {
        target: 'http://localhost:8788',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyRequest, request) => {
            const browserOrigin = request.headers.origin;
            const browserHost = request.headers.host;
            if (browserOrigin && browserHost) {
              try {
                // Rewrite only same-origin browser requests. Cross-origin requests
                // keep their Origin and remain rejected by the Functions guard.
                if (new URL(browserOrigin).host === browserHost) proxyRequest.setHeader('origin', 'http://localhost:8788');
              } catch {
                // Preserve an invalid Origin so the backend rejects it.
              }
            }
          });
        },
      },
      '/media': 'http://localhost:8788',
    },
  },
})
