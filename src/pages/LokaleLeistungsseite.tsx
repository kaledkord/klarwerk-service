import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Brain,
  Building2,
  CheckCircle,
  ClipboardCheck,
  FileText,
  Lock,
  MapPin,
  MinusCircle,
  Phone,
  Smile,
  Stethoscope,
  UserCheck,
  type LucideIcon,
} from 'lucide-react';
import SEO from '../components/SEO';
import AnimatedSection from '../components/ui/AnimatedSection';
import AblaufAngeheftet from '../components/ui/AblaufAngeheftet';
import CTASection from '../components/ui/CTASection';
import FAQAccordion from '../components/ui/FAQAccordion';
import LeuchtPunkt from '../components/ui/LeuchtPunkt';
import ScrollKarte from '../components/ui/ScrollKarte';
import SeitenKopf from '../components/ui/SeitenKopf';
import { businessConfig } from '../config/businessConfig';
import { getLokaleSeite, lokalerPfad } from '../data/lokaleSeiten';
import { getServiceById } from '../data/services';
import { getCityBySlug } from '../data/cities';
import { useSpalten } from '../lib/scrollEffekte';

const PHONE = '+49 176 31287131';
const BASE_URL = businessConfig.url;

// Symbole für die Zielgruppen-Karten, in der Reihenfolge der Daten.
const ZIELGRUPPEN_ICONS: LucideIcon[] = [Stethoscope, Smile, Activity, Brain, Building2];
const VERTRAUEN_ICONS: LucideIcon[] = [ClipboardCheck, FileText, Lock, UserCheck];

/**
 * Lokale Leistungsseite (z. B. /leistungen/praxisreinigung/kiel).
 * Inhalte kommen vollständig aus src/data/lokaleSeiten.ts – unbekannte Kombinationen
 * leiten auf die allgemeine Leistungsseite weiter.
 */
