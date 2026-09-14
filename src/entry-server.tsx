import { StrictMode } from 'react';
import { StaticRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import type { HelmetServerState } from 'react-helmet-async';
import App from './App';
import { services } from './data/services';
import { cities } from './data/cities';

export interface HelmetContext {
  helmet?: HelmetServerState;
}

/**
 * Server-Einstieg für das Vorrendern (scripts/prerender.mjs).
 * Liefert den React-Baum für eine URL plus den Helmet-Kontext, aus dem nach dem
 * Rendern title/meta/link/script für den <head> gelesen werden.
 */
export function createApp(url: string) {
  const helmetContext: HelmetContext = {};
  const element = (
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>
  );
  return { element, helmetContext };
}

/** Alle indexierbaren Routen – Grundlage für Prerender und Sitemap-Abgleich. */
export const routes: string[] = [
  '/',
  '/leistungen',
  ...services.map((s) => `/leistungen/${s.id}`),
  '/einsatzgebiet',
  ...cities.map((c) => `/einsatzgebiet/${c.slug}`),
  '/ueber-uns',
  '/nachhaltigkeit',
  '/kontakt',
  '/impressum',
  '/datenschutz',
  '/agb',
  '/rechtliche-hinweise',
];
