/**
 * Speicher für den Google-Gemini-API-Schlüssel (Direktverbindung).
 *
 * Bewusst GETRENNT vom übrigen Datenbestand:
 *  - liegt nur im localStorage dieses Browsers/Geräts
 *  - ist NIE Teil des JSON-Datenexports (Sicherungen bleiben schlüsselfrei)
 *  - kann jederzeit entfernt werden
 *
 * Gedacht für die private Standalone-Nutzung auf dem eigenen Rechner.
 * Für eine öffentlich gehostete Mehrbenutzer-Version gehört der Schlüssel
 * weiterhin auf den Server (Edge Function) — dieser Pfad bleibt bestehen.
 */

const KEY_STORAGE = 'klarwerk-gemini-key';

export function getGeminiKey(): string | null {
  try {
    const v = localStorage.getItem(KEY_STORAGE);
    return v && v.trim().length > 0 ? v.trim() : null;
  } catch {
    return null;
  }
}

export function setGeminiKey(key: string | null): void {
  try {
    if (key && key.trim().length > 0) localStorage.setItem(KEY_STORAGE, key.trim());
    else localStorage.removeItem(KEY_STORAGE);
  } catch {
    // localStorage nicht verfügbar — Schlüssel kann nicht gespeichert werden
  }
}

/** Maskierte Darstellung für die Oberfläche, z. B. „AIza…k3Fg“. */
export function maskKey(key: string): string {
  if (key.length <= 8) return '••••';
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

/**
 * Grobe Plausibilitätsprüfung — bewusst großzügig.
 *
 * Google verwendet mehrere Schlüsselformate nebeneinander (klassisch
 * „AIzaSy…“, neuere Varianten wie „AQ.…“ inkl. Punkt) und kann dies
 * jederzeit ändern. Ein hartes Format-Muster hier würde echte Schlüssel
 * fälschlich blockieren, bevor überhaupt ein Google-Aufruf stattfindet.
 * Diese Prüfung fängt nur offensichtliche Fehleingaben ab (leer, zu kurz,
 * ganze Sätze mit Leerzeichen) — die eigentliche Prüfung übernimmt immer
 * der echte Verbindungstest gegen die Google-API.
 */
export function looksLikeGeminiKey(key: string): boolean {
  const k = key.trim();
  return k.length >= 15 && !/\s/.test(k);
}
