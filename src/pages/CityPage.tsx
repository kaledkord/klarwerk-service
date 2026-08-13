import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Phone, CheckCircle } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import CTASection from '../components/ui/CTASection';
import FAQAccordion from '../components/ui/FAQAccordion';
import SEO from '../components/SEO';
import { getCityBySlug, cities } from '../data/cities';
import { featuredServices } from '../data/services';

const PHONE = '+49 176 31287131';
const EMAIL = 'info@klarwerk-service.com';
const BASE_URL = 'https://klarwerk-service.com';

export default function CityPage() {
  const { citySlug } = useParams<{ citySlug: string }>();
  const city = citySlug ? getCityBySlug(citySlug) : undefined;

  if (!city) return <Navigate to="/" replace />;

  const cityTitle = `Gebäudereinigung ${city.name} | KlarWerk Service`;
  const cityDesc = city.description;

  const faqs = [
    {
      question: `Bietet KlarWerk Service Gebäudereinigung in ${city.name} an?`,
      answer: `Ja, KlarWerk Service bietet professionelle Gebäudereinigung in ${city.name} und Umgebung an. Wir betreuen Büros, Praxen, Wohnanlagen und Geschäftsobjekte – regelmäßig, zuverlässig und persönlich betreut.`,
    },
    {
      question: `Welche Leistungen bieten Sie in ${city.name} an?`,
      answer: `In ${city.name} bieten wir Büroreinigung, Glasreinigung, Treppenhausreinigung, Hausmeisterservice, Gartenpflege, Grundreinigung, Bauendreinigung und Winterdienst an.`,
    },
    {
      question: `Wie erhalte ich ein Angebot für ${city.name}?`,
      answer: `Kontaktieren Sie uns telefonisch oder über das Kontaktformular. Nach einer kostenlosen Vor-Ort-Besichtigung in ${city.name} erhalten Sie innerhalb von 24 Stunden ein individuelles Angebot.`,
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
    <div className="bg-white">
      <SEO
        title={cityTitle}
        description={cityDesc}
        keywords={`Gebäudereinigung ${city.name}, Reinigungsfirma ${city.name}, Büroreinigung ${city.name}, Glasreinigung ${city.name}, Hausmeisterservice ${city.name}, ${city.region}`}
        canonicalPath={`/einsatzgebiet/${city.slug}`}
        jsonLd={[jsonLd, faqJsonLd, breadcrumbJsonLd]}
      />

      {/* HERO */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                <Link to="/" className="hover:text-slate-600 transition-colors">Start</Link>
                <span>/</span>
                <Link to="/einsatzgebiet" className="hover:text-slate-600 transition-colors">Einsatzgebiet</Link>
                <span>/</span>
                <span className="text-slate-600">{city.name}</span>
              </nav>
              <p className="text-sm font-semibold text-navy-900 uppercase tracking-widest mb-5">
                <MapPin size={14} className="inline mr-1.5 -mt-0.5" />
                {city.region}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                Gebäudereinigung in {city.name}
              </h1>
              <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-xl">
                {city.intro}
              </p>
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={city.image}
                alt={`Professionelle Gebäudereinigung in ${city.name} durch KlarWerk Service`}
                width={720}
                height={480}
                loading="eager"
                decoding="async"
                className="rounded-2xl h-[420px] lg:h-[480px] w-full object-cover shadow-xl shadow-slate-900/10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-navy-700 text-sm font-semibold uppercase tracking-widest">Leistungen vor Ort</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight">
              Unsere Reinigungsleistungen in {city.name}
            </h2>
          </AnimatedSection>
          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {city.highlights.map((h, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl px-5 py-4">
                  <CheckCircle size={18} className="text-cyan-500 shrink-0 mt-0.5" />
                  <p className="text-slate-700 text-sm leading-relaxed">{h}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-navy-700 text-sm font-semibold uppercase tracking-widest">Leistungen</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight">
              Reinigung & Service in {city.name}
            </h2>
            <p className="mt-4 text-slate-500 text-lg max-w-2xl">
              Von Büroreinigung bis Winterdienst – wir bieten das komplette Spektrum der Gebäudereinigung in {city.name}.
            </p>
          </AnimatedSection>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredServices.map((service, i) => (
              <AnimatedSection key={service.id} delay={i * 0.06}>
                <Link
                  to={`/leistungen/${service.id}`}
                  className="block bg-white border border-slate-100 rounded-2xl p-6 hover:border-navy-200 hover:shadow-md transition-all h-full group"
                >
                  <service.icon size={28} className="text-navy-700 mb-4" />
                  <h3 className="font-bold text-slate-900 group-hover:text-navy-900 transition-colors">
                    {service.title} in {city.name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{service.shortDesc}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900">
                    {service.title} ansehen <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* OTHER CITIES */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <span className="text-navy-700 text-sm font-semibold uppercase tracking-widest">Einsatzgebiet</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight">Auch in Ihrer Nähe</h2>
            <p className="mt-4 text-slate-500 text-lg">Unser Schwerpunkt liegt in Schleswig-Holstein rund um Bordesholm, Kiel und Neumünster – darüber hinaus sind wir in Hamburg für Sie da.</p>
          </AnimatedSection>
          <div className="mt-8 flex flex-wrap gap-3">
            {cities.filter((c) => c.slug !== city.slug).map((c, i) => (
              <AnimatedSection key={c.slug} delay={i * 0.05}>
                <Link
                  to={`/einsatzgebiet/${c.slug}`}
                  className="flex items-center gap-2 bg-white border border-slate-200 hover:border-navy-200 hover:bg-navy-50 px-5 py-2.5 rounded-full text-sm font-medium text-slate-700 transition-colors"
                  aria-label={`Gebäudereinigung in ${c.name}`}
                >
                  <MapPin size={13} className="text-navy-600" />{c.name}
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection className="text-center mb-10">
            <span className="text-navy-700 text-sm font-semibold uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight">
              Häufige Fragen zur Gebäudereinigung in {city.name}
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="bg-white rounded-2xl border border-slate-100 px-8 py-4 shadow-sm">
              <FAQAccordion items={faqs} />
            </div>
          </AnimatedSection>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
