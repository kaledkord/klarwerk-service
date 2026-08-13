import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Star } from 'lucide-react';
import { businessConfig, platformProfiles } from '../../config/businessConfig';
import { cities } from '../../data/cities';
import { featuredServices } from '../../data/services';

function PlatformIcon({ icon, size = 16 }: { icon: string; size?: number }) {
  switch (icon) {
    case 'google':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.24H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      );
    case 'yelp':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.548 3.046l.523 7.46c.034.496.354.928.813 1.098.46.17.977.05 1.32-.31l5.13-5.39c.343-.36.44-.88.246-1.337-.193-.457-.63-.762-1.126-.78l-7.49-.28c-.497-.02-.96.27-1.173.72-.213.45-.13.99.22 1.35l.837.89zM3.5 9.5l7.03 2.62c.47.175.997.06 1.357-.29.36-.35.48-.87.31-1.34L9.58 3.4c-.17-.47-.61-.79-1.11-.81-.5-.02-.96.27-1.16.73L3.2 8.06c-.2.46-.1.99.3 1.44zM9.5 20.5l2.62-7.03c.175-.47.06-.997-.29-1.357-.35-.36-.87-.48-1.34-.31L3.4 14.42c-.47.17-.79.61-.81 1.11-.02.5.27.96.73 1.16l4.74 2.11c.46.2.99.1 1.44-.3zM20.5 14.5l-7.03-2.62c-.47-.175-.997-.06-1.357.29-.36.35-.48.87-.31 1.34l2.62 7.03c.17.47.61.79 1.11.81.5.02.96-.27 1.16-.73l2.11-4.74c.2-.46.1-.99-.3-1.44z" fill="#D32323" />
        </svg>
      );
    case 'apple':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.08 1.85-2.99 5.89.6 7.04-.72 1.87-1.85 3.71-3.65 4.17zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
      );
    case 'facebook':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
}

export default function NAPFooter() {
  const { address, phone, email, hours, reviews } = businessConfig;
  const footerCities = cities.filter((c) => c.tier === 1).slice(0, 7);

  return (
    <footer className="bg-navy-950 text-white" itemScope itemType="https://schema.org/LocalBusiness">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* NAP Block */}
          <div>
            <Link to="/" className="inline-block mb-5">
              <img
                src="/Kein_Titel_(580_x_140_px)_20260715_025604_0000.svg"
                alt={businessConfig.name}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <address className="not-italic space-y-2.5 text-sm text-slate-400">
              <meta itemProp="name" content={businessConfig.name} />
              <div className="flex items-start gap-2.5" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <MapPin size={14} className="shrink-0 text-cyan-400 mt-0.5" />
                <span>
                  <span itemProp="streetAddress">{address.street}</span><br />
                  <span itemProp="postalCode">{address.zip}</span>{' '}
                  <span itemProp="addressLocality">{address.city}</span><br />
                  <span itemProp="addressRegion">{address.state}</span>,{' '}
                  <span itemProp="addressCountry">{address.countryName}</span>
                </span>
              </div>
              <a
                href={`tel:${phone.raw}`}
                className="flex items-center gap-2.5 hover:text-white transition-colors"
                itemProp="telephone"
              >
                <Phone size={14} className="shrink-0 text-cyan-400" />
                {phone.display}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2.5 hover:text-white transition-colors"
                itemProp="email"
              >
                <Mail size={14} className="shrink-0 text-cyan-400" />
                {email}
              </a>
            </address>

            {/* Rating */}
            <div className="mt-5 flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-slate-400">
                {reviews.ratingValue} ({reviews.reviewCount} Bewertungen)
              </span>
              <meta itemProp="aggregateRating" content={reviews.ratingValue} />
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <Clock size={14} /> Öffnungszeiten
            </h4>
            <ul className="space-y-2 text-sm">
              {hours.map((h) => (
                <li key={h.day} className="flex justify-between text-slate-400">
                  <span>{h.day === 'Monday' ? 'Mo' : h.day === 'Tuesday' ? 'Di' : h.day === 'Wednesday' ? 'Mi' : h.day === 'Thursday' ? 'Do' : h.day === 'Friday' ? 'Fr' : h.day === 'Saturday' ? 'Sa' : 'So'}</span>
                  <span>
                    {h.open && h.close ? `${h.open}–${h.close}` : 'Geschlossen'}
                  </span>
                </li>
              ))}
            </ul>
            <meta itemProp="openingHours" content="Mo-Fr 07:00-19:00, Sa 09:00-14:00" />
          </div>

          {/* Service Area */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Einsatzgebiet</h4>
            <ul className="space-y-2 text-sm">
              {footerCities.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/einsatzgebiet/${c.slug}`}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Gebäudereinigung {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/einsatzgebiet" className="text-slate-400 hover:text-white transition-colors font-medium">
                  Alle Einsatzgebiete →
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Profiles */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Folgen Sie uns</h4>
            <div className="grid grid-cols-2 gap-3">
              {platformProfiles.map((p) => (
                <a
                  key={p.name}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-sm text-slate-300 hover:text-white"
                >
                  <PlatformIcon icon={p.icon} size={16} />
                  {p.name}
                </a>
              ))}
            </div>
            <div className="mt-5">
              <Link to="/kontakt" className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
                Angebot anfordern
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Beliebte Leistungen</h4>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {featuredServices.map((s) => (
              <Link
                key={s.id}
                to={`/leistungen/${s.id}`}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {s.title}
              </Link>
            ))}
            <Link to="/leistungen" className="text-slate-300 hover:text-white transition-colors font-medium">
              Alle Leistungen →
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} {businessConfig.name}. Alle Rechte vorbehalten.</p>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            <Link to="/impressum" className="hover:text-slate-300 transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-slate-300 transition-colors">Datenschutzerklärung</Link>
            <Link to="/agb" className="hover:text-slate-300 transition-colors">AGB</Link>
            <Link to="/rechtliche-hinweise" className="hover:text-slate-300 transition-colors">Rechtliche Hinweise</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
