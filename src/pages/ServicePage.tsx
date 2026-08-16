import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Leaf,
  ShieldCheck,
  Award,
  Handshake,
  Sparkles,
  Phone,
} from 'lucide-react';
import SEO from '../components/SEO';
import AnimatedSection from '../components/ui/AnimatedSection';
import ServiceImage from '../components/ui/ServiceImage';
import FAQAccordion from '../components/ui/FAQAccordion';
import ServiceReviews from '../components/ui/ServiceReviews';
import CTASection from '../components/ui/CTASection';
import { businessConfig } from '../config/businessConfig';
import { getServiceById, services } from '../data/services';
import { serviceContents } from '../data/serviceContent';
import { cities } from '../data/cities';

const trustItems = [
  { icon: Award, title: 'Qualitätsversprechen', desc: 'Wir arbeiten nach festen Qualitätsstandards und prüfen jedes Ergebnis vor der Übergabe.' },
  { icon: ShieldCheck, title: 'Zuverlässigkeit', desc: 'Pünktliche Termine, feste Ansprechpartner und verlässliche Qualität bei jedem Einsatz.' },
  { icon: Handshake, title: 'Persönliche Betreuung', desc: 'Sie haben einen festen Ansprechpartner, der Ihr Objekt kennt und Ihre Wünsche umsetzt.' },
  { icon: Sparkles, title: 'Professionelle Arbeitsweise', desc: 'Geschultes Personal, moderne Technik und durchdachte Abläufe für sichtbar bessere Resultate.' },
];

// Preisfaktoren je Leistung – ehrlich, ohne konkrete Preise (Festpreis nach Besichtigung).
const priceFactors: Record<string, string> = {
  gebaeudereinigung: 'Größe des Objekts, Nutzung und Reinigungsfrequenz',
  bueroreinigung: 'Fläche, Anzahl der Räume und Reinigungsfrequenz',
  unterhaltsreinigung: 'Fläche, Frequenz und vereinbartem Leistungsumfang',
  glasreinigung: 'Anzahl, Größe und Zugänglichkeit der Fenster und Glasflächen',
  praxisreinigung: 'Praxisgröße, Raumanzahl und Hygieneanforderungen',
  hausmeisterservice: 'Objektgröße, Aufgabenumfang und Einsatzhäufigkeit',
  gartenpflege: 'Flächengröße, Pflegeumfang und Häufigkeit',
  grundreinigung: 'Fläche, Zustand und gewünschtem Leistungsumfang',
  bauendreinigung: 'Objektgröße, Verschmutzungsgrad und Bauart',
  winterdienst: 'Fläche, Lage und Umfang der Räum- und Streupflicht',
  entruempelung: 'Menge, Etage bzw. Zugang und Entsorgungsaufwand',
  moebelreinigung: 'Art und Anzahl der Möbel sowie Verschmutzungsgrad',
  schulreinigung: 'Gebäudegröße, Raumanzahl und Reinigungsfrequenz',
  'kita-reinigung': 'Einrichtungsgröße, Gruppenanzahl und Hygieneanforderungen',
  pflegeheimreinigung: 'Einrichtungsgröße, Bereichen und Hygieneanforderungen',
  lagerhallenreinigung: 'Hallenfläche, Verschmutzungsgrad und Frequenz',
  gastronomiereinigung: 'Betriebsgröße, Küchenumfang und Reinigungsfrequenz',
  supermarktreinigung: 'Verkaufsfläche, Bereichen und Reinigungsfrequenz',
  schwimmbadreinigung: 'Anlagengröße, Besucherfrequenz und Hygieneanforderungen',
};

