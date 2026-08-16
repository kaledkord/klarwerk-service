import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import ServiceCard from '../components/ui/ServiceCard';
import ServiceImage from '../components/ui/ServiceImage';
import FAQAccordion from '../components/ui/FAQAccordion';
import CTASection from '../components/ui/CTASection';
import EquipmentSection from '../components/ui/EquipmentSection';
import GoogleReviewsCarousel from '../components/ui/GoogleReviewsCarousel';
import BranchenSection from '../components/ui/BranchenSection';
import SEO from '../components/SEO';
import { featuredServices } from '../data/services';
import { cities as cityData } from '../data/cities';
import { seoConfig } from '../config/seoConfig';

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

const cities = cityData.map((c) => ({ name: c.name, slug: c.slug }));

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

export default function Home() {
  return (
    <div className="bg-paper">
      <SEO
        {...seoConfig['/']}
        keywords="Gebäudereinigung, Büroreinigung, Glasreinigung, Hausmeisterservice, Reinigungsfirma, Schleswig-Holstein, Kiel, Hamburg"
        jsonLd={jsonLd}
      />

      {/* ── 1 HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden bg-ink">
        <div
          className="klar-photo"
          style={{ backgroundImage: "url('/Kein_Titel_(1080_x_1080_px).png')" }}
          aria-hidden="true"
        />
        <div
          className="klar-photo klar-unclear"
          style={{ backgroundImage: "url('/Kein_Titel_(1080_x_1080_px).png')" }}
          aria-hidden="true"
        />
        <div className="klar-squeegee" aria-hidden="true" />
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              'linear-gradient(90deg, rgba(15,22,20,0.86) 0%, rgba(15,22,20,0.45) 44%, rgba(15,22,20,0.05) 74%), linear-gradient(0deg, rgba(15,22,20,0.7), transparent 46%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-[4] w-full max-w-7xl mx-auto px-6 pt-36 pb-16 lg:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-300">
              Gebäudereinigung · Schleswig-Holstein &amp; Hamburg
            </p>
            <h1 className="mt-4 text-white font-black tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl">
              Erst unklar.<br />
              Dann <span className="text-brand-400">klar.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-200 leading-relaxed">
              Professionelle Gebäudereinigung, die man sieht — für Büros, Praxen und
              Objekte in Kiel, Neumünster, Rendsburg und Umgebung.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/kontakt" className="btn-primary">
                Kostenloses Angebot
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/leistungen"
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl transition duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Leistungen ansehen
              </Link>
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
                <p className="text-4xl font-black text-white">{s.value}</p>
                <p className="mt-1.5 text-sm text-slate-400">{s.label}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3 LEISTUNGEN ───────────────────────────────────────────────────── */}
      <section id="leistungen" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">
              Leistungen
            </span>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-3">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">Unsere Leistungen</h2>
              <Link
                to="/leistungen"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:gap-2.5 transition-all shrink-0"
              >
                Alle Leistungen <ArrowRight size={15} />
              </Link>
            </div>
            <p className="mt-4 text-slate-600 text-lg max-w-2xl">
              Individuelle Reinigungslösungen für private und gewerbliche Kunden in
              Schleswig-Holstein und Hamburg.
            </p>
          </AnimatedSection>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredServices.map((service, i) => (
              <AnimatedSection key={service.id} delay={i * 0.07}>
                <ServiceCard service={service} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 BRANCHEN & ZIELGRUPPEN ───────────────────────────────────────── */}
      <BranchenSection />

      {/* ── 5 WARUM KLARWERK ───────────────────────────────────────────────── */}
      <section className="py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <ServiceImage
                src="/Design_ohne_Titel.png"
                alt="Warum KlarWerk Service"
                className="rounded-3xl h-[480px] w-full"
                imgClassName="shadow-xl shadow-slate-900/10"
              />
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">
                Warum wir
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">
                Warum KlarWerk Service?
              </h2>
              <p className="mt-5 text-slate-600 leading-relaxed">
                Wir verstehen Gebäudereinigung als professionellen Service – nicht als bloße
                Dienstleistung. Qualität, Zuverlässigkeit und persönliche Betreuung stehen bei
                uns an erster Stelle.
              </p>
              <div className="mt-8 space-y-5">
                {advantages.map((a) => (
                  <div key={a.title} className="flex gap-4">
                    <div className="w-2 h-2 rounded-full bg-brand-600 mt-2 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-900">{a.title}</h4>
                      <p className="mt-1 text-sm text-slate-600 leading-relaxed">{a.desc}</p>
                    </div>
                  </div>
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

      {/* ── 8 ABLAUF DER ZUSAMMENARBEIT ────────────────────────────────────── */}
      <section className="py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">
              Ablauf
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">
              So funktioniert die Zusammenarbeit
            </h2>
            <p className="mt-4 text-slate-500 text-lg max-w-2xl">
              In vier einfachen Schritten zu einem sauberen Ergebnis – unkompliziert und transparent.
            </p>
          </AnimatedSection>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 0.09}>
                <div className="relative bg-white border border-slate-100 rounded-2xl p-7 hover:border-brand-200 hover:shadow-md transition-all h-full">
                  <span className="text-5xl font-black text-slate-100 leading-none">
                    {step.num}
                  </span>
                  <h3 className="mt-3 font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                  {i < processSteps.length - 1 && (
                    <div className="hidden lg:flex absolute top-10 -right-3 z-10 w-6 h-6 bg-white rounded-full border border-slate-100 items-center justify-center">
                      <ArrowRight size={12} className="text-slate-400" />
                    </div>
                  )}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9 KUNDENBEWERTUNGEN ────────────────────────────────────────────── */}
      <GoogleReviewsCarousel />

      {/* ── 10 EINSATZGEBIET ───────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">
              Einsatzgebiet
            </span>
            <h2 className="text-4xl font-black mt-3 tracking-tight">Unser Einsatzgebiet</h2>
            <p className="mt-4 text-slate-600 text-lg">
              Wir sind in ganz Schleswig-Holstein und Hamburg für Sie da – schnell vor Ort, wo Sie uns brauchen.
            </p>
          </AnimatedSection>
          <div className="mt-8 flex flex-wrap gap-3">
            {cities.map((city, i) => (
              <AnimatedSection key={city.slug} delay={i * 0.06}>
                <Link
                  to={`/einsatzgebiet/${city.slug}`}
                  className="flex items-center gap-2 bg-white border border-slate-200 hover:border-brand-300 hover:bg-brand-50 px-5 py-2.5 rounded-full text-sm font-medium text-slate-700 transition-colors"
                >
                  <MapPin size={13} className="text-brand-600" />
                  {city.name}
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11 FAQ ─────────────────────────────────────────────────────────── */}
      <section className="py-28 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight">Häufige Fragen</h2>
            <p className="mt-4 text-slate-500 text-lg">
              Antworten auf die häufigsten Fragen rund um unsere Leistungen.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="bg-white rounded-2xl border border-slate-100 px-8 py-4 shadow-sm">
              <FAQAccordion items={faqs} />
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.15} className="mt-8 text-center">
            <p className="text-slate-600 text-sm">
              Weitere Fragen?{' '}
              <Link
                to="/kontakt"
                className="text-brand-700 font-semibold underline underline-offset-2 hover:no-underline"
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
