/**
 * Build-Konfiguration für die Standalone-Version von KlarWerk Kalkulation:
 * bündelt die komplette App (inkl. Logo) in EINE HTML-Datei, die offline
 * per Doppelklick läuft. Ausgabe: dist-kalkulation/KlarWerk-Kalkulation.html
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
  publicDir: false,
  build: {
    outDir: 'dist-kalkulation',
    emptyOutDir: true,
    rollupOptions: { input: 'kalkulation-standalone.html' },
    assetsInlineLimit: 100_000_000,
    chunkSizeWarningLimit: 8000,
  },
});
