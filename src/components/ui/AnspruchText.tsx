import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { begrenzen, useScrollEffekte } from '../../lib/scrollEffekte';

// Scroll-Effekt 4: Der Abschnitt bleibt stehen, die Wörter leuchten beim Scrollen nacheinander auf.
// Der Satz stand bisher unter „Warum KlarWerk Service?“ und ist hierher umgezogen.
const SATZ: { text: string; hervor?: boolean }[] = [
  ...'Wir verstehen Gebäudereinigung als professionellen Service – nicht als bloße Dienstleistung.'
    .split(' ')
    .map((text) => ({ text })),
  { text: 'Qualität,', hervor: true },
  { text: 'Zuverlässigkeit', hervor: true },
  { text: 'und' },
  { text: 'persönliche', hervor: true },
  { text: 'Betreuung', hervor: true },
  ...'stehen bei uns an erster Stelle.'.split(' ').map((text) => ({ text })),
];

const GRUEN = '#3cbe74';
const WEISS = '#ffffff';

function Wort({
  text,
  hervor,
  index,
  fortschritt,
  aktiv,
}: {
  text: string;
  hervor?: boolean;
  index: number;
  fortschritt: MotionValue<number>;
  aktiv: boolean;
}) {
  const q = useTransform(fortschritt, (p) => begrenzen(p * SATZ.length * 1.18 - index));
  const opacity = useTransform(q, (v) => 0.16 + v * 0.84);
  const color = useTransform(q, (v) => (hervor && v >= 0.6 ? GRUEN : WEISS));
  if (!aktiv) return <span style={hervor ? { color: GRUEN } : undefined}>{text}</span>;
  return <motion.span style={{ opacity, color }}>{text}</motion.span>;
}

export default function AnspruchText() {
  const ref = useRef<HTMLElement>(null);
  const effekte = useScrollEffekte();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // Linie unter dem Satz läuft mit, der Absender erscheint, wenn alle Wörter leuchten.
  const linie = useTransform(scrollYProgress, (p) => begrenzen(p / 0.85));
  const absender = useTransform(scrollYProgress, (p) => begrenzen((p - 0.8) / 0.12));

  return (
    <section ref={ref} aria-label="Unser Anspruch" className={`relative bg-[#0b1220] ${effekte ? 'h-[200vh]' : ''}`}>
      <div className={effekte ? 'sticky top-0 h-screen flex items-center' : 'py-28'}>
        <div className="max-w-7xl mx-auto px-6 w-full">
          <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-brand-300 lg:mb-8">Unser Anspruch</p>
          {/* Groß und über die ganze Breite, damit der Satz die Fläche füllt */}
          <p className="max-w-[26ch] text-[clamp(32px,6vw,76px)] leading-[1.1] font-black tracking-tight text-white">
            {SATZ.map((w, i) => (
              <span key={i}>
                <Wort text={w.text} hervor={w.hervor} index={i} fortschritt={scrollYProgress} aktiv={effekte} />
                {i < SATZ.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
          <div className="mt-8 flex items-center gap-5 lg:mt-12">
            <div className="h-[3px] w-full max-w-md overflow-hidden rounded bg-white/10" aria-hidden="true">
              <motion.i
                className="block h-full origin-left bg-gradient-to-r from-[#35A1DA] via-[#2AA391] to-[#22A750]"
                style={{ scaleX: effekte ? linie : 1 }}
              />
            </div>
            <motion.p
              className="shrink-0 text-base font-bold text-slate-300 lg:text-lg"
              style={effekte ? { opacity: absender } : undefined}
            >
              KlarWerk Service
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
