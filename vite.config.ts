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
        // .vite/manifest.json: scripts/prerender.mjs liest daraus, welche Datei jede Seite braucht,
        // und schreibt <link rel="modulepreload"> dafür ins vorgerenderte HTML (ein Umlauf weniger).
        manifest: true,
        rollupOptions: {
          output: {
            // Kleinstdateien (einzelne Icons, 300–500 Bytes) in größere Chunks legen: weniger Anfragen.
            experimentalMinChunkSize: 8192,
            // Selten wechselnde Bibliotheken in eigene, lange cachebare Dateien.
            // (@supabase/supabase-js wird im Client nicht importiert – kein Chunk dafür.)
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-motion': ['framer-motion'],
            },
          },
        },
      },
}));
