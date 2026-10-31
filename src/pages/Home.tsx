import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import AblaufDialog from '../components/ui/AblaufDialog';
import AblaufAngeheftet from '../components/ui/AblaufAngeheftet';
import AnspruchText from '../components/ui/AnspruchText';
import CountUp from '../components/ui/CountUp';
import OeffnendesBild from '../components/ui/OeffnendesBild';
import ScrollKarte from '../components/ui/ScrollKarte';
import ServiceCard from '../components/ui/ServiceCard';
import StaedteWaagerecht from '../components/ui/StaedteWaagerecht';
import VorteilPunkt from '../components/ui/VorteilPunkt';
import FAQAccordion from '../components/ui/FAQAccordion';
import CTASection from '../components/ui/CTASection';
import EquipmentSection from '../components/ui/EquipmentSection';
import GoogleReviewsCarousel from '../components/ui/GoogleReviewsCarousel';
import BranchenSection from '../components/ui/BranchenSection';
import HeroVideo from '../components/ui/HeroVideo';
import Bild, { bildEintrag } from '../components/ui/Bild';
import { Helmet } from 'react-helmet-async';
import SEO from '../components/SEO';
import { featuredServices } from '../data/services';
import { seoConfig } from '../config/seoConfig';
import { begrenzen, useScrollEffekte, useSpalten } from '../lib/scrollEffekte';

const stats = [
  { value: '756+', label: 'Erfolgreiche Einsätze' },
  { value: '365 Tage', label: 'Erreichbar nach Vereinbarung' },
  { value: '17+', label: 'Spezialisierte Leistungen' },
  { value: '100%', label: 'Kundenzufriedenheit' },
];

const advantages = [
  { title: 'Zuverlässiger Service', desc: 'Pünktlich, sorgfältig und immer gemäß Vereinbarung – darauf können Sie sich verlassen.' },
  { title: 'Flexible Terminplanung', desc: 'Wir passen uns Ihrem Zeitplan an. Morgens, abends oder am Wochenende – kein Problem.' },
  { title: 'Professionelle Qualität', desc: 'Geschultes Personal und modernes Equipment für erstklassige Ergebnisse.' },
  { title: 'Persönlicher Ansprechpartner', desc: 'Ein fester Kontakt für alle Anliegen – schnell, direkt und unkompliziert.' },
];

const processSteps = [
  { num: '01', title: 'Kontakt aufnehmen', desc: 'Kurze Anfrage per Telefon, E-Mail oder Kontaktformular genügt.' },
  { num: '02', title: 'Besichtigung & Beratung', desc: 'Kostenlose Vor-Ort-Besichtigung und individuelle Beratung.' },
  { num: '03', title: 'Individuelles Angebot', desc: 'Transparentes Angebot auf Basis Ihrer Anforderungen.' },
  { num: '04', title: 'Professionelle Reinigung', desc: 'Wir kümmern uns zuverlässig um alles Weitere.' },
];

