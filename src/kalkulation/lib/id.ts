/** ID-Erzeugung (browser- und testtauglich). */

export function uid(prefix = ''): string {
  const core =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return prefix ? `${prefix}_${core}` : core;
}

/** Formatiert laufende Nummern, z. B. K-2026-007. */
export function formatSequence(prefix: string, year: number, n: number): string {
  return `${prefix}-${year}-${String(n).padStart(3, '0')}`;
}
