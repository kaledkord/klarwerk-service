import { Link } from 'react-router-dom';
import { Phone, MapPin, ArrowRight } from 'lucide-react';
import { businessConfig } from '../../config/businessConfig';

/**
 * Slim top contact bar visible on all pages above the main navigation.
 * Shows phone (tel: link), city/service area, and a "Get a Free Quote" CTA.
 */
export default function NAPHeader() {
  const { phone } = businessConfig;

  return (
    <div className="block bg-navy-950 text-white border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-10 flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <a
            href={`tel:${phone.raw}`}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <Phone size={13} className="text-cyan-400" />
            <span className="font-medium">{phone.display}</span>
          </a>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="hidden md:flex items-center gap-2 text-slate-400">
            <MapPin size={13} className="text-cyan-400" />
            Kiel · Neumünster · Rendsburg &amp; Umgebung
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-slate-500 text-xs hidden lg:inline">
            Mo–Fr 7–19 Uhr · Sa 9–14 Uhr
          </span>
          <Link
            to="/kontakt"
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold text-xs transition-colors group"
          >
            Kostenloses Angebot
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
