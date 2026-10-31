/**
 * Gesamtbewertung von KlarWerk Service bei Google.
 *
 * Die Zahl auf der Website kommt live aus dem Google-Unternehmensprofil Bordesholm
 * (Funktion netlify/functions/bewertung.mjs, Places API). Dieser Rückfallwert wird
 * nur angezeigt, solange der Live-Abruf nicht eingerichtet ist oder fehlschlägt,
 * und steht so im vorgerenderten HTML.
 *
 * WICHTIG: Keine erfundenen Zahlen. Der Rückfallwert ist der zuletzt im Profil
 * gezählte Stand und wird bei jeder Änderung nachgezogen.
 */
export interface Bewertung {
  /** Durchschnitt mit einer Nachkommastelle und Punkt, z. B. '5.0' (für Schema.org). */
  ratingValue: string;
  /** Anzahl der Bewertungen. */
  reviewCount: number;
  /** Stand als ISO-Datum. */
  stand: string;
  /** 'google' = live von Google geholt, 'rueckfall' = Wert aus dieser Datei. */
  quelle: 'google' | 'rueckfall';
}

export const bewertungFallback: Bewertung = {
  ratingValue: '5.0',
  reviewCount: 12,
  stand: '2026-10-31',
  quelle: 'rueckfall',
};

/** Anzeige in deutscher Schreibweise, z. B. '5,0'. */
export function bewertungAnzeige(ratingValue: string): string {
  return ratingValue.replace('.', ',');
}
