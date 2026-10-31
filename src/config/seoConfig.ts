import { businessConfig } from './businessConfig';

/**
 * Centralized SEO metadata for every route in the application.
 * Descriptions are kept between 120–160 characters and are unique per route.
 */
interface SeoEntry {
  title: string;
  description: string;
  canonical?: string;
}
export const seoConfig = {
  // ── Static pages ───────────────────────────────────────────────────────────
  '/': {
    title: 'Gebäudereinigung Kiel & Schleswig-Holstein | KlarWerk',
    description:
      'Gebäudereinigung für Kiel, Neumünster, Rendsburg und ganz Schleswig-Holstein: Büro-, Glas- und Praxisreinigung mit festem Ansprechpartner.',
    canonical: '/',
  },
  '/ueber-uns': {
    title: 'Über uns',
    description:
      'Über KlarWerk Service: inhabergeführte Gebäudereinigung und Gebäudeservice für Schleswig-Holstein, Hamburg und NRW mit persönlicher Betreuung.',
    canonical: '/ueber-uns',
  },
  '/leistungen': {
    title: 'Leistungen – Gebäudereinigung & Gebäudeservice | KlarWerk',
    description:
      'Alle Leistungen von KlarWerk Service im Überblick: Büro-, Glas-, Praxis- und Grundreinigung, Bauendreinigung, Hausmeisterservice und Gartenpflege.',
    canonical: '/leistungen',
  },
  '/einsatzgebiet': {
    title: 'Unser Einsatzgebiet in Schleswig-Holstein | KlarWerk',
    description:
      'KlarWerk Service reinigt in Bordesholm, Kiel, Neumünster, Rendsburg, Preetz und ganz Schleswig-Holstein sowie in Hamburg. Wählen Sie Ihren Standort.',
    canonical: '/einsatzgebiet',
  },
  '/nachhaltigkeit': {
    title: 'Nachhaltigkeit – Sauberkeit mit Verantwortung | KlarWerk',
    description:
      'Nachhaltig reinigen: umweltschonende Mittel, genaue Dosierung, wiederverwendbare Textilien und kurze Wege. Werterhalt statt Wegwerfen.',
    canonical: '/nachhaltigkeit',
  },
  '/kontakt': {
    title: 'Kontakt – Angebot für Gebäudereinigung anfordern | KlarWerk',
    description:
      'Gebäudereinigung in Kiel, Neumünster und Schleswig-Holstein anfragen: per Telefon, E-Mail oder Formular. Die Besichtigung vor Ort ist kostenlos.',
    canonical: '/kontakt',
  },
  '/impressum': {
    title: 'Impressum',
    description:
      'Impressum von KlarWerk Service – Gebäudereinigung und Gebäudeservice gemäß § 5 DDG und § 18 MStV. Anbieterkennzeichnung und Kontaktinformationen des Unternehmens.',
    canonical: '/impressum',
  },
  '/datenschutz': {
    title: 'Datenschutzerklärung',
    description:
      'Datenschutzerklärung von KlarWerk Service – Datenschutzerklärung gemäß DSGVO. Informationen zur Verarbeitung personenbezogener Daten auf dieser Website.',
    canonical: '/datenschutz',
  },
  '/agb': {
    title: 'Allgemeine Geschäftsbedingungen',
    description:
      'AGB von KlarWerk Service – Allgemeine Geschäftsbedingungen für Gebäudereinigung und Gebäudeservice. Vertragsgrundlagen, Pflichten und Konditionen unserer Leistungen.',
    canonical: '/agb',
  },
  '/rechtliche-hinweise': {
    title: 'Rechtliche Hinweise',
    description:
      'Rechtliche Hinweise von KlarWerk Service – Gebäudereinigung und Gebäudeservice. Haftungsausschluss, Urheberrecht und weitere rechtliche Bestimmungen für diese Website.',
    canonical: '/rechtliche-hinweise',
  },
  '/404': {
    title: 'Seite nicht gefunden',
    description:
      'Die angeforderte Seite wurde nicht gefunden. Kehren Sie zur Startseite von KlarWerk Service zurück oder kontaktieren Sie uns für Gebäudereinigung und Gebäudeservice.',
    canonical: '/404',
  },

  // ── Dynamic route fallbacks ────────────────────────────────────────────────
  // Override these in the page component with the resolved entity data.
  '/leistungen/:serviceId': {
    title: 'Leistung',
    description:
      'Detaillierte Informationen zu dieser Reinigungsleistung von KlarWerk Service – professionelle Gebäudereinigung und Gebäudeservice für Schleswig-Holstein, Hamburg und NRW.',
  },
  '/einsatzgebiet/:citySlug': {
    title: 'Gebäudereinigung vor Ort',
    description:
      'Professionelle Gebäudereinigung und Gebäudeservice an Ihrem Standort – KlarWerk Service ist in Schleswig-Holstein, Hamburg und Nordrhein-Westfalen für Sie da.',
  },
} as const;

/** Brand name appended to every page title by the SEO component. */
export const SITE_NAME = businessConfig.name;
