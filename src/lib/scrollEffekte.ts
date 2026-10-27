import { useEffect, useState } from 'react';

// Hilfen für die Effekte, die direkt am Scrollen hängen (Fortschritt, Parallaxe, angeheftete Abschnitte).

export const begrenzen = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
/** Bremst zum Ende hin ab. */
export const auslaufen = (t: number) => 1 - Math.pow(1 - t, 3);
/** Weich am Anfang und am Ende. */
export const weich = (t: number) => t * t * (3 - 2 * t);

/**
 * true erst nach dem Hydrieren. Vorher bleibt alles so stehen, wie es vorgerendert ist: ohne
 * JavaScript und für Suchmaschinen ist jeder Inhalt sichtbar. Die Effekte laufen auch bei
 * „Bewegung reduzieren“ (Wunsch von Khaled, Oktober 2026).
 */
export function useScrollEffekte() {
  const [bereit, setBereit] = useState(false);
  useEffect(() => setBereit(true), []);
  return bereit;
}

/**
 * Spaltenzahl eines Rasters wie in Tailwind: `basis` darunter, ab sm (640 px) `sm`,
 * ab md (768 px) `md` (ohne Angabe wie sm), ab lg (1024 px) `lg`.
 */
export function useSpalten(sm: number, lg: number, basis = 1, md = sm) {
  const [spalten, setSpalten] = useState(basis);
  useEffect(() => {
    const mqLg = window.matchMedia('(min-width: 1024px)');
    const mqMd = window.matchMedia('(min-width: 768px)');
    const mqSm = window.matchMedia('(min-width: 640px)');
    const aktualisieren = () =>
      setSpalten(mqLg.matches ? lg : mqMd.matches ? md : mqSm.matches ? sm : basis);
    aktualisieren();
    [mqLg, mqMd, mqSm].forEach((mq) => mq.addEventListener('change', aktualisieren));
    return () => [mqLg, mqMd, mqSm].forEach((mq) => mq.removeEventListener('change', aktualisieren));
  }, [sm, lg, basis, md]);
  return spalten;
}
