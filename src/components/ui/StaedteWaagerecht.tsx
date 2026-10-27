import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { cities } from '../../data/cities';
import { begrenzen, useScrollEffekte } from '../../lib/scrollEffekte';

/**
 * Scroll-Effekt 7: Der Abschnitt bleibt stehen, die Städte fahren beim Runterscrollen von rechts
 * nach links durch, die Fotos bewegen sich leicht in ihren Rahmen. Die Höhe des Abschnitts ergibt
 * sich aus der Breite der Reihe. Ohne Effekte lässt sich die Reihe seitlich wischen.
 */
export default function StaedteWaagerecht({
  eyebrow = 'Einsatzgebiet',
  titel = 'Unser Einsatzgebiet',
  text = 'Wir sind in ganz Schleswig-Holstein und Hamburg für Sie da – schnell vor Ort, wo Sie uns brauchen.',
  ohne,
}: {
  eyebrow?: string;
  titel?: string;
  text?: string;
  /** Stadt, die nicht in der Reihe erscheint (auf ihrer eigenen Seite) */
  ohne?: string;
}) {
  const staedte = cities.filter((c) => c.slug !== ohne);
  const ref = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const karten = useRef<(HTMLAnchorElement | null)[]>([]);
  const bilder = useRef<(HTMLImageElement | null)[]>([]);
  const distanzRef = useRef(0);
  const [distanz, setDistanz] = useState(0);
  const effekte = useScrollEffekte();
  const x = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  const aktualisieren = useCallback(
    (p: number) => {
      const neuX = -begrenzen(p) * distanzRef.current;
      x.set(neuX);
      // Lage der Karte aus dem Layout (offsetLeft) statt aus dem verschobenen Bild, damit nichts hinterherläuft.
      const links = viewRef.current?.getBoundingClientRect().left ?? 0;
      const breite = window.innerWidth;
      karten.current.forEach((karte, i) => {
        const img = bilder.current[i];
        if (!karte || !img) return;
        const mitte = links + karte.offsetLeft + neuX + karte.offsetWidth / 2;
        const d = begrenzen((mitte - breite / 2) / breite, -1, 1);
        img.style.transform = `translate3d(${(d * -8).toFixed(2)}%,0,0) scale(1.18)`;
      });
    },
    [x],
  );

  useEffect(() => {
    if (!effekte) {
      bilder.current.forEach((img) => img?.style.removeProperty('transform'));
      return;
    }
    const messen = () => {
      const t = trackRef.current;
      const v = viewRef.current;
      if (!t || !v) return;
      distanzRef.current = Math.max(0, t.scrollWidth - v.clientWidth);
      setDistanz(distanzRef.current);
      aktualisieren(scrollYProgress.get());
    };
    messen();
    const ro = new ResizeObserver(messen);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewRef.current) ro.observe(viewRef.current);
    return () => ro.disconnect();
  }, [effekte, aktualisieren, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (effekte) aktualisieren(p);
  });

  return (
    <section
      ref={ref}
      aria-labelledby="einsatzgebiet-titel"
      className="relative bg-paper"
      style={effekte ? { height: `calc(${distanz}px + 100vh)` } : undefined}
    >
      <div className={effekte ? 'sticky top-0 flex h-screen flex-col justify-center gap-7 overflow-hidden' : 'flex flex-col gap-8 py-24'}>
        <div className="mx-auto w-full max-w-7xl px-6">
          <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">{eyebrow}</span>
          <h2 id="einsatzgebiet-titel" className="text-4xl font-black mt-3 tracking-tight">{titel}</h2>
          <p className="mt-4 max-w-3xl text-slate-300 text-lg">{text}</p>
        </div>

        <div ref={viewRef} className={effekte ? 'overflow-hidden' : 'overflow-x-auto pb-4'}>
          <motion.div
            ref={trackRef}
            className="relative flex w-max gap-5 pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-12"
            style={effekte ? { x } : undefined}
          >
            {staedte.map((c, i) => (
              <Link
                key={c.slug}
                ref={(el) => {
                  karten.current[i] = el;
                }}
                to={`/einsatzgebiet/${c.slug}`}
                className="group flex w-[clamp(240px,30vw,380px)] flex-none flex-col gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-paper-100">
                  <img
                    ref={(el) => {
                      bilder.current[i] = el;
                    }}
                    src={c.image}
                    alt={`Gebäudereinigung in ${c.name}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-[filter] duration-300 group-hover:brightness-110"
                  />
                </div>
                <span className="flex items-center gap-2 text-lg font-bold text-white">
                  <MapPin size={16} className="text-brand-400" />
                  {c.name}
                </span>
                <span className="-mt-1.5 text-sm text-slate-400">Gebäudereinigung in {c.name}</span>
              </Link>
            ))}
          </motion.div>
        </div>

        {effekte && (
          <div className="mx-auto w-full max-w-7xl px-6" aria-hidden="true">
            <div className="h-[3px] overflow-hidden rounded bg-white/10">
              <motion.i
                className="block h-full origin-left bg-gradient-to-r from-[#35A1DA] via-[#2AA391] to-[#22A750]"
                style={{ scaleX: scrollYProgress }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
