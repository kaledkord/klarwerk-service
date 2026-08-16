import {
  Clock,
  Gem,
  ShieldCheck,
  Sparkles,
  Handshake,
  Leaf,
  Building2,
  Stethoscope,
  Baby,
  Factory,
  Hotel,
  Landmark,
  Home,
  GraduationCap,
  HeartPulse,
  Warehouse,
  UtensilsCrossed,
  ShoppingCart,
  Waves,
  type LucideIcon,
} from 'lucide-react';

export interface ProcessStep {
  title: string;
  desc: string;
}

export interface Advantage {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface ServiceContent {
  id: string;
  h1: string;
  intro: string;
  process: ProcessStep[];
  advantages: Advantage[];
  areas: { icon: LucideIcon; label: string }[];
  sustainability: string[];
  faqs: { question: string; answer: string }[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
}

const defaultProcess: ProcessStep[] = [
  { title: 'Beratung & Besichtigung', desc: 'Wir besichtigen Ihr Objekt vor Ort, hören zu und nehmen alle Anforderungen präzise auf.' },
  { title: 'Planung', desc: 'Sie erhalten einen transparenten Reinigungsplan mit klaren Zeit- und Materialvorgaben.' },
  { title: 'Vorbereitung', desc: 'Wir stellen das geschulte Team, die passende Technik und die Mittel bereit.' },
  { title: 'Durchführung', desc: 'Gewissenhafte Ausführung nach festgelegtem Ablaufplan – sauber, gründlich, zuverlässig.' },
  { title: 'Qualitätskontrolle', desc: 'Wir prüfen das Ergebnis anhand eines Checklisten-Systems vor der Übergabe.' },
  { title: 'Nachbetreuung', desc: 'Persönliche Rückfrage, Anpassungen und Terminierung des nächsten Einsatzes.' },
];

const defaultAdvantages: Advantage[] = [
  { icon: Clock, title: 'Zeitersparnis', desc: 'Sie gewinnen wertvolle Zeit für Ihr Kerngeschäft – die Reinigung liegt bei uns.' },
  { icon: Gem, title: 'Werterhalt', desc: 'Regelmäßige Profi-Pflege schützt Böden, Möbel und Oberflächen langfristig.' },
  { icon: ShieldCheck, title: 'Hygiene', desc: 'Saubere Flächen reduzieren Keime und sorgen für ein gesundes Umfeld.' },
  { icon: Sparkles, title: 'Professionelle Ergebnisse', desc: 'Geschultes Personal und moderne Technik für sichtbar bessere Resultate.' },
  { icon: Handshake, title: 'Zuverlässiger Service', desc: 'Feste Ansprechpartner, pünktliche Termine und verlässliche Qualität.' },
];

const defaultAreas: { icon: LucideIcon; label: string }[] = [
  { icon: Building2, label: 'Büros' },
  { icon: Stethoscope, label: 'Praxen' },
  { icon: Baby, label: 'Kindergärten' },
  { icon: Factory, label: 'Industrie' },
  { icon: Hotel, label: 'Hotels' },
  { icon: Landmark, label: 'Öffentliche Einrichtungen' },
  { icon: Home, label: 'Privathaushalte' },
];

const defaultSustainability: string[] = [
  'Umweltschonende Arbeitsweise mit zertifizierten Reinigungsmitteln',
  'Effiziente Nutzung von Wasser und Reinigungsmitteln durch Dosierung',
  'Nachhaltige Pflege von Materialien für längere Lebensdauer',
  'Verantwortungsvoller Umgang mit Ressourcen und Abfällen',
];

const localKeywords = 'Schleswig-Holstein, Kiel, Bordesholm, Neumünster, Rendsburg, Hamburg';

export const serviceContents: Record<string, ServiceContent> = {
  gebaeudereinigung: {
    id: 'gebaeudereinigung',
    h1: 'Gebäudereinigung in Schleswig-Holstein & Hamburg',
    intro:
      'Ein gepflegtes Gebäude schützt Werte und hinterlässt bei Mietern, Kunden und Besuchern den richtigen Eindruck – doch im Alltag bleibt für gründliche Reinigung selten Zeit. KlarWerk Service übernimmt die komplette Gebäudereinigung für Wohn- und Geschäftsobjekte in Schleswig-Holstein und Hamburg: Treppenhäuser, Gemeinschaftsflächen, Büros und ganze Liegenschaften. Nach einem festen Reinigungsplan arbeitet ein eingespieltes Team, das Ihr Objekt kennt – termintreu, versichert und mit dokumentierter Qualitätskontrolle. So bleibt Ihr Gebäude dauerhaft sauber, ohne dass Sie sich darum kümmern müssen.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: defaultAreas,
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Wie oft wird mein Gebäude gereinigt?', answer: 'Wir erstellen einen individuellen Reinigungsplan – wöchentlich, alle zwei Wochen oder nach Bedarf. Die Frequenz richtet sich nach Nutzung und Größe des Objekts.' },
      { question: 'Übernehmen Sie auch die Reinigung von Gemeinschaftsflächen?', answer: 'Ja, Treppenhäuser, Flure und Gemeinschaftsräume gehören zu unseren Kernaufgaben, insbesondere für Wohnanlagen und Mehrfamilienhäuser.' },
      { question: 'Brauche ich einen festen Reinigungstag?', answer: 'Ein fester Tag sorgt für Planungssicherheit, ist aber nicht zwingend erforderlich. Wir passen uns an Ihre Wünsche und die Nutzung des Objekts an.' },
      { question: 'Stellen Sie das Reinigungspersonal dauerhaft?', answer: 'Ja, Sie bekommen ein festes Team, das Ihr Objekt kennt. Das sichert gleichbleibende Qualität und kurze Wege.' },
      { question: 'Was kostet die Gebäudereinigung?', answer: 'Der Preis hängt von Größe, Nutzung und Frequenz ab. Nach einer kostenlosen Besichtigung erhalten Sie ein transparentes Festangebot.' },
      { question: 'Arbeiten Sie auch außerhalb von Schleswig-Holstein?', answer: 'Unser Schwerpunkt liegt in Schleswig-Holstein rund um Bordesholm, Kiel und Neumünster. Darüber hinaus sind wir in Hamburg tätig; überregionale Anfragen prüfen wir gerne individuell.' },
    ],
    seo: {
      title: 'Gebäudereinigung in Schleswig-Holstein & Hamburg | KlarWerk Service',
      description:
        'Professionelle Gebäude­reinigung für Wohn- und Geschäftsobjekte in Schleswig-Holstein & Hamburg. Regelmäßige Reinigung, Treppenhäuser, Gemeinschaftsflächen. Jetzt kostenloses Angebot anfragen.',
      keywords: `Gebäudereinigung, Treppenhausreinigung, Wohnungsreinigung, Geschäftsobjekte, ${localKeywords}`,
    },
  },

