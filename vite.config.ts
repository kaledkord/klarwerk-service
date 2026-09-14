import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  ssr: {
    // CommonJS-Paket ins SSR-Bundle aufnehmen: Node-ESM kann dessen Named Exports
    // (Helmet, HelmetProvider) sonst beim Vorrendern nicht auflösen.
    noExternal: ['react-helmet-async'],
  },
  build: isSsrBuild
    ? {}
    : {
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-motion': ['framer-motion'],
              'vendor-supabase': ['@supabase/supabase-js'],
            },
          },
        },
      },
}));
