import AnimatedSection from './AnimatedSection';
import { businessConfig } from '../../config/businessConfig';
import { reviews } from '../../data/reviews';

const GOOGLE_LOGO = (
  <svg className="w-6 h-6 shrink-0" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.6 20.5H42V20.4H24v7.2h11.3c-1.6 4.7-6.1 8.1-11.3 8.1-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.7 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l5.9 4.3C13.9 15.1 18.6 12 24 12c3.1 0 5.9 1.2 8 3.1l5.1-5.1C33.7 6.1 29.1 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5 0 9.5-1.9 12.9-5.1l-6-5c-2 1.4-4.5 2.2-6.9 2.2-5.2 0-9.6-3.3-11.3-8l-6 4.6C9.6 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20.4H24v7.2h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6 5C40.9 35 44 30 44 24c0-1.3-.1-2.7-.4-3.5z"/>
  </svg>
);

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ name, meta, text }: { name: string; meta: string; text: string }) {
  return (
    <div className="flex flex-col w-[320px] shrink-0 bg-paper-100 rounded-2xl p-6 border border-white/10 shadow-md shadow-md hover:shadow-md transition-shadow duration-300 border-t-[3px] border-t-brand-500">
      <div className="flex items-center gap-3 mb-3">
        {GOOGLE_LOGO}
        <div>
          <p className="text-sm font-bold text-white leading-tight">{name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{meta}</p>
        </div>
      </div>
      <Stars />
      <p className="mt-3 text-sm text-slate-300 leading-relaxed line-clamp-5">{text}</p>
    </div>
  );
}

export default function GoogleReviewsCarousel() {
  const doubled = [...reviews, ...reviews];

  return (
    <section className="py-28 bg-paper overflow-hidden">
      <AnimatedSection className="text-center max-w-2xl mx-auto px-6 mb-12">
        <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">Bewertungen</span>
        <h2 className="text-4xl md:text-5xl font-black mt-3 tracking-tight text-white">
          Das sagen unsere Kunden
        </h2>
        <p className="mt-4 text-slate-400 text-base leading-relaxed">
          Echte Google-Bewertungen von privaten und gewerblichen Kunden.
        </p>
        <div className="inline-flex items-center gap-3 bg-paper-100 rounded-full px-5 py-2.5 mt-5 shadow-md border border-white/10">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map((s) => (
              <svg key={s} className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm font-bold text-white">5,0</span>
          <span className="text-sm text-slate-400">· {businessConfig.reviews.reviewCount}+ Google Bewertungen</span>
        </div>
      </AnimatedSection>

      <div
        className="marquee-viewport relative w-full overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 80px, #000 calc(100% - 80px), transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0, #000 80px, #000 calc(100% - 80px), transparent 100%)',
        }}
      >
        <div className="marquee-track flex gap-5 w-max px-5">
          {doubled.map((r, i) => (
            <ReviewCard key={i} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}