  bueroreinigung: {
    id: 'bueroreinigung',
    h1: 'Büroreinigung für produktive Arbeitsräume',
    intro:
      'Volle Papierkörbe, streifige Konferenztische und vernachlässigte Sanitärbereiche kosten kein Geld, aber Ansehen – bei Mitarbeitern wie bei Besuchern. KlarWerk Service hält Ihre Büroräume, Besprechungszimmer, Küchen und Sanitäranlagen zuverlässig sauber, auf Wunsch früh morgens, abends oder am Wochenende, damit der Betrieb ungestört läuft. Sie erhalten ein festes Team mit festem Ansprechpartner, einen klaren Reinigungsplan und gleichbleibende Qualität – geprüft per Checkliste. Das Ergebnis ist ein professionelles Arbeitsumfeld, in dem sich konzentriert arbeiten lässt.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: defaultAreas,
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Wann wird unser Büro gereinigt?', answer: 'In der Regel außerhalb der Arbeitszeiten – frühmorgens, abends oder am Wochenende. Wir richten uns nach Ihrem Betriebsablauf.' },
      { question: 'Reinigen Sie auch Bildschirme und Tastaturen?', answer: 'Ja, auf Wunsch übernehmen wir die hygienische Reinigung von Arbeitsplätzen inklusive Bildschirmen und Tastaturen.' },
      { question: 'Können wir einen Zugangsschlüssel hinterlegen?', answer: 'Selbstverständlich. Wir behandeln Ihre Schlüssel vertraulich und dokumentieren die Übergabe sorgfältig.' },
      { question: 'Was ist mit Küche und Sanitärbereichen?', answer: 'Beides gehört zum Standardumfang: Küchenzeilen, Kaffeemaschinen, Sanitärbereiche und Waschbecken reinigen wir bei jedem Einsatz.' },
      { question: 'Bieten Sie auch Glasreinigung fürs Büro an?', answer: 'Ja, wir reinigen Innen- und Außengläser – als Teil der Büroreinigung oder als separater Termin.' },
      { question: 'Wie schnell können Sie starten?', answer: 'Nach der Besichtigung und Angebotsfreigabe starten wir in der Regel innerhalb von ein bis zwei Wochen.' },
    ],
    seo: {
      title: 'Büroreinigung in Schleswig-Holstein & Hamburg | KlarWerk Service',
      description:
        'Zuverlässige Büroreinigung für produktive Arbeitsplätze in Schleswig-Holstein & Hamburg. Schreibtische, Böden, Sanitärbereiche, Küche. Flexible Termine, festes Team. Jetzt anfragen.',
      keywords: `Büroreinigung, Büroreinigung Hamburg, Büroreinigung Kiel, Schreibtischreinigung, Bodenpflege, ${localKeywords}`,
    },
  },

