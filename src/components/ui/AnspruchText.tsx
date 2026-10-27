import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { begrenzen, useScrollEffekte } from '../../lib/scrollEffekte';

// Scroll-Effekt 4: Der Abschnitt bleibt stehen, die Wörter leuchten beim Scrollen nacheinander auf.
// Ohne Angaben der Satz der Startseite (stand bisher unter „Warum KlarWerk Service?“).
const STANDARD_SATZ =
  'Wir verstehen Gebäudereinigung als professionellen Service – nicht als bloße Dienstleistung. Qualität, Zuverlässigkeit und persönliche Betreuung stehen bei uns an erster Stelle.';
const STANDARD_HERVOR = ['Qualität,', 'Zuverlässigkeit', 'persönliche', 'Betreuung'];

const GRUEN = '#3cbe74';
const WEISS = '#ffffff';

function Wort({
  text,
  hervor,
  index,
  anzahl,
  fortschritt,
  aktiv,
}: {
  text: string;
  hervor?: boolean;
  index: number;
  anzahl: number;
  fortschritt: MotionValue<number>;
  aktiv: boolean;
}) {
  const q = useTransform(fortschritt, (p) => begrenzen(p * anzahl * 1.18 - index));
  const opacity = useTransform(q, (v) => 0.16 + v * 0.84);
  const color = useTransform(q, (v) => (hervor && v >= 0.6 ? GRUEN : WEISS));
  if (!aktiv) return <span style={hervor ? { color: GRUEN } : undefined}>{text}</span>;
  return <motion.span style={{ opacity, color }}>{text}</motion.span>;
}

/**
 * @param satz     der Satz, der Wort für Wort aufleuchtet
 * @param hervor   Wörter (genau wie im Satz, mit Satzzeichen), die grün werden
 * @param titel    kleine Zeile darüber; als Überschrift (h2), wenn `titelAlsUeberschrift`
 * @param absender erscheint am Ende neben der mitlaufenden Linie
 */
export default function AnspruchText({
  satz = STANDARD_SATZ,
  hervor = STANDARD_HERVOR,
  titel = 'Unser Anspruch',
  titelAlsUeberschrift = false,
  absender = 'KlarWerk Service',
}: {
  satz?: string;
  hervor?: string[];
  titel?: string;
  titelAlsUeberschrift?: boolean;
  absender?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const effekte = useScrollEffekte();
  const woerter = satz.split(' ');
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // Linie unter dem Satz läuft mit, der Absender erscheint, wenn alle Wörter leuchten.
  const linie = useTransform(scrollYProgress, (p) => begrenzen(p / 0.85));
  const absenderSichtbar = useTransform(scrollYProgress, (p) => begrenzen((p - 0.8) / 0.12));
  const TitelTag = titelAlsUeberschrift ? 'h2' : 'p';

  return (
    <section ref={ref} aria-label={titel} className={`relative bg-[#0b1220] ${effekte ? 'h-[200vh]' : ''}`}>
      <div className={effekte ? 'sticky top-0 h-screen flex items-center' : 'py-28'}>
        <div className="max-w-7xl mx-auto px-6 w-full">
          <TitelTag className="mb-6 text-sm font-semibold uppercase tracking-widest text-brand-300 lg:mb-8">{titel}</TitelTag>
          {/* Groß und über die ganze Breite, damit der Satz die Fläche füllt */}
          <p className="max-w-[26ch] text-[clamp(32px,6vw,76px)] leading-[1.1] font-black tracking-tight text-white">
            {woerter.map((w, i) => (
              <span key={i}>
                <Wort
                  text={w}
                  hervor={hervor.includes(w)}
                  index={i}
                  anzahl={woerter.length}
                  fortschritt={scrollYProgress}
                  aktiv={effekte}
                />
                {i < woerter.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
          <div className="mt-8 flex items-center gap-5 lg:mt-12">
            <div className="h-[3px] min-w-[64px] max-w-md flex-1 overflow-hidden rounded bg-white/10" aria-hidden="true">
              <motion.i
                className="block h-full origin-left bg-gradient-to-r from-[#35A1DA] via-[#2AA391] to-[#22A750]"
                style={{ scaleX: effekte ? linie : 1 }}
              />
            </div>
            <motion.p
              className="text-base font-bold text-slate-300 lg:text-lg"
              style={effekte ? { opacity: absenderSichtbar } : undefined}
            >
              {absender}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