export default function LokaleLeistungsseite() {
  const { serviceId = '', citySlug = '' } = useParams<{ serviceId: string; citySlug: string }>();
  const seite = getLokaleSeite(serviceId, citySlug);
  const service = getServiceById(serviceId);
  const city = getCityBySlug(citySlug);
  // Spalten für den versetzten Aufstieg der Karten (vor dem frühen Return, wegen der Hook-Regeln).
  const spaltenGruppen = useSpalten(2, 3);
  const spaltenVertrauen = useSpalten(2, 4);
  const spaltenErgaenzung = useSpalten(2, 3);

  if (!seite || !service || !city) {
    return <Navigate to={service ? `/leistungen/${service.id}` : '/leistungen'} replace />;
  }

  const pfad = lokalerPfad(seite);
  const titelOrt = `${seite.leistung} in ${seite.ort}`;

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: titelOrt,
    serviceType: seite.leistung,
    description: seite.seo.description,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${BASE_URL}/#business`,
      name: 'KlarWerk Service',
      telephone: PHONE,
    },
    areaServed: [
      { '@type': 'City', name: seite.ort },
      ...seite.anfahrt.umland.map((name) => ({ '@type': 'Place', name })),
    ],
    url: `${BASE_URL}${pfad}`,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: seite.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Start', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Leistungen', item: `${BASE_URL}/leistungen` },
      { '@type': 'ListItem', position: 3, name: service.title, item: `${BASE_URL}/leistungen/${service.id}` },
      { '@type': 'ListItem', position: 4, name: seite.ort, item: `${BASE_URL}${pfad}` },
    ],
  };

  return (
    <div className="bg-paper">
      <SEO
        title={seite.seo.title}
        description={seite.seo.description}
        keywords={seite.seo.keywords}
        canonicalPath={pfad}
        jsonLd={[serviceJsonLd, faqJsonLd, breadcrumbJsonLd]}
      />

      {/* HERO */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-paper">
        <SeitenKopf className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav aria-label="Brotkrümel" className="flex flex-wrap items-center gap-2 text-sm text-slate-400 mb-6">
                <Link to="/" className="hover:text-slate-300 transition-colors">Start</Link>
                <span>/</span>
                <Link to="/leistungen" className="hover:text-slate-300 transition-colors">Leistungen</Link>
                <span>/</span>
                <Link to={`/leistungen/${service.id}`} className="hover:text-slate-300 transition-colors">{service.title}</Link>
                <span>/</span>
                <span className="text-slate-300">{seite.ort}</span>
              </nav>
              <p className="text-sm font-semibold text-brand-300 uppercase tracking-widest mb-5">
                <MapPin size={14} className="inline mr-1.5 -mt-0.5" />
                {seite.leistung} · {seite.ort}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                {seite.h1}
              </h1>
              <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-xl">{seite.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/kontakt" className="btn-primary">
                  Kostenlose Besichtigung
                  <ArrowRight size={16} />
                </Link>
                <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="btn-secondary">
                  <Phone size={15} />
                  {PHONE}
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={seite.bild.src}
                alt={seite.bild.alt}
                width={720}
                height={480}
                loading="eager"
                decoding="async"
                className="rounded-2xl h-[360px] lg:h-[460px] w-full object-cover shadow-xl shadow-slate-900/10"
              />
            </motion.div>
          </div>

          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            {seite.eckdaten.map((e) => (
              <div key={e.titel} className="flex items-start gap-3 bg-paper-100 border border-white/10 rounded-xl px-5 py-4">
                <CheckCircle size={18} className="text-cyan-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-semibold text-sm">{e.titel}</p>
                  <p className="text-slate-400 text-sm leading-relaxed mt-0.5">{e.text}</p>
                </div>
              </div>
            ))}
          </div>
        </SeitenKopf>
      </section>

      {/* ZIELGRUPPEN */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">Für Ihre Praxis</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight">
              Jede Praxis in {seite.ort} braucht etwas anderes
            </h2>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl">
              Wir richten Reinigungsplan und Rhythmus nach Ihrer Praxisart aus – nicht nach einer Standardliste.
            </p>
          </AnimatedSection>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {seite.zielgruppen.map((z, i) => {
              const ZIcon = ZIELGRUPPEN_ICONS[i % ZIELGRUPPEN_ICONS.length];
              return (
                <ScrollKarte key={z.titel} spalte={i % spaltenGruppen}>
                  <div className="bg-paper-100 border border-white/10 rounded-2xl p-7 h-full shadow-md">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-500/15 rounded-xl mb-5">
                      <ZIcon size={22} className="text-brand-300" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{z.titel}</h3>
                    <p className="mt-2 text-slate-300 text-sm leading-relaxed">{z.text}</p>
                  </div>
                </ScrollKarte>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEISTUNGSUMFANG */}
      <section className="py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">Leistungsumfang</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight">
              Was wir übernehmen – und was bei Ihrem Team bleibt
            </h2>
          </AnimatedSection>
          <div className="mt-10 grid lg:grid-cols-5 gap-6">
            <AnimatedSection className="lg:col-span-3">
              <div className="bg-paper-100 border border-white/10 rounded-2xl p-8 h-full">
                <h3 className="text-xl font-bold text-white mb-6">Das reinigen wir</h3>
                <div className="space-y-4">
                  {seite.umfang.wir.map((p) => (
                    <LeuchtPunkt key={p}>{p}</LeuchtPunkt>
                  ))}
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection className="lg:col-span-2" delay={0.1}>
              <div className="border border-white/10 rounded-2xl p-8 h-full">
                <h3 className="text-xl font-bold text-white mb-2">Das bleibt bei Ihrem Praxisteam</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Klare Grenzen schützen Patienten, Geräte und Ihre Haftung.
                </p>
                <ul className="space-y-4">
                  {seite.umfang.praxis.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-slate-300">
                      <MinusCircle size={18} className="text-slate-500 shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ZEITEN */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="bg-paper-100 border border-white/10 rounded-3xl p-8 md:p-10 grid md:grid-cols-2 gap-8 items-start">
              <div>
                <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">Reinigungszeiten</span>
                <h2 className="mt-3 text-2xl md:text-3xl font-black tracking-tight text-white">{seite.zeiten.titel}</h2>
                <p className="mt-4 text-slate-300 leading-relaxed">{seite.zeiten.text}</p>
              </div>
              <div className="space-y-4">
                {seite.zeiten.punkte.map((p) => (
                  <LeuchtPunkt key={p}>{p}</LeuchtPunkt>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ABLAUF */}
      <AblaufAngeheftet
        schritte={seite.ablauf}
        titel="So starten wir in Ihrer Praxis"
        text="Vom ersten Anruf bis zur laufenden Betreuung – in fünf klaren Schritten."
      />

      {/* VERTRAUEN */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">Hygiene &amp; Vertrauen</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-black text-white tracking-tight">
              Worauf Sie sich verlassen können
            </h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {seite.vertrauen.map((v, i) => {
              const VIcon = VERTRAUEN_ICONS[i % VERTRAUEN_ICONS.length];
              return (
                <ScrollKarte key={v.titel} spalte={i % spaltenVertrauen}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-7 h-full">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/10 rounded-xl mb-5">
                      <VIcon size={22} className="text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{v.titel}</h3>
                    <p className="mt-2 text-slate-400 text-sm leading-relaxed">{v.text}</p>
                  </div>
                </ScrollKarte>
              );
            })}
          </div>
        </div>
      </section>

      {/* ANFAHRT / STADTTEILE */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">Einsatzgebiet</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight">{seite.anfahrt.titel}</h2>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl">{seite.anfahrt.text}</p>
          </AnimatedSection>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              { titel: `${seite.ort} Westufer`, orte: seite.anfahrt.westufer },
              { titel: `${seite.ort} Ostufer`, orte: seite.anfahrt.ostufer },
              { titel: 'Umland', orte: seite.anfahrt.umland },
            ].map((gruppe, i) => (
              <AnimatedSection key={gruppe.titel} delay={i * 0.05}>
                <div className="bg-paper-100 border border-white/10 rounded-2xl p-6 h-full">
                  <h3 className="font-bold text-white mb-4">{gruppe.titel}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {gruppe.orte.map((o) => (
                      <li key={o} className="px-3 py-1.5 rounded-full border border-white/10 text-sm text-slate-300">
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ERGÄNZUNGEN */}
      <section className="py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">Passt dazu</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight">Alles für Ihre Praxis aus einer Hand</h2>
          </AnimatedSection>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {seite.ergaenzungen.map((e, i) => {
              const s = getServiceById(e.serviceId);
              if (!s) return null;
              return (
                <ScrollKarte key={e.serviceId} spalte={i % spaltenErgaenzung}>
                  <Link
                    to={`/leistungen/${s.id}`}
                    className="block bg-paper-100 border border-white/10 rounded-2xl p-6 hover:border-brand-200 shadow-md transition-all h-full group"
                  >
                    <s.icon size={28} className="text-brand-300 mb-4" />
                    <h3 className="font-bold text-white group-hover:text-brand-300 transition-colors">{s.title}</h3>
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed">{e.text}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300">
                      {s.title} ansehen <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </ScrollKarte>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection className="text-center mb-10">
            <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight">
              Häufige Fragen zur {titelOrt}
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="bg-paper-100 rounded-2xl border border-white/10 px-8 py-4 shadow-md">
              <FAQAccordion items={seite.faqs} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* WEITERFÜHRENDE LINKS */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row gap-4 justify-between">
          <Link
            to={`/leistungen/${service.id}`}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-semibold transition-colors"
          >
            <ArrowLeft size={16} />
            Alles zur {service.title}
          </Link>
          <Link
            to={`/einsatzgebiet/${city.slug}`}
            className="inline-flex items-center gap-2 text-brand-300 font-semibold hover:gap-3 transition-all"
          >
            Gebäudereinigung in {city.name}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <CTASection
        title={`${titelOrt} anfragen`}
        subtitle={`Wir kommen zur kostenlosen Besichtigung in Ihre Praxis in ${seite.ort} und erstellen Ihnen ein Festpreis-Angebot mit klarem Leistungsverzeichnis.`}
      />
    </div>
  );
}
