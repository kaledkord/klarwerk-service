import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import CTASection from '../components/ui/CTASection';
import SEO from '../components/SEO';
import { seoConfig } from '../config/seoConfig';
import { cities } from '../data/cities';

const BASE_URL = 'https://klarwerk-service.com';

export default function CitiesOverview() {
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Einsatzgebiete von KlarWerk Service',
    itemListElement: cities.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `Gebäudereinigung ${c.name}`,
      url: `${BASE_URL}/einsatzgebiet/${c.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Start', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Einsatzgebiet', item: `${BASE_URL}/einsatzgebiet` },
    ],
  };

  return (
    <div className="bg-white">
      <SEO
        {...seoConfig['/einsatzgebiet']}
        keywords="Gebäudereinigung Schleswig-Holstein, Gebäudereinigung Kiel, Reinigungsfirma Bordesholm, Reinigungsfirma Neumünster, Reinigungsfirma Rendsburg, Gebäudereinigung Hamburg"
        jsonLd={[itemListJsonLd, breadcrumbJsonLd]}
      />

      {/* HERO */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link to="/" className="hover:text-slate-600 transition-colors">Start</Link>
            <span>/</span>
            <span className="text-slate-600">Einsatzgebiet</span>
          </nav>
          <p className="text-sm font-semibold text-brand-700 uppercase tracking-widest mb-5">
            <MapPin size={14} className="inline mr-1.5 -mt-0.5" />
            Schleswig-Holstein, Hamburg &amp; NRW
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Unser Einsatzgebiet
          </h1>
          <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-2xl">
            KlarWerk Service ist in ganz Schleswig-Holstein, Hamburg und Nordrhein-Westfalen für Sie da.
            Wählen Sie Ihren Standort für detaillierte Informationen zu unseren
            Reinigungsleistungen vor Ort.
          </p>
        </div>
      </section>

      {/* CITY CARDS */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city, i) => (
              <AnimatedSection key={city.slug} delay={i * 0.06}>
                <Link
                  to={`/einsatzgebiet/${city.slug}`}
                  className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-brand-200 shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={city.image}
                      alt={`Gebäudereinigung in ${city.name} durch KlarWerk Service`}
                      width={400}
                      height={192}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent" />
                    <div className="absolute bottom-4 left-5 flex items-center gap-2 text-white">
                      <MapPin size={16} className="text-cyan-300" />
                      <span className="font-bold text-lg">{city.name}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                      {city.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                      Gebäudereinigung in {city.name}
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
