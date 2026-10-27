import { useCallback, useEffect, useId, useRef } from 'react';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { DACH, SAEULEN, SYMBOLE } from '../../data/werkzeugHaus';
import { auslaufen, begrenzen, useScrollEffekte } from '../../lib/scrollEffekte';

/**
 * Scroll-Effekt 9: Das Haus aus dem Logo mit Werkzeugen baut sich beim Hineinscrollen auf.
 * Die Säulen wachsen nacheinander, die Werkzeuge erscheinen, zuletzt schließt sich das Dach.
 * Ohne Effekte steht das Haus fertig da.
 */
export default function WerkzeugHaus({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const dach = useRef<SVGPathElement>(null);
  const saeulen = useRef<(SVGPathElement | null)[]>([]);
  const symbole = useRef<(SVGGElement | null)[]>([]);
  const verlaufId = `klw-haus-${useId().replace(/:/g, '')}`;
  const effekte = useScrollEffekte();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end 0.6'] });

  const zeichnen = useCallback((p: number) => {
    saeulen.current.forEach((el, i) => {
      if (el) el.style.transform = `scaleY(${auslaufen(begrenzen((p - i * 0.08) / 0.5)).toFixed(4)})`;
    });
    symbole.current.forEach((el, i) => {
      if (!el) return;
      const q = begrenzen((p - i * 0.08 - 0.3) / 0.25);
      el.style.opacity = q.toFixed(3);
      el.style.transform = `scale(${(0.6 + 0.4 * auslaufen(q)).toFixed(4)})`;
    });
    if (dach.current) {
      dach.current.style.strokeDasharray = '1 2';
      dach.current.style.strokeDashoffset = (1.05 - 1.05 * auslaufen(begrenzen((p - 0.55) / 0.4))).toFixed(4);
    }
  }, []);

  useEffect(() => {
    if (effekte) {
      zeichnen(scrollYProgress.get());
      return;
    }
    [...saeulen.current, ...symbole.current, dach.current].forEach((el) => el?.removeAttribute('style'));
  }, [effekte, zeichnen, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (effekte) zeichnen(p);
  });

  return (
    <div ref={ref} className={className}>
    <svg viewBox="-30 -18 660 458" className="block h-auto w-full overflow-visible" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={verlaufId} x1="28" y1="0" x2="572" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#35A1DA" />
          <stop offset="0.5" stopColor="#2AA391" />
          <stop offset="1" stopColor="#22A750" />
        </linearGradient>
      </defs>
      <path
        ref={dach}
        d={DACH}
        pathLength={1}
        fill="none"
        stroke={`url(#${verlaufId})`}
        strokeWidth={36}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {SAEULEN.map((s, i) => (
        <path
          key={s.farbe}
          ref={(el) => {
            saeulen.current[i] = el;
          }}
          d={s.d}
          fill={s.farbe}
          style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
        />
      ))}
      {SYMBOLE.map((s, i) => (
        <g
          key={i}
          ref={(el) => {
            symbole.current[i] = el;
          }}
          style={{ transformBox: 'fill-box', transformOrigin: '50% 60%' }}
        >
          <path d={s.d} transform={s.transform} fill="#fff" fillRule="evenodd" />
        </g>
      ))}
    </svg>
    </div>
  );
}