export default function ServicePage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const service = serviceId ? getServiceById(serviceId) : undefined;
  const content = serviceId ? serviceContents[serviceId] : undefined;

  if (!service || !content) return <Navigate to="/leistungen" replace />;

  const Icon = service.icon;
  const currentIndex = services.findIndex((s) => s.id === service.id);
  const nextService = services[(currentIndex + 1) % services.length];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.title,
    name: `${service.title} – KlarWerk Service`,
    description: content.seo.description,
    provider: { '@type': 'LocalBusiness', '@id': `${businessConfig.url}/#business`, name: 'KlarWerk Service' },
    areaServed: ['Schleswig-Holstein', 'Bordesholm', 'Kiel', 'Neumünster', 'Rendsburg', 'Hamburg'],
    url: `${businessConfig.url}/leistungen/${service.id}`,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Start', item: `${businessConfig.url}/` },
      { '@type': 'ListItem', position: 2, name: 'Leistungen', item: `${businessConfig.url}/leistungen` },
      { '@type': 'ListItem', position: 3, name: service.title, item: `${businessConfig.url}/leistungen/${service.id}` },
    ],
  };

  return (
    <div className="bg-paper">
      <SEO
        title={content.seo.title}
        description={content.seo.description}
        keywords={content.seo.keywords}
        canonicalPath={`/leistungen/${service.id}`}
        jsonLd={[jsonLd, faqJsonLd, breadcrumbJsonLd]}
      />

      {/* Hero */}
      <section className="pt-36 pb-16 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/leistungen"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-6"
            >
              <ArrowLeft size={14} />
              Alle Leistungen
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-600 rounded-2xl">
                <Icon size={26} className="text-white" />
              </div>
              <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">
                {service.title}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
              {content.h1}
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed">
              {content.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-brand-600/20 hover:-translate-y-0.5"
              >
                Kostenloses Angebot anfragen
                <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+4917631287131"
                className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3.5 rounded-xl transition-colors"
              >
                <Phone size={16} />
                +49 176 31287131
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features image + checklist */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          <AnimatedSection>
            <ServiceImage src={service.image} alt={`${service.title} durch KlarWerk Service`} loading="eager" className="rounded-3xl h-[460px] w-full" imgClassName="shadow-xl shadow-slate-900/10" />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              Das ist im Leistungsumfang enthalten
            </h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              {service.description}
            </p>
            <div className="mt-8 space-y-4">
              {service.features.map((f) => (
                <div key={f} className="flex items-center gap-3 text-slate-700">
                  <div className="w-6 h-6 rounded-full bg-success-50 flex items-center justify-center shrink-0">
                    <CheckCircle size={14} className="text-success-500" />
                  </div>
                  {f}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">
              Ablauf
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight">
              Unsere Vorgehensweise
            </h2>
            <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto">
              Schritt für Schritt zu einem sauberen Ergebnis – transparent und zuverlässig.
              Den genauen Zeitrahmen für Ihr Objekt nennen wir verbindlich im Angebot.
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.process.map((step, i) => (
              <AnimatedSection key={step.title} delay={i * 0.08}>
                <div className="bg-white border border-slate-200 rounded-2xl p-8 h-full shadow-md hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center justify-center w-9 h-9 bg-brand-600 text-white text-sm font-bold rounded-lg">
                      {i + 1}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Kosten & Bedingungen */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">
              Kosten &amp; Bedingungen
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight">
              Was kostet die {service.title}?
            </h2>
            <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto">
              Bei KlarWerk Service gibt es keinen Tarif von der Stange. Nach einer kostenlosen
              Besichtigung erfassen wir alle Angaben in unserem eigenen Kalkulationsprogramm für die
              Gebäudereinigung – und erstellen daraus ein faires, transparentes Festpreis-Angebot,
              das genau zu Ihrem Objekt passt.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
                {[
                  'Individueller Festpreis nach kostenloser Vor-Ort-Besichtigung – transparent und ohne versteckte Kosten',
                  'Faire Kalkulation über unser eigenes Programm für Gebäudereinigung – für alle Kunden nach denselben Maßstäben',
                  'Als einmalige Leistung oder im regelmäßigen Turnus – ganz nach Ihrem Bedarf',
                  `Der Preis richtet sich nach: ${priceFactors[service.id] ?? 'Umfang, Häufigkeit und Zustand des Objekts'}`,
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle size={18} className="text-brand-600 shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-slate-600 text-sm max-w-md">
                  Voraussetzung ist lediglich ein kurzer Besichtigungstermin – unverbindlich und kostenfrei.
                </p>
                <Link
                  to="/kontakt"
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition duration-200 active:scale-[0.98] shrink-0"
                >
                  Festpreis anfragen
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">
              Vorteile
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight">
              Vorteile für unsere Kunden
            </h2>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.advantages.map((a, i) => {
              const AIcon = a.icon;
              return (
                <AnimatedSection key={a.title} delay={i * 0.08}>
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 h-full shadow-md hover:shadow-md transition-shadow">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-50 rounded-xl mb-5">
                      <AIcon size={22} className="text-cyan-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{a.title}</h3>
                    <p className="mt-2 text-slate-600 text-sm leading-relaxed">{a.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Einsatzbereiche */}
      <section className="py-24 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">
              Einsatzbereiche
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight">
              Für wen wir arbeiten
            </h2>
            <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
              Unsere Kunden kommen aus unterschiedlichsten Branchen – von der Praxis bis zum Privathaushalt.
            </p>
          </AnimatedSection>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {content.areas.map((area, i) => {
              const AIcon = area.icon;
              return (
                <AnimatedSection key={area.label} delay={i * 0.05}>
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center text-center gap-3 h-full shadow-md hover:shadow-md transition-shadow">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-50 rounded-xl">
                      <AIcon size={22} className="text-brand-700" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{area.label}</span>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <div className="inline-flex items-center justify-center w-14 h-14 bg-success-50 rounded-2xl mb-6">
              <Leaf size={26} className="text-success-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Nachhaltigkeit bei dieser Leistung
            </h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Sauberkeit mit Verantwortung – auch bei dieser Leistung achten wir auf einen bewussten Umgang mit Ressourcen.
            </p>
            <div className="mt-8 space-y-4">
              {content.sustainability.map((s) => (
                <div key={s} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle size={18} className="text-success-500 shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{s}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <ServiceImage src="https://images.unsplash.com/photo-1638068109209-002be3ae4950?auto=format&fit=crop&w=900&q=80" alt="Nachhaltigkeit bei KlarWerk Service" className="rounded-3xl h-[420px] w-full" imgClassName="shadow-xl shadow-slate-900/10" />
          </AnimatedSection>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-widest">
              Vertrauen
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-black text-white tracking-tight">
              Warum KlarWerk Service?
            </h2>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto">
              Wir übernehmen Verantwortung – für Ihr Objekt, für unsere Mitarbeiter und für die Umwelt.
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((t, i) => {
              const TIcon = t.icon;
              return (
                <AnimatedSection key={t.title} delay={i * 0.08}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full hover:bg-white/10 transition-colors">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-500/10 rounded-xl mb-5">
                      <TIcon size={22} className="text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{t.title}</h3>
                    <p className="mt-2 text-slate-400 text-sm leading-relaxed">{t.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Region cross-links */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">Vor Ort</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight">
              {service.title} in Ihrer Region
            </h2>
            <p className="mt-4 text-slate-500 text-lg max-w-2xl">
              KlarWerk Service ist in ganz Schleswig-Holstein und Hamburg im Einsatz.
              Wählen Sie Ihren Standort für Details zur {service.title} vor Ort.
            </p>
          </AnimatedSection>
          <div className="mt-8 flex flex-wrap gap-3">
            {cities.filter((c) => c.tier === 1).map((c, i) => (
              <AnimatedSection key={c.slug} delay={i * 0.05}>
                <Link
                  to={`/einsatzgebiet/${c.slug}`}
                  className="flex items-center gap-2 bg-white border border-slate-200 hover:border-brand-200 hover:bg-brand-50 px-5 py-2.5 rounded-full text-sm font-medium text-slate-700 transition-colors"
                  aria-label={`${service.title} in ${c.name}`}
                >
                  {service.title} in {c.name}
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <ServiceReviews serviceId={service.id} serviceTitle={service.title} />

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">
              FAQ
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-black tracking-tight">
              Häufige Fragen
            </h2>
            <p className="mt-4 text-slate-500 text-lg">
              Die wichtigsten Fragen rund um {service.title} bei KlarWerk Service.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <FAQAccordion items={content.faqs} />
          </AnimatedSection>
        </div>
      </section>

      {/* Next service */}
      <section className="py-16 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-slate-500">Nächste Leistung</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{nextService.title}</h3>
            </div>
            <Link
              to={`/leistungen/${nextService.id}`}
              className="inline-flex items-center gap-2 text-brand-700 font-semibold hover:gap-3 transition-all"
            >
              Weiter zu {nextService.title}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <CTASection
        title={`Interesse an ${service.title}?`}
        subtitle="Fordern Sie jetzt Ihr kostenloses und unverbindliches Angebot an. Wir vereinbaren zeitnah eine Besichtigung und erstellen Ihnen ein faires Festpreis-Angebot."
      />
    </div>
  );
}
