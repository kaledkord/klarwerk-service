import { useEffect, useRef, useState } from 'react';
import SEO from '../components/SEO';
import ServiceCard from '../components/ui/ServiceCard';
import ScrollKarte from '../components/ui/ScrollKarte';
import SeitenKopf from '../components/ui/SeitenKopf';
import CTASection from '../components/ui/CTASection';
import { services } from '../data/services';
import { LOGOFARBE, LOGOFARBE_HELL, leistungenIm, leistungsbereiche, type Bereich } from '../data/leistungsbereiche';
import { seoConfig } from '../config/seoConfig';
import { useSpalten } from '../lib/scrollEffekte';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: leistungsbereiche
    .flatMap((b) => leistungenIm(b.id))
    .map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.title,
      description: s.shortDesc,
    })),
};

export default function Services() {
  const spalten = useSpalten(2, 3, 1, 2, 4);
  const [aktiv, setAktiv] = useState<Bereich>(leistungsbereiche[0].id);
  const leisteRef = useRef<HTMLDivElement>(null);

  // Der Bereich, der gerade in der Bildmitte steht, ist in der Sprungleiste hervorgehoben.
  useEffect(() => {
    const beobachter = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) if (e.isIntersecting) setAktiv(e.target.id as Bereich);
      },
      { rootMargin: '-40% 0px -55% 0px' },
    );
    leistungsbereiche.forEach((b) => {
      const abschnitt = document.getElementById(b.id);
      if (abschnitt) beobachter.observe(abschnitt);
    });
    return () => beobachter.disconnect();
  }, []);

  // Auf dem Handy passt die Leiste nicht ganz ins Bild: die hervorgehobene Schaltfläche hineinschieben.
  // Nur die Leiste scrollt, nicht die Seite.
  useEffect(() => {
    const leiste = leisteRef.current;
    const knopf = leiste?.querySelector<HTMLElement>(`[data-bereich="${aktiv}"]`);
    if (!leiste || !knopf || leiste.scrollWidth <= leiste.clientWidth) return;
    leiste.scrollTo({ left: knopf.offsetLeft - 24, behavior: 'smooth' });
  }, [aktiv]);

  const springen = (e: React.MouseEvent<HTMLAnchorElement>, id: Bereich) => {
    const ziel = document.getElementById(id);
    if (!ziel) return;
    e.preventDefault();
    setAktiv(id);
    ziel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="bg-paper">
      <SEO
        {...seoConfig['/leistungen']}
        keywords="Gebäudereinigung Leistungen, Büroreinigung, Glasreinigung, Hausmeisterservice, Gartenpflege, Schleswig-Holstein, Hamburg"
        jsonLd={jsonLd}
      />

      <section className="pt-36 pb-12 bg-paper">
        <SeitenKopf className="max-w-7xl mx-auto px-6">
          <div className="klw-auftritt">
            <span className="text-brand-300 text-sm font-semibold uppercase tracking-widest">Leistungen</span>
            <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight hyphens-auto">Unsere Dienstleistungen</h1>
            <p className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed">
              Von der regelmäßigen Büroreinigung bis zum kompletten Hausmeisterservice – wir bieten Ihnen maßgeschneiderte Lösungen für Ihr Objekt.
            </p>
            <p className="mt-5 text-[15px] text-slate-400">
              {services.length} Leistungen in {leistungsbereiche.length} Bereichen – wählen Sie, was Sie suchen:
            </p>
          </div>
        </SeitenKopf>
      </section>

      {/* Sprungleiste: hängt unter der Kopfzeile und rückt nach oben, sobald die Kopfzeile verschwindet (index.css). */}
      <nav aria-label="Leistungsbereiche" className="klw-sprungleiste sticky z-30 border-y border-white/5 bg-paper/90 backdrop-blur">
        <div
          ref={leisteRef}
          className="relative max-w-7xl mx-auto px-6 py-3 flex gap-2.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {leistungsbereiche.map((b) => {
            const istAktiv = b.id === aktiv;
            return (
              <a
                key={b.id}
                href={`#${b.id}`}
                data-bereich={b.id}
                onClick={(e) => springen(e, b.id)}
                aria-current={istAktiv ? 'true' : undefined}
                className={`inline-flex shrink-0 items-center gap-2.5 min-h-11 px-4 rounded-full text-sm sm:text-[15px] whitespace-nowrap transition-colors duration-200 ${
                  istAktiv
                    ? 'bg-white text-paper font-bold'
                    : 'bg-paper-100 border border-white/10 text-slate-200 font-semibold hover:border-white/25 hover:text-white'
                }`}
              >
                <span aria-hidden="true" className="w-2.5 h-2.5 rounded-[3px]" style={{ background: LOGOFARBE[b.farbe] }} />
                {/* Lange Namen erst, wenn alle vier nebeneinander passen */}
                <span className="xl:hidden">{b.kurz}</span>
                <span className="hidden xl:inline">{b.titel}</span>
                <span className={`text-xs ${istAktiv ? 'text-slate-600' : 'text-slate-400'}`}>{leistungenIm(b.id).length}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {leistungsbereiche.map((b, nr) => {
        const liste = leistungenIm(b.id);
        return (
          <section key={b.id} id={b.id} aria-labelledby={`${b.id}-titel`} className="scroll-mt-36 pt-16 sm:pt-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-start gap-4 mb-6 sm:mb-8">
                {/* Säule wie im Logo: oben schräg angeschnitten, neben Kennzeile und Überschrift */}
                <span aria-hidden="true" className="klw-saeule mt-1 w-3 h-11 sm:w-4 sm:h-14 shrink-0" style={{ background: LOGOFARBE[b.farbe] }} />
                <div>
                  <p className="text-xs sm:text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: LOGOFARBE_HELL[b.farbe] }}>
                    Bereich {nr + 1} · {liste.length} Leistungen
                  </p>
                  <h2 id={`${b.id}-titel`} className="mt-1.5 text-2xl sm:text-[34px] font-black tracking-tight text-white">
                    {b.titel}
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">{b.text}</p>
                </div>
              </div>
              {/* Scroll-Effekt 3: Karten steigen beim Scrollen auf, Spalte für Spalte versetzt. */}
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {liste.map((service, i) => (
                  <ScrollKarte key={service.id} spalte={i % spalten}>
                    <ServiceCard service={service} kompaktMobil />
                  </ScrollKarte>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <div className="h-16 sm:h-20" />

      <CTASection
        title="Nicht sicher, welcher Bereich passt?"
        subtitle="Wir sehen uns Ihr Objekt bei einer kostenlosen Besichtigung an, beraten Sie und erstellen Ihnen ein auf Ihre Bedürfnisse zugeschnittenes Angebot."
        primaryLabel="Besichtigung anfragen"
      />
    </div>
  );
}
