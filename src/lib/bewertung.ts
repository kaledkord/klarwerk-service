import { useEffect, useState } from 'react';
import { bewertungFallback, type Bewertung } from '../data/bewertung';

/** Adresse der Netlify-Funktion (siehe netlify/functions/bewertung.mjs). */
const BEWERTUNG_URL = '/api/bewertung';

let geladen: Bewertung | null = null;
let laeuft: Promise<Bewertung | null> | null = null;

interface Antwort {
  ok: true;
  ratingValue: string;
  reviewCount: number;
  stand?: string;
}

function istAntwort(d: unknown): d is Antwort {
  if (!d || typeof d !== 'object') return false;
  const o = d as Record<string, unknown>;
  return (
    o.ok === true &&
    typeof o.ratingValue === 'string' &&
    /^[1-5]\.\d$/.test(o.ratingValue) &&
    typeof o.reviewCount === 'number' &&
    Number.isInteger(o.reviewCount) &&
    o.reviewCount > 0
  );
}

/**
 * Holt die Gesamtbewertung einmal pro Seitenaufruf von der Funktion. Fehlt die Funktion
 * (z. B. kein API-Schlüssel hinterlegt) oder antwortet sie nicht, bleibt der Rückfallwert.
 */
export function ladeBewertung(): Promise<Bewertung | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (geladen) return Promise.resolve(geladen);
  if (!laeuft) {
    laeuft = fetch(BEWERTUNG_URL, { headers: { accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: unknown) => {
        if (!istAntwort(d)) return null;
        geladen = {
          ratingValue: d.ratingValue,
          reviewCount: d.reviewCount,
          stand: typeof d.stand === 'string' ? d.stand : new Date().toISOString().slice(0, 10),
          quelle: 'google',
        };
        return geladen;
      })
      .catch(() => null);
  }
  return laeuft;
}

/**
 * Gesamtbewertung für die Anzeige: zuerst der Rückfallwert (auch beim Vorrendern),
 * nach dem Laden im Browser der Live-Wert von Google.
 */
export function useBewertung(): Bewertung {
  const [bewertung, setBewertung] = useState<Bewertung>(geladen ?? bewertungFallback);

  useEffect(() => {
    let aktiv = true;
    ladeBewertung().then((b) => {
      if (aktiv && b) setBewertung(b);
    });
    return () => {
      aktiv = false;
    };
  }, []);

  return bewertung;
}
