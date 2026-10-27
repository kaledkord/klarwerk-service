import { Fragment, useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  X,
} from 'lucide-react';
import { easeOut, easeInOut } from '../../lib/motion';
import { useSpalten } from '../../lib/scrollEffekte';
import { services } from '../../data/services';
import ScrollKarte from './ScrollKarte';

// Logofarben in der Reihenfolge der vier Säulen; jede Reihe der Karten liest sich wie das Logo.
const LOGOFARBEN = ['#35A1DA', '#F5891F', '#F0552B', '#21A841'];

// „mehr“ und die Leistungen stammen aus den Leistungsbeschreibungen der Seite (data/services.ts).
const branches = [
  {
    icon: Building2,
    title: 'Bürogebäude & Unternehmen',
    desc: 'Regelmäßige Unterhaltsreinigung, Glasreinigung und Sanitärpflege für Gewerbeobjekte jeder Größe.',
    mehr: 'Büroräume, Besprechungszimmer und Sanitärbereiche reinigen wir nach einem festen Reinigungsplan – wöchentlich, alle zwei Wochen oder nach Bedarf. Ein festes Team kennt Ihr Objekt; Glasflächen und Grundreinigungen planen wir auf Wunsch mit ein.',
    leistungen: ['bueroreinigung', 'unterhaltsreinigung', 'glasreinigung', 'grundreinigung'],
  },
  {
    icon: Stethoscope,
    title: 'Arztpraxen & Gesundheitswesen',
    desc: 'Hygienegerechte Reinigung nach den Anforderungen medizinischer Einrichtungen.',
    mehr: 'Wartebereiche, Behandlungsräume und Sanitärbereiche reinigen wir nach hygienischen Standards – für eine saubere und sichere Umgebung für Patienten und Mitarbeiter. Auch Pflegeeinrichtungen mit hohen Anforderungen an Hygiene betreuen wir.',
    leistungen: ['praxisreinigung', 'pflegeheimreinigung', 'unterhaltsreinigung'],
  },
  {
    icon: Home,
    title: 'Wohnanlagen & Immobilien',
    desc: 'Treppenhausreinigung, Außenanlagenpflege und Hausmeisterdienste für Wohnimmobilien.',
    mehr: 'Für Hausverwaltungen und Eigentümer übernehmen wir Treppenhäuser, Flure und Gemeinschaftsräume, pflegen die Außenanlagen und räumen und streuen im Winter. Kleine Reparaturen erledigt unser Hausmeisterservice gleich mit.',
    leistungen: ['gebaeudereinigung', 'hausmeisterservice', 'gartenpflege', 'winterdienst'],
  },
  {
    icon: ShoppingBag,
    title: 'Handel & Einzelhandel',
    desc: 'Verkaufsflächen, Lagerbereiche und Eingangszonen stets sauber und repräsentativ.',
    mehr: 'Ob Supermarkt, Discounter, Getränkemarkt oder Fachgeschäft: Saubere Verkaufsflächen schaffen ein positives Einkaufserlebnis und stärken das Vertrauen Ihrer Kunden. Die Termine richten wir nach Ihrem Zeitplan – morgens, abends oder am Wochenende.',
    leistungen: ['supermarktreinigung', 'lagerhallenreinigung', 'glasreinigung'],
  },
  {
    icon: GraduationCap,
    title: 'Bildungseinrichtungen & Kitas',
    desc: 'Sichere, hygienische Reinigung für Schulen, Kitas und Bildungsstätten.',
    mehr: 'Schulen und Kindertagesstätten brauchen besondere Hygienestandards. Wir entwickeln Reinigungskonzepte für sensible Bereiche mit Kindern und sorgen für hygienische, sichere und gepflegte Räume, in denen sich Kinder, Schüler und Mitarbeiter wohlfühlen.',
    leistungen: ['schulreinigung', 'kita-reinigung', 'unterhaltsreinigung'],
  },
  {
    icon: Factory,
    title: 'Industrie & Produktion',
    desc: 'Industriereinigung, Maschinenpflege und Hallenreinigung für Produktionsbetriebe.',
    mehr: 'In Lagerhallen, Logistikzentren und Produktionsbetrieben sorgen wir für saubere Böden, staubfreie Regale und sichere Verkehrswege. Nach Umbauten oder Renovierungen übernehmen wir auch die Bauendreinigung.',
    leistungen: ['lagerhallenreinigung', 'grundreinigung', 'bauendreinigung'],
  },
  {
    icon: Hotel,
    title: 'Hotels & Gastronomie',
    desc: 'Zimmer-, Küchen- und Gemeinschaftsflächenreinigung mit höchstem Hygienestandard.',
    mehr: 'Restaurants, Cafés und Kantinen reinigen wir zuverlässig außerhalb Ihrer Öffnungszeiten – von der Küchen- und Fettentfernung über den Gastraum bis zu den Sanitäranlagen. Polstermöbel und Teppiche reinigen wir schonend in der Tiefe.',
    leistungen: ['gastronomiereinigung', 'moebelreinigung', 'glasreinigung'],
  },
  {
    icon: Wrench,
    title: 'Hausmeister & Facility',
    desc: 'Ganzheitlicher Gebäudeservice – von kleinen Reparaturen bis zur kompletten Objektbetreuung.',
    mehr: 'Ein Ansprechpartner für Ihr Objekt: Treppenhausreinigung, kleine Reparaturen, Gartenpflege und Winterdienst aus einer Hand. Bei Bedarf entrümpeln wir Keller, Dachböden und Gewerbeflächen, inklusive Entsorgung.',
    leistungen: ['hausmeisterservice', 'gartenpflege', 'winterdienst', 'entruempelung'],
  },
];

