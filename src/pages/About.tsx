import { motion } from 'framer-motion';
import { CheckCircle, Users, Award, HeartHandshake, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedSection from '../components/ui/AnimatedSection';
import AnimatedLogo from '../components/ui/AnimatedLogo';
import CTASection from '../components/ui/CTASection';
import SEO from '../components/SEO';
import { seoConfig } from '../config/seoConfig';

const values = [
  { icon: Award, title: 'Qualität', desc: 'Wir liefern konstant hohe Qualität – nicht nur beim ersten Mal, sondern jeden Tag aufs Neue.' },
  { icon: HeartHandshake, title: 'Vertrauen', desc: 'Verlässlichkeit ist unsere Basis. Sie können sich zu 100% auf unsere Zusagen verlassen.' },
  { icon: Users, title: 'Teamwork', desc: 'Geschulte Mitarbeiter, die mit Engagement und Sorgfalt für Sie im Einsatz sind.' },
];

export default function About() {
  return (
    <div className="bg-paper">
      <SEO
        {...seoConfig['/ueber-uns']}
        keywords="Über KlarWerk Service, Gebäudereinigung Unternehmen, Reinigungsfirma Schleswig-Holstein"
      />

      <section className="pt-36 pb-20 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
            <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">Über uns</span>
            <h1 className="mt-3 text-5xl md:text-6xl font-black tracking-tight">Ihr Partner für<br />saubere Lösungen.</h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl leading-relaxed">
              KlarWerk Service ist Ihr zuverlässiger Partner für professionelle Gebäudereinigung und Gebäudeservice in Schleswig-Holstein, Hamburg und NRW. Seit über 10 Jahren stehen wir für Qualität, Zuverlässigkeit und persönliche Betreuung.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <AnimatedSection>
            <AnimatedLogo />
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Unsere Mission</h2>
            <p className="mt-5 text-slate-600 leading-relaxed">
              Wir glauben, dass Sauberkeit mehr ist als nur eine Aufgabe – sie ist ein Beitrag zu einem angenehmen Arbeits- und Wohnumfeld. Deshalb arbeiten wir mit Sorgfalt, Engagement und einem Auge fürs Detail.
            </p>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Unser Team besteht aus geschulten und zuverlässigen Mitarbeitern, die ihr Handwerk verstehen. Wir behandeln jedes Objekt mit der gleichen Sorgfalt, als wäre es unser eigenes.
            </p>
            <div className="mt-8 space-y-3">
              {['Geschultes und motiviertes Personal', 'Moderne Reinigungstechnik und -mittel', 'Umweltbewusste Arbeitsweise', 'Fester Ansprechpartner für alle Anliegen'].map((t) => (
                <div key={t} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle size={18} className="text-success-500 shrink-0" />{t}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-24 bg-paper">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Unsere Werte</h2>
            <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto">Worauf wir bei KlarWerk Service besonders achten.</p>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <AnimatedSection key={v.title} delay={i * 0.1}>
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-md hover:shadow-md transition-shadow h-full">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-50 rounded-2xl mb-5">
                      <Icon size={26} className="text-brand-700" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">{v.title}</h3>
                    <p className="mt-3 text-slate-600 leading-relaxed text-sm">{v.desc}</p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 mb-6">
              <Leaf className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 mb-4">
              Nachhaltigkeit ist uns wichtig
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Wir setzen auf umweltfreundliche Reinigungsmittel, ressourcenschonende Verfahren und
              eine verantwortungsvolle Betriebsführung. Unser Ziel: saubere Ergebnisse, die auch
              der Umwelt zugutekommen.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              Von biologisch abbaubaren Produkten bis hin zur Optimierung unserer Fahrzeugrouten –
              Nachhaltigkeit ist nicht nur ein Schlagwort, sondern gelebte Praxis bei KlarWerk Service.
            </p>
            <Link
              to="/nachhaltigkeit"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200"
            >
              <Leaf className="w-4 h-4" />
              Mehr zu unserer Nachhaltigkeit
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <CTASection
        title="Möchten Sie uns kennenlernen?"
        subtitle="Vereinbaren Sie ein unverbindliches Gespräch. Wir freuen uns auf Ihre Anfrage."
      />
    </div>
  );
}
