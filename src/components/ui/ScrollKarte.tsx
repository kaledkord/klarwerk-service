import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { auslaufen, begrenzen, useScrollEffekte } from '../../lib/scrollEffekte';

/**
 * Scroll-Effekt 3: Die Karte kippt beim Hineinscrollen aus der Tiefe nach oben, Spalte für Spalte
 * versetzt. Hängt am Scrollen, läuft also beim Hochscrollen rückwärts.
 * Gemessen wird am äußeren Element, bewegt wird das innere, damit sich die Bewegung nicht selbst misst.
 */
export default function ScrollKarte({
  spalte,
  className = '',
  children,
}: {
  spalte: number;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const effekte = useScrollEffekte();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start center'] });
  const q = useTransform(scrollYProgress, (p) => auslaufen(begrenzen(p - spalte * 0.12)));
  const y = useTransform(q, (v) => (1 - v) * 90);
  const rotateX = useTransform(q, (v) => (1 - v) * 16);
  const scale = useTransform(q, (v) => 0.94 + v * 0.06);
  const opacity = useTransform(q, (v) => 0.1 + v * 0.9);

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="h-full origin-bottom"
        style={effekte ? { y, rotateX, scale, opacity, transformPerspective: 1200 } : undefined}
      >
        {children}
      </motion.div>
    </div>
  );
}