const titelVon = (id: string) => services.find((s) => s.id === id)?.title ?? id;

// Inhalt des Felds kommt nacheinander: Titel, Text, Leistungen, Knopf.
const nacheinander = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const teil = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } },
};

export default function BranchenSection() {
  const [offen, setOffen] = useState<number | null>(null);
  // Spalten wie im Raster unten; das Feld mit den Details öffnet sich unter der Reihe der angeklickten Karte.
  const spalten = useSpalten(2, 4);
  const basisId = useId();
  const detailId = `${basisId}-detail`;
  const feldRef = useRef<HTMLDivElement | null>(null);

  const offeneReihe = offen === null ? null : Math.floor(offen / spalten);
  const offeneSpalte = offen === null ? 0 : offen % spalten;
  const b = offen === null ? null : branches[offen];
  const farbe = offen === null ? LOGOFARBEN[0] : LOGOFARBEN[offen % LOGOFARBEN.length];

  // Liegt das geöffnete Feld unter dem Bildschirmrand, ein Stück nachscrollen.
  useEffect(() => {
    if (offen === null) return;
    const t = window.setTimeout(() => {
      const ruhig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      feldRef.current?.scrollIntoView({ block: 'nearest', behavior: ruhig ? 'auto' : 'smooth' });
    }, 380);
    return () => window.clearTimeout(t);
  }, [offen]);

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
          <span className="text-brand-300 text-xs font-bold uppercase tracking-widest">
            Branchen &amp; Zielgruppen
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-black tracking-tight text-white">
            Für wen wir arbeiten
          </h2>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed">
            Von kleinen Büros bis zu großen Industrieanlagen — wir bieten
            maßgeschneiderte Reinigungslösungen für jede Branche und jeden Bedarf.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {branches.map((branche, i) => {
            const Icon = branche.icon;
            const istOffen = offen === i;
            const reihe = Math.floor(i / spalten);
            const reiheEndetHier = i % spalten === spalten - 1 || i === branches.length - 1;
            return (
              <Fragment key={branche.title}>
                {/* Scroll-Effekt 3: Karten steigen beim Scrollen auf, Spalte für Spalte versetzt. */}
                <ScrollKarte spalte={i % spalten}>
                <motion.div
                  whileHover={istOffen ? undefined : { y: -4, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] } }}
                  data-offen={istOffen}
                  style={{ '--c': LOGOFARBEN[i % LOGOFARBEN.length] } as React.CSSProperties}
                  className="klw-karte h-full bg-paper-100 border border-white/10 rounded-2xl shadow-md transition-[border-color,box-shadow] duration-300"
                >
                  <button
                    type="button"
                    onClick={() => setOffen(istOffen ? null : i)}
                    aria-expanded={istOffen}
                    aria-controls={detailId}
                    className="flex h-full w-full flex-col text-left p-7 rounded-2xl focus-visible:outline-none"
                  >
                    <span className="klw-karte-icon inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5">
                      <Icon size={20} />
                    </span>
                    <h3 id={`${basisId}-titel-${i}`} className="font-bold text-white leading-snug">
                      {branche.title}
                    </h3>
                    <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">{branche.desc}</p>
                    <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300">
                      {istOffen ? 'Weniger anzeigen' : 'Mehr erfahren'}
                      <motion.span
                        animate={{ rotate: istOffen ? 180 : 0 }}
                        transition={{ duration: 0.32, ease: easeInOut }}
                        className="inline-flex"
                      >
                        <ChevronDown size={16} />
                      </motion.span>
                    </span>
                  </button>
                </motion.div>
                </ScrollKarte>

                {/* Feld mit Details über die ganze Breite, direkt unter der Reihe der geöffneten Karte */}
                {reiheEndetHier && (
                  <AnimatePresence initial={false}>
                    {b && offeneReihe === reihe && (
                      <motion.div
                        key={`reihe-${reihe}`}
                        // Nur setzen, nie leeren: beim Reihenwechsel verschwindet das alte Feld erst nach dem neuen.
                        ref={(el) => {
                          if (el) feldRef.current = el;
                        }}
                        className="col-span-full overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: easeInOut }}
                      >
                        <div className="relative pt-2" style={{ '--c': farbe } as React.CSSProperties}>
                          {/* Pfeil zeigt auf die angeklickte Karte */}
                          <span
                            aria-hidden="true"
                            className="absolute top-0 z-10 w-4 h-4 -translate-x-1/2 rotate-45 rounded-tl-[3px] border-l border-t bg-paper-100 transition-[left] duration-300"
                            style={{
                              left: `calc((100% - ${spalten - 1} * 1.25rem) / ${spalten} * ${offeneSpalte + 0.5} + ${offeneSpalte} * 1.25rem)`,
                              borderColor: 'color-mix(in srgb, var(--c) 55%, transparent)',
                            }}
                          />
                          <div
                            id={detailId}
                            role="region"
                            aria-labelledby={`${basisId}-titel-${offen}`}
                            className="relative rounded-2xl border bg-paper-100 p-7 md:p-9"
                            style={{ borderColor: 'color-mix(in srgb, var(--c) 55%, transparent)' }}
                          >
                            <button
                              type="button"
                              onClick={() => setOffen(null)}
                              aria-label="Schließen"
                              className="absolute top-3 right-3 w-11 h-11 grid place-items-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <X size={20} />
                            </button>

                            {/* Beim Wechsel innerhalb einer Reihe blendet der Inhalt über. */}
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.div
                                key={offen}
                                variants={nacheinander}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                                className="grid gap-8 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:gap-12"
                              >
                                <div className="min-w-0">
                                  {/* Auf dem Handy steht das Feld direkt unter der Karte; Symbol und Titel wären doppelt. */}
                                  <motion.div variants={teil} className="hidden sm:flex items-center gap-3 pr-10">
                                    <span className="klw-karte-icon inline-flex items-center justify-center w-11 h-11 shrink-0 rounded-xl">
                                      <b.icon size={20} />
                                    </span>
                                    <p className="text-xl font-bold text-white leading-snug">{b.title}</p>
                                  </motion.div>
                                  <motion.p variants={teil} className="pr-10 sm:pr-0 sm:mt-5 text-slate-300 leading-relaxed">
                                    {b.mehr}
                                  </motion.p>
                                </div>
                                <div className="min-w-0 md:pt-14">
                                  <motion.p variants={teil} className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                    Passende Leistungen
                                  </motion.p>
                                  <motion.div variants={teil} className="mt-3 flex flex-wrap gap-2">
                                    {b.leistungen.map((id) => (
                                      <Link
                                        key={id}
                                        to={`/leistungen/${id}`}
                                        className="klw-karte-link inline-flex items-center min-h-10 px-3.5 rounded-full border text-xs font-medium text-slate-200"
                                      >
                                        {titelVon(id)}
                                      </Link>
                                    ))}
                                  </motion.div>
                                  <motion.div variants={teil}>
                                    <Link to="/kontakt" className="btn-primary mt-7 text-sm px-6 py-3">
                                      Kostenloses Angebot anfordern
                                      <ArrowRight size={15} />
                                    </Link>
                                  </motion.div>
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </Fragment>
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
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300 hover:gap-2.5 transition-all"
          >
            Alle Leistungen im Überblick <ArrowRight size={15} />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
