import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';

interface Props {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  showPhone?: boolean;
}

export default function CTASection({
  title = 'Bereit für eine saubere Lösung?',
  subtitle = 'Fordern Sie jetzt Ihr kostenloses und unverbindliches Angebot an. Wir melden uns innerhalb von 24 Stunden.',
  primaryLabel = 'Kostenloses Angebot',
  primaryHref = '/kontakt',
  showPhone = true,
}: Props) {
  return (
    <section className="py-24 bg-navy-950">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{title}</h2>
        <p className="mt-5 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={primaryHref}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl transition duration-200 shadow-lg shadow-brand-600/25 hover:shadow-xl hover:shadow-brand-600/35 active:scale-[0.98]"
          >
            {primaryLabel}
            <ArrowRight size={16} />
          </Link>
          {showPhone && (
            <a
              href="tel:+4917631287131"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
            >
              <Phone size={16} />
              +49 176 31287131
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