  unterhaltsreinigung: {
    id: 'unterhaltsreinigung',
    h1: 'Unterhaltsreinigung für dauerhaft saubere Räume',
    intro:
      'Sauberkeit, die man nicht organisieren muss: Die Unterhaltsreinigung von KlarWerk Service hält Büros, Praxen, Gewerbe und Wohnanlagen dauerhaft in Form – nach einem festen Plan, in der Frequenz, die zu Ihrer Nutzung passt. Ein festes Team kennt Ihr Objekt, hält Termine verlässlich ein und sichert die Qualität über Reinigungspläne und regelmäßige Kontrollen. Böden, Oberflächen, Sanitär- und Sozialräume bleiben so konstant gepflegt, Ihre Flächen behalten ihren Wert – und Sie haben den Kopf frei fürs Kerngeschäft.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: defaultAreas,
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Was ist der Unterschied zwischen Unterhalts- und Grundreinigung?', answer: 'Die Unterhaltsreinigung ist die regelmäßige, wiederkehrende Reinigung nach festem Plan. Die Grundreinigung ist eine seltene, besonders gründliche Intensivreinigung – ideal ergänzend ein- bis zweimal im Jahr.' },
      { question: 'Wie oft findet die Unterhaltsreinigung statt?', answer: 'Das legen wir gemeinsam fest – täglich, mehrmals pro Woche, wöchentlich oder vierzehntägig. Frequenz und Umfang richten sich nach Nutzung und Anforderungen.' },
      { question: 'Bekommen wir ein festes Reinigungsteam?', answer: 'Ja. Sie erhalten ein festes Team mit festem Ansprechpartner, das Ihr Objekt kennt – das sichert gleichbleibende Qualität und kurze Wege.' },
      { question: 'Wird außerhalb unserer Arbeitszeiten gereinigt?', answer: 'Auf Wunsch reinigen wir frühmorgens, abends oder am Wochenende, damit Ihr Betrieb ungestört bleibt.' },
      { question: 'Sind Reinigungsmittel und Material inklusive?', answer: 'Ja, wir bringen alle benötigten Reinigungsmittel, Materialien und die passende Technik mit. Verbrauchsmaterial wie Seife oder Papier können wir auf Wunsch mitliefern.' },
      { question: 'Wie wird die Qualität sichergestellt?', answer: 'Wir arbeiten mit Reinigungsplänen und Checklisten und führen regelmäßige Qualitätskontrollen durch – so bleibt das Ergebnis dauerhaft auf hohem Niveau.' },
    ],
    seo: {
      title: 'Unterhaltsreinigung in Schleswig-Holstein & Hamburg | KlarWerk Service',
      description:
        'Regelmäßige Unterhaltsreinigung für Büros, Praxen & Gewerbe in Schleswig-Holstein & Hamburg. Fester Reinigungsplan, festes Team, gleichbleibende Qualität. Jetzt anfragen.',
      keywords: `Unterhaltsreinigung, unterhaltsreinigung Kiel, Gebäudereinigung regelmäßig, Büroreinigung Vertrag, ${localKeywords}`,
    },
  },

  glasreinigung: {
    id: 'glasreinigung',
    h1: 'Glasreinigung für klare Sicht und ein helles Raumgefühl',
    intro:
      'Fenster sind die Visitenkarte Ihres Objekts – und nichts wirkt ungepflegter als Schlieren, Kalkränder und Fingerabdrücke im Gegenlicht. KlarWerk Service reinigt Fenster, Glasfassaden, Schaufenster, Vitrinen und Spiegel streifenfrei, innen wie außen, mit professioneller Wischtechnik statt Haushaltsmitteln. Hohe und schwer erreichbare Flächen erreichen wir sicher mit Teleskop- und Leitersystemen; auf Wunsch reinigen wir Rahmen, Fensterbänke und Falze gleich mit. So gewinnen Ihre Räume Licht und Klarheit zurück – regelmäßig im Turnus oder einmalig zum Anlass, in Kiel, Neumünster und ganz Schleswig-Holstein.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: defaultAreas,
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Wie oft sollte eine Glasreinigung erfolgen?', answer: 'Für Innenräume empfehlen wir eine Frequenz von 4–8 Wochen, Außenflächen je nach Verschmutzung 2–4 mal pro Jahr.' },
      { question: 'Reinigen Sie auch schwer erreichbare Fenster?', answer: 'Ja, mit Teleskopstangen und Leitersystemen erreichen wir auch hohe und schwer zugängliche Glasflächen.' },
      { question: 'Arbeiten Sie streifenfrei?', answer: 'Wir nutzen professionelle Wischtechniken und -mittel, die ein streifenfreies Ergebnis garantieren.' },
      { question: 'Kann die Glasreinigung kombiniert werden?', answer: 'Ja, sie lässt sich ideal mit der Büro- oder Gebäude­reinigung kombinieren. Wir erstellen einen gemeinsamen Ablaufplan.' },
      { question: 'Reinigen Sie auch Rahmen und Fensterbänke?', answer: 'Auf Wunsch übernehmen wir die Reinigung von Rahmen, Fensterbänken und Falzen vollständig.' },
      { question: 'Was kostet eine Glasreinigung?', answer: 'Die Kosten richten sich nach Anzahl, Größe und Zugänglichkeit der Fenster. Nach einer Besichtigung erhalten Sie ein Festpreis-Angebot.' },
    ],
    seo: {
      title: 'Glasreinigung & Fensterreinigung in Schleswig-Holstein | KlarWerk Service',
      description:
        'Streifenfreie Glas- und Fensterreinigung in Schleswig-Holstein & Hamburg. Fenster, Fassaden, Spiegel. Innen & außen. Flexible Termine, festes Team. Jetzt kostenloses Angebot.',
      keywords: `Glasreinigung, Fensterreinigung, Fassadenreinigung, streifenfreie Reinigung, ${localKeywords}`,
    },
  },

  praxisreinigung: {
    id: 'praxisreinigung',
    h1: 'Praxisreinigung nach hygienischen Standards',
    intro:
      'In einer Praxis entscheidet Sauberkeit über Vertrauen – und über die Sicherheit von Patienten und Team. KlarWerk Service reinigt Wartebereiche, Behandlungsräume und Sanitäranlagen nach hygienischen Standards, mit fachgerechter Flächendesinfektion und nachvollziehbarer Dokumentation. Wir arbeiten bevorzugt außerhalb der Sprechzeiten, damit Ihr Praxisablauf ungestört bleibt, setzen VAH-gelistete Desinfektionsmittel gezielt nach Einsatzbereich ein und stellen auf Wunsch Hygienepläne bereit. So übergeben wir Ihnen Räume, die den Anforderungen an eine medizinische Einrichtung wirklich gerecht werden.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: defaultAreas,
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Welche Hygienevorschriften beachten Sie?', answer: 'Wir arbeiten nach den Vorgaben des Arbeitsschutzes und der RKI-Richtlinien, inklusive sachgerechter Desinfektion von Oberflächen.' },
      { question: 'Reinigen Sie auch Behandlungsräume?', answer: 'Ja, Behandlungsräume inklusive Liegen, Instrumententische und Ablagen gehören zu unserem Leistungsumfang.' },
      { question: 'Welche Desinfektionsmittel verwenden Sie?', answer: 'Wir nutzen VAH-zertifizierte Desinfektionsmittel und passen die Wahl dem Einsatzbereich an.' },
      { question: 'Dokumentieren Sie die Reinigung?', answer: 'Ja, wir stellen Reinigungs- und Hygienepläne bereit und dokumentieren die durchgeführten Maßnahmen nachvollziehbar.' },
      { question: 'Können Sie außerhalb der Sprechzeiten arbeiten?', answer: 'Selbstverständlich. Wir reinigen vorzugsweise außerhalb der Praxiszeiten, um den Praxisablauf nicht zu stören.' },
      { question: 'Bieten Sie auch die Entsorgung von Praxisabfällen an?', answer: 'Die Entsorgung von Hausmüll übernehmen wir; für medizinische Abfälle arbeiten wir mit zertifizierten Partnern zusammen.' },
    ],
    seo: {
      title: 'Praxisreinigung für Arztpraxen in Schleswig-Holstein | KlarWerk Service',
      description:
        'Hygienische Praxisreinigung nach RKI-Standards in Schleswig-Holstein & Hamburg. Wartebereiche, Behandlungsräume, Sanitärbereiche. Desinfektion & Dokumentation. Jetzt anfragen.',
      keywords: `Praxisreinigung, Arztpraxisreinigung, Desinfektion, Hygiene, Reinigung medizinische Einrichtungen, ${localKeywords}`,
    },
  },

  hausmeisterservice: {
    id: 'hausmeisterservice',
    h1: 'Hausmeisterservice – Ihr zuverlässiger Partner vor Ort',
    intro:
      'Ein Objekt läuft nur rund, wenn sich jemand verlässlich kümmert – vom sauberen Treppenhaus bis zur schnell gewechselten Lampe. Als Hausmeisterservice betreut KlarWerk Service Wohnanlagen und Gewerbeobjekte mit festem Personal und festen Einsatztagen: Treppenhaus- und Grünflächenpflege, Winterdienst, kleine Reparaturen, Kontrolle der Haustechnik und allgemeine Objektbetreuung. Über durchgeführte Tätigkeiten und den Zustand des Objekts berichten wir Ihnen regelmäßig. Ob einzelne Liegenschaft oder größeres Portfolio – Sie haben einen festen Ansprechpartner, der weiß, was zu tun ist.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: defaultAreas,
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Welche Aufgaben übernimmt der Hausmeister?', answer: 'Treppenhausreinigung, Winterdienst, kleine Reparaturen, Objektbetreuung, Grünflächenpflege und Kontrolle der Haustechnik gehören zum Standardumfang.' },
      { question: 'Bieten Sie den Service dauerhaft an?', answer: 'Ja, wir übernehmen die langfristige Betreuung Ihres Objekts mit festem Personal und festen Einsatztagen.' },
      { question: 'Ist der Winterdienst inklusive?', answer: 'Der Winterdienst kann als Baustein gebucht werden – mit Räumung, Streuung und rechtssicherer Dokumentation.' },
      { question: 'Übernehmen Sie auch kleinere Reparaturen?', answer: 'Ja, kleinere handwerkliche Tätigkeiten wie Lampenwechsel, Türwartung oder Montagearbeiten übernehmen wir direkt.' },
      { question: 'Wie werden die Einsätze dokumentiert?', answer: 'Sie erhalten regelmäßige Berichte über die durchgeführten Tätigkeiten und den Zustand des Objekts.' },
      { question: 'Können Sie mehrere Objekte betreuen?', answer: 'Ja, wir betreuen sowohl einzelne Wohnanlagen als auch größere Portfolios mit mehreren Liegenschaften.' },
    ],
    seo: {
      title: 'Hausmeisterservice in Schleswig-Holstein & Hamburg | KlarWerk Service',
      description:
        'Kompletter Hausmeisterservice in Schleswig-Holstein & Hamburg. Treppenhausreinigung, Winterdienst, kleine Reparaturen, Objektbetreuung. Fester Ansprechpartner. Jetzt anfragen.',
      keywords: `Hausmeisterservice, Hausmeister, Objektbetreuung, Winterdienst, Treppenhausreinigung, ${localKeywords}`,
    },
  },

  gartenpflege: {
    id: 'gartenpflege',
    h1: 'Gartenpflege für gepflegte Außenanlagen',
    intro:
      'Eine gepflegte Außenanlage ist der erste Eindruck – und der lässt sich nur mit kontinuierlicher Pflege halten. KlarWerk Service hält Ihre Grünflächen das ganze Jahr in Form: Rasenpflege, Heckenschnitt, Laubentfernung, Baumschnitt und saisonale Bepflanzung, abgestimmt auf die Vegetationsphasen. Auf Wunsch beraten wir bei der Pflanzenwahl, übernehmen die Anwuchspflege und entsorgen den Grünschnitt fachgerecht. Als Einzelleistung oder ganzjähriger Pflegevertrag, für private Gärten ebenso wie für gewerbliche und öffentliche Flächen in Schleswig-Holstein und Hamburg.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: defaultAreas,
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Welche Gartenarbeiten übernehmen Sie?', answer: 'Rasenpflege, Heckenschnitt, Laubentfernung, Baumschnitt, saisonale Bepflanzung und die Pflege von Wegen und Plätzen.' },
      { question: 'Bieten Sie eine ganzjährige Pflege an?', answer: 'Ja, wir erstellen einen Jahresplan, der auf die Vegetationsphasen abgestimmt ist – vom Frühlingsschnitt bis zur Winterpflege.' },
      { question: 'Können Sie auch neue Pflanzen setzen?', answer: 'Selbstverständlich. Wir beraten Sie bei der Pflanzenwahl und übernehmen die Pflanzung und Anwuchspflege.' },
      { question: 'Entsorgen Sie den Grünschnitt?', answer: 'Ja, der Grünschnitt wird fachgerecht entsorgt oder auf Wunsch vor Ort kompostiert.' },
      { question: 'Pflegen Sie auch gewerbliche Außenanlagen?', answer: 'Ja, wir betreuen sowohl private Gärten als auch gewerbliche Außenanlagen und öffentliche Flächen.' },
      { question: 'Was kostet die Gartenpflege?', answer: 'Nach einer Besichtigung erstellen wir ein individuelles Angebot – als Einzelleistung oder als ganzjähriger Pflegevertrag.' },
    ],
    seo: {
      title: 'Gartenpflege & Außenanlagenpflege in Schleswig-Holstein | KlarWerk Service',
      description:
        'Professionelle Gartenpflege in Schleswig-Holstein & Hamburg. Rasen, Hecken, Laub, saisonale Bepflanzung. Ganzjährige Pflege für private & gewerbliche Flächen. Jetzt anfragen.',
      keywords: `Gartenpflege, Außenanlagenpflege, Rasenmähen, Heckenschnitt, Laubentsorgung, ${localKeywords}`,
    },
  },

  grundreinigung: {
    id: 'grundreinigung',
    h1: 'Grundreinigung für einen sauberen Neuanfang',
    intro:
      'Manchmal reicht die normale Reinigung nicht – vor dem Einzug, nach dem Umbau oder wenn sich über die Zeit Schichten festgesetzt haben. Die Grundreinigung von KlarWerk Service geht in die Tiefe: Böden, Sanitär, Küchen und schwer zugängliche Bereiche werden intensiv gereinigt, auf Wunsch inklusive Bodenversiegelung und Fensterreinigung. Vorab erhalten Sie ein transparentes Festpreis-Angebot mit klarer Zeitvorgabe, das benötigte Material und die Technik bringen wir mit. Das Ergebnis ist ein sauberer Neuanfang – bis in die letzte Ecke.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: defaultAreas,
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Wann ist eine Grundreinigung sinnvoll?', answer: 'Vor Einzug, nach Bauarbeiten, bei Objektübergabe oder als tiefgehende Jahresaktion – immer, wenn es besonders gründlich sein muss.' },
      { question: 'Ist die Grundreinigung teurer als die Unterhaltsreinigung?', answer: 'Ja, da sie deutlich aufwendiger ist. Sie erhalten vorab ein transparentes Festpreis-Angebot.' },
      { question: 'Reinigen Sie auch Böden versiegelungsreif?', answer: 'Ja, auf Wunsch übernehmen wir Bodenversiegelung und -pflege als Teil der Grundreinigung.' },
      { question: 'Sind Fenster inklusive?', answer: 'Fenster- und Glasreinigung können als Baustein hinzugebucht werden.' },
      { question: 'Wie lange dauert eine Grundreinigung?', answer: 'Je nach Größe und Zustand des Objekts – von einem Tag bis zu mehreren Tagen. Wir nennen Ihnen eine klare Zeitvorgabe.' },
      { question: 'Stellen Sie das Material bereit?', answer: 'Ja, wir bringen alle benötigten Reinigungs- und Pflegemittel sowie die passende Technik mit.' },
    ],
    seo: {
      title: 'Grundreinigung in Schleswig-Holstein & Hamburg | KlarWerk Service',
      description:
        'Intensive Grundreinigung für Wohnungen, Büros & Gewerbe in Schleswig-Holstein & Hamburg. Bodenversiegelung, Desinfektion, Fenster. Vor Einzug oder nach Bauarbeiten. Jetzt anfragen.',
      keywords: `Grundreinigung, Intensivreinigung, Bodenversiegelung, Desinfektion, ${localKeywords}`,
    },
  },

  bauendreinigung: {
    id: 'bauendreinigung',
    h1: 'Bauendreinigung – sauberer Abschluss nach Bauarbeiten',
    intro:
      'Nach dem letzten Gewerk steht der Übergabe nur noch der Baustaub im Weg – und der sitzt hartnäckig auf jeder Fläche. KlarWerk Service übernimmt die Bauendreinigung, sobald keine staubintensiven Arbeiten mehr anstehen: Wir entfernen Baustaub, Farb-, Mörtel- und Klebereste schonend von Flächen, Rahmen und Profilen und reinigen Fenster und Böden übergabefertig. Auf Wunsch ergänzen wir eine intensive Grundreinigung und organisieren die Entsorgung von Reststoffen. Sie erhalten eine verbindliche Zeitvorgabe im Angebot – und am Ende ein Objekt, das bezugsfertig ist.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: defaultAreas,
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Wann sollte die Bauendreinigung erfolgen?', answer: 'Nach Abschluss aller Gewerke, sobald keine staubintensiven Arbeiten mehr anstehen.' },
      { question: 'Entfernen Sie auch Farb- und Mörtelreste?', answer: 'Ja, wir entfernen schonend Farb-, Mörtel- und Klebereste von Flächen, Rahmen und Profilen.' },
      { question: 'Reinigen Sie auch die Fenster nach Baustaub?', answer: 'Fenster- und Glasreinigung gehören zum Standardumfang der Bauendreinigung.' },
      { question: 'Wie lange dauert die Bauendreinigung?', answer: 'Abhängig von Objektgröße und Verschmutzungsgrad – wir nennen Ihnen eine verbindliche Zeitvorgabe im Angebot.' },
      { question: 'Können Sie die Reinigung mit einer Grundreinigung kombinieren?', answer: 'Ja, auf Wunsch ergänzen wir die Bauendreinigung um eine intensive Grundreinigung für alle Flächen.' },
      { question: 'Stellen Sie Container für den Bauschutt?', answer: 'Die Entsorgung von Reststoffen organisieren wir auf Wunsch gerne für Sie.' },
    ],
    seo: {
      title: 'Bauendreinigung in Schleswig-Holstein & Hamburg | KlarWerk Service',
      description:
        'Professionelle Bauendreinigung in Schleswig-Holstein & Hamburg. Baustaub, Farbreste, Fenster, Böden. Sauberer Abschluss nach Bau- und Renovierungsarbeiten. Jetzt anfragen.',
      keywords: `Bauendreinigung, Baureinigung, Baustaub entfernen, Farbreste entfernen, ${localKeywords}`,
    },
  },

  winterdienst: {
    id: 'winterdienst',
    h1: 'Winterdienst – sicher durch den Winter',
    intro:
      'Bei Schnee und Eisglätte haftet der Eigentümer – und der erste Sturz kommt oft vor dem ersten Kaffee. KlarWerk Service übernimmt Ihre Räum- und Streupflicht zuverlässig, in der Regel frühmorgens vor Betriebsbeginn: Schneeräumung, Streuung mit umweltverträglichem Splitt und, wo sinnvoll und zulässig, Salz. Ob Saisonvertrag oder Einsatz auf Abruf bei unerwarteter Witterung – wir halten Wege und Flächen frei und dokumentieren jeden Einsatz rechtssicher. So sind Ihre Zugänge sicher und Sie rechtlich auf der sicheren Seite, ohne selbst zur Schippe greifen zu müssen.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: defaultAreas,
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Ab wann rücken Sie aus?', answer: 'Wir räumen bei Schnee- oder Eisglätte – in der Regel frühmorgens vor Betriebsbeginn, je nach Vereinbarung.' },
      { question: 'Bieten Sie einen Rundum-Sorglos-Service an?', answer: 'Ja, wir übernehmen die komplette Räum- und Streupflicht inklusive rechtssicherer Dokumentation.' },
      { question: 'Welche Streumittel verwenden Sie?', answer: 'Wir nutzen umweltverträgliche Streumittel wie Splitt; Salz nur dort, wo es sinnvoll und zulässig ist.' },
      { question: 'Kann der Winterdienst auf Abruf gebucht werden?', answer: 'Ja, neben Saisonverträgen bieten wir auch Abruf-Dienste für unerwartete Witterung.' },
      { question: 'Gelten Sie auch für private Wege?', answer: 'Ja, wir betreuen private Grundstücke ebenso wie gewerbliche und öffentliche Flächen.' },
      { question: 'Wie wird der Einsatz dokumentiert?', answer: 'Sie erhalten einen Räum- und Streuplan sowie Protokolle über die durchgeführten Einsätze.' },
    ],
    seo: {
      title: 'Winterdienst & Räumdienst in Schleswig-Holstein & Hamburg | KlarWerk Service',
      description:
        'Zuverlässiger Winterdienst in Schleswig-Holstein & Hamburg. Schneeräumung, Streudienst, Flächenfreihaltung. Saisonvertrag oder Abruf. Rechtssichere Dokumentation. Jetzt anfragen.',
      keywords: `Winterdienst, Räumdienst, Schneeräumung, Streudienst, Splitt, ${localKeywords}`,
    },
  },

  entruempelung: {
    id: 'entruempelung',
    h1: 'Entrümpelung & fachgerechte Entsorgung',
    intro:
      'Eine Wohnungsauflösung oder ein voller Keller kostet Nerven, Zeit und oft auch Diskretion. KlarWerk Service entrümpelt Wohnungen, Keller, Dachböden, Garagen und Gewerbeobjekte vollständig – zuverlässig, sauber und diskret, gerade bei sensiblen Anlässen. Vorab besprechen wir, was behalten, verkauft oder entsorgt wird, und dokumentieren alles nachvollziehbar; die Materialien trennen und entsorgen wir fachgerecht, den Transport übernehmen wir. Nach einer Besichtigung erhalten Sie ein Festpreis-Angebot mit klarer Zeitvorgabe – und danach einen leeren, besenreinen Raum.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: defaultAreas,
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Welche Räume entrümpeln Sie?', answer: 'Wohnungen, Keller, Dachböden, Garagen, Lager und Gewerbeobjekte – wir entrümpeln jede Art von Raum.' },
      { question: 'Übernehmen Sie die Entsorgung?', answer: 'Ja, wir sorgen für die fachgerechte Trennung und Entsorgung der Materialien inklusive Transport.' },
      { question: 'Ist die Entrümpelung diskret?', answer: 'Selbstverständlich. Wir arbeiten zuverlässig und diskret, gerade bei sensiblen Anlässen wie Wohnungsauflösungen.' },
      { question: 'Kann ich Wertgegenstände behalten?', answer: 'Ja, vorab besprechen wir, was behalten, verkauft oder entsorgt werden soll. Wir dokumentieren alles.' },
      { question: 'Wie lange dauert eine Entrümpelung?', answer: 'Je nach Menge und Größe – von wenigen Stunden bis zu mehreren Tagen. Sie erhalten eine klare Zeitvorgabe.' },
      { question: 'Was kostet eine Entrümpelung?', answer: 'Die Kosten hängen von Menge, Etagen und Entsorgungsaufwand ab. Nach einer Besichtigung erhalten Sie ein Festpreis-Angebot.' },
    ],
    seo: {
      title: 'Entrümpelung & Wohnungsauflösung in Schleswig-Holstein | KlarWerk Service',
      description:
        'Professionelle Entrümpelung in Schleswig-Holstein & Hamburg. Wohnungen, Keller, Dachböden, Gewerbe. Inklusive fachgerechter Entsorgung & Transport. Diskret & schnell. Jetzt anfragen.',
      keywords: `Entrümpelung, Wohnungsauflösung, Entsorgung, Kellerentrümpelung, ${localKeywords}`,
    },
  },

  moebelreinigung: {
    id: 'moebelreinigung',
    h1: 'Möbelreinigung für Polster, Teppiche & Matratzen',
    intro:
      'Polster, Matratzen und Teppiche nehmen im Alltag Flecken, Staub und Gerüche auf – sichtbar und spürbar. KlarWerk Service reinigt sie in der Tiefe und trotzdem materialschonend: Flecken behandeln wir mit geeigneten Spezialmitteln, Hausstaub, Milben und Allergene werden gründlich entfernt, unangenehme Gerüche neutralisiert. Wir reinigen vor Ort – zu Hause oder im Büro – und nutzen schnelltrocknende Verfahren, damit Möbel rasch wieder nutzbar sind. So gewinnen Ihre Sitzmöbel, Matratzen und Teppiche Frische und Hygiene zurück, ohne dass etwas ausgebaut werden muss.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: defaultAreas,
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Welche Möbel reinigen Sie?', answer: 'Polstermöbel, Matratzen, Teppiche, Teppichböden und Sitzbezüge – schonend und materialspezifisch.' },
      { question: 'Entfernen Sie auch Flecken?', answer: 'Ja, wir behandeln Flecken mit schonenden Spezialmitteln und schonen dabei das Gewebe.' },
      { question: 'Wie lange dauert die Trocknung?', answer: 'Je nach Material und Feuchtigkeit einige Stunden – wir nutzen schnelltrocknende Verfahren.' },
      { question: 'Ist die Reinigung für Allergiker geeignet?', answer: 'Ja, wir entfernen Hausstaub, Milben und Allergene – besonders wichtig bei Matratzen und Teppichen.' },
      { question: 'Können Sie auch Gerüche entfernen?', answer: 'Ja, durch Tiefenreinigung und geruchsneutralisierende Behandlung werden unangenehme Gerüche beseitigt.' },
      { question: 'Müssen die Möbel ausgebaut werden?', answer: 'Nein, wir reinigen vor Ort – egal ob zu Hause oder im Büro.' },
    ],
    seo: {
      title: 'Möbelreinigung & Polsterreinigung in Schleswig-Holstein | KlarWerk Service',
      description:
        'Schonende Möbelreinigung in Schleswig-Holstein & Hamburg. Polster, Teppiche, Matratzen. Flecken- und Geruchsentfernung. Allergiker-geeignet. Reinigung vor Ort. Jetzt anfragen.',
      keywords: `Möbelreinigung, Polsterreinigung, Teppichreinigung, Matratzenreinigung, Fleckenentfernung, ${localKeywords}`,
    },
  },

  schulreinigung: {
    id: 'schulreinigung',
    h1: 'Schulreinigung – Saubere Lernumgebungen für Schüler und Lehrkräfte',
    intro:
      'Lernen gelingt in Räumen, die sauber und gesund sind – und in Schulen zählt dabei jede Fläche, von der Tafel bis zur Sporthalle. KlarWerk Service reinigt Bildungseinrichtungen nach einem abgestimmten Konzept: Klassenräume, Flure, Sanitäranlagen und Sportbereiche, außerhalb der Unterrichtszeiten und ohne Störung des Betriebs. In den Ferien führen wir intensive Grundreinigungen sowie Bodenpflege und -beschichtung durch, die im laufenden Betrieb nicht möglich sind. Wir setzen umwelt- und gesundheitsschonende Mittel ein – für hygienische Lernumgebungen, in denen sich Schüler und Lehrkräfte wohlfühlen.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: [
      { icon: GraduationCap, label: 'Schulen' },
      { icon: Building2, label: 'Berufsschulen' },
      { icon: Stethoscope, label: 'Bildungseinrichtungen' },
      { icon: Factory, label: 'Ausbildungszentren' },
    ],
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Reinigen Sie auch während des Unterrichts?', answer: 'Nein, wir reinigen in der Regel außerhalb der Unterrichtszeiten – frühmorgens, abends oder in den Ferien.' },
      { question: 'Übernehmen Sie die Sporthallenreinigung?', answer: 'Ja, wir reinigen Sportböden, Umkleiden und Sanitärbereiche von Sporthallen professionell.' },
      { question: 'Was ist die Ferien-Grundreinigung?', answer: 'In den Schulferien führen wir intensive Grundreinigungen durch, die im regulären Betrieb nicht möglich sind.' },
      { question: 'Verwenden Sie kindersichere Reinigungsmittel?', answer: 'Ja, wir nutzen umweltverträgliche und gesundheitsschonende Mittel, die für Bildungseinrichtungen geeignet sind.' },
      { question: 'Können Sie Treppenhäuser und Flure abdecken?', answer: 'Selbstverständlich, Treppenhaus- und Flurreinigung gehören zum Standardumfang der Schulreinigung.' },
      { question: 'Bieten Sie Bodenpflege und Beschichtung an?', answer: 'Ja, wir pflegen und beschichten verschiedene Bodenbeläge für langfristigen Werterhalt.' },
    ],
    seo: {
      title: 'Schulreinigung für Bildungseinrichtungen in Schleswig-Holstein | KlarWerk Service',
      description:
        'Professionelle Schulreinigung in Schleswig-Holstein & Hamburg. Klassenräume, Flure, Sanitäranlagen, Sporthallen, Ferien-Grundreinigung. Hygienische Lernumgebungen. Jetzt anfragen.',
      keywords: `Schulreinigung, Schulreinigung Hamburg, Schulreinigung Kiel, Berufsschulreinigung, Bildungseinrichtung reinigen, ${localKeywords}`,
    },
  },

  'kita-reinigung': {
    id: 'kita-reinigung',
    h1: 'Kita-Reinigung – Hygiene und Sicherheit für Kinder',
    intro:
      'Kleine Kinder fassen alles an, sitzen auf dem Boden und stecken Dinge in den Mund – deshalb gelten in Kitas besondere Hygienestandards. KlarWerk Service entwickelt Reinigungskonzepte speziell für sensible Bereiche: Gruppen- und Spielräume, Wickelbereiche und Sanitäranlagen werden mit geprüften, für Kindereinrichtungen zugelassenen Hygienemitteln gereinigt und desinfiziert. Bei Infektionswellen führen wir zusätzliche Desinfektionsreinigungen durch; Böden aus Linoleum, PVC oder Fliesen pflegen wir dauerhaft. Gereinigt wird außerhalb der Betreuungszeiten – für eine Umgebung, in der Kinder sicher spielen und lernen können.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: [
      { icon: Baby, label: 'Kindergärten' },
      { icon: Baby, label: 'Krippen' },
      { icon: Building2, label: 'Horte' },
      { icon: Handshake, label: 'Betreuungseinrichtungen' },
    ],
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Welche Hygienestandards gelten in Kitas?', answer: 'Wir arbeiten nach den Vorgaben der Träger und Gesundheitsämter, insbesondere für Wickelbereiche und Sanitäranlagen.' },
      { question: 'Verwenden Sie kindersichere Reinigungsmittel?', answer: 'Ja, wir nutzen geprüfte Hygienemittel, die für den Einsatz in Kindereinrichtungen zugelassen sind.' },
      { question: 'Reinigen Sie auch Wickelbereiche?', answer: 'Ja, die hygienische Reinigung und Desinfektion von Wickelbereichen ist ein wichtiger Bestandteil unseres Konzepts.' },
      { question: 'Bieten Sie Desinfektionsreinigung an?', answer: 'Ja, bei Bedarf führen wir zusätzliche Desinfektionsreinigungen durch, etwa bei Infektionswellen.' },
      { question: 'Können Sie auch die Bodenpflege übernehmen?', answer: 'Ja, wir pflegen Linoleum, PVC und Fliesen und führen Grundreinigung und Versiegelung während der Ferien durch.' },
      { question: 'Wann findet die Reinigung statt?', answer: 'In der Regel außerhalb der Betreuungszeiten – frühmorgens oder abends, um den Kita-Alltag nicht zu stören.' },
    ],
    seo: {
      title: 'Kita-Reinigung für Kindertagesstätten in Schleswig-Holstein | KlarWerk Service',
      description:
        'Hygienische Kita-Reinigung in Schleswig-Holstein & Hamburg. Gruppenräume, Wickelbereiche, Sanitär, Bodenpflege. Kindersichere Reinigungsmittel. Jetzt anfragen.',
      keywords: `Kita-Reinigung, Kindergartenreinigung, Krippenreinigung, Hygiene Kita, ${localKeywords}`,
    },
  },

  pflegeheimreinigung: {
    id: 'pflegeheimreinigung',
    h1: 'Pflegeheim-Reinigung – Hygiene mit Verantwortung',
    intro:
      'In Pflegeeinrichtungen ist Reinigung mehr als Sauberkeit – sie ist Teil des Infektionsschutzes und der Würde der Bewohner. KlarWerk Service reinigt Bewohnerzimmer, Gemeinschaftsräume und Sanitäranlagen nach hygienischen Vorgaben, mit regelmäßiger Hygienereinigung und VAH-gelisteten Desinfektionsmitteln, die für den Einsatz in Pflegeeinrichtungen zugelassen sind. Wir stimmen uns rücksichtsvoll mit Bewohnern und Personal ab, dokumentieren alle Maßnahmen nachvollziehbar und übernehmen auf Wunsch auch die Fensterreinigung. So entsteht eine Umgebung, in der sich Bewohner und Pflegekräfte sicher und wohl fühlen.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: [
      { icon: HeartPulse, label: 'Pflegeheime' },
      { icon: Building2, label: 'Seniorenresidenzen' },
      { icon: Handshake, label: 'Betreuungseinrichtungen' },
      { icon: Stethoscope, label: 'Pflegestationen' },
    ],
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Welche Hygienevorschriften beachten Sie?', answer: 'Wir arbeiten nach den Vorgaben des Arbeitsschutzes, der RKI-Richtlinien und der jeweiligen Träger für Pflegeeinrichtungen.' },
      { question: 'Reinigen Sie Bewohnerzimmer?', answer: 'Ja, die Reinigung von Bewohnerzimmern gehört zum Standardumfang – auf Wunsch in Absprache mit den Bewohnern.' },
      { question: 'Bieten Sie Hygienereinigung an?', answer: 'Ja, wir führen regelmäßig Hygienereinigungen durch, insbesondere in Sanitärbereichen und Gemeinschaftsräumen.' },
      { question: 'Verwenden Sie besondere Desinfektionsmittel?', answer: 'Wir nutzen VAH-zertifizierte Desinfektionsmittel, die für den Einsatz in Pflegeeinrichtungen zugelassen sind.' },
      { question: 'Dokumentieren Sie die Reinigung?', answer: 'Ja, wir stellen Reinigungs- und Hygienepläne bereit und dokumentieren alle durchgeführten Maßnahmen nachvollziehbar.' },
      { question: 'Können Sie auch die Fensterreinigung übernehmen?', answer: 'Ja, Fenster- und Glasreinigung gehören zu unserem Leistungsumfang für Pflegeeinrichtungen.' },
    ],
    seo: {
      title: 'Pflegeheim-Reinigung in Schleswig-Holstein & Hamburg | KlarWerk Service',
      description:
        'Hygienische Pflegeheim-Reinigung in Schleswig-Holstein & Hamburg. Bewohnerzimmer, Gemeinschaftsräume, Sanitär, Hygienereinigung. RKI-Standards. Jetzt anfragen.',
      keywords: `Pflegeheimreinigung, Seniorenresidenz reinigen, Pflegeeinrichtung Hygiene, ${localKeywords}`,
    },
  },

  lagerhallenreinigung: {
    id: 'lagerhallenreinigung',
    h1: 'Lagerhallenreinigung – Saubere Arbeitsbereiche für effiziente Prozesse',
    intro:
      'In Lager und Logistik entscheiden saubere Böden und freie Verkehrswege über Sicherheit und reibungslose Abläufe – Staub und Ablagerungen dagegen bremsen und gefährden. KlarWerk Service reinigt Lagerhallen, Logistikzentren und Produktionsbetriebe jeder Größe: Böden per Scheuersaugmaschine, Regale und Ablagen staubfrei, Verladerampen und Verkehrswege sicher begehbar. Auf Wunsch arbeiten wir außerhalb der Betriebszeiten, damit Ihr Ablauf nicht ins Stocken gerät. Die Frequenz richtet sich nach Nutzung und Verschmutzung – wir erstellen dazu einen individuellen Reinigungsplan für dauerhaft sichere Arbeitsbereiche.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: [
      { icon: Warehouse, label: 'Lagerunternehmen' },
      { icon: Factory, label: 'Logistikzentren' },
      { icon: Building2, label: 'Produktionsbetriebe' },
      { icon: Warehouse, label: 'Distributionszentren' },
    ],
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Reinigen Sie auch große Lagerhallen?', answer: 'Ja, wir verfügen über die passende Technik und das Personal für Hallen jeder Größe.' },
      { question: 'Können Sie während des Betriebs arbeiten?', answer: 'Auf Wunsch reinigen wir außerhalb der Betriebszeiten, um den laufenden Betrieb nicht zu stören.' },
      { question: 'Entfernen Sie auch Staub in Regalanlagen?', answer: 'Ja, wir reinigen Regale, Ablagen und schwer erreichbare Bereiche von Staub und Ablagerungen.' },
      { question: 'Übernehmen Sie die Reinigung von Rampenbereichen?', answer: 'Ja, die Reinigung von Verladerampen und Verkehrswegen gehört zu unserem Leistungsumfang.' },
      { question: 'Bieten Sie maschinelle Bodenreinigung an?', answer: 'Ja, für große Bodenflächen setzen wir Scheuersaugmaschinen ein.' },
      { question: 'Wie oft sollte eine Lagerhalle gereinigt werden?', answer: 'Die Frequenz richtet sich nach Nutzung und Verschmutzungsgrad – wir erstellen einen individuellen Reinigungsplan.' },
    ],
    seo: {
      title: 'Lagerhallenreinigung in Schleswig-Holstein & Hamburg | KlarWerk Service',
      description:
        'Professionelle Lagerhallenreinigung in Schleswig-Holstein & Hamburg. Lagerböden, Regale, Verkehrswege, Rampen. Maschinelle Bodenreinigung. Jetzt anfragen.',
      keywords: `Lagerhallenreinigung, Logistikreinigung, Lagerreinigung, Produktionshalle reinigen, ${localKeywords}`,
    },
  },

  gastronomiereinigung: {
    id: 'gastronomiereinigung',
    h1: 'Gastronomiereinigung – Hygiene für Ihre Gäste und Mitarbeiter',
    intro:
      'In der Gastronomie ist Hygiene kein Detail, sondern Geschäftsgrundlage – ein Kontrollbesuch oder eine schlechte Bewertung genügt, um Vertrauen zu kosten. KlarWerk Service reinigt Restaurants, Cafés, Kantinen und Gastronomiebetriebe gründlich: Küche inklusive Fettentfernung an Oberflächen, Abzügen und Böden, dazu Gasträume, Glasflächen und Sanitärbereiche. Gearbeitet wird außerhalb der Öffnungszeiten, nachts oder frühmorgens, damit Ihr Betrieb ungestört bleibt. Wir richten uns nach den Vorgaben der Lebensmittelhygiene und erstellen auf Wunsch einen festen Pflegevertrag – für Sauberkeit, auf die sich Gäste und Team verlassen.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: [
      { icon: UtensilsCrossed, label: 'Restaurants' },
      { icon: UtensilsCrossed, label: 'Cafés' },
      { icon: Building2, label: 'Gastronomiebetriebe' },
      { icon: UtensilsCrossed, label: 'Kantinen' },
    ],
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Reinigen Sie auch die Küche?', answer: 'Ja, die Küchenreinigung inklusive Fettentfernung ist ein zentraler Bestandteil unseres Angebots.' },
      { question: 'Entfernen Sie auch Fettreste?', answer: 'Ja, wir entfernen Fettbeläge von Oberflächen, Abzügen und Böden mit professionellen Fettlösern.' },
      { question: 'Wann findet die Reinigung statt?', answer: 'In der Regel außerhalb der Öffnungszeiten – nachts oder frühmorgens, um den Betrieb nicht zu stören.' },
      { question: 'Übernehmen Sie auch die Gastraumreinigung?', answer: 'Ja, wir reinigen Tische, Böden, Glasflächen und Sanitärbereiche im Gastraum.' },
      { question: 'Bieten Sie eine regelmäßige Reinigung an?', answer: 'Ja, wir erstellen individuelle Pflegeverträge für tägliche oder wöchentliche Reinigung.' },
      { question: 'Beachten Sie die Hygienevorschriften?', answer: 'Ja, wir arbeiten nach den Vorgaben der Lebensmittelhygieneverordnung und der Berufsgenossenschaft.' },
    ],
    seo: {
      title: 'Gastronomiereinigung in Schleswig-Holstein & Hamburg | KlarWerk Service',
      description:
        'Professionelle Gastronomiereinigung in Schleswig-Holstein & Hamburg. Küche, Fettentfernung, Gastraum, Sanitär. Hygiene nach LMHV. Flexible Termine. Jetzt anfragen.',
      keywords: `Gastronomiereinigung, Restaurantreinigung, Küchenreinigung, Fettentfernung, Kantinenreinigung, ${localKeywords}`,
    },
  },

  supermarktreinigung: {
    id: 'supermarktreinigung',
    h1: 'Supermarkt-Reinigung – Professionelle Sauberkeit für Verkaufsflächen',
    intro:
      'Im Einzelhandel entscheidet der erste Eindruck über den Einkauf – klebrige Böden oder staubige Regale schrecken Kunden ab, bevor sie den ersten Artikel in den Wagen legen. KlarWerk Service reinigt Supermärkte, Discounter, Fach- und Biomärkte sowie Einkaufszentren vor Öffnung oder nach Schließung, ohne den Kundenverkehr zu stören. Große Verkaufsflächen reinigen wir maschinell und streifenfrei, dazu Regale, Kühlbereiche, Kassenzonen und Sanitäranlagen; auf Wunsch übernehmen wir Grundreinigung, Bodenversiegelung, Fenster- und Fassadenreinigung. So präsentiert sich Ihr Markt jeden Tag von seiner besten Seite.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: [
      { icon: ShoppingCart, label: 'Supermärkte' },
      { icon: ShoppingCart, label: 'Discounter' },
      { icon: ShoppingCart, label: 'Getränkemärkte' },
      { icon: ShoppingCart, label: 'Biomärkte' },
      { icon: Building2, label: 'Einkaufszentren' },
      { icon: Building2, label: 'Fachgeschäfte' },
    ],
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Reinigen Sie außerhalb der Öffnungszeiten?', answer: 'Ja, wir reinigen in der Regel vor Öffnung oder nach Schließung des Marktes, um den Kundenverkehr nicht zu stören.' },
      { question: 'Setzen Sie Scheuersaugmaschinen ein?', answer: 'Ja, für große Verkaufsflächen nutzen wir maschinelle Bodenreinigung für streifenfreie und gründliche Ergebnisse.' },
      { question: 'Reinigen Sie auch die Kühlbereiche?', answer: 'Ja, die Reinigung von Kühlvitrinen und -bereichen gehört zu unserem Leistungsumfang.' },
      { question: 'Übernehmen Sie die Regalreinigung?', answer: 'Ja, wir entfernen Staub von Regalen, Ablagen und reinigen schwer erreichbare Bereiche.' },
      { question: 'Bieten Sie Grundreinigungen an?', answer: 'Ja, außerhalb der Öffnungszeiten führen wir Grundreinigungen, Bodenversiegelungen und Fensterreinigung durch.' },
      { question: 'Können Sie auch Fassadenreinigung übernehmen?', answer: 'Ja, auf Wunsch übernehmen wir Fassadenreinigung und Reinigung nach Renovierungen oder Umbauten.' },
    ],
    seo: {
      title: 'Supermarkt-Reinigung & Einzelhandelsreinigung in Schleswig-Holstein | KlarWerk Service',
      description:
        'Professionelle Supermarkt-Reinigung in Schleswig-Holstein & Hamburg. Verkaufsflächen, Kassenbereiche, Regale, Sanitär, Lager. Maschinelle Bodenreinigung. Jetzt anfragen.',
      keywords: `Supermarktreinigung, Einzelhandelsreinigung, Verkaufsflächenreinigung, Discounterreinigung, ${localKeywords}`,
    },
  },

  schwimmbadreinigung: {
    id: 'schwimmbadreinigung',
    h1: 'Schwimmbad- & Schwimmhallenreinigung mit Hygiene-Fokus',
    intro:
      'Wo viele Menschen barfuß und im Nassen unterwegs sind, sind Hygiene und Trittsicherheit entscheidend – und genau hier verzeihen Gäste keine Nachlässigkeit. KlarWerk Service reinigt Schwimmbäder, Schwimmhallen und Wellnessbereiche mit klarem Hygiene-Fokus: Beckenumgänge, Umkleiden, Duschen und Sanitäranlagen werden hygienisch gereinigt und desinfiziert, Kalk-, Wasser- und Urinstein-Ablagerungen an Fliesen, Armaturen und Rinnen entfernt. An Nassbereichen setzen wir rutschhemmende Verfahren ein, Sauna- und Spa-Bereiche behandeln wir materialschonend. Gereinigt wird außerhalb der Badezeiten – nach einem individuellen Reinigungs- und Hygieneplan.',
    process: defaultProcess,
    advantages: defaultAdvantages,
    areas: [
      { icon: Waves, label: 'Schwimmbäder' },
      { icon: Waves, label: 'Schwimmhallen' },
      { icon: Hotel, label: 'Wellness- & Spa-Bereiche' },
      { icon: Building2, label: 'Sport- & Freizeitbäder' },
    ],
    sustainability: defaultSustainability,
    faqs: [
      { question: 'Reinigen Sie außerhalb der Badezeiten?', answer: 'Ja, in der Regel reinigen wir vor Öffnung oder nach Schließung, um den Badebetrieb nicht zu stören.' },
      { question: 'Verwenden Sie rutschhemmende Reinigungsverfahren?', answer: 'Ja, gerade an Beckenumgängen und in Nassbereichen setzen wir rutschhemmende Verfahren ein, um die Sicherheit zu erhöhen.' },
      { question: 'Entfernen Sie Kalk- und Wasserablagerungen?', answer: 'Ja, die Entfernung von Kalk-, Wasser- und Urinstein-Ablagerungen an Fliesen, Armaturen und Rinnen gehört zum Leistungsumfang.' },
      { question: 'Reinigen Sie auch Umkleiden und Duschen?', answer: 'Selbstverständlich. Umkleidekabinen, Duschen, WC-Anlagen und Kontaktflächen werden hygienisch gereinigt und desinfiziert.' },
      { question: 'Übernehmen Sie auch Sauna- und Wellnessbereiche?', answer: 'Ja, wir reinigen Sauna-, Wellness- und Spa-Bereiche materialschonend und nach hygienischen Standards.' },
      { question: 'Wie oft sollte ein Schwimmbad gereinigt werden?', answer: 'Das hängt von Besucherzahl und Nutzung ab. Nach einer Besichtigung erstellen wir einen individuellen Reinigungs- und Hygieneplan.' },
    ],
    seo: {
      title: 'Schwimmbadreinigung & Schwimmhallenreinigung in Schleswig-Holstein | KlarWerk Service',
      description:
        'Hygienische Schwimmbad- und Schwimmhallenreinigung in Schleswig-Holstein & Hamburg. Beckenumgänge, Umkleiden, Duschen, Sauna. Rutschhemmend & desinfizierend. Jetzt anfragen.',
      keywords: `Schwimmbadreinigung, Schwimmhallenreinigung, Beckenumgang reinigen, Wellnessreinigung, ${localKeywords}`,
    },
  },
};
