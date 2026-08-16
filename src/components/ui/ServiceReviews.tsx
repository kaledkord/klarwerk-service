import AnimatedSection from './AnimatedSection';
import { businessConfig } from '../../config/businessConfig';
import { getReviewsForService } from '../../data/reviews';

const GOOGLE_LOGO = (
  <svg className="w-6 h-6 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.6 4.7-6.1 8.1-11.3 8.1-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.7 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l5.9 4.3C13.9 15.1 18.6 12 24 12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.7 6.1 29.1 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5.1l-6-5c-2 1.4-4.5 2.2-6.9 2.2-5.2 0-9.6-3.3-11.3-8l-6 4.6C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20.4H24v7.2h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6 5C40.9 35 44 30 44 24c0-1.3-.1-2.7-.4-3.5z" />
  </svg>
);

function Stars() {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Bewertungsblock für eine Leistungsseite. Zeigt echte, thematisch passende
 * Google-Rezensionen plus die echte Gesamtbewertung. Es werden keine
 * Bewertungen erfunden – die Daten stammen aus data/reviews.ts.
 */
export default function ServiceReviews({
  serviceId,
  serviceTitle,
}: {
  serviceId: string;
  serviceTitle: string;
}) {
  const items = getReviewsForService(serviceId, 3);
  if (items.length === 0) return null;

  const { reviews: r } = businessConfig;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-700 text-sm font-semibold uppercase tracking-widest">Bewertungen</span>
          <h2 className="text-3xl md:text-4xl font-black mt-3 tracking-tight text-slate-900">
            Das sagen Kunden über KlarWerk Service
          </h2>
          <p className="mt-4 text-slate-500 leading-relaxed">
            Echte Google-Bewertungen rund um {serviceTitle} und weitere Leistungen.
          </p>
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-5 py-2.5 mt-5 shadow-sm border border-slate-100">
            <Stars />
            <span className="text-sm font-bold text-slate-900">{r.ratingValue.replace('.', ',')}</span>
            <span className="text-sm text-slate-500">· {r.reviewCount}+ Google Bewertungen</span>
          </div>
        </AnimatedSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((review, i) => (
            <AnimatedSection key={`${review.name}-${i}`} delay={i * 0.08}>
              <figure className="flex flex-col h-full bg-white rounded-2xl p-6 border border-slate-100 shadow-sm border-t-[3px] border-t-brand-500">
                <div className="flex items-center gap-3 mb-3">
                  {GOOGLE_LOGO}
                  <figcaption>
                    <p className="text-sm font-bold text-slate-900 leading-tight">{review.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{review.meta}</p>
                  </figcaption>
                </div>
                <Stars />
                <blockquote className="mt-3 text-sm text-slate-600 leading-relaxed">{review.text}</blockquote>
              </figure>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
