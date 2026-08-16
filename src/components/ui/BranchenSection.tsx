import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Stethoscope,
  GraduationCap,
  ShoppingBag,
  Home,
  Factory,
  Hotel,
  Wrench,
  ArrowRight,
} from 'lucide-react';
import { easeOut } from '../../lib/motion';

const branches = [
  {
    icon: Building2,
    title: 'Bürogebäude & Unternehmen',
    desc: 'Regelmäßige Unterhaltsreinigung, Glasreinigung und Sanitärpflege für Gewerbeobjekte jeder Größe.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Stethoscope,
    title: 'Arztpraxen & Gesundheitswesen',
    desc: 'Hygienegerechte Reinigung nach den Anforderungen medizinischer Einrichtungen.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Home,
    title: 'Wohnanlagen & Immobilien',
    desc: 'Treppenhausreinigung, Außenanlagenpflege und Hausmeisterdienste für Wohnimmobilien.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: ShoppingBag,
    title: 'Handel & Einzelhandel',
    desc: 'Verkaufsflächen, Lagerbereiche und Eingangszonen stets sauber und repräsentativ.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: GraduationCap,
    title: 'Bildungseinrichtungen & Kitas',
    desc: 'Sichere, hygienische Reinigung für Schulen, Kitas und Bildungsstätten.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: Factory,
    title: 'Industrie & Produktion',
    desc: 'Industriereinigung, Maschinenpflege und Hallenreinigung für Produktionsbetriebe.',
    color: 'bg-slate-100 text-slate-600',
  },
  {
    icon: Hotel,
    title: 'Hotels & Gastronomie',
    desc: 'Zimmer-, Küchen- und Gemeinschaftsflächenreinigung mit höchstem Hygienestandard.',
    color: 'bg-cyan-50 text-cyan-600',
  },
  {
    icon: Wrench,
    title: 'Hausmeister & Facility',
    desc: 'Ganzheitlicher Gebäudeservice – von kleinen Reparaturen bis zur kompletten Objektbetreuung.',
    color: 'bg-orange-50 text-orange-600',
  },
];

export default function BranchenSection() {
  return (
    <section className="py-28 bg-paper">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="max-w-3xl"
        >
          <span className="text-brand-700 text-xs font-bold uppercase tracking-widest">
            Branchen &amp; Zielgruppen
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Für wen wir arbeiten
          </h2>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">
            Von kleinen Büros bis zu großen Industrieanlagen — wir bieten
            maßgeschneiderte Reinigungslösungen für jede Branche und jeden Bedarf.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {branches.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: easeOut }}
                className="group bg-white border border-slate-200 hover:border-slate-200 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:shadow-slate-900/6 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5 ${b.color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-bold text-slate-900 leading-snug">{b.title}</h3>
                <p className="mt-2.5 text-sm text-slate-500 leading-relaxed">{b.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15, ease: easeOut }}
          className="mt-12 flex items-center gap-2"
        >
          <Link
            to="/leistungen"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:gap-2.5 transition-all"
          >
            Alle Leistungen im Überblick <ArrowRight size={15} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
