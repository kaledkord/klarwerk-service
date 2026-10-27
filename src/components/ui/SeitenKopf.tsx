import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { begrenzen, useScrollEffekte } from '../../lib/scrollEffekte';

/**
 * Scroll-Effekt 2 für Unterseiten: Der Kopfbereich gleitet beim Runterscrollen nach oben weg und
 * blendet aus, beim Hochscrollen kommt er zurück. Gemessen wird am äußeren Element.
 */
export default function SeitenKopf({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const effekte = useScrollEffekte();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.15', 'end start'] });
  const y = useTransform(scrollYProgress, (p) => p * -80);
  const opacity = useTransform(scrollYProgress, (p) => begrenzen(1 - p * 1.3));

  return (
    <div ref={ref} className={className}>
      <motion.div style={effekte ? { y, opacity } : undefined}>{children}</motion.div>
    </div>
  );
}