const faqs = [
  { question: 'In welchen Regionen sind Sie tätig?', answer: 'KlarWerk Service ist schwerpunktmäßig in Schleswig-Holstein tätig – insbesondere in Kiel, Neumünster, Rendsburg, Preetz und Umgebung. Darüber hinaus sind wir in Hamburg im Einsatz.' },
  { question: 'Für welche Kunden bieten Sie Reinigungsleistungen an?', answer: 'Wir betreuen Unternehmen, medizinische Praxen, Büros, Wohn- und Geschäftshäuser sowie private Immobilien. Unser Angebot richtet sich an gewerbliche und private Kunden gleichermaßen.' },
  { question: 'Wie schnell erhalte ich ein Angebot?', answer: 'Nach Ihrer Anfrage vereinbaren wir eine kurze Besichtigung vor Ort. Alle Angaben erfassen wir anschließend in unserem eigenen Kalkulationsprogramm für Gebäudereinigung – daraus erhalten Sie ein individuelles, faires und transparentes Festpreis-Angebot.' },
  { question: 'Sind Ihre Mitarbeiter versichert?', answer: 'Ja, alle unsere Mitarbeiter sind sozialversicherungspflichtig beschäftigt und vollständig haftpflichtversichert. Sie können sich auf verlässliche und sichere Dienstleistungen verlassen.' },
  { question: 'Bieten Sie auch Einmalreinigungen an?', answer: 'Ja. Neben regelmäßigen Reinigungsverträgen führen wir auch Einmalreinigungen durch, z.B. Grundreinigungen, Entrümpelungen oder saisonale Reinigungen.' },
  { question: 'Wie werden die Preise berechnet?', answer: 'Preise richten sich nach Fläche, Häufigkeit, Art der Leistung und besonderen Anforderungen. Nach einer kostenfreien Besichtigung erhalten Sie einen Festpreis ohne versteckte Kosten.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};

// Größtes Element über dem Falz: Foto hinter dem Startbereich. Vorab laden, damit der Browser es
// nicht erst nach CSS und JavaScript entdeckt (LCP). AVIF-Browser nehmen die AVIF-Liste, alle anderen
// ignorieren den Preload mit type="image/avif" und laden das Bild normal über <picture>.
const HERO_BILD = '/bilder/hero-objektpflege.jpg';
const heroEintrag = bildEintrag(HERO_BILD);

export default function Home() {
  const effekte = useScrollEffekte();
  const spalten = useSpalten(2, 3);

  // Scroll-Effekt 2: Foto und Video bleiben zurück und zoomen leicht, der Text gleitet nach oben weg.
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bildY = useTransform(heroP, (p) => `${(p * 28).toFixed(2)}%`);
  const bildScale = useTransform(heroP, (p) => 1.04 + p * 0.1);
  const textY = useTransform(heroP, (p) => p * -150);
  const textOpacity = useTransform(heroP, (p) => begrenzen(1 - p * 1.7));
  const abdunkeln = useTransform(heroP, (p) => p * 0.7);

  return (
    <div className="bg-paper">
      <SEO
        {...seoConfig['/']}
        keywords="Gebäudereinigung, Büroreinigung, Glasreinigung, Hausmeisterservice, Reinigungsfirma, Schleswig-Holstein, Kiel, Hamburg"
        jsonLd={jsonLd}
      />
      {heroEintrag && (
        <Helmet>
          <link
            rel="preload"
            as="image"
            type="image/avif"
            imageSrcSet={heroEintrag.avif}
            imageSizes="100vw"
            {...({ fetchpriority: 'high' } as Record<string, string>)}
          />
        </Helmet>
      )}

      {/* ── 1 HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center overflow-hidden bg-ink">
        <motion.div
          className="absolute inset-0"
          style={effekte ? { y: bildY, scale: bildScale } : undefined}
          aria-hidden="true"
        >
          <div className="klar-photo">
            <Bild
              src={HERO_BILD}
              alt=""
              sizes="100vw"
              prioritaet
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <HeroVideo src="/hero-objektpflege.mp4" />
        </motion.div>
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              'linear-gradient(90deg, rgba(15,22,20,0.86) 0%, rgba(15,22,20,0.45) 44%, rgba(15,22,20,0.05) 74%), linear-gradient(0deg, rgba(15,22,20,0.7), transparent 46%)',
          }}
          aria-hidden="true"
        />
        <motion.div
          className="pointer-events-none absolute inset-0 z-[3] bg-paper"
          style={{ opacity: effekte ? abdunkeln : 0 }}
          aria-hidden="true"
        />

        {/* Abfolge per CSS (index.css, „Startbereich“): läuft schon im vorgerenderten HTML und wartet beim ersten Besuch auf den Loader. */}
        <div className="relative z-[4] w-full max-w-7xl mx-auto px-6 pt-28 pb-16">
          <motion.div className="max-w-2xl" style={effekte ? { y: textY, opacity: textOpacity } : undefined}>
            <p className="klw-hero-dach text-sm font-semibold uppercase tracking-widest text-brand-300">
              Gebäudereinigung · Schleswig-Holstein &amp; Hamburg
            </p>
            <h1 className="mt-4 text-white font-black tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl">
              <span className="klw-hero-z1">Erst unklar.</span>{' '}
              <span className="klw-hero-z2">
                Dann <span className="klw-glanz">klar.</span>
              </span>
            </h1>
            <p className="klw-hero-text mt-6 max-w-xl text-lg text-slate-200 leading-relaxed">
              Professionelle Gebäudereinigung, die man sieht — für Büros, Praxen und
              Objekte in Kiel, Neumünster, Rendsburg und Umgebung.
            </p>
            <div className="klw-hero-knoepfe mt-8 flex flex-wrap gap-3">
              <Link to="/kontakt" className="btn-primary">
                Kostenloses Angebot
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/leistungen"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 hover:bg-white/10 hover:-translate-y-0.5 text-white font-semibold px-8 py-4 rounded-xl transition duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Leistungen ansehen
              </Link>
            </div>
            <div className="klw-hero-info mt-4">
              <AblaufDialog schritte={processSteps} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2 VERTRAUENSZAHLEN ─────────────────────────────────────────────── */}
      <section className="bg-navy-950 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 0.07}>
                <CountUp value={s.value} className="text-4xl font-black text-white" />
                <p className="mt-1.5 text-sm text-slate-400">{s.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 LEISTUNGEN ───────────────────────────────────────────────────── */}
      <section id="leistungen" className="py-28 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">
              Leistungen
            </span>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-3">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Unsere Leistungen</h2>
              <Link
                to="/leistungen"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 hover:gap-2.5 transition-all shrink-0"
              >
                Alle Leistungen <ArrowRight size={15} />
              </Link>
            </div>
            <p className="mt-4 text-slate-300 text-lg max-w-2xl">
              Individuelle Reinigungslösungen für private und gewerbliche Kunden in
              Schleswig-Holstein und Hamburg.
            </p>
          </AnimatedSection>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredServices.map((service, i) => (
              <ScrollKarte key={service.id} spalte={i % spalten}>
                <ServiceCard service={service} />
              </ScrollKarte>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 BRANCHEN & ZIELGRUPPEN ───────────────────────────────────────── */}
      <BranchenSection />

      {/* ── 4b ANSPRUCH, Wort für Wort ─────────────────────────────────────── */}
      <AnspruchText />

      {/* ── 5 WARUM KLARWERK ───────────────────────────────────────────────── */}
      <section className="py-28 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Seitenverhältnis wie das Foto (1200 × 800), damit nichts angeschnitten wird */}
            <OeffnendesBild
              src="/bilder/leistung-unterhaltsreinigung.jpg"
              alt="Warum KlarWerk Service"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[3/2] w-full"
            />
            <AnimatedSection delay={0.1}>
              <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">
                Warum wir
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">
                Warum KlarWerk Service?
              </h2>
              {/* Der Satz zum Anspruch steht jetzt groß im Abschnitt darüber. */}
              <div className="mt-8 space-y-5">
                {advantages.map((a) => (
                  <VorteilPunkt key={a.title} title={a.title} desc={a.desc} />
                ))}
              </div>
              <Link
                to="/kontakt"
                className="mt-10 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition duration-200 active:scale-[0.98]"
              >
                Kostenloses Angebot anfordern <ArrowRight size={15} />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── 6 PROFESSIONELLE AUSSTATTUNG ───────────────────────────────────── */}
      <EquipmentSection />

      {/* ── 8 ABLAUF DER ZUSAMMENARBEIT (angeheftet) ──────────────────────── */}
      <AblaufAngeheftet schritte={processSteps} />

      {/* ── 9 KUNDENBEWERTUNGEN ────────────────────────────────────────────── */}
      <GoogleReviewsCarousel />

      {/* ── 10 EINSATZGEBIET (Städte waagerecht) ──────────────────────────── */}
      <StaedteWaagerecht />

      {/* ── 11 FAQ ─────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-paper">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">Häufige Fragen</h2>
            <p className="mt-4 text-slate-400 text-lg">
              Antworten auf die häufigsten Fragen rund um unsere Leistungen.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="bg-paper-100 rounded-2xl border border-white/10 px-8 py-4 shadow-md">
              <FAQAccordion items={faqs} />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.15} className="mt-8 text-center">
            <p className="text-slate-300 text-sm">
              Weitere Fragen?{' '}
              <Link
                to="/kontakt"
                className="text-brand-300 font-semibold underline underline-offset-2 hover:no-underline"
              >
                Kontaktieren Sie uns direkt.
              </Link>
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── 12 FINALER CTA ─────────────────────────────────────────────────── */}
      <CTASection />
    </div>
  );
}
