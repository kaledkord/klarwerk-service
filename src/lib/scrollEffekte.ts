import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// Hilfen für die Effekte, die direkt am Scrollen hängen (Fortschritt, Parallaxe, angeheftete Abschnitte).

export const begrenzen = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
/** Bremst zum Ende hin ab. */
export const auslaufen = (t: number) => 1 - Math.pow(1 - t, 3);
/** Weich am Anfang und am Ende. */
export const weich = (t: number) => t * t * (3 - 2 * t);

/**
 * true erst nach dem Hydrieren und nur ohne „Bewegung reduzieren“. Vorher bleibt alles so stehen,
 * wie es vorgerendert ist: ohne JavaScript und für Suchmaschinen ist jeder Inhalt sichtbar.
 */
export function useScrollEffekte() {
  const ruhig = useReducedMotion();
  const [bereit, setBereit] = useState(false);
  useEffect(() => setBereit(true), []);
  return bereit && !ruhig;
}

/** Spaltenzahl eines Rasters wie in Tailwind: 1, ab sm (640 px) `sm`, ab lg (1024 px) `lg`. */
export function useSpalten(sm: number, lg: number) {
  const [spalten, setSpalten] = useState(1);
  useEffect(() => {
    const mqLg = window.matchMedia('(min-width: 1024px)');
    const mqSm = window.matchMedia('(min-width: 640px)');
    const aktualisieren = () => setSpalten(mqLg.matches ? lg : mqSm.matches ? sm : 1);
    aktualisieren();
    mqLg.addEventListener('change', aktualisieren);
    mqSm.addEventListener('change', aktualisieren);
    return () => {
      mqLg.removeEventListener('change', aktualisieren);
      mqSm.removeEventListener('change', aktualisieren);
    };
  }, [sm, lg]);
  return spalten;
}
