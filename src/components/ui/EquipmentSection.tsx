import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
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

  return (
    <div className="marquee-item group relative flex items-center justify-center px-10 md:px-14 flex-shrink-0">
      <div className="relative flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110">
        {/* Glow */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-xl rounded-full bg-cyan-400/20" />

        {status === 'loading' && (
          <div className="w-24 h-10 rounded bg-white/10 animate-pulse" />
        )}

        {status !== 'error' && (
          <img
            src={src}
            alt={m.alt}
            loading="lazy"
            onLoad={() => setStatus('loaded')}
            onError={handleError}
            className={`object-contain h-8 md:h-10 w-auto max-w-[110px] md:max-w-[140px] relative z-10 transition-all duration-300 ${
              status === 'loaded' ? 'opacity-60 group-hover:opacity-100' : 'opacity-0 absolute'
            }`}
            style={{ filter: 'grayscale(100%) contrast(0.8)', transition: 'filter 0.3s, opacity 0.3s' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.filter = 'grayscale(0%) contrast(1)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.filter = 'grayscale(100%) contrast(0.8)')}
          />
        )}

        {status === 'error' && (
          <div className="flex items-center gap-2 opacity-40">
            <Building2 size={20} className="text-slate-400" />
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">{m.name}</span>
          </div>
        )}
      </div>

      {/* Separator dot */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-white/15/40" />
    </div>
  );
}

// ─── Marquee Track ────────────────────────────────────────────────────────────

const DURATION = 35; // seconds per full loop

function MarqueeTrack() {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [paused, setPaused] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const lastScrollY = useRef(0);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Scroll acceleration
  useEffect(() => {
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY.current);
      lastScrollY.current = window.scrollY;
      const boost = Math.min(1 + delta * 0.08, 4);
      setScrollSpeed(boost);

      if (scrollTimer.current) clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setScrollSpeed(1), 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useAnimationFrame((_, delta) => {
    if (paused || trackWidth === 0) return;
    const pxPerMs = (trackWidth / (DURATION * 1000)) * scrollSpeed;
    const next = x.get() - pxPerMs * delta;
    // Reset when we've scrolled one full set width
    x.set(next <= -trackWidth ? next + trackWidth : next);
  });

  const translateX = useTransform(x, (v) => `${v}px`);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 md:w-40 z-10"
        style={{ background: 'linear-gradient(to right, #f8fafc, transparent)' }} />
      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 md:w-40 z-10"
        style={{ background: 'linear-gradient(to left, #f8fafc, transparent)' }} />

      <motion.div
        ref={trackRef}
        style={{ translateX, willChange: 'transform' }}
        className="flex items-center py-6"
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
