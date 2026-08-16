import { motion } from 'framer-motion';
import { Star, ExternalLink } from 'lucide-react';
import { businessConfig } from '../../config/businessConfig';

interface ReviewPlatform {
  name: string;
  url: string;
  icon: 'google' | 'facebook' | 'instagram' | 'tiktok';
}

const reviewPlatforms: ReviewPlatform[] = [
  { name: 'Google Maps', url: businessConfig.platforms.googleBusiness, icon: 'google' },
  { name: 'Facebook', url: `${businessConfig.platforms.facebook}/reviews`, icon: 'facebook' },
  { name: 'Instagram', url: businessConfig.platforms.instagram, icon: 'instagram' },
  { name: 'TikTok', url: businessConfig.platforms.tiktok, icon: 'tiktok' },
];

function PlatformIcon({ icon, size = 28 }: { icon: string; size?: number }) {
  switch (icon) {
    case 'google':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.24H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      );
    case 'facebook':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f09433" />
              <stop offset="25%" stopColor="#e6683c" />
              <stop offset="50%" stopColor="#dc2743" />
              <stop offset="75%" stopColor="#cc2366" />
              <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5.5" fill="url(#ig-grad)" />
          <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none" />
          <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.79a8.18 8.18 0 004.78 1.52V6.85a4.85 4.85 0 01-1.01-.16z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ReviewPlatformLinks() {
  const { reviews } = businessConfig;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 mb-4">
            Kundenbewertungen
          </p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Was unsere Kunden sagen
          </h2>
          <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto">
            Teilen Sie Ihre Erfahrung — Ihr Feedback hilft uns und anderen Kunden.
          </p>

          {/* Rating badge */}
          <div className="mt-8 inline-flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3">
            <div className="text-left">
              <p className="text-3xl font-black text-slate-900 leading-none">{reviews.ratingValue}</p>
              <p className="text-xs text-slate-400 mt-0.5">von 5 Punkten</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={16} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-400">{reviews.reviewCount} verifizierte Bewertungen</p>
            </div>
          </div>
        </motion.div>

        {/* Platform cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {reviewPlatforms.map((platform, i) => (
            <motion.a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.18 } }}
              className="group relative bg-white border border-slate-200 hover:border-slate-200 rounded-2xl p-6 text-center transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-slate-900/6"
            >
              <div className="flex justify-center mb-4">
                <PlatformIcon icon={platform.icon} size={36} />
              </div>
              <p className="font-semibold text-slate-800 text-sm">{platform.name}</p>
              <p className="mt-1 text-xs text-slate-400">Jetzt bewerten</p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={12} className="text-slate-300" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
