/**
 * Netlify-Funktion: Gesamtbewertung live aus dem Google-Unternehmensprofil.
 *
 * Adresse: /api/bewertung
 * Quelle:  Places API (New), Place Details, Felder rating und userRatingCount.
 *
 * Einrichtung (einmalig, in Netlify unter Site configuration → Environment variables):
 *   GOOGLE_PLACES_API_KEY  Schlüssel aus der Google Cloud Console mit freigeschalteter
 *                          „Places API (New)“. Der Aufruf kommt vom Server, deshalb den
 *                          Schlüssel auf diese API beschränken (nicht auf Websites).
 *   GOOGLE_PLACE_IDS       Optional. Place-IDs durch Komma getrennt. Standard ist das Profil
 *                          Bordesholm. Bei mehreren Profilen werden die Anzahlen addiert und der
 *                          Durchschnitt nach Anzahl gewichtet.
 *
 * Die Antwort wird im Netlify-CDN 6 Stunden zwischengespeichert, danach bis zu einem Tag
 * weiter ausgeliefert und im Hintergrund erneuert. So bleibt es bei wenigen Google-Abrufen
 * am Tag, unabhängig von der Zahl der Besucher.
 *
 * Ohne Schlüssel antwortet die Funktion mit 503 und { ok: false }; die Website zeigt dann
 * den Rückfallwert aus src/data/bewertung.ts.
 */

const PLACE_ID_BORDESHOLM = 'ChIJUVMmB4u-Y24Ri8gJbsf734M';

function env(name) {
  if (typeof Netlify !== 'undefined' && Netlify.env && typeof Netlify.env.get === 'function') {
    return Netlify.env.get(name);
  }
  return process.env[name];
}

function json(body, status, cacheSekunden) {
  const headers = { 'content-type': 'application/json; charset=utf-8' };
  if (cacheSekunden > 0) {
    headers['cache-control'] = 'public, max-age=' + Math.min(cacheSekunden, 3600);
    headers['netlify-cdn-cache-control'] =
      'public, durable, max-age=' + cacheSekunden + ', stale-while-revalidate=86400';
  } else {
    headers['cache-control'] = 'no-store';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

async function placeDetails(placeId, key) {
  const url = 'https://places.googleapis.com/v1/places/' + encodeURIComponent(placeId) + '?languageCode=de';
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'rating,userRatingCount',
    },
  });
  if (!res.ok) {
    throw new Error('Google antwortet mit ' + res.status + ' für ' + placeId);
  }
  const data = await res.json();
  const rating = Number(data.rating);
  const count = Number(data.userRatingCount);
  if (!Number.isFinite(rating) || !Number.isInteger(count) || count < 0) {
    throw new Error('Unerwartete Antwort für ' + placeId);
  }
  return { rating, count };
}

export default async () => {
  const key = env('GOOGLE_PLACES_API_KEY');
  if (!key) {
    return json({ ok: false, grund: 'kein_schluessel' }, 503, 0);
  }
  const placeIds = (env('GOOGLE_PLACE_IDS') || PLACE_ID_BORDESHOLM)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  try {
    const teile = await Promise.all(placeIds.map((id) => placeDetails(id, key)));
    const reviewCount = teile.reduce((s, t) => s + t.count, 0);
    if (reviewCount === 0) {
      return json({ ok: false, grund: 'keine_bewertungen' }, 503, 0);
    }
    const summe = teile.reduce((s, t) => s + t.rating * t.count, 0);
    const ratingValue = (Math.round((summe / reviewCount) * 10) / 10).toFixed(1);
    return json(
      {
        ok: true,
        ratingValue,
        reviewCount,
        stand: new Date().toISOString().slice(0, 10),
        quelle: 'google',
        profile: placeIds.length,
      },
      200,
      6 * 3600,
    );
  } catch (fehler) {
    return json({ ok: false, grund: 'google_fehler', detail: String(fehler && fehler.message ? fehler.message : fehler) }, 502, 0);
  }
};

export const config = {
  path: '/api/bewertung',
};
