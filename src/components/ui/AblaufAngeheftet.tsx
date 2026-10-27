import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { easeOut } from '../../lib/motion';
import { begrenzen, useScrollEffekte, useSpalten } from '../../lib/scrollEffekte';

interface Schritt {
  title: string;
  desc: string;
}

// Farben der vier Säulen aus dem Logo, ein Schritt je Farbe.
const FARBEN = ['#35A1DA', '#F5891F', '#F0552B', '#21A841'];

// Schriftgrößen in px: der aktuelle Schritt groß, die anderen kleiner (auf dem Handy etwas weniger).
const GROESSEN = {
  breit: { titelJetzt: 30, titel: 20, textJetzt: 18, text: 15 },
  schmal: { titelJetzt: 22, titel: 17, textJetzt: 16, text: 14 },
};

/**
 * Scroll-Effekt 6: Der Ablauf bleibt stehen, die Linie füllt sich, Schritt für Schritt in den Logofarben.
 * Der aktuelle Schritt wird groß und hell, der Zähler blättert um. Ein Klick auf einen Schritt
 * scrollt dorthin. Ohne Effekte (vorgerendert, ohne JavaScript) stehen alle Schritte ganz
 * normal untereinander.
 */
export default function AblaufAngeheftet({
  schritte,
  eyebrow = 'Ablauf',
  titel = 'So funktioniert die Zusammenarbeit',
  text = 'In vier einfachen Schritten zu einem sauberen Ergebnis – unkompliziert und transparent.',
}: {
  schritte: Schritt[];
  eyebrow?: string;
  titel?: string;
  text?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const effekte = useScrollEffekte();
  // Ab 640 px ist genug Platz für die großen Schriften, auch wenn der Ablauf noch einspaltig steht.
  const breit = useSpalten(2, 2) === 2;
  const groessen = breit ? GROESSEN.breit : GROESSEN.schmal;
  const anzahl = schritte.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const schrittBei = (p: number) => Math.min(anzahl - 1, Math.floor(begrenzen(p) * anzahl));
  const [aktuell, setAktuell] = useState(anzahl - 1);
  const fuellung = useTransform(scrollYProgress, (p) => begrenzen(p * 1.08));

  // Beim Einschalten den Stand übernehmen, danach folgt er dem Scrollen.
  useEffect(() => {
    if (effekte) setAktuell(Math.min(anzahl - 1, Math.floor(begrenzen(scrollYProgress.get()) * anzahl)));
  }, [effekte, scrollYProgress, anzahl]);
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (effekte) setAktuell(schrittBei(p));
  });

  // Zur Mitte des Scrollbereichs dieses Schritts springen.
  const springeZu = (i: number) => {
    const sec = ref.current;
    if (!sec) return;
    const start = sec.getBoundingClientRect().top + window.scrollY;
    const strecke = sec.offsetHeight - window.innerHeight;
    window.scrollTo({ top: start + strecke * ((i + 0.5) / anzahl), behavior: 'smooth' });
  };

  const angezeigt = effekte ? aktuell : anzahl - 1;

  return (
    <section ref={ref} className={`relative bg-paper ${effekte ? 'h-[340vh]' : ''}`}>
      <div className={effekte ? 'sticky top-0 flex h-screen items-center' : 'py-28'}>
        <div className="mx-auto grid w-full max-w-7xl items-center gap-6 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
          <div className="flex flex-col gap-3 lg:gap-4">
            <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">{eyebrow}</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">{titel}</h2>
            <p className="max-w-[40ch] text-slate-400 lg:text-lg">{text}</p>
            <p
              aria-hidden="true"
              className="mt-1 flex items-end text-5xl font-black leading-none tracking-tighter text-white tabular-nums lg:mt-3 lg:text-[clamp(56px,9vw,128px)]"
            >
              {/* Zähler blättert beim Wechsel um */}
              <span className="relative inline-flex overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={angezeigt}
                    initial={{ y: '70%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: '-70%', opacity: 0 }}
                    transition={{ duration: 0.35, ease: easeOut }}
                  >
                    0{angezeigt + 1}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.28)]">/0{anzahl}</span>
            </p>
          </div>

          <ol className="relative flex flex-col gap-4 lg:gap-7">
            <li aria-hidden="true" className="absolute left-[21px] top-[22px] bottom-[22px] w-0.5 bg-white/10">
              <motion.span
                className="absolute inset-0 origin-top bg-gradient-to-b from-[#35A1DA] via-[#F0552B] to-[#21A841]"
                style={{ scaleY: effekte ? fuellung : 1 }}
              />
            </li>
            {schritte.map((s, i) => {
              const an = i <= angezeigt;
              const jetzt = effekte && i === aktuell;
              const farbe = FARBEN[i % FARBEN.length];
              const inhalt = (
                <>
                  <span
                    className="relative z-[1] grid h-11 w-11 place-items-center rounded-full border-2 font-black transition-all duration-300"
                    style={{
                      background: an ? farbe : '#18212e',
                      borderColor: an ? farbe : 'rgba(255,255,255,0.18)',
                      color: an ? '#fff' : '#94a3b8',
                      transform: jetzt ? 'scale(1.15)' : undefined,
                      boxShadow: jetzt ? `0 0 0 8px color-mix(in srgb, ${farbe} 25%, transparent)` : undefined,
                    }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 transition-transform duration-300 group-hover:translate-x-1.5">
                    <motion.h3
                      className="pt-2 font-bold leading-tight lg:pt-2.5"
                      initial={false}
                      animate={{
                        fontSize: jetzt ? groessen.titelJetzt : groessen.titel,
                        color: jetzt ? '#ffffff' : an ? '#e2e8f0' : '#94a3b8',
                      }}
                      transition={{ duration: 0.35, ease: easeOut }}
                    >
                      {s.title}
                    </motion.h3>
                    <motion.p
                      className="mt-1.5 leading-relaxed"
                      initial={false}
                      animate={{
                        fontSize: jetzt ? groessen.textJetzt : groessen.text,
                        color: jetzt ? '#e2e8f0' : '#94a3b8',
                      }}
                      transition={{ duration: 0.35, ease: easeOut }}
                    >
                      {s.desc}
                    </motion.p>
                  </div>
                </>
              );
              return (
                <li
                  key={s.title}
                  aria-current={jetzt ? 'step' : undefined}
                  className={`relative transition-opacity duration-300 ${an ? 'opacity-100' : 'opacity-[0.4] hover:opacity-80'}`}
                >
                  {effekte ? (
                    <button
                      type="button"
                      onClick={() => springeZu(i)}
                      className="group grid w-full grid-cols-[44px_minmax(0,1fr)] items-start gap-4 rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-4 focus-visible:ring-offset-paper lg:gap-5"
                    >
                      {inhalt}
                    </button>
                  ) : (
                    <div className="grid grid-cols-[44px_minmax(0,1fr)] items-start gap-4 lg:gap-5">{inhalt}</div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
