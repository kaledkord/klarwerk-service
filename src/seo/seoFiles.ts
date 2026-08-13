/**
 * SEO file guidance: recommended robots.txt content and XML sitemap structure.
 *
 * USAGE:
 *   1. Copy the `robotsTxtContent` string into `public/robots.txt`
 *   2. Generate a dynamic sitemap from your routes, or copy `sampleSitemapXml`
 *      into `public/sitemap.xml` and update the URLs/lastmod dates.
 *
 * In a Vite project, files in the `public/` directory are served at the root path
 * and copied as-is into the `dist/` build output.
 */

import { businessConfig } from '../config/businessConfig';

const BASE_URL = businessConfig.url;

/** Recommended robots.txt content for a local business site. */
export const robotsTxtContent = `# robots.txt for ${businessConfig.name}
# ${BASE_URL}

User-agent: *
Allow: /

# Block legal/privacy pages from indexing if desired
# Disallow: /impressum
# Disallow: /datenschutz

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml
`;

/** All site routes for sitemap generation. Kept in sync with public/sitemap.xml. */
export const siteRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/leistungen', changefreq: 'monthly', priority: '0.9' },
  { path: '/leistungen/gebaeudereinigung', changefreq: 'monthly', priority: '0.8' },
  { path: '/leistungen/bueroreinigung', changefreq: 'monthly', priority: '0.8' },
  { path: '/leistungen/glasreinigung', changefreq: 'monthly', priority: '0.8' },
  { path: '/leistungen/praxisreinigung', changefreq: 'monthly', priority: '0.8' },
  { path: '/leistungen/hausmeisterservice', changefreq: 'monthly', priority: '0.8' },
  { path: '/leistungen/unterhaltsreinigung', changefreq: 'monthly', priority: '0.8' },
  { path: '/leistungen/grundreinigung', changefreq: 'monthly', priority: '0.8' },
  { path: '/leistungen/gartenpflege', changefreq: 'monthly', priority: '0.7' },
  { path: '/leistungen/bauendreinigung', changefreq: 'monthly', priority: '0.7' },
  { path: '/leistungen/winterdienst', changefreq: 'monthly', priority: '0.7' },
  { path: '/leistungen/entruempelung', changefreq: 'monthly', priority: '0.7' },
  { path: '/leistungen/moebelreinigung', changefreq: 'monthly', priority: '0.7' },
  { path: '/leistungen/schulreinigung', changefreq: 'monthly', priority: '0.7' },
  { path: '/leistungen/kita-reinigung', changefreq: 'monthly', priority: '0.7' },
  { path: '/leistungen/pflegeheimreinigung', changefreq: 'monthly', priority: '0.7' },
  { path: '/leistungen/lagerhallenreinigung', changefreq: 'monthly', priority: '0.7' },
  { path: '/leistungen/schwimmbadreinigung', changefreq: 'monthly', priority: '0.7' },
  { path: '/leistungen/supermarktreinigung', changefreq: 'monthly', priority: '0.7' },
  { path: '/leistungen/gastronomiereinigung', changefreq: 'monthly', priority: '0.7' },
  { path: '/einsatzgebiet', changefreq: 'monthly', priority: '0.8' },
  { path: '/einsatzgebiet/bordesholm', changefreq: 'monthly', priority: '0.8' },
  { path: '/einsatzgebiet/kiel', changefreq: 'monthly', priority: '0.8' },
  { path: '/einsatzgebiet/neumuenster', changefreq: 'monthly', priority: '0.8' },
  { path: '/einsatzgebiet/rendsburg', changefreq: 'monthly', priority: '0.8' },
  { path: '/einsatzgebiet/preetz', changefreq: 'monthly', priority: '0.7' },
  { path: '/einsatzgebiet/ploen-eckernfoerde', changefreq: 'monthly', priority: '0.7' },
  { path: '/einsatzgebiet/bad-segeberg', changefreq: 'monthly', priority: '0.7' },
  { path: '/einsatzgebiet/eutin', changefreq: 'monthly', priority: '0.7' },
  { path: '/einsatzgebiet/luebeck', changefreq: 'monthly', priority: '0.7' },
  { path: '/einsatzgebiet/hamburg', changefreq: 'monthly', priority: '0.6' },
  { path: '/einsatzgebiet/nordrhein-westfalen', changefreq: 'monthly', priority: '0.5' },
  { path: '/ueber-uns', changefreq: 'monthly', priority: '0.6' },
  { path: '/nachhaltigkeit', changefreq: 'yearly', priority: '0.5' },
  { path: '/kontakt', changefreq: 'yearly', priority: '0.6' },
  { path: '/impressum', changefreq: 'yearly', priority: '0.3' },
  { path: '/datenschutz', changefreq: 'yearly', priority: '0.3' },
  { path: '/agb', changefreq: 'yearly', priority: '0.3' },
  { path: '/rechtliche-hinweise', changefreq: 'yearly', priority: '0.3' },
] as const;

/** Generate a sitemap XML string from siteRoutes. */
export function generateSitemapXml(lastmod?: string): string {
  const date = lastmod || new Date().toISOString().split('T')[0];

  const urls = siteRoutes
    .map(
      (route) => `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/** Sample sitemap XML for reference. */
export const sampleSitemapXml = generateSitemapXml();
