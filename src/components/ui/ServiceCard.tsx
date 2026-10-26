import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Service } from '../../data/services';

interface Props {
  service: Service;
}

// Farben aus dem Logo, je Leistung wie die Werkzeuge in den Säulen:
// Blau Reinigung innen, Orange Glas und Solar, Rot Unterhalt und Grundreinigung, Grün draußen.
const LOGOFARBE = { blau: '#35A1DA', orange: '#F5891F', rot: '#F0552B', gruen: '#21A841' };
const FARBE_JE_LEISTUNG: Record<string, keyof typeof LOGOFARBE> = {
  glasreinigung: 'orange',
  unterhaltsreinigung: 'rot',
  grundreinigung: 'rot',
  bauendreinigung: 'rot',
  moebelreinigung: 'rot',
  entruempelung: 'rot',
  hausmeisterservice: 'gruen',
  gartenpflege: 'gruen',
  winterdienst: 'gruen',
};

export default function ServiceCard({ service }: Props) {
  const Icon = service.icon;
  const farbe = LOGOFARBE[FARBE_JE_LEISTUNG[service.id] ?? 'blau'];

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
      className="klw-karte group flex flex-col bg-paper-100 border border-white/10 rounded-2xl p-7 shadow-md transition-all duration-300 h-full"
      style={{ '--c': farbe } as React.CSSProperties}
    >
      <div className="klw-karte-icon inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5">
        <Icon size={22} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">{service.shortDesc}</p>
      <Link
        to={`/leistungen/${service.id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 group-hover:gap-2.5 transition-all duration-200"
        aria-label={`${service.title} – mehr erfahren`}
      >
        {service.title} ansehen
        <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}
