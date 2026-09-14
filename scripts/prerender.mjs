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
