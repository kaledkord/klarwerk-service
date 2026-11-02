/** Stichpunkt unter „Unsere Reinigungsleistungen in …“, auf Wunsch mit Link auf die passende Seite. */
export type CityHighlight = string | { text: string; to: string };

export interface City {
  slug: string;
  name: string;
  region: string;
  description: string;
  intro: string;
  /** Satz nach der Einleitung mit Links auf die Ortsseiten der Leistungen (nur Städte mit eigenen Seiten). */
  eigeneSeiten?: { vorspann: string; links: { label: string; to: string }[] };
  highlights: CityHighlight[];
  /** Zusätzliche Fragen vor den allgemeinen FAQ der Stadtseite. */
  faqs?: { question: string; answer: string }[];
  image: string;
  /** Priorität für Sortierung/Signale: 1 = Kernregion SH, 2 = Hamburg, 3 = überregional. */
  tier: 1 | 2 | 3;
  /** Optionaler eigener Seitentitel (inkl. Marke), sonst „Gebäudereinigung {Ort} | KlarWerk Service“. */
  seoTitle?: string;
  /**
   * In sich geschlossene Antwort-Abschnitte (je 100–180 Wörter, Überschrift als Frage oder Thema, Antwort im
   * ersten Satz) direkt nach dem Kopf. So können Google und KI-Suchen sie als Ganzes übernehmen
   * (seo-geo-consultant). Nur belegte Angaben.
   */
  abschnitte?: { titel: string; text: string; link?: { label: string; to: string } }[];
  /** Stand der Inhalte: sichtbar unter den FAQ und als dateModified. Nur bei echten Änderungen anpassen. */
  stand?: { iso: string; anzeige: string };
}

