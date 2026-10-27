import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import ServiceCard from '../components/ui/ServiceCard';
import ScrollKarte from '../components/ui/ScrollKarte';
import SeitenKopf from '../components/ui/SeitenKopf';
import CTASection from '../components/ui/CTASection';
import { services } from '../data/services';
import { seoConfig } from '../config/seoConfig';
import { useSpalten } from '../lib/scrollEffekte';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: services.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: s.title,
    description: s.shortDesc,
  })),
};

export default function Services() {
  const spalten = useSpalten(2, 3);
  return (
    <div className="bg-paper">
      <SEO
        {...seoConfig['/leistungen']}
        keywords="Gebäudereinigung Leistungen, Büroreinigung, Glasreinigung, Hausmeisterservice, Gartenpflege, Schleswig-Holstein, Hamburg"
        jsonLd={jsonLd}
      />

      <section className="pt-36 pb-16 bg-paper">
        <SeitenKopf className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">Leistungen</span>
            <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight hyphens-auto">Unsere Dienstleistungen</h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
              Von der regelmäßigen Büroreinigung bis zum kompletten Hausmeisterservice – wir bieten Ihnen maßgeschneiderte Lösungen für Ihr Objekt.
            </p>
          </motion.div>
        </SeitenKopf>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Scroll-Effekt 3: Karten steigen beim Scrollen auf, Spalte für Spalte versetzt. */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <ScrollKarte key={service.id} spalte={i % spalten}>
                <ServiceCard service={service} />
              </ScrollKarte>
            ))}
          </div>
        </div>
      </section>


      <CTASection
        title="Sie brauchen eine individuelle Lösung?"
        subtitle="Wir beraten Sie gerne und erstellen ein auf Ihre Bedürfnisse zugeschnittenes Angebot."
      />
    </div>
  );
}
