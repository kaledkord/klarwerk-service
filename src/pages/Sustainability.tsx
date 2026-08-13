import { motion } from 'framer-motion';
import { CheckCircle, Leaf, Droplets, Recycle, Route, Sprout, ArrowRight } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import CTASection from '../components/ui/CTASection';
import SEO from '../components/SEO';
import { seoConfig } from '../config/seoConfig';

const goals = [
  { icon: Leaf, title: 'Weniger Chemie', desc: 'Optimierter Einsatz von Reinigungsmitteln.' },
  { icon: Droplets, title: 'Weniger Wasserverbrauch', desc: 'Effiziente Reinigungstechniken.' },
  { icon: Recycle, title: 'Mehr Wiederverwendung', desc: 'Nachhaltige Materialien und Arbeitsweisen.' },
  { icon: Route, title: 'Effiziente Wegeplanung', desc: 'Weniger unnötige Fahrten.' },
];

const ecoMeasures = [
  'Einsatz umweltschonender Reinigungsmittel, wo möglich',
  'Dosierte Verwendung von Reinigungsprodukten zur Vermeidung unnötiger Chemie',
  'Moderne Reinigungstechniken für bessere Ergebnisse bei geringerem Verbrauch',
  'Vermeidung von Einwegmaterialien durch wiederverwendbare Reinigungstextilien',
];

const workMeasures = [
  'Effiziente Planung von Reinigungseinsätzen zur Reduzierung von Fahrwegen',
  'Sorgsamer Umgang mit Materialien und Arbeitsmitteln',
  'Langlebige Pflege von Böden und Oberflächen durch professionelle Reinigung',
  'Ordnungsgemäße Entsorgung von Abfällen',
];

const gardenMeasures = [
  'Umweltbewusste Pflege von Grünflächen',
  'Förderung eines gesunden Pflanzenwachstums',
  'Vermeidung unnötiger Eingriffe in die Natur',
];

export default function Sustainability() {
  return (
    <div className="bg-white">
      <SEO
        {...seoConfig['/nachhaltigkeit']}
        keywords="Nachhaltigkeit Gebäudereinigung, umweltfreundliche Reinigung, ökologische Reinigungsmittel, KlarWerk Service Nachhaltigkeit"
      />

      {/* Hero */}
      <section className="pt-36 pb-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <span className="text-navy-700 text-sm font-semibold uppercase tracking-widest">Nachhaltigkeit</span>
            <h1 className="mt-3 text-5xl md:text-6xl font-black tracking-tight">
              Sauberkeit mit<br />Verantwortung.
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed">
              Bei KlarWerk Service verbinden wir professionelle Gebäudereinigung mit einem verantwortungsvollen Umgang mit unserer Umwelt. Unser Ziel ist es, hochwertige Reinigungslösungen anzubieten, die nicht nur gründlich reinigen, sondern auch Ressourcen schonen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Goals grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Unsere Nachhaltigkeits-Ziele</h2>
            <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">
              Konkrete Maßnahmen statt großer Versprechen – das ist unser Ansatz.
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {goals.map((g, i) => {
              const Icon = g.icon;
              return (
                <AnimatedSection key={g.title} delay={i * 0.1}>
                  <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center hover:shadow-md transition-shadow h-full">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-success-50 rounded-2xl mb-5">
                      <Icon size={26} className="text-success-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{g.title}</h3>
                    <p className="mt-2 text-slate-600 leading-relaxed text-sm">{g.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Eco-friendly cleaning */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <img
              src="/images.jpg"
              alt="Umweltfreundliche Reinigung"
              className="rounded-3xl h-[420px] w-full object-cover"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Umweltfreundliche Reinigung</h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Wir setzen auf moderne und effiziente Reinigungsmethoden, um den Verbrauch von Wasser, Energie und Reinigungsmitteln zu reduzieren.
            </p>
            <div className="mt-8 space-y-3">
              {ecoMeasures.map((m) => (
                <div key={m} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle size={18} className="text-success-500 shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{m}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Sustainable work practices */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection className="lg:order-2">
            <img
              src="/1096661_028b195047ea5ccd409ca5192a87c92d.jpg"
              alt="Nachhaltige Arbeitsweise"
              className="rounded-3xl h-[420px] w-full object-cover"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1} className="lg:order-1">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Nachhaltige Arbeitsweise</h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Nachhaltigkeit bedeutet für uns nicht nur Umweltbewusstsein, sondern auch verantwortungsvolles Handeln im täglichen Betrieb.
            </p>
            <div className="mt-8 space-y-3">
              {workMeasures.map((m) => (
                <div key={m} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle size={18} className="text-success-500 shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{m}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Value preservation */}
      <section className="py-24 bg-navy-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6">
              <Recycle size={30} className="text-cyan-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Werterhalt statt Wegwerfen</h2>
            <p className="mt-6 text-lg text-slate-400 leading-relaxed">
              Eine regelmäßige professionelle Reinigung verlängert die Lebensdauer von Böden, Möbeln und Gebäudeeinrichtungen. Dadurch helfen wir unseren Kunden, Ressourcen zu sparen und langfristig Kosten zu reduzieren.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Garden care */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <img
              src="/landscape-tree-nature-forest-grass-wilderness-911049-pxhere.com.jpg"
              alt="Nachhaltige Gartenpflege"
              className="rounded-3xl h-[420px] w-full object-cover"
            />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="inline-flex items-center justify-center w-14 h-14 bg-success-50 rounded-2xl mb-5">
              <Sprout size={26} className="text-success-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Nachhaltige Pflege von Außenanlagen</h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Auch im Bereich Gartenpflege achten wir auf einen bewussten Umgang mit der Natur.
            </p>
            <div className="mt-8 space-y-3">
              {gardenMeasures.map((m) => (
                <div key={m} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle size={18} className="text-success-500 shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{m}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Closing statement */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Gemeinsam für eine saubere Zukunft</h2>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed">
              Nachhaltigkeit funktioniert nur gemeinsam. Deshalb beraten wir unsere Kunden gerne, wie Reinigung und Pflege umweltbewusster gestaltet werden können.
            </p>
            <p className="mt-6 text-base font-semibold text-navy-700">
              KlarWerk Service – Sauberkeit, Qualität und Verantwortung.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <CTASection
        title="Gemeinsam nachhaltig reinigen?"
        subtitle="Sprechen Sie uns an – wir beraten Sie gerne zu umweltbewussten Reinigungslösungen für Ihr Objekt."
        primaryLabel="Beratung anfragen"
      />
    </div>
  );
}
