import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useScrollEffekte } from '../../lib/scrollEffekte';

// Scroll-Effekt 5 (zweiter Teil): Die Vorteile leuchten nacheinander auf, wenn sie ins obere Drittel rücken.
export default function VorteilPunkt({ title, desc }: { title: string; desc: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const effekte = useScrollEffekte();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'start 0.6'] });
  const opacity = useTransform(scrollYProgress, (q) => 0.3 + 0.7 * q);
  const punktScale = useTransform(scrollYProgress, (q) => 0.4 + 0.6 * q);

  return (
    <motion.div ref={ref} className="flex gap-4" style={effekte ? { opacity } : undefined}>
      <span className="relative mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-white/25">
        <motion.span
          className="absolute -inset-0.5 rounded-full bg-brand-400"
          style={effekte ? { scale: punktScale, opacity: scrollYProgress } : undefined}
        />
      </span>
      <div>
        <h4 className="font-bold text-white">{title}</h4>
        <p className="mt-1 text-sm text-slate-300 leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}