export const cities: City[] = [
  {
    slug: 'bordesholm',
    name: 'Bordesholm',
    region: 'Schleswig-Holstein',
    // „gebäudereinigung bordesholm“ steht auf Position 9 ohne Klick: Suchbegriff wörtlich an den Anfang,
    // Beschreibung nennt die Leistungen mit eigener Seite (Mira, 02.11.2026).
    description:
      'Gebäudereinigung in Bordesholm vom Betrieb vor Ort: Büro, Praxis, Glas, Unterhalt, Kita und Schule im ganzen Amt Bordesholm. Angebot anfragen.',
    seoTitle: 'Gebäudereinigung Bordesholm – Betrieb vor Ort | KlarWerk',
    intro:
      'KlarWerk Service hat seinen Sitz in Bordesholm und reinigt Büros, Praxen, Kitas, Schulen, Wohnanlagen und Gewerbeobjekte im ganzen Amt Bordesholm zwischen Kiel und Neumünster. Feste Ansprechpartner, verlässliche Termine und gründliche Ergebnisse – von der regelmäßigen Unterhaltsreinigung bis zur einmaligen Grund- und Bauendreinigung.',
    eigeneSeiten: {
      vorspann: 'Für die häufigsten Aufträge haben wir eigene Seiten:',
      links: [
        { label: 'Büroreinigung in Bordesholm', to: '/leistungen/bueroreinigung/bordesholm' },
        { label: 'Praxisreinigung in Bordesholm', to: '/leistungen/praxisreinigung/bordesholm' },
        { label: 'Glasreinigung in Bordesholm', to: '/leistungen/glasreinigung/bordesholm' },
        { label: 'Unterhaltsreinigung in Bordesholm', to: '/leistungen/unterhaltsreinigung/bordesholm' },
        { label: 'Grundreinigung in Bordesholm', to: '/leistungen/grundreinigung/bordesholm' },
        { label: 'Bauendreinigung in Bordesholm', to: '/leistungen/bauendreinigung/bordesholm' },
        { label: 'Kita-Reinigung in Bordesholm', to: '/leistungen/kita-reinigung/bordesholm' },
        { label: 'Schulreinigung in Bordesholm', to: '/leistungen/schulreinigung/bordesholm' },
      ],
    },
    highlights: [
      { text: 'Büroreinigung in Bordesholm außerhalb der Arbeitszeit', to: '/leistungen/bueroreinigung/bordesholm' },
      { text: 'Praxisreinigung in Bordesholm nach Hygieneplan', to: '/leistungen/praxisreinigung/bordesholm' },
      { text: 'Treppenhaus- und Unterhaltsreinigung im Amt Bordesholm', to: '/leistungen/unterhaltsreinigung/bordesholm' },
      { text: 'Glasreinigung in Bordesholm, innen und außen', to: '/leistungen/glasreinigung/bordesholm' },
    ],
    abschnitte: [
      {
        titel: 'Welche Reinigungsfirma sitzt in Bordesholm?',
        text: 'KlarWerk Service ist ein inhabergeführtes Gebäudereinigungsunternehmen mit Sitz in Bordesholm. Von hier aus reinigen wir Büros, Kanzleien, Praxen, Kitas, Schulen, Wohnanlagen und Gewerbeobjekte in Bordesholm und allen Gemeinden des Amtes – Wattenbek, Brügge, Mühbrook, Schmalstede, Grevenkrug, Hoffeld, Loop, Sören, Reesdorf, Schönbek, Groß Buchwald, Bissee und Negenharrie – sowie in Flintbek, Molfsee, Nortorf, Boostedt und Wasbek. Zum Angebot gehören Unterhalts-, Büro-, Praxis- und Glasreinigung, Kita- und Schulreinigung, Grund- und Bauendreinigung sowie Hausmeisterservice. Grundreinigung und Versiegelung macht unser eigenes Team, das Aus- und Einräumen der Räume übernehmen wir. Vor jedem Angebot sehen wir uns Ihr Objekt kostenlos an und kalkulieren einen Festpreis mit unserem eigenen Programm für die Gebäudereinigung.',
      },
      {
        titel: 'Was bringt eine Reinigungsfirma aus dem eigenen Ort?',
        text: 'Kurze Wege – und die merken Sie im Alltag. Weil wir in Bordesholm sitzen, kommen wir kurzfristig zur Besichtigung, Ihr Ansprechpartner macht die Kontrollen persönlich, und Rückfragen oder Änderungen am Plan sind ein kurzer Weg statt eines Tickets. Auch ein fester Turnus lohnt sich so für kleinere Objekte, und ein Außentermin der Glasreinigung, der wegen Regen oder Frost ausfällt, ist schnell nachgeholt. Bei Urlaub und Krankheit übernimmt eine eingearbeitete Vertretung, die Ihr Objekt kennt. Betriebe und Träger mit weiteren Standorten in Kiel oder Neumünster bekommen einen Ansprechpartner für alle Häuser.',
      },
    ],
    faqs: [
      {
        question: 'Welche Gemeinden im Amt Bordesholm betreuen Sie?',
        answer:
          'Alle: Bordesholm, Wattenbek, Brügge, Mühbrook, Schmalstede, Grevenkrug, Hoffeld, Loop, Sören, Reesdorf, Schönbek, Groß Buchwald, Bissee und Negenharrie. Dazu kommen Flintbek, Molfsee, Nortorf, Boostedt und Wasbek.',
      },
      {
        question: 'Wie schnell können Sie zur Besichtigung kommen?',
        answer:
          'Kurzfristig. Unser Sitz ist in Bordesholm, in jede Gemeinde des Amtes sind es nur wenige Minuten. Die Besichtigung ist kostenlos.',
      },
      {
        question: 'Machen Sie die Grundreinigung selbst?',
        answer:
          'Ja. Grundreinigung und Versiegelung macht unser eigenes Team, ohne Subunternehmer. Das Aus- und Einräumen der Räume übernehmen wir, damit die Übergabe schnell geht.',
      },
    ],
    stand: { iso: '2026-11-02', anzeige: '02.11.2026' },
    image: '/bilder/leistung-unterhaltsreinigung.jpg',
    tier: 1,
  },
  {
    slug: 'kiel',
    name: 'Kiel',
    region: 'Schleswig-Holstein',
    // „Praxis“ nicht mehr im Titel: „praxisreinigung kiel“ landete auf dieser Seite statt auf
    // /leistungen/praxisreinigung/kiel. Die Stadtseite trägt „gebäudereinigung/reinigungsfirma kiel“ (Mira, 02.11.2026).
    description:
      'Gebäudereinigung in Kiel für Wohnanlagen, Büros, Praxen und Gewerbe: Treppenhaus-, Unterhalts- und Glasreinigung, fester Ansprechpartner. Angebot anfragen.',
    seoTitle: 'Gebäudereinigung in Kiel – Reinigungsfirma | KlarWerk',
    intro:
      'KlarWerk Service reinigt Büros, Praxen, Geschäfte und Wohnanlagen in ganz Kiel – auf dem Westufer von der Innenstadt über Ravensberg, Schreventeich und Wik bis Mettenhof und Friedrichsort, auf dem Ostufer in Gaarden, Neumühlen-Dietrichsdorf und Wellsee. Unser Sitz in Bordesholm liegt rund 20 Kilometer südlich, über die A215 sind wir in 20 Minuten bei Ihnen.',
    eigeneSeiten: {
      vorspann: 'Für die häufigsten Aufträge haben wir eigene Seiten:',
      links: [
        { label: 'Büroreinigung', to: '/leistungen/bueroreinigung/kiel' },
        { label: 'Praxisreinigung', to: '/leistungen/praxisreinigung/kiel' },
        { label: 'Glasreinigung', to: '/leistungen/glasreinigung/kiel' },
        { label: 'Grundreinigung für Kitas und Schulen in Kiel', to: '/leistungen/grundreinigung/kiel' },
        { label: 'Unterhaltsreinigung', to: '/leistungen/unterhaltsreinigung/kiel' },
        { label: 'Bauendreinigung', to: '/leistungen/bauendreinigung/kiel' },
        { label: 'Kita-Reinigung', to: '/leistungen/kita-reinigung/kiel' },
        { label: 'Schulreinigung', to: '/leistungen/schulreinigung/kiel' },
      ],
    },
    highlights: [
      { text: 'Büroreinigung in Kiel nach Feierabend', to: '/leistungen/bueroreinigung/kiel' },
      { text: 'Praxisreinigung in Kiel nach Hygieneplan', to: '/leistungen/praxisreinigung/kiel' },
      { text: 'Glasreinigung in Kiel, streifenfrei innen und außen', to: '/leistungen/glasreinigung/kiel' },
      { text: 'Treppenhausreinigung für Wohnanlagen in Kiel', to: '/leistungen/unterhaltsreinigung/kiel' },
    ],
    abschnitte: [
      {
        titel: 'Welche Reinigungsfirma reinigt Gebäude in Kiel?',
        text: 'KlarWerk Service ist ein inhabergeführtes Gebäudereinigungsunternehmen aus Bordesholm, das Wohnanlagen, Büros, Praxen, Kitas, Schulen und Gewerbeobjekte in ganz Kiel reinigt. Unser Sitz liegt rund 20 Kilometer südlich, über die A215 sind wir in 20 Minuten in der Stadt – auf dem Westufer ebenso wie in Gaarden, Neumühlen-Dietrichsdorf und Wellsee. Zum Angebot gehören Unterhalts- und Treppenhausreinigung, Büro-, Praxis- und Glasreinigung, Grund- und Bauendreinigung sowie Hausmeisterservice. Vor jedem Auftrag sehen wir uns das Objekt kostenlos an und kalkulieren einen Festpreis mit unserem eigenen Programm für die Gebäudereinigung; Bereiche und Intervalle stehen in einem Leistungsverzeichnis. Jedes Objekt hat einen festen Ansprechpartner, und bei Urlaub oder Krankheit übernimmt eine eingearbeitete Vertretung.',
      },
      {
        titel: 'Treppenhausreinigung in Kiel für Wohnanlagen und Hausverwaltungen',
        text: 'Treppenhäuser, Hauseingänge, Aufzüge, Keller- und Müllräume in Kieler Wohnanlagen reinigen wir im festen Turnus, meist wöchentlich oder vierzehntägig. Was in welchem Rhythmus gereinigt wird – Stufen und Podeste, Handläufe, Türen und auf Wunsch die Treppenhausfenster –, steht im Leistungsverzeichnis, das auch Bewohner nachlesen können. Die Hausverwaltung hat einen Ansprechpartner für alle Häuser und für Rückmeldungen aus der Hausgemeinschaft. Regelmäßige Kontrollen sorgen dafür, dass der Plan eingehalten wird, und bei Urlaub oder Krankheit übernimmt eine eingearbeitete Vertretung. Bei uns gehört die Treppenhausreinigung zur Unterhaltsreinigung; dort finden Sie Umfang, Ablauf und Antworten im Detail.',
        link: { label: 'Unterhaltsreinigung in Kiel', to: '/leistungen/unterhaltsreinigung/kiel' },
      },
    ],
    faqs: [
      {
        question: 'In welchen Stadtteilen von Kiel reinigen Sie?',
        answer:
          'Im ganzen Stadtgebiet: auf dem Westufer in der Innenstadt, in Ravensberg, Brunswik, Schreventeich, Wik, Hassee, Suchsdorf, am Südfriedhof, in Mettenhof und Friedrichsort, auf dem Ostufer in Gaarden, Neumühlen-Dietrichsdorf und Wellsee. Dazu kommt das Umland mit Kronshagen, Altenholz, Molfsee, Flintbek, Schwentinental und Heikendorf.',
      },
      {
        question: 'Wie schnell sind Sie in Kiel vor Ort?',
        answer:
          'In rund 20 Minuten. Unser Sitz in Bordesholm liegt rund 20 Kilometer südlich von Kiel, über die A215 sind wir schnell im Stadtgebiet. Besichtigung, Kontrollen und kurzfristige Absprachen sind so kurze Wege.',
      },
      {
        question: 'Machen Sie Treppenhausreinigung in Kiel?',
        answer:
          'Ja, als Teil der Unterhaltsreinigung: Treppenhäuser, Hauseingänge, Aufzüge und Gemeinschaftsflächen im festen Turnus, meist wöchentlich oder vierzehntägig, mit einem Ansprechpartner für die Hausverwaltung und einem Leistungsverzeichnis.',
      },
    ],
    stand: { iso: '2026-11-02', anzeige: '02.11.2026' },
    image: '/bilder/stadt-kiel.jpg',
    tier: 1,
  },
  {
    slug: 'neumuenster',
    name: 'Neumünster',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Neumünster für Büros, Praxen und Gewerbe: Unterhalts-, Glas- und Grundreinigung, fester Ansprechpartner, kurze Anfahrt aus Bordesholm.',
    intro:
      'In Neumünster bieten wir umfassende Gebäudereinigung für gewerbliche und private Kunden an. Ob Büroreinigung, Glasreinigung oder Hausmeisterservice – KlarWerk Service sorgt für Sauberkeit in der Mittelstadt zwischen Kiel und Hamburg.',
    eigeneSeiten: {
      vorspann: 'Für die häufigsten Aufträge haben wir eigene Seiten:',
      links: [
        { label: 'Büroreinigung', to: '/leistungen/bueroreinigung/neumuenster' },
        { label: 'Praxisreinigung', to: '/leistungen/praxisreinigung/neumuenster' },
        { label: 'Glasreinigung', to: '/leistungen/glasreinigung/neumuenster' },
        { label: 'Unterhaltsreinigung', to: '/leistungen/unterhaltsreinigung/neumuenster' },
        { label: 'Grundreinigung', to: '/leistungen/grundreinigung/neumuenster' },
        { label: 'Bauendreinigung', to: '/leistungen/bauendreinigung/neumuenster' },
        { label: 'Kita-Reinigung', to: '/leistungen/kita-reinigung/neumuenster' },
        { label: 'Schulreinigung', to: '/leistungen/schulreinigung/neumuenster' },
      ],
    },
    highlights: [
      'Büroreinigung im Neumünsteraner Stadtgebiet',
      'Treppenhausreinigung für Mehrfamilienhäuser',
      'Glasreinigung für Geschäfte und Praxen',
      'Grundreinigung und Bauendreinigung in Neumünster',
    ],
    image: '/bilder/stadt-neumuenster.jpg',
    tier: 1,
  },
  {
    slug: 'rendsburg',
    name: 'Rendsburg',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Rendsburg für Büros, Praxen, Wohnanlagen und Geschäftsobjekte: regelmäßig, zuverlässig und persönlich betreut.',
    intro:
      'KlarWerk Service bietet Gebäudereinigung in Rendsburg für Unternehmen, Praxen, Immobilienverwaltungen und private Auftraggeber. An der Eider und im gesamten Kreis Rendsburg-Eckernförde sorgen wir für Sauberkeit in Bürogebäuden, Wohnanlagen und Geschäftsobjekten.',
    eigeneSeiten: {
      vorspann: 'Für die häufigsten Aufträge in Rendsburg haben wir eigene Seiten:',
      links: [
        { label: 'Büroreinigung', to: '/leistungen/bueroreinigung/rendsburg' },
        { label: 'Praxisreinigung', to: '/leistungen/praxisreinigung/rendsburg' },
        { label: 'Glasreinigung', to: '/leistungen/glasreinigung/rendsburg' },
        { label: 'Unterhaltsreinigung', to: '/leistungen/unterhaltsreinigung/rendsburg' },
        { label: 'Grundreinigung', to: '/leistungen/grundreinigung/rendsburg' },
        { label: 'Bauendreinigung', to: '/leistungen/bauendreinigung/rendsburg' },
        { label: 'Kita-Reinigung', to: '/leistungen/kita-reinigung/rendsburg' },
        { label: 'Schulreinigung', to: '/leistungen/schulreinigung/rendsburg' },
      ],
    },
    highlights: [
      { text: 'Büroreinigung in Rendsburg nach Feierabend', to: '/leistungen/bueroreinigung/rendsburg' },
      { text: 'Praxisreinigung in Rendsburg nach Hygieneplan', to: '/leistungen/praxisreinigung/rendsburg' },
      { text: 'Glasreinigung in Rendsburg, streifenfrei innen und außen', to: '/leistungen/glasreinigung/rendsburg' },
      'Treppenhausreinigung für Wohnanlagen in Rendsburg',
    ],
    image: '/bilder/stadt-rendsburg.jpg',
    tier: 1,
  },
  {
    slug: 'preetz',
    name: 'Preetz',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Preetz: Zuverlässige Reinigung für Wohn- und Geschäftsobjekte. Persönlicher Service für Preetz und Umgebung.',
    intro:
      'KlarWerk Service bietet professionelle Gebäudereinigung in Preetz und Umgebung an. Wir betreuen Wohnanlagen, Büros und Geschäftsobjekte in der Schusterstadt mit persönlichem Engagement und regionaler Nähe.',
    highlights: [
      'Regelmäßige Reinigung für Wohnanlagen in Preetz',
      'Büroreinigung für kleine und mittlere Unternehmen',
      'Hausmeisterservice für Wohnanlagen und Gewerbe',
      'Gartenpflege für Außenanlagen in Preetz',
    ],
    image: '/bilder/stadt-preetz.jpg',
    tier: 1,
  },
  {
    slug: 'ploen-eckernfoerde',
    name: 'Plön & Eckernförde',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Plön und Eckernförde: Professionelle Reinigung für Wohn- und Geschäftsobjekte. Zuverlässig, flexibel und persönlich betreut.',
    intro:
      'KlarWerk Service bietet Gebäudereinigung in Plön und Eckernförde an. Von der Holsteinischen Schweiz bis zur Ostseeküste sorgen wir für Sauberkeit in Wohnanlagen, Büros und Geschäftsobjekten – mit regionaler Nähe und persönlichem Engagement.',
    highlights: [
      'Büroreinigung für Unternehmen in Plön und Eckernförde',
      'Treppenhausreinigung für Wohnanlagen',
      'Hausmeisterservice für Wohnanlagen und Gewerbe',
      'Gartenpflege und Außenanlagenpflege',
    ],
    image: '/bilder/stadt-ploen-eckernfoerde.jpg',
    tier: 1,
  },
  {
    slug: 'bad-segeberg',
    name: 'Bad Segeberg',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Bad Segeberg für Büros, Praxen, Wohnanlagen und Geschäftsobjekte: regelmäßig, zuverlässig und persönlich betreut.',
    intro:
      'In Bad Segeberg bietet KlarWerk Service umfassende Gebäudereinigung für gewerbliche und private Kunden. Vom Kurort bis ins Umland sorgen wir für Sauberkeit in Bürogebäuden, Wohnanlagen und Geschäftsobjekten.',
    highlights: [
      'Büroreinigung im Bad Segeberger Stadtgebiet',
      'Treppenhausreinigung für Wohnanlagen',
      'Glasreinigung für Geschäfte und Praxen',
      'Hausmeisterservice für Wohnanlagen in Bad Segeberg',
    ],
    image: '/bilder/stadt-bad-segeberg.jpg',
    tier: 1,
  },
  {
    slug: 'eutin',
    name: 'Eutin',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Eutin: Professionelle Reinigung für Wohn- und Geschäftsobjekte. Zuverlässig, flexibel und persönlich betreut.',
    intro:
      'KlarWerk Service bietet Gebäudereinigung in Eutin und Umgebung an. In der Rosenstadt und im gesamten Kreis Ostholstein sorgen wir für Sauberkeit in Wohnanlagen, Büros und Geschäftsobjekten mit persönlichem Engagement.',
    highlights: [
      'Büroreinigung für Unternehmen in Eutin',
      'Treppenhausreinigung für Wohnanlagen',
      'Hausmeisterservice für Wohnanlagen und Gewerbe',
      'Gartenpflege und Außenanlagenpflege in Eutin',
    ],
    image: '/bilder/stadt-eutin.jpg',
    tier: 1,
  },
  {
    slug: 'luebeck',
    name: 'Lübeck',
    region: 'Schleswig-Holstein',
    description:
      'Gebäudereinigung in Lübeck: Professionelle Reinigung für Büros, Praxen, Wohnanlagen und Geschäftsobjekte. Regelmäßig, zuverlässig und persönlich betreut.',
    intro:
      'KlarWerk Service bietet Gebäudereinigung in Lübeck für Unternehmen, Praxen, Immobilienverwaltungen und private Auftraggeber. Von der Hansestadt bis ins Umland sorgen wir für Sauberkeit in Bürogebäuden, Wohnanlagen und Geschäftsobjekten.',
    highlights: [
      'Büroreinigung im Lübecker Zentrum und Vororten',
      'Glasreinigung für historische und moderne Fassaden',
      'Treppenhausreinigung für Wohnanlagen in Lübeck',
      'Hausmeisterservice für Wohnanlagen und Gewerbe',
    ],
    image: '/bilder/stadt-luebeck.jpg',
    tier: 1,
  },
  {
    slug: 'hamburg',
    name: 'Hamburg',
    region: 'Hamburg',
    description:
      'Gebäudereinigung in Hamburg: Professionelle Reinigung für Büros, Praxen, Wohnanlagen und Geschäftsobjekte. Flexibel, zuverlässig und persönlich betreut.',
    intro:
      'In der Hansestadt Hamburg bieten wir umfassende Gebäudereinigung für gewerbliche und private Kunden. Vom Stadtzentrum bis in die Randbezirke – KlarWerk Service steht für zuverlässige Reinigungslösungen mit persönlichem Service.',
    highlights: [
      'Büroreinigung im Hamburger Zentrum und der HafenCity',
      'Glasreinigung für Bürogebäude und Geschäftsobjekte',
      'Treppenhausreinigung für Hamburger Wohnanlagen',
      'Hausmeisterservice für Wohnanlagen in Hamburg',
    ],
    image: '/bilder/stadt-hamburg.jpg',
    tier: 2,
  },
  {
    slug: 'nordrhein-westfalen',
    name: 'Nordrhein-Westfalen',
    region: 'Nordrhein-Westfalen',
    description:
      'Gebäudereinigung in Nordrhein-Westfalen für Büros, Praxen, Wohnanlagen und Geschäftsobjekte: flexibel, zuverlässig und persönlich betreut.',
    intro:
      'KlarWerk Service ist auch in Nordrhein-Westfalen für gewerbliche und private Kunden tätig. Von Köln über Düsseldorf bis ins Ruhrgebiet sorgen wir für Sauberkeit in Bürogebäuden, Wohnanlagen und Geschäftsobjekten mit persönlichem Engagement.',
    highlights: [
      'Büroreinigung in Köln, Düsseldorf und im Ruhrgebiet',
      'Glasreinigung für Bürogebäude und Geschäftsobjekte',
      'Treppenhausreinigung für Wohnanlagen in NRW',
      'Hausmeisterservice für Wohnanlagen und Gewerbe',
    ],
    image: '/bilder/stadt-nordrhein-westfalen.jpg',
    tier: 3,
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
