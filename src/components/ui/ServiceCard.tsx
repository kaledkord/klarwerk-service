import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Service } from '../../data/services';
import { LOGOFARBE, farbeVon } from '../../data/leistungsbereiche';

interface Props {
  service: Service;
  /** Unter 640 px als schmale Zeile ohne Beschreibung, damit lange Listen auf dem Handy kurz bleiben. */
  kompaktMobil?: boolean;
}

// Leiste und Symbol in der Logofarbe des Leistungsbereichs (wie die vier Säulen im Logo):
// Blau regelmäßig, Orange Branchen, Rot einmalig, Grün Haus und Außenanlagen.
export default function ServiceCard({ service, kompaktMobil = false }: Props) {
  const Icon = service.icon;
  const farbe = LOGOFARBE[farbeVon(service)];
  const k = kompaktMobil;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
      className={`klw-karte group flex bg-paper-100 border border-white/10 rounded-2xl shadow-md transition-all duration-300 h-full ${
        k ? 'flex-row items-center gap-4 p-3 pr-5 sm:flex-col sm:items-stretch sm:gap-0 sm:p-7' : 'flex-col p-7'
      }`}
      style={{ '--c': farbe } as React.CSSProperties}
    >
      <div
        className={`klw-karte-icon inline-flex shrink-0 items-center justify-center rounded-xl ${
          k ? 'w-10 h-10 sm:w-12 sm:h-12 sm:mb-5' : 'w-12 h-12 mb-5'
        }`}
      >
        <Icon size={22} />
      </div>
      <h3 className={`font-bold text-white ${k ? 'flex-1 text-base sm:flex-none sm:text-lg sm:mb-2' : 'text-lg mb-2'}`}>
        {service.title}
      </h3>
      <p className={`text-slate-400 text-sm leading-relaxed flex-1 mb-5 ${k ? 'hidden sm:block' : ''}`}>{service.shortDesc}</p>
      {/* Der Link deckt die ganze Karte ab (after:inset-0), so ist jede Stelle der Karte anklickbar. */}
      <Link
        to={`/leistungen/${service.id}`}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 group-hover:gap-2.5 transition-all duration-200 after:absolute after:inset-0 after:rounded-2xl"
        aria-label={`${service.title} – mehr erfahren`}
      >
        <span className={k ? 'hidden sm:inline' : ''}>{service.title} ansehen</span>
        <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}
