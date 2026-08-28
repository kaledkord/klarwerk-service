/**
 * Einstiegspunkt der Standalone-Version von KlarWerk Kalkulation.
 *
 * Wird zu EINER einzelnen HTML-Datei gebaut (npm run build:kalkulation),
 * die komplett offline per Doppelklick im Browser läuft — unabhängig von
 * der Website. Hash-Routing, damit Navigation und Druckansichten auch
 * über file:// funktionieren.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import KalkulationApp from './KalkulationApp';
import '../index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <HashRouter>
        <Routes>
          <Route path="/kalkulation/*" element={<KalkulationApp />} />
          <Route path="*" element={<Navigate to="/kalkulation" replace />} />
        </Routes>
      </HashRouter>
    </HelmetProvider>
  </StrictMode>
);
