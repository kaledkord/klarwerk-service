/**
 * Prerender (statisches Vorrendern) aller Routen.
 *
 * Ablauf (siehe "build" in package.json):
 *   1. vite build                                   → dist/ (Client-Bundle + Vorlage dist/index.html)
 *   2. vite build --ssr src/entry-server.tsx        → dist-ssr/entry-server.js
 *   3. node scripts/prerender.mjs                   → pro Route eine fertige HTML-Datei in dist/
 *
 * Ergebnis: Jede Seite liefert bereits im rohen HTML ihren eigenen <title>, die Description,
 * genau EINEN Canonical-Link, Open-Graph-Tags, JSON-LD und den kompletten Seiteninhalt.
 * Google, Bing und KI-Crawler (die kein JavaScript ausführen) sehen damit sofort die richtige
 * Seite statt einer leeren SPA-Hülle mit dem Canonical der Startseite.
 *
 * Dateischema (Netlify liefert /pfad aus pfad.html bzw. pfad/index.html ohne Weiterleitung):
 *   /                      → dist/index.html
 *   /leistungen            → dist/leistungen.html  + dist/leistungen/index.html
 *   /leistungen/x          → dist/leistungen/x.html + dist/leistungen/x/index.html
 *   unbekannte URL         → dist/404.html (Netlify liefert sie automatisch mit Status 404)
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const entryFile = join(root, 'dist-ssr', 'entry-server.js');

if (!existsSync(entryFile)) {
  throw new Error(
    `SSR-Bundle fehlt (${entryFile}). Erst "vite build --ssr src/entry-server.tsx --outDir dist-ssr" ausführen.`,
  );
}

const { createApp, routes } = await import(pathToFileURL(entryFile).href);

const templateFile = join(dist, 'index.html');
const template = readFileSync(templateFile, 'utf8');
for (const marker of ['<!--app-head-->', '<!--app-html-->']) {
  if (!template.includes(marker)) {
    throw new Error(`index.html: Platzhalter ${marker} fehlt.`);
  }
}

// ── Modulepreload je Seite ──────────────────────────────────────────────────────────────────
// Die Seiten sind lazy (React.lazy in src/App.tsx). Ohne Hinweis lädt der Browser den Seiten-Chunk
// erst, nachdem index-*.js ausgeführt wurde – ein zusätzlicher Umlauf vor dem Hydrieren. Aus Vites
// Manifest (build.manifest in vite.config.ts) bekommt jede vorgerenderte Seite ihren Chunk samt
// statischer Importe als <link rel="modulepreload">; eigenes CSS eines Chunks als <link rel="stylesheet">.
const manifestFile = join(dist, '.vite', 'manifest.json');
const manifest = existsSync(manifestFile) ? JSON.parse(readFileSync(manifestFile, 'utf8')) : null;
if (!manifest) console.warn('  Hinweis: dist/.vite/manifest.json fehlt – kein modulepreload je Seite.');

const seitenModul = (route) => {
  const fest = {
    '/': 'Home',
    '/leistungen': 'Services',
    '/einsatzgebiet': 'CitiesOverview',
    '/ueber-uns': 'About',
    '/nachhaltigkeit': 'Sustainability',
    '/kontakt': 'Contact',
    '/impressum': 'legal/Impressum',
    '/datenschutz': 'legal/Datenschutz',
    '/agb': 'legal/AGB',
    '/rechtliche-hinweise': 'legal/RechtlicheHinweise',
    '/404': 'NotFound',
  };
  if (fest[route]) return `src/pages/${fest[route]}.tsx`;
  const teile = route.split('/').filter(Boolean);
  if (teile[0] === 'leistungen') return teile.length === 2 ? 'src/pages/ServicePage.tsx' : 'src/pages/LokaleLeistungsseite.tsx';
  if (teile[0] === 'einsatzgebiet') return 'src/pages/CityPage.tsx';
  throw new Error(`Kein Seitenmodul für ${route} bekannt (scripts/prerender.mjs, seitenModul).`);
};

/** <link>-Tags für den Chunk der Seite und alles, was er statisch importiert und die Vorlage noch nicht lädt. */
function preloadTags(route) {
  if (!manifest) return '';
  let modul = seitenModul(route);
  if (!manifest[modul]) {
    // Rollup legt kleine Seiten zusammen (experimentalMinChunkSize); der gemeinsame Chunk heißt dann
    // „_<Seite>-<hash>.js“ nach einer der Seiten. Passt der Name, diesen nehmen; sonst ohne Vorabladen.
    const basis = modul.replace(/^.*\//, '').replace(/\.tsx$/, '');
    const ersatz = Object.keys(manifest).find((k) => k.startsWith(`_${basis}-`));
    if (!ersatz) {
      console.log(`  (kein modulepreload für ${route}: ${basis} liegt in einem zusammengelegten Chunk)`);
      return '';
    }
    modul = ersatz;
  }
  const dateien = new Set();
  const css = new Set();
  const besuche = (key) => {
    const eintrag = manifest[key];
    if (!eintrag || dateien.has(eintrag.file)) return;
    dateien.add(eintrag.file);
    for (const c of eintrag.css ?? []) css.add(c);
    for (const imp of eintrag.imports ?? []) besuche(imp);
  };
  besuche(modul);
  const tags = [];
  for (const datei of dateien) {
    if (template.includes(`/${datei}`)) continue; // index-*.js, vendor-*.js stehen schon in der Vorlage
    tags.push(`<link rel="modulepreload" crossorigin href="/${datei}">`);
  }
  for (const datei of css) {
    if (template.includes(`/${datei}`)) continue;
    tags.push(`<link rel="stylesheet" crossorigin href="/${datei}">`);
  }
  return tags.join('\n    ');
}

/** Rendert einen React-Baum vollständig (wartet auch auf lazy()-Seiten) zu einem HTML-String. */
function renderToHtml(element) {
  return new Promise((resolvePromise, reject) => {
    let html = '';
    const sink = new Writable({
      write(chunk, _encoding, callback) {
        html += chunk;
        callback();
      },
      final(callback) {
        callback();
        resolvePromise(html);
      },
    });
    const { pipe } = renderToPipeableStream(element, {
      onAllReady() {
        pipe(sink);
      },
      onShellError: reject,
      onError: reject,
    });
  });
}

function outputFiles(route) {
  if (route === '/') return [join(dist, 'index.html')];
  if (route === '/404') return [join(dist, '404.html')];
  const rel = route.slice(1);
  return [join(dist, `${rel}.html`), join(dist, rel, 'index.html')];
}

// ── Sitemap-Abgleich: jede Route in der Sitemap, keine Sitemap-URL ohne Route ────────────────
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => {
  const path = new URL(m[1].trim()).pathname.replace(/\/+$/, '');
  return path || '/';
});
const missingInSitemap = routes.filter((r) => !sitemapPaths.includes(r));
const unknownInSitemap = sitemapPaths.filter((p) => !routes.includes(p));
if (missingInSitemap.length || unknownInSitemap.length) {
  throw new Error(
    `Sitemap und Routen weichen ab.\n  fehlt in sitemap.xml: ${missingInSitemap.join(', ') || '–'}\n  ohne Route: ${unknownInSitemap.join(', ') || '–'}`,
  );
}

// ── Rendern ───────────────────────────────────────────────────────────────────────────────────
const pages = [...routes, '/404'];
let count = 0;
for (const route of pages) {
  const { element, helmetContext } = createApp(route);
  const appHtml = await renderToHtml(element);
  const helmet = helmetContext.helmet;
  if (!helmet) throw new Error(`Kein Helmet-Kontext für ${route} – hat die Seite eine <SEO>-Komponente?`);

  const head = [helmet.title, helmet.meta, helmet.link, helmet.script]
    .map((part) => part.toString())
    .filter(Boolean)
    .concat(preloadTags(route))
    .filter(Boolean)
    .join('\n    ');

  // Funktions-Replacer: kein "$&"-Sonderverhalten von String.replace bei "$" im Inhalt.
  const html = template.replace('<!--app-head-->', () => head).replace('<!--app-html-->', () => appHtml);

  for (const file of outputFiles(route)) {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
    count++;
  }
  const title = /<title[^>]*>([^<]*)<\/title>/.exec(head)?.[1] ?? '(kein Titel)';
  console.log(`  ✓ ${route.padEnd(36)} ${title}`);
}
console.log(`\nPrerender fertig: ${pages.length} Routen → ${count} HTML-Dateien in dist/`);
