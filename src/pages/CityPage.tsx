import Bild from '../components/ui/Bild';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowRight, MapPin, Phone, CheckCircle } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import CTASection from '../components/ui/CTASection';
import FAQAccordion from '../components/ui/FAQAccordion';
import ScrollKarte from '../components/ui/ScrollKarte';
import SeitenKopf from '../components/ui/SeitenKopf';
import StaedteWaagerecht from '../components/ui/StaedteWaagerecht';
import SEO from '../components/SEO';
import { getCityBySlug } from '../data/cities';
import { featuredServices } from '../data/services';
import { getLokaleSeite, lokalerPfad } from '../data/lokaleSeiten';
import { useSpalten } from '../lib/scrollEffekte';

const PHONE = '+49 176 31287131';
const EMAIL = 'info@klarwerk-service.com';
const BASE_URL = 'https://klarwerk-service.com';

export default function CityPage() {
  const { citySlug } = useParams<{ citySlug: string }>();
  const city = citySlug ? getCityBySlug(citySlug) : undefined;
  // Spalten der Raster für den versetzten Aufstieg der Karten (vor dem frühen Return, wegen der Hook-Regeln).
  const spaltenHighlights = useSpalten(2, 2);
  const spaltenLeistungen = useSpalten(2, 3);

  if (!city) return <Navigate to="/" replace />;

  const cityTitle = city.seoTitle ?? `Gebäudereinigung ${city.name} | KlarWerk Service`;
  const cityDesc = city.description;

  const faqs = [
    ...(city.faqs ?? []),
    {
      question: `Bietet KlarWerk Service Gebäudereinigung in ${city.name} an?`,
      answer: `Ja, KlarWerk Service bietet professionelle Gebäudereinigung in ${city.name} und Umgebung an. Wir betreuen Büros, Praxen, Wohnanlagen und Geschäftsobjekte – regelmäßig, zuverlässig und persönlich betreut.`,
    },
    {
      question: `Welche Leistungen bieten Sie in ${city.name} an?`,
      answer: `In ${city.name} bieten wir Büroreinigung, Glasreinigung, Treppenhausreinigung, Hausmeisterservice, Gartenpflege, Grundreinigung und Bauendreinigung an.`,
    },
    {
      question: `Wie erhalte ich ein Angebot für ${city.name}?`,
      answer: `Kontaktieren Sie uns telefonisch oder über das Kontaktformular. Nach einer kostenlosen Vor-Ort-Besichtigung in ${city.name} erhalten Sie ein individuelles, faires Festpreis-Angebot.`,
    },
    {
      question: `Reinigen Sie in ${city.name} auch außerhalb der Geschäftszeiten?`,
      answer: `Ja. Auf Wunsch reinigen wir frühmorgens, abends oder am Wochenende, damit Ihr Betrieb in ${city.name} ungestört weiterlaufen kann.`,
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Gebäudereinigung ${city.name}`,
    serviceType: 'Gebäudereinigung',
    description: city.description,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${BASE_URL}/#business`,
      name: 'KlarWerk Service',
      telephone: PHONE,
      email: EMAIL,
    },
    areaServed: { '@type': 'City', name: city.name },
    url: `${BASE_URL}/einsatzgebiet/${city.slug}`,
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
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
      { '@type': 'ListItem', position: 2, name: 'Einsatzgebiet', item: `${BASE_URL}/einsatzgebiet` },
      { '@type': 'ListItem', position: 3, name: city.name, item: `${BASE_URL}/einsatzgebiet/${city.slug}` },
    ],
  };

  return (
    <div className="bg-paper">
      <SEO
        title={cityTitle}
        description={cityDesc}
        keywords={`Gebäudereinigung ${city.name}, Reinigungsfirma ${city.name}, Büroreinigung ${city.name}, Glasreinigung ${city.name}, Hausmeisterservice ${city.name}, ${city.region}`}
        canonicalPath={`/einsatzgebiet/${city.slug}`}
        jsonLd={[jsonLd, faqJsonLd, breadcrumbJsonLd]}
      />

      {/* HERO */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 bg-paper">
        <SeitenKopf className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="klw-auftritt">
              <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <Link to="/" className="hover:text-slate-300 transition-colors">Start</Link>
                <span>/</span>
                <Link to="/einsatzgebiet" className="hover:text-slate-300 transition-colors">Einsatzgebiet</Link>
                <span>/</span>
                <span className="text-slate-300">{city.name}</span>
              </nav>
              <p className="text-sm font-semibold text-brand-300 uppercase tracking-widest mb-5">
                <MapPin size={14} className="inline mr-1.5 -mt-0.5" />
                {city.region}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Gebäudereinigung in {city.name}
              </h1>
              <p className="mt-6 text-lg text-slate-400 leading-relaxed max-w-xl">
                {city.intro}
              </p>
              {city.eigeneSeiten && (
                <p className="mt-4 text-lg text-slate-400 leading-relaxed max-w-xl">
                  {city.eigeneSeiten.vorspann}{' '}
                  {city.eigeneSeiten.links.map((l, i, alle) => (
                    <span key={l.to}>
                      <Link to={l.to} className="text-brand-300 font-semibold underline underline-offset-2 hover:no-underline">
                        {l.label}
                      </Link>
                      {i < alle.length - 2 ? ', ' : i === alle.length - 2 ? ' und ' : '.'}
                    </span>
                  ))}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/kontakt" className="btn-primary">
                  Kostenloses Angebot
                  <ArrowRight size={16} />
                </Link>
                <a href={`tel:${PHONE.replace(/\s/g, '')}`} className="btn-secondary">
                  <Phone size={15} />
                  Jetzt anrufen
                </a>
              </div>
            </div>

            <div className="klw-auftritt-spaet">
              <Bild
                src={city.image}
                alt={`Professionelle Gebäudereinigung in ${city.name} durch KlarWerk Service`}
                width={720}
                height={480}
                prioritaet
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="rounded-2xl h-[420px] lg:h-[480px] w-full object-cover shadow-xl shadow-slate-900/10"
              />
            </div>
          </div>
        </SeitenKopf>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">Leistungen vor Ort</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight">
              Unsere Reinigungsleistungen in {city.name}
            </h2>
          </AnimatedSection>
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {city.highlights.map((h, i) => (
              <ScrollKarte key={i} spalte={i % spaltenHighlights}>
                {typeof h === 'string' ? (
                  <div className="flex h-full items-start gap-3 bg-paper-100 border border-white/10 rounded-xl px-5 py-4">
                    <CheckCircle size={18} className="text-cyan-500 shrink-0 mt-0.5" />
                    <p className="text-slate-200 text-sm leading-relaxed">{h}</p>
                  </div>
                ) : (
                  <Link
                    to={h.to}
                    className="flex h-full items-start gap-3 bg-paper-100 border border-white/10 hover:border-brand-200 rounded-xl px-5 py-4 transition-colors group"
                  >
                    <CheckCircle size={18} className="text-cyan-500 shrink-0 mt-0.5" />
                    <span className="text-slate-200 group-hover:text-brand-300 text-sm leading-relaxed transition-colors">
                      {h.text}
                      <ArrowRight size={14} className="inline ml-1.5 -mt-0.5 opacity-70" />
                    </span>
                  </Link>
                )}
              </ScrollKarte>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">Leistungen</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight">
              Reinigung & Service in {city.name}
            </h2>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl">
              Von Büroreinigung bis Hausmeisterservice – wir bieten das komplette Spektrum der Gebäudereinigung in {city.name}.
            </p>
          </AnimatedSection>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredServices.map((service, i) => (
              <ScrollKarte key={service.id} spalte={i % spaltenLeistungen}>
                <Link
                  to={
                    getLokaleSeite(service.id, city.slug)
                      ? lokalerPfad({ serviceId: service.id, citySlug: city.slug })
                      : `/leistungen/${service.id}`
                  }
                  className="block bg-paper-100 border border-white/10 rounded-2xl p-6 hover:border-brand-200 shadow-md hover:shadow-md transition-all h-full group"
                >
                  <service.icon size={28} className="text-brand-300 mb-4" />
                  <h3 className="font-bold text-white group-hover:text-brand-300 transition-colors">
                    {service.title} in {city.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{service.shortDesc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300">
                    {service.title} ansehen <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </ScrollKarte>
            ))}
          </div>
        </div>
      </section>

      {/* OTHER CITIES (waagerecht, angeheftet) */}
      <StaedteWaagerecht
        titel="Auch in Ihrer Nähe"
        text="Unser Schwerpunkt liegt in Schleswig-Holstein rund um Bordesholm, Kiel und Neumünster – darüber hinaus sind wir in Hamburg für Sie da."
        ohne={city.slug}
      />

      {/* FAQ */}
      <section className="py-20 bg-paper">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection className="text-center mb-10">
            <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight">
              Häufige Fragen zur Gebäudereinigung in {city.name}
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="bg-paper-100 rounded-2xl border border-white/10 px-8 py-4 shadow-md">
              <FAQAccordion items={faqs} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
