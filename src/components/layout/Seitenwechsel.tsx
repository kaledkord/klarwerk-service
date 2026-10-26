import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import SaeulenLader from '../ui/SaeulenLader';

// Beim Wechsel der Seite deckt eine Fläche kurz den Inhalt ab und zeigt die vier Säulen
// des Logos; darunter wechselt die Seite. Die Kopfzeile bleibt sichtbar (z-50 über z-40).
const HALTEN_MS = 600;

export default function Seitenwechsel() {
  const { pathname } = useLocation();
  const vorher = useRef(pathname);
  const [aktiv, setAktiv] = useState(false);

  useEffect(() => {
    // Vergleich statt „erster Aufruf“, damit StrictMode den Lader nicht beim Laden auslöst.
    if (vorher.current === pathname) return;
    vorher.current = pathname;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setAktiv(true);
    const t = window.setTimeout(() => setAktiv(false), HALTEN_MS);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {aktiv && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-paper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.15 } }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          <SaeulenLader label="Seite wird geladen" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
