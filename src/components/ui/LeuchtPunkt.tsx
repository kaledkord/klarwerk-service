import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useScrollEffekte } from '../../lib/scrollEffekte';

/**
 * Listenpunkt mit Häkchen, der beim Scrollen aufleuchtet, sobald er ins obere Drittel rückt
 * (wie die Vorteile auf der Startseite). Ohne Effekte steht er fertig da.
 */
export default function LeuchtPunkt({
  children,
  farbe = 'text-success-500',
  className = 'flex items-start gap-3 text-slate-200',
  textKlasse = 'text-sm leading-relaxed',
}: {
  children: React.ReactNode;
  farbe?: string;
  className?: string;
  textKlasse?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const effekte = useScrollEffekte();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'start 0.65'] });
  const opacity = useTransform(scrollYProgress, (q) => 0.3 + 0.7 * q);
  const scale = useTransform(scrollYProgress, (q) => 0.6 + 0.4 * q);

  return (
    <motion.div ref={ref} className={className} style={effekte ? { opacity } : undefined}>
      <motion.span className="mt-0.5 inline-flex shrink-0" style={effekte ? { scale } : undefined}>
        <CheckCircle size={18} className={farbe} />
      </motion.span>
      <span className={textKlasse}>{children}</span>
    </motion.div>
  );
}
