import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { Cpu, BadgeCheck, ShieldCheck, Leaf, ArrowRight, Building2, type LucideIcon } from 'lucide-react';
import { manufacturers } from '../../data/manufacturers';
import { easeOut } from '../../lib/motion';

// ─── Logo Item ────────────────────────────────────────────────────────────────

function LogoItem({ m }: { m: (typeof manufacturers)[0] }) {
  const [src, setSrc] = useState(m.logoUrl);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  const handleError = () => {
    const fallback = `https://logo.clearbit.com/${m.domain}`;
    if (src !== fallback) {
      setSrc(fallback);
    } else {
      setStatus('error');
    }
  };

  // Helle Kachel mit dem Logo in Originalfarben: auf dem dunklen Hintergrund waren die
  // grau gefilterten Logos kaum zu erkennen (dunkle Schrift wie bei Kärcher verschwand ganz).
  return (
    <div className="marquee-item group flex-shrink-0 px-3 md:px-4 py-2">
      <div className="relative flex items-center justify-center h-16 md:h-[4.5rem] w-40 md:w-48 px-5 rounded-2xl bg-white/95 shadow-md shadow-black/30 transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:bg-white group-hover:shadow-lg">
        {status === 'loading' && (
          <div className="w-24 h-8 rounded bg-slate-200 animate-pulse" />
        )}

        {status !== 'error' && (
          <img
            src={src}
            alt={m.alt}
            loading="lazy"
            onLoad={() => setStatus('loaded')}
            onError={handleError}
            className={`object-contain h-8 md:h-10 w-auto max-w-full transition-opacity duration-300 ${
              status === 'loaded' ? 'opacity-100' : 'opacity-0 absolute'
            }`}
          />
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-slate-500" />
            <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">{m.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Marquee Track ────────────────────────────────────────────────────────────

const DURATION = 35; // seconds per full loop

// Scroll-Effekt 8: Das Band läuft schneller, je schneller man scrollt, folgt der Scrollrichtung
// und neigt sich dabei leicht. Ohne Scrollen läuft es ruhig weiter; bei „Bewegung reduzieren“ steht es.
// Die Schleife läuft nur, solange das Band im Bild ist.
function MarqueeTrack() {
  const bandRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const skewX = useMotionValue(0);
  const ruhig = useReducedMotion();
  const imBild = useInView(bandRef, { margin: '100px 0px' });
  const pausiert = useRef(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const letztesY = useRef<number | null>(null);
  const tempo = useRef(0);
  const richtung = useRef(1);

  // Deduplicate: remove the duplicate "Kärcher Professional" (same logo as Kärcher)
  const items = manufacturers.filter((m) => m.name !== 'Kärcher Professional');
  // Triple the items so the loop is seamless
  const loopedItems = [...items, ...items, ...items];

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        // Width of one full set of items
        const fullW = trackRef.current.scrollWidth / 3;
        setTrackWidth(fullW);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (ruhig || !imBild || trackWidth === 0) return;
    let id = 0;
    let letzteZeit = 0;
    letztesY.current = null;
    const schritt = (zeit: number) => {
      const delta = letzteZeit ? Math.min(50, zeit - letzteZeit) : 16.7;
      letzteZeit = zeit;
      // Scrolltempo je Bild, geglättet; die Richtung wechselt erst bei spürbarem Scrollen.
      const y = window.scrollY;
      const dy = letztesY.current === null ? 0 : y - letztesY.current;
      letztesY.current = y;
      tempo.current += (dy - tempo.current) * 0.18;
      if (Math.abs(tempo.current) > 0.4) richtung.current = tempo.current > 0 ? 1 : -1;
      skewX.set(Math.max(-9, Math.min(9, -tempo.current * 0.35)));
      // Unter der Maus anhalten, außer es wird gerade gescrollt.
      if (!pausiert.current || Math.abs(tempo.current) >= 0.4) {
        const grund = (trackWidth / (DURATION * 1000)) * delta;
        const extra = Math.min(Math.abs(tempo.current) * 0.45, 26) * (delta / 16.7);
        let next = x.get() - (grund + extra) * richtung.current;
        // Nach einer ganzen Runde nahtlos zurücksetzen, in beide Richtungen.
        if (next <= -trackWidth) next += trackWidth;
        if (next > 0) next -= trackWidth;
        x.set(next);
      }
      id = requestAnimationFrame(schritt);
    };
    id = requestAnimationFrame(schritt);
    return () => cancelAnimationFrame(id);
  }, [ruhig, imBild, trackWidth, x, skewX]);

  const translateX = useTransform(x, (v) => `${v}px`);

  return (
    <div
      ref={bandRef}
      className="relative overflow-hidden bg-transparent"
      onMouseEnter={() => {
        pausiert.current = true;
      }}
      onMouseLeave={() => {
        pausiert.current = false;
      }}
    >
      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10"
        style={{ background: 'linear-gradient(to right, #0f1826, transparent)' }} />
      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10"
        style={{ background: 'linear-gradient(to left, #0f1826, transparent)' }} />

      <motion.div
        ref={trackRef}
        style={{ translateX, skewX, willChange: 'transform' }}
        className="flex items-center py-4"
      >
        {loopedItems.map((m, i) => (
          <LogoItem key={`${m.name}-${i}`} m={m} />
        ))}
      </motion.div>
    </div>
  );
}

// ─── Advantages ───────────────────────────────────────────────────────────────

const advantages: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Cpu,
    title: 'Moderne Reinigungstechnik',
    text: 'Leistungsstarke Maschinen ermöglichen gründliche Reinigung auch bei großen Flächen und starken Verschmutzungen.',
  },
  {
    icon: BadgeCheck,
    title: 'Konstante Qualität',
    text: 'Professionelle Systeme sorgen für reproduzierbare Ergebnisse bei jedem Auftrag.',
  },
  {
    icon: ShieldCheck,
    title: 'Materialschonende Reinigung',
    text: 'Die richtige Technik schützt Böden, Glasflächen und hochwertige Oberflächen.',
  },
  {
    icon: Leaf,
    title: 'Effiziente Prozesse',
    text: 'Moderne Geräte reduzieren Wasserverbrauch, Zeitaufwand und Ressourcenverbrauch.',
  },
];

// ─── Section ──────────────────────────────────────────────────────────────────

export default function EquipmentSection() {
  return (
    <section className="py-28 bg-paper">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="max-w-3xl"
        >
          <span className="text-brand-300 text-xs font-bold uppercase tracking-widest">
            Professionelle Ausstattung von führenden Herstellern
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black tracking-tight text-white">
            Wir setzen auf professionelle Technik und Qualität
          </h2>
          <p className="mt-5 text-lg text-slate-300 leading-relaxed">
            Für unsere Kunden setzen wir auf moderne Reinigungssysteme, professionelle Maschinen
            und hochwertige Produkte führender Hersteller. Die Kombination aus Erfahrung,
            geschultem Personal und professioneller Ausstattung ermöglicht zuverlässige
            Reinigungsergebnisse auf höchstem Niveau.
          </p>
        </motion.div>

        {/* Marquee carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
          className="mt-16 -mx-6"
        >
          <MarqueeTrack />
        </motion.div>

        {/* Advantages */}
        <div className="mt-16 pt-14 border-t border-white/10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="text-3xl md:text-4xl font-black tracking-tight text-white text-center"
          >
            Professionelle Ausstattung bedeutet bessere Ergebnisse
          </motion.h3>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={a.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: easeOut }}
                  className="bg-paper-100 border border-white/10 rounded-2xl p-8 shadow-md hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/15 rounded-xl mb-5">
                    <Icon size={22} className="text-cyan-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">{a.title}</h4>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">{a.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Überzeugen Sie sich von professioneller Reinigungstechnik.
          </h3>
          <Link
            to="/kontakt"
            className="mt-8 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-brand-600/20 hover:-translate-y-0.5"
          >
            Kostenloses Angebot anfordern
            <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
