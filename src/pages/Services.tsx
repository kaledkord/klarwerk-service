import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import ServiceCard from '../components/ui/ServiceCard';
import { StaggerGroup, StaggerItem } from '../components/ui/AnimatedSection';
import CTASection from '../components/ui/CTASection';
import { services } from '../data/services';
import { seoConfig } from '../config/seoConfig';

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
  return (
    <div className="bg-white">
      <SEO
        {...seoConfig['/leistungen']}
        keywords="Gebäudereinigung Leistungen, Büroreinigung, Glasreinigung, Hausmeisterservice, Gartenpflege, Schleswig-Holstein, Hamburg"
        jsonLd={jsonLd}
      />

      <section className="pt-36 pb-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">Leistungen</span>
            <h1 className="mt-3 text-5xl md:text-6xl font-black tracking-tight">Unsere Dienstleistungen</h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed">
              Von der regelmäßigen Büroreinigung bis zum kompletten Hausmeisterservice – wir bieten Ihnen maßgeschneiderte Lösungen für Ihr Objekt.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <StaggerGroup className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <StaggerItem key={service.id}>
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>


      <CTASection
        title="Sie brauchen eine individuelle Lösung?"
        subtitle="Wir beraten Sie gerne und erstellen ein auf Ihre Bedürfnisse zugeschnittenes Angebot."
      />
    </div>
  );
}
