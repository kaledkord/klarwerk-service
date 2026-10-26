import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

// Zählt eine Kennzahl wie „756+“ oder „365 Tage“ beim Hineinscrollen von 0 hoch.
// Vorgerendert und ohne JavaScript steht sofort der Endwert da.
const DAUER_S = 1.6;

export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduceMotion = useReducedMotion();
  const [text, setText] = useState(value);

  useEffect(() => {
    const teile = /^(\d+)(.*)$/.exec(value);
    if (!inView || reduceMotion || !teile) return;
    const ziel = Number(teile[1]);
    const rest = teile[2];
    const steuerung = animate(0, ziel, {
      duration: DAUER_S,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: (v) => setText(`${Math.round(v)}${rest}`),
    });
    return () => steuerung.stop();
  }, [inView, reduceMotion, value]);

  return (
    <p ref={ref} className={`tabular-nums ${className ?? ''}`}>
      {text}
    </p>
  );
}
