/**
 * Lokale Leistungsseiten: eine Leistung in einer Stadt, z. B. /leistungen/praxisreinigung/kiel.
 *
 * Bewusst KEINE automatische Kombination aller Leistungen mit allen Städten. Jede Seite hier
 * ist einzeln geschrieben – mit eigenen Zielgruppen, eigenem Ablauf, eigenen FAQ und echtem
 * Ortsbezug. Eine neue Seite kommt nur dazu, wenn sie wirklich eigene Inhalte hat.
 */

import {
  Activity,
  Baby,
  Brain,
  Briefcase,
  Building2,
  CalendarCheck,
  Car,
  ClipboardCheck,
  FileText,
  HardHat,
  Home,
  KeyRound,
  Laptop,
  Lock,
  Scale,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  Store,
  Truck,
  UserCheck,
  Users,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';

/** Überschriften und Zwischentexte, die je nach Leistung anders lauten (Praxis vs. Büro usw.). */
export interface LokaleTexte {
  /** Kleine Zeile über den Zielgruppen, z. B. „Für Ihre Praxis“. */
  zielgruppenLabel: string;
  zielgruppenTitel: string;
  zielgruppenText: string;
  /** Kasten „Das bleibt bei Ihnen“ im Leistungsumfang. */
  grenzenTitel: string;
  grenzenText: string;
  ablaufTitel: string;
  vertrauenLabel: string;
  ergaenzungTitel: string;
  ctaText: string;
}

export interface LokaleSeite {
  serviceId: string;
  citySlug: string;
  /** Anzeigename der Leistung, z. B. „Praxisreinigung“. */
  leistung: string;
  /** Anzeigename des Ortes, z. B. „Kiel“. */
  ort: string;
  seo: { title: string; description: string; keywords: string };
  h1: string;
  intro: string;
  /** Hauptfoto. Ohne `src` wird automatisch das Foto der allgemeinen Leistungsseite genommen. */
  bild: { src?: string; alt: string };
  /** Kurze Fakten unter dem Hero. */
  eckdaten: { titel: string; text: string }[];
  zielgruppen: { titel: string; text: string }[];
  /** `wir`: was wir reinigen. `beiIhnen`: was bewusst beim Kunden bleibt. */
  umfang: { wir: string[]; beiIhnen: string[] };
  zeiten: { titel: string; text: string; punkte: string[] };
  vertrauen: { titel: string; text: string }[];
  /** Einsatzgebiet: Gruppen von Stadtteilen (z. B. „Kiel Westufer“) plus Umland (geht auch in die strukturierten Daten). */
  anfahrt: { titel: string; text: string; gruppen: { titel: string; orte: string[] }[]; umland: string[] };
  ablauf: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
  /** Passende Ergänzungsleistungen (IDs aus services.ts) mit Begründung. */
  ergaenzungen: { serviceId: string; text: string }[];
  texte: LokaleTexte;
  /** Symbole für Zielgruppen- und Vertrauenskarten, in der Reihenfolge der Daten. */
  icons: { zielgruppen: LucideIcon[]; vertrauen: LucideIcon[] };
}

export const lokaleSeiten: LokaleSeite[] = [
  {
    serviceId: 'praxisreinigung',
    citySlug: 'kiel',
    leistung: 'Praxisreinigung',
    ort: 'Kiel',
    seo: {
      title: 'Praxisreinigung Kiel nach Feierabend | KlarWerk Service',
      description:
        'Praxisreinigung in Kiel für Arzt-, Zahnarzt- und Therapiepraxen: nach Ihrem Hygieneplan, außerhalb der Sprechzeiten, mit festem Ansprechpartner.',
      keywords:
        'Praxisreinigung Kiel, Reinigung Arztpraxis Kiel, Zahnarztpraxis Reinigung Kiel, Reinigungsfirma Praxis Kiel, Physiotherapie Reinigung Kiel, Praxisreinigung Kronshagen',
    },
    h1: 'Praxisreinigung in Kiel',
    intro:
      'Ihre Praxis soll morgens sauber, hygienisch und ohne Nachfragen bereitstehen – ob in der Innenstadt, auf dem Westufer oder am Ostufer. KlarWerk Service reinigt Arzt-, Zahnarzt- und Therapiepraxen in Kiel nach Ihrem Hygieneplan, außerhalb der Sprechzeiten und mit einem festen Ansprechpartner, der Ihre Räume kennt. Unser Sitz in Bordesholm liegt nur rund 20 Kilometer südlich von Kiel.',
    bild: {
      // gleiches Foto wie auf /leistungen/praxisreinigung (kommt aus services.ts)
      alt: 'Saubere Praxisräume – Praxisreinigung in Kiel durch KlarWerk Service',
    },
    eckdaten: [
      { titel: 'Außerhalb der Sprechzeiten', text: 'Abends, früh morgens oder am freien Nachmittag' },
      { titel: 'Nach Ihrem Hygieneplan', text: 'Bereiche, Mittel und Intervalle wie bei Ihnen festgelegt' },
      { titel: 'Fester Ansprechpartner', text: 'Auch bei Urlaub und Krankheit eine eingearbeitete Vertretung' },
    ],
    zielgruppen: [
      {
        titel: 'Hausarzt- und Facharztpraxen',
        text: 'Volles Wartezimmer, viel Laufverkehr am Empfang: Böden, Wartebereich und häufig berührte Flächen wie Türklinken, Tresen und Armlehnen werden bei jeder Reinigung gereinigt und nach Plan desinfiziert.',
      },
      {
        titel: 'Zahnarztpraxen',
        text: 'Behandlungszimmer mit Böden und Oberflächen rund um die Behandlungseinheit, dazu Rezeption, Wartebereich und Sanitär. Was am Gerät selbst passiert, bleibt bei Ihrem Praxisteam.',
      },
      {
        titel: 'Physio-, Ergo- und Logopädiepraxen',
        text: 'Therapieliegen, Ablagen, Trainingsflächen, Umkleiden und Duschen – Räume, die den ganzen Tag genutzt werden und dafür eine feste Routine brauchen.',
      },
      {
        titel: 'Psychotherapie und kleine Praxen',
        text: 'Wenige Räume, ruhige Atmosphäre, Diskretion zählt. Hier reicht oft eine Reinigung an festen Wochentagen statt täglich.',
      },
      {
        titel: 'MVZ, Praxisgemeinschaften und Ärztehäuser',
        text: 'Mehrere Praxen auf einer Etage oder in einem Haus: ein Ansprechpartner, ein abgestimmter Plan – und auf Wunsch Leistungsverzeichnis und Rechnung getrennt nach Praxis.',
      },
    ],
    umfang: {
      wir: [
        'Böden in allen Räumen – feucht gewischt, in sensiblen Bereichen desinfizierend',
        'Wartebereich, Empfang und Flure',
        'Kontaktflächen wie Türklinken, Lichtschalter, Tresen und Armlehnen',
        'Behandlungs- und Therapieräume: Liegen, Arbeitsflächen und Ablagen',
        'Sanitärbereiche für Patienten und Team',
        'Sozialraum und Teeküche, Papierkörbe und Hausmüll',
        'Glasflächen innen: Eingangstür, Glaswände und Spiegel',
      ],
      beiIhnen: [
        'Aufbereitung von Instrumenten und Medizinprodukten',
        'Desinfektion medizinischer Geräte nach Herstellervorgabe',
        'Patientenakten, Unterlagen und Bildschirme – die fassen wir nicht an',
      ],
    },
    zeiten: {
      titel: 'Reinigung, wenn Ihre Praxis leer ist',
      text: 'Patienten und Team sollen von der Reinigung nichts merken außer dem Ergebnis. Den Rhythmus – täglich oder an festen Wochentagen – legen wir nach Praxisgröße und Hygieneplan gemeinsam fest.',
      punkte: [
        'Abends nach der letzten Sprechstunde',
        'Früh morgens vor Praxisbeginn',
        'An Ihren freien Nachmittagen, etwa mittwochs oder freitags',
        'Grundreinigung der Böden in den Praxisferien',
      ],
    },
    vertrauen: [
      {
        titel: 'Ihr Hygieneplan ist die Vorgabe',
        text: 'Wir übernehmen Ihre Festlegungen zu Bereichen, Mitteln und Intervallen und setzen VAH-gelistete Desinfektionsmittel passend zum Einsatzbereich ein.',
      },
      {
        titel: 'Jede Reinigung dokumentiert',
        text: 'Sie sehen jederzeit, was wann gereinigt wurde – hilfreich für Ihre Hygienedokumentation und bei Begehungen.',
      },
      {
        titel: 'Diskret und verschwiegen',
        text: 'Wer in einer Praxis reinigt, sieht vieles. Auf Wunsch unterschreiben wir eine Verschwiegenheitsvereinbarung für Ihre Praxis.',
      },
      {
        titel: 'Kontrolle statt Hoffnung',
        text: 'Regelmäßige Qualitätskontrollen durch Ihren festen Ansprechpartner – Mängel werden behoben, bevor sie Ihnen auffallen.',
      },
    ],
    anfahrt: {
      titel: 'Kurze Wege in ganz Kiel',
      text: 'Von Bordesholm sind wir über die A215 schnell in Kiel. Wir reinigen Praxen im ganzen Stadtgebiet und im direkten Umland – zum Beispiel in Ravensberg, Brunswik, Schreventeich, Hassee und Suchsdorf.',
      gruppen: [
        { titel: 'Kiel Westufer', orte: ['Innenstadt', 'Ravensberg', 'Brunswik', 'Schreventeich', 'Wik', 'Hassee', 'Suchsdorf', 'Südfriedhof', 'Mettenhof', 'Friedrichsort'] },
        { titel: 'Kiel Ostufer', orte: ['Gaarden-Ost', 'Neumühlen-Dietrichsdorf', 'Wellsee'] },
      ],
      umland: ['Kronshagen', 'Altenholz', 'Molfsee', 'Flintbek', 'Schwentinental', 'Heikendorf'],
    },
    ablauf: [
      {
        title: 'Kurze Anfrage',
        desc: 'Per Telefon, E-Mail oder Formular: Praxisart, ungefähre Raumzahl und Ihre Wunschzeiten genügen für den Anfang.',
      },
      {
        title: 'Besichtigung in Ihrer Praxis',
        desc: 'Kostenlos vor Ort in Kiel: Wir gehen Räume, Bodenbeläge und Ihren Hygieneplan gemeinsam durch.',
      },
      {
        title: 'Festpreis-Angebot',
        desc: 'Mit klarem Leistungsverzeichnis nach Räumen und Rhythmus, kalkuliert mit unserem eigenen Programm für die Gebäudereinigung.',
      },
      {
        title: 'Start mit Einweisung',
        desc: 'Schlüssel- und Alarmregelung, Zuständigkeiten und Reinigungsplan halten wir vor dem ersten Einsatz schriftlich fest.',
      },
      {
        title: 'Laufende Betreuung',
        desc: 'Fester Ansprechpartner, regelmäßige Kontrollen und eine eingearbeitete Vertretung bei Urlaub oder Krankheit.',
      },
    ],
    faqs: [
      {
        question: 'Reinigen Sie Praxen in ganz Kiel?',
        answer:
          'Ja. Wir betreuen Praxen in allen Kieler Stadtteilen, vom Westufer bis zum Ostufer, sowie im direkten Umland wie Kronshagen, Altenholz, Molfsee und Schwentinental. Unser Sitz in Bordesholm liegt rund 20 Kilometer südlich von Kiel.',
      },
      {
        question: 'Reinigen Sie während der Sprechzeiten?',
        answer:
          'In der Regel nicht. Wir reinigen abends nach der letzten Sprechstunde, früh morgens vor Praxisbeginn oder an Ihren freien Nachmittagen. Ob täglich oder an festen Wochentagen, richtet sich nach Ihrer Praxisgröße und Ihrem Hygieneplan.',
      },
      {
        question: 'Arbeiten Sie nach unserem Hygieneplan?',
        answer:
          'Ja. Wir übernehmen die Vorgaben Ihres Hygieneplans zu Bereichen, Mitteln und Intervallen, setzen VAH-gelistete Desinfektionsmittel ein und dokumentieren jede Reinigung nachvollziehbar.',
      },
      {
        question: 'Wer reinigt bei Urlaub oder Krankheit?',
        answer:
          'Eine eingearbeitete Vertretung, die Ihre Praxis und den Reinigungsplan kennt. Ihr fester Ansprechpartner bleibt derselbe – Sie müssen nichts neu erklären.',
      },
      {
        question: 'Übernehmen Sie auch die Aufbereitung von Instrumenten?',
        answer:
          'Nein. Die Aufbereitung von Medizinprodukten und die Desinfektion medizinischer Geräte bleiben bei Ihrem Praxisteam. Wir reinigen und desinfizieren Böden, Oberflächen, Kontaktflächen und Sanitärbereiche.',
      },
      {
        question: 'Wie gehen Sie mit Patientendaten um?',
        answer:
          'Diskret: Akten, Unterlagen und Bildschirme fassen wir nicht an. Auf Wunsch unterschreiben wir eine Verschwiegenheitsvereinbarung für Ihre Praxis.',
      },
      {
        question: 'Was kostet die Praxisreinigung in Kiel?',
        answer:
          'Das hängt von Praxisgröße, Raumanzahl, Bodenbelägen und Reinigungsrhythmus ab. Nach einer kostenlosen Besichtigung in Ihrer Praxis erhalten Sie ein Festpreis-Angebot mit klarem Leistungsverzeichnis – ohne versteckte Kosten.',
      },
    ],
    ergaenzungen: [
      { serviceId: 'glasreinigung', text: 'Praxisfenster, Eingangstür und Praxisschild – streifenfrei, innen und außen.' },
      { serviceId: 'grundreinigung', text: 'Böden gründlich reinigen und neu einpflegen, ideal in den Praxisferien.' },
      { serviceId: 'unterhaltsreinigung', text: 'Für Büro- und Verwaltungsflächen im selben Haus nach festem Plan.' },
    ],
    texte: {
      zielgruppenLabel: 'Für Ihre Praxis',
      zielgruppenTitel: 'Jede Praxis in Kiel braucht etwas anderes',
      zielgruppenText: 'Wir richten Reinigungsplan und Rhythmus nach Ihrer Praxisart aus – nicht nach einer Standardliste.',
      grenzenTitel: 'Das bleibt bei Ihrem Praxisteam',
      grenzenText: 'Klare Grenzen schützen Patienten, Geräte und Ihre Haftung.',
      ablaufTitel: 'So starten wir in Ihrer Praxis',
      vertrauenLabel: 'Hygiene & Vertrauen',
      ergaenzungTitel: 'Alles für Ihre Praxis aus einer Hand',
      ctaText:
        'Wir kommen zur kostenlosen Besichtigung in Ihre Praxis in Kiel und erstellen Ihnen ein Festpreis-Angebot mit klarem Leistungsverzeichnis.',
    },
    icons: {
      zielgruppen: [Stethoscope, Smile, Activity, Brain, Building2],
      vertrauen: [ClipboardCheck, FileText, Lock, UserCheck],
    },
  },

  {
    serviceId: 'bueroreinigung',
    citySlug: 'kiel',
    leistung: 'Büroreinigung',
    ort: 'Kiel',
    seo: {
      title: 'Büroreinigung Kiel nach Feierabend | KlarWerk Service',
      description:
        'Büroreinigung in Kiel für Kanzleien, Agenturen und Bürogebäude: außerhalb der Arbeitszeit, mit festem Ansprechpartner und eingearbeiteter Vertretung.',
      keywords:
        'Büroreinigung Kiel, Reinigungsfirma Büro Kiel, Büroreinigung Kanzlei Kiel, Unterhaltsreinigung Büro Kiel, Büroreinigung Kronshagen, Büroreinigung Altenholz',
    },
    h1: 'Büroreinigung in Kiel',
    intro:
      'Saubere Schreibtische, eine gepflegte Teeküche und frische Sanitärräume – jeden Morgen, ohne dass Sie Reinigung organisieren, kontrollieren oder Ausfälle auffangen müssen. KlarWerk Service reinigt Büros, Kanzleien und Agenturen in Kiel nach festem Plan, außerhalb Ihrer Arbeitszeiten und mit einem festen Ansprechpartner, der Ihre Räume kennt. Unser Sitz in Bordesholm liegt nur rund 20 Kilometer südlich von Kiel.',
    bild: {
      // gleiches Foto wie auf /leistungen/bueroreinigung (kommt aus services.ts)
      alt: 'Gepflegte Büroräume – Büroreinigung in Kiel durch KlarWerk Service',
    },
    eckdaten: [
      { titel: 'Außerhalb der Arbeitszeit', text: 'Abends, früh morgens oder an festen Wochentagen' },
      { titel: 'Ein fester Ansprechpartner', text: 'Für Plan, Schlüssel, Rückfragen und Kontrollen' },
      { titel: 'Vertretung, die Ihr Büro kennt', text: 'Bei Urlaub und Krankheit läuft die Reinigung weiter' },
    ],
    zielgruppen: [
      {
        titel: 'Kanzleien und Steuerbüros',
        text: 'Mandantengespräche, Akten auf dem Tisch, Diskretion als Pflicht: Wir reinigen freigeräumte Flächen, Böden, Besprechungsraum und Empfang – Unterlagen bleiben, wo sie liegen.',
      },
      {
        titel: 'Agenturen und IT-Büros',
        text: 'Offene Arbeitsflächen, viel genutzte Teeküche, Besprechungsräume im Dauereinsatz. Hier zählen eine feste Routine für Küche und Sanitär und Böden, die den Tag mitmachen.',
      },
      {
        titel: 'Büros mit Kundenverkehr',
        text: 'Makler, Versicherungsagenturen, Immobilienbüros: Eingang, Glastür und Wartebereich sind Ihre Visitenkarte und werden bei jeder Reinigung mitgenommen.',
      },
      {
        titel: 'Kleine Büros',
        text: 'Wenige Arbeitsplätze, überschaubare Fläche: Oft reicht eine Reinigung an ein oder zwei festen Wochentagen – mit genauso festem Ansprechpartner wie bei großen Objekten.',
      },
      {
        titel: 'Bürogebäude und Hausverwaltungen',
        text: 'Mehrere Mieter, gemeinsame Flure, Treppenhaus und Eingangsbereich: ein Ansprechpartner, ein abgestimmter Plan für Mietflächen und Gemeinschaftsflächen.',
      },
    ],
    umfang: {
      wir: [
        'Arbeitsplätze: freigeräumte Schreibtische, Ablagen und Fensterbänke',
        'Böden in allen Räumen – Hartböden gewischt, Teppichböden gesaugt',
        'Teeküche: Spüle, Arbeitsflächen, Fronten und Geräte außen',
        'Sanitärräume gründlich und hygienisch, Verbrauchsmaterial auf Wunsch',
        'Kontaktflächen wie Türklinken, Lichtschalter und Handläufe',
        'Empfang, Flure und Besprechungsräume, Papierkörbe und Mülltrennung',
        'Glas innen: Glastüren, Glaswände und Spiegel',
      ],
      beiIhnen: [
        'Akten, Unterlagen und volle Schreibtische – die räumen wir nicht um',
        'Geschirr und Spülmaschine, wenn nicht ausdrücklich vereinbart',
        'Server- und Technikräume nur nach Absprache und Einweisung',
      ],
    },
    zeiten: {
      titel: 'Reinigung, wenn Ihr Büro leer ist',
      text: 'Ihr Team soll von der Reinigung nichts merken außer dem Ergebnis. Wie oft wir kommen, hängt von Fläche, Mitarbeiterzahl und Kundenverkehr ab – den Rhythmus legen wir nach der Besichtigung gemeinsam fest.',
      punkte: [
        'Abends nach Feierabend',
        'Früh morgens vor Arbeitsbeginn',
        'An festen Wochentagen statt täglich, wenn das reicht',
        'Grundreinigung der Böden in ruhigen Zeiten, etwa zwischen den Jahren',
      ],
    },
    vertrauen: [
      {
        titel: 'Ein fester Ansprechpartner',
        text: 'Pro Objekt eine Person, die Ihre Räume, Wünsche und Besonderheiten kennt. Sie müssen nichts zweimal erklären.',
      },
      {
        titel: 'Regelmäßige Qualitätskontrollen',
        text: 'Wir prüfen das Ergebnis vor Ort und stimmen Anpassungen mit Ihnen ab – bevor Ihnen etwas auffällt.',
      },
      {
        titel: 'Eingearbeitete Vertretung',
        text: 'Bei Urlaub und Krankheit übernimmt jemand, der Ihr Büro und den Reinigungsplan kennt. Keine Lücke, keine neue Einweisung.',
      },
      {
        titel: 'Schlüssel in guten Händen',
        text: 'Schlüssel oder Transponder behandeln wir vertraulich, die Übergabe und Ihre Alarmregelung halten wir schriftlich fest.',
      },
    ],
    anfahrt: {
      titel: 'Büroreinigung in ganz Kiel',
      text: 'Von Bordesholm sind wir über die A215 schnell in Kiel – in Bürolagen wie der Wik, Ravensberg, Brunswik und am Südfriedhof ebenso wie in den Gewerbegebieten in Wellsee und Friedrichsort. Kurze Wege machen Besichtigung, Kontrollen und kurzfristige Absprachen einfach.',
      gruppen: [
        { titel: 'Kiel Westufer', orte: ['Innenstadt', 'Wik', 'Ravensberg', 'Brunswik', 'Südfriedhof', 'Schreventeich', 'Suchsdorf', 'Hassee', 'Mettenhof', 'Friedrichsort'] },
        { titel: 'Kiel Ostufer', orte: ['Wellsee', 'Gaarden-Ost', 'Neumühlen-Dietrichsdorf'] },
      ],
      umland: ['Kronshagen', 'Altenholz', 'Molfsee', 'Flintbek', 'Schwentinental', 'Heikendorf'],
    },
    ablauf: [
      {
        title: 'Kurze Anfrage',
        desc: 'Per Telefon, E-Mail oder Formular: Art des Büros, ungefähre Fläche und Ihre Wunschzeiten genügen für den Anfang.',
      },
      {
        title: 'Besichtigung in Ihrem Büro',
        desc: 'Kostenlos vor Ort in Kiel: Wir gehen Räume, Bodenbeläge, Teeküche und Sanitär gemeinsam durch und klären, was wie oft gereinigt wird.',
      },
      {
        title: 'Festpreis-Angebot',
        desc: 'Mit klarem Leistungsverzeichnis nach Bereichen und Rhythmus – Sie sehen genau, was Sie bekommen.',
      },
      {
        title: 'Start mit Einweisung',
        desc: 'Schlüssel- und Alarmregelung, Zeiten, Zuständigkeiten und Reinigungsplan halten wir vor dem ersten Einsatz schriftlich fest.',
      },
      {
        title: 'Laufende Betreuung',
        desc: 'Fester Ansprechpartner, regelmäßige Kontrollen und eine eingearbeitete Vertretung bei Urlaub oder Krankheit.',
      },
    ],
    faqs: [
      {
        question: 'Reinigen Sie Büros in ganz Kiel?',
        answer:
          'Ja. Wir betreuen Büros in allen Kieler Stadtteilen, vom Westufer bis zum Ostufer, sowie im direkten Umland wie Kronshagen, Altenholz, Molfsee und Schwentinental. Unser Sitz in Bordesholm liegt rund 20 Kilometer südlich von Kiel.',
      },
      {
        question: 'Wann wird unser Büro gereinigt?',
        answer:
          'Außerhalb Ihrer Arbeitszeiten: abends nach Feierabend, früh morgens vor Arbeitsbeginn oder an festen Wochentagen. Wir richten uns nach Ihrem Betriebsablauf.',
      },
      {
        question: 'Wie oft sollte ein Büro gereinigt werden?',
        answer:
          'Das hängt von Fläche, Mitarbeiterzahl und Kundenverkehr ab. Nach der Besichtigung empfehlen wir Ihnen einen passenden Rhythmus – von täglich bis zu festen Wochentagen.',
      },
      {
        question: 'Wer reinigt bei Urlaub oder Krankheit?',
        answer:
          'Eine eingearbeitete Vertretung, die Ihr Büro und den Reinigungsplan kennt. Ihr fester Ansprechpartner bleibt derselbe – Sie müssen nichts neu erklären.',
      },
      {
        question: 'Wie läuft das mit Schlüssel und Alarmanlage?',
        answer:
          'Schlüssel oder Transponder behandeln wir vertraulich. Übergabe, Zutrittszeiten und Ihre Alarmregelung halten wir vor dem ersten Einsatz schriftlich fest.',
      },
      {
        question: 'Übernehmen Sie auch die Fenster?',
        answer:
          'Glastüren, Glaswände und Spiegel innen gehören zur laufenden Büroreinigung. Fenster innen und außen reinigen wir auf Wunsch als eigenen Termin im Rahmen der Glasreinigung.',
      },
      {
        question: 'Was kostet die Büroreinigung in Kiel?',
        answer:
          'Das hängt von Fläche, Bodenbelägen, Ausstattung und Reinigungsrhythmus ab. Nach einer kostenlosen Besichtigung erhalten Sie ein Festpreis-Angebot mit klarem Leistungsverzeichnis – ohne versteckte Kosten.',
      },
    ],
    ergaenzungen: [
      { serviceId: 'glasreinigung', text: 'Fenster, Glasfassade und Eingangstür – streifenfrei, innen und außen, im festen Turnus.' },
      { serviceId: 'grundreinigung', text: 'Teppich- und Hartböden gründlich reinigen und neu einpflegen, ideal in ruhigen Wochen.' },
      { serviceId: 'hausmeisterservice', text: 'Kleine Reparaturen, Kontrollgänge und Außenanlagen für Ihr Bürogebäude.' },
    ],
    texte: {
      zielgruppenLabel: 'Für Ihr Büro',
      zielgruppenTitel: 'Jedes Büro in Kiel braucht etwas anderes',
      zielgruppenText: 'Wir richten Reinigungsplan und Rhythmus nach Ihrem Büro aus – nicht nach einer Standardliste.',
      grenzenTitel: 'Das bleibt bei Ihnen',
      grenzenText: 'Klare Absprachen schützen Ihre Unterlagen, Ihre Technik und Ihre Abläufe.',
      ablaufTitel: 'So starten wir in Ihrem Büro',
      vertrauenLabel: 'Verlässlichkeit',
      ergaenzungTitel: 'Alles für Ihr Büro aus einer Hand',
      ctaText:
        'Wir kommen zur kostenlosen Besichtigung in Ihr Büro in Kiel und erstellen Ihnen ein Festpreis-Angebot mit klarem Leistungsverzeichnis.',
    },
    icons: {
      zielgruppen: [Scale, Laptop, Store, Briefcase, Building2],
      vertrauen: [UserCheck, ClipboardCheck, Users, KeyRound],
    },
  },
  // ───────────────────────── Neumünster ─────────────────────────

  {
    serviceId: 'glasreinigung',
    citySlug: 'neumuenster',
    leistung: 'Glasreinigung',
    ort: 'Neumünster',
    seo: {
      title: 'Glasreinigung Neumünster für Gewerbe | KlarWerk Service',
      description:
        'Glas- und Fensterreinigung in Neumünster für Geschäfte, Büros, Praxen und Wohnanlagen: innen und außen, im festen Turnus oder einmalig. Jetzt anfragen.',
      keywords:
        'Glasreinigung Neumünster, Fensterreinigung Neumünster, Schaufensterreinigung Neumünster, Glasreinigung Gewerbe Neumünster, Fensterputzer Neumünster, Glasreinigung Wasbek, Glasreinigung Boostedt',
    },
    h1: 'Glasreinigung in Neumünster',
    intro:
      'Schaufenster, Eingangstüren und Bürofenster sehen Kunden und Besucher zuerst – und im Gegenlicht fällt jede Schliere auf. KlarWerk Service reinigt Fenster und Glasflächen in Neumünster streifenfrei, innen und außen, im festen Turnus oder einmalig zum Anlass. Unser Sitz in Bordesholm liegt direkt nördlich von Neumünster, über das Bordesholmer Dreieck und die A7 sind wir schnell bei Ihnen.',
    bild: {
      // gleiches Foto wie auf /leistungen/glasreinigung (kommt aus services.ts)
      alt: 'Streifenfreie Fenster – Glasreinigung in Neumünster durch KlarWerk Service',
    },
    eckdaten: [
      { titel: 'Innen und außen', text: 'Scheiben, auf Wunsch mit Rahmen und Fensterbänken' },
      { titel: 'Fester Turnus oder einmalig', text: 'Regelmäßig über das Jahr oder zum Anlass' },
      { titel: 'Ein Ansprechpartner', text: 'Termine abgestimmt, auch mit Ihrer laufenden Reinigung' },
    ],
    zielgruppen: [
      {
        titel: 'Geschäfte und Schaufenster',
        text: 'In der Innenstadt entscheidet das Schaufenster, ob jemand stehen bleibt. Scheiben und Eingangstür reinigen wir vor Ladenöffnung oder nach Geschäftsschluss.',
      },
      {
        titel: 'Büros und Verwaltungen',
        text: 'Mehr Tageslicht am Arbeitsplatz und ein gepflegter Eindruck für Besucher: Bürofenster, Glastüren und Glaswände im festen Rhythmus.',
      },
      {
        titel: 'Praxen',
        text: 'Praxisfenster, Eingangstür und Glas im Empfang – gereinigt außerhalb der Sprechzeiten, damit der Praxisbetrieb ungestört bleibt.',
      },
      {
        titel: 'Wohnanlagen und Hausverwaltungen',
        text: 'Treppenhausfenster, Haustüren und Glas in Gemeinschaftsbereichen – planbar im Turnus, mit einem Ansprechpartner für die ganze Anlage.',
      },
      {
        titel: 'Autohäuser und Ausstellungsflächen',
        text: 'Große Glasfronten zeigen, was drinnen steht. Wir stimmen die Termine so ab, dass Ausstellung und Verkauf weiterlaufen.',
      },
    ],
    umfang: {
      wir: [
        'Fensterscheiben innen und außen, streifenfrei',
        'Rahmen, Falze und Fensterbänke auf Wunsch',
        'Schaufenster, Eingangstüren und Glasvordächer, soweit sicher erreichbar',
        'Glastüren, Glaswände und Trennwände im Innenbereich',
        'Spiegel und Glas in Empfang, Treppenhaus und Sanitär',
        'Höher gelegene Flächen mit Teleskop- und Leitersystemen',
      ],
      beiIhnen: [
        'Fensterbänke freiräumen, Deko und Pflanzen zur Seite stellen',
        'Fassadenflächen, die Hubsteiger oder Gerüst brauchen – nur nach Absprache',
        'Beschädigte oder undichte Fenster – Auffälliges melden wir, reparieren aber nicht',
      ],
    },
    zeiten: {
      titel: 'Glasreinigung im passenden Rhythmus',
      text: 'Wie oft sich eine Glasreinigung lohnt, hängt von Lage, Laufkundschaft und Witterung ab. Ein Schaufenster an einer belebten Straße braucht mehr Pflege als ein Bürofenster zum Hof. Den Rhythmus legen wir nach der Besichtigung gemeinsam fest.',
      punkte: [
        'Schaufenster und Eingangstüren in kurzen Abständen',
        'Bürofenster im festen Turnus über das Jahr',
        'Einmalig nach dem Winter, nach Bauarbeiten oder vor einem Anlass',
        'Früh morgens vor Ladenöffnung oder nach Geschäftsschluss',
      ],
    },
    vertrauen: [
      {
        titel: 'Streifenfrei mit Profi-Technik',
        text: 'Professionelle Wischtechnik statt Haushaltsmittel – damit die Scheibe auch im Gegenlicht klar bleibt.',
      },
      {
        titel: 'Ein fester Ansprechpartner',
        text: 'Eine Person für Termine, Rückfragen und Kontrollen. Sie müssen niemandem Ihr Objekt zweimal erklären.',
      },
      {
        titel: 'Sicher in der Höhe',
        text: 'Teleskop- und Leitersysteme für höher gelegene Fenster. Was nur mit Hubsteiger oder Gerüst geht, klären wir vorab offen.',
      },
      {
        titel: 'Kombinierbar',
        text: 'Glasreinigung lässt sich mit Büro- oder Unterhaltsreinigung verbinden: ein Plan, ein Ansprechpartner, abgestimmte Termine.',
      },
    ],
    anfahrt: {
      titel: 'Glasreinigung in ganz Neumünster',
      text: 'Von Bordesholm sind wir über das Bordesholmer Dreieck und die A7 schnell in Neumünster – bei den Geschäften in der Innenstadt genauso wie in den Stadtteilen, den Gewerbegebieten und im Umland.',
      gruppen: [
        { titel: 'Innenstadt & Kernbezirke', orte: ['Innenstadt', 'Nord', 'Ost', 'Süd', 'West'] },
        { titel: 'Stadtteile', orte: ['Tungendorf', 'Einfeld', 'Gartenstadt', 'Faldera', 'Wittorf', 'Gadeland', 'Brachenfeld', 'Ruthenberg', 'Böcklersiedlung', 'Stör'] },
      ],
      umland: ['Bordesholm', 'Wasbek', 'Boostedt', 'Großenaspe', 'Groß Kummerfeld', 'Aukrug'],
    },
    ablauf: [
      {
        title: 'Kurze Anfrage',
        desc: 'Art des Objekts, ungefähre Zahl und Größe der Fenster – ein paar Fotos genügen für eine erste Einschätzung.',
      },
      {
        title: 'Besichtigung vor Ort',
        desc: 'Kostenlos in Neumünster: Wir sehen uns Glasflächen, Höhen und Zugänge an und klären, was innen und außen dazugehört.',
      },
      {
        title: 'Festpreis-Angebot',
        desc: 'Ein fester Preis je Termin oder für den Turnus – Sie wissen vorher genau, was Sie zahlen.',
      },
      {
        title: 'Erster Termin',
        desc: 'Zu einer Zeit, die Ihren Betrieb nicht stört: vor Öffnung, nach Feierabend oder am Wochenende nach Absprache.',
      },
      {
        title: 'Fester Turnus',
        desc: 'Auf Wunsch kommen wir regelmäßig wieder – Ihr Ansprechpartner hält die Termine im Blick.',
      },
    ],
    faqs: [
      {
        question: 'Reinigen Sie Fenster in ganz Neumünster?',
        answer:
          'Ja. Wir sind in allen Stadtteilen von Neumünster und im Umland unterwegs, etwa in Wasbek, Boostedt, Großenaspe und Groß Kummerfeld. Unser Sitz in Bordesholm liegt direkt nördlich der Stadt.',
      },
      {
        question: 'Wie oft sollten Fenster gereinigt werden?',
        answer:
          'Das hängt von Lage und Nutzung ab. Schaufenster und Eingangstüren brauchen kurze Abstände, Bürofenster meist einen festen Turnus über das Jahr. Nach der Besichtigung empfehlen wir Ihnen einen passenden Rhythmus.',
      },
      {
        question: 'Reinigen Sie auch Fenster in oberen Etagen?',
        answer:
          'Ja, soweit sie mit Teleskop- und Leitersystemen sicher erreichbar sind. Flächen, die einen Hubsteiger oder ein Gerüst brauchen, besprechen wir vorab mit Ihnen.',
      },
      {
        question: 'Gehören Rahmen und Fensterbänke dazu?',
        answer:
          'Auf Wunsch ja. Rahmen, Falze und Fensterbänke reinigen wir mit, wenn das im Angebot so vereinbart ist.',
      },
      {
        question: 'Können Sie außerhalb der Öffnungszeiten reinigen?',
        answer:
          'Ja. Schaufenster und Eingänge reinigen wir gern vor Ladenöffnung oder nach Geschäftsschluss, damit Kunden nicht gestört werden.',
      },
      {
        question: 'Lässt sich die Glasreinigung mit der Unterhaltsreinigung verbinden?',
        answer:
          'Ja. Glas innen kann Teil der laufenden Reinigung sein, Fenster außen kommen im eigenen Turnus dazu – mit einem gemeinsamen Plan und einem Ansprechpartner.',
      },
      {
        question: 'Was kostet die Glasreinigung in Neumünster?',
        answer:
          'Das hängt von Anzahl, Größe und Erreichbarkeit der Glasflächen ab. Nach einer kostenlosen Besichtigung erhalten Sie ein Festpreis-Angebot – einmalig oder für den Turnus.',
      },
    ],
    ergaenzungen: [
      { serviceId: 'unterhaltsreinigung', text: 'Glas innen gleich in die laufende Reinigung einplanen – mit festem Rhythmus.' },
      { serviceId: 'bueroreinigung', text: 'Büros, Teeküchen und Sanitärräume aus einer Hand mit Ihren Fenstern.' },
      { serviceId: 'grundreinigung', text: 'Böden und Flächen gründlich reinigen, etwa nach dem Winter oder vor dem Einzug.' },
    ],
    texte: {
      zielgruppenLabel: 'Für Ihr Objekt',
      zielgruppenTitel: 'Glasflächen in Neumünster – je nach Objekt anders',
      zielgruppenText: 'Ein Schaufenster braucht einen anderen Rhythmus als ein Treppenhausfenster. Wir planen nach Ihrem Objekt.',
      grenzenTitel: 'Das klären wir vorab',
      grenzenText: 'Damit am Termin nichts überrascht.',
      ablaufTitel: 'So läuft Ihre Glasreinigung',
      vertrauenLabel: 'Qualität',
      ergaenzungTitel: 'Rund um Ihr Objekt aus einer Hand',
      ctaText:
        'Wir sehen uns Ihre Glasflächen in Neumünster kostenlos an und erstellen Ihnen ein Festpreis-Angebot – einmalig oder im festen Turnus.',
    },
    icons: {
      zielgruppen: [Store, Building2, Stethoscope, Home, Car],
      vertrauen: [Sparkles, UserCheck, ShieldCheck, CalendarCheck],
    },
  },

  {
    serviceId: 'bueroreinigung',
    citySlug: 'neumuenster',
    leistung: 'Büroreinigung',
    ort: 'Neumünster',
    seo: {
      title: 'Büroreinigung Neumünster nach Feierabend | KlarWerk Service',
      description:
        'Büroreinigung in Neumünster für Verwaltungen, Kanzleien und Büros in Gewerbebetrieben: außerhalb der Arbeitszeit, mit festem Ansprechpartner.',
      keywords:
        'Büroreinigung Neumünster, Reinigungsfirma Büro Neumünster, Büroreinigung Gewerbe Neumünster, Unterhaltsreinigung Büro Neumünster, Büroreinigung Wasbek, Büroreinigung Boostedt',
    },
    h1: 'Büroreinigung in Neumünster',
    intro:
      'In Neumünster liegen viele Büros nicht nur in der Innenstadt, sondern auch in Gewerbe-, Handels- und Logistikbetrieben – mit Sozialräumen, Umkleiden und Besprechungsräumen gleich nebenan. KlarWerk Service reinigt Ihre Büroflächen nach festem Plan, außerhalb Ihrer Arbeitszeiten und mit einem festen Ansprechpartner. Von Bordesholm aus sind wir über die A7 schnell bei Ihnen.',
    bild: {
      // gleiches Foto wie auf /leistungen/bueroreinigung (kommt aus services.ts)
      alt: 'Saubere Büroräume – Büroreinigung in Neumünster durch KlarWerk Service',
    },
    eckdaten: [
      { titel: 'Außerhalb der Arbeitszeit', text: 'Nach Büroschluss, früh morgens oder zwischen den Schichten' },
      { titel: 'Ein fester Ansprechpartner', text: 'Für Plan, Schlüssel, Rückfragen und Kontrollen' },
      { titel: 'Vertretung, die Ihr Büro kennt', text: 'Bei Urlaub und Krankheit läuft die Reinigung weiter' },
    ],
    zielgruppen: [
      {
        titel: 'Verwaltungen und Dienstleister',
        text: 'Büroetagen in der Innenstadt mit Empfang, Besprechungsräumen und Teeküche – gereinigt, bevor der erste Termin beginnt.',
      },
      {
        titel: 'Büros in Gewerbe- und Logistikbetrieben',
        text: 'Bürotrakt, Sozial- und Pausenräume, Umkleiden und Sanitär: Bereiche, die von vielen Menschen genutzt werden und eine feste Routine brauchen.',
      },
      {
        titel: 'Kanzleien und Steuerbüros',
        text: 'Mandantengespräche und Akten auf dem Tisch: Wir reinigen freigeräumte Flächen, Böden und Empfang – Unterlagen bleiben, wo sie liegen.',
      },
      {
        titel: 'Autohäuser mit Verkaufsräumen',
        text: 'Verkaufsbüros, Kundenbereich und Sanitär im Autohaus – abgestimmt auf Öffnungszeiten und Ausstellung.',
      },
      {
        titel: 'Kleine Büros',
        text: 'Wenige Arbeitsplätze, überschaubare Fläche: Oft reichen ein oder zwei feste Wochentage – mit genauso festem Ansprechpartner.',
      },
    ],
    umfang: {
      wir: [
        'Arbeitsplätze: freigeräumte Schreibtische, Ablagen und Fensterbänke',
        'Böden in allen Räumen – Hartböden gewischt, Teppichböden gesaugt',
        'Teeküche, Sozial- und Pausenräume',
        'Sanitärräume und Umkleiden gründlich und hygienisch',
        'Kontaktflächen wie Türklinken, Lichtschalter und Handläufe',
        'Empfang, Flure und Besprechungsräume, Papierkörbe und Mülltrennung',
        'Glas innen: Glastüren, Glaswände und Spiegel',
      ],
      beiIhnen: [
        'Akten, Unterlagen und volle Schreibtische – die räumen wir nicht um',
        'Lager- und Produktionsflächen – dafür gibt es ein eigenes Angebot',
        'Server- und Technikräume nur nach Absprache und Einweisung',
      ],
    },
    zeiten: {
      titel: 'Reinigung, die zu Ihrem Betrieb passt',
      text: 'Ob klassische Bürozeiten oder Schichtbetrieb: Wir reinigen dann, wenn die Räume frei sind. Wie oft, hängt von Fläche, Mitarbeiterzahl und Kundenverkehr ab – das legen wir nach der Besichtigung gemeinsam fest.',
      punkte: [
        'Abends nach Büroschluss',
        'Früh morgens vor Arbeitsbeginn',
        'Im Schichtbetrieb zwischen den Schichten, nach Absprache',
        'An festen Wochentagen statt täglich, wenn das reicht',
      ],
    },
    vertrauen: [
      {
        titel: 'Ein fester Ansprechpartner',
        text: 'Pro Objekt eine Person, die Ihre Räume und Wünsche kennt – auch wenn Büro, Sozialräume und Umkleiden dazugehören.',
      },
      {
        titel: 'Regelmäßige Qualitätskontrollen',
        text: 'Wir prüfen das Ergebnis vor Ort und stimmen Anpassungen mit Ihnen ab, bevor Ihnen etwas auffällt.',
      },
      {
        titel: 'Eingearbeitete Vertretung',
        text: 'Bei Urlaub und Krankheit übernimmt jemand, der Ihr Objekt und den Reinigungsplan kennt. Keine Lücke, keine neue Einweisung.',
      },
      {
        titel: 'Schlüssel in guten Händen',
        text: 'Schlüssel, Transponder und Alarmregelung halten wir vor dem ersten Einsatz schriftlich fest.',
      },
    ],
    anfahrt: {
      titel: 'Büroreinigung in ganz Neumünster',
      text: 'Von Bordesholm sind wir über das Bordesholmer Dreieck und die A7 schnell in Neumünster – in der Innenstadt, in den Stadtteilen und in den Gewerbegebieten. Kurze Wege machen Besichtigung, Kontrollen und kurzfristige Absprachen einfach.',
      gruppen: [
        { titel: 'Innenstadt & Kernbezirke', orte: ['Innenstadt', 'Nord', 'Ost', 'Süd', 'West'] },
        { titel: 'Stadtteile', orte: ['Wittorf', 'Gadeland', 'Tungendorf', 'Einfeld', 'Faldera', 'Gartenstadt', 'Brachenfeld', 'Ruthenberg', 'Böcklersiedlung', 'Stör'] },
      ],
      umland: ['Bordesholm', 'Wasbek', 'Boostedt', 'Großenaspe', 'Groß Kummerfeld', 'Aukrug'],
    },
    ablauf: [
      {
        title: 'Kurze Anfrage',
        desc: 'Per Telefon, E-Mail oder Formular: Art des Büros, ungefähre Fläche und Ihre Wunschzeiten genügen für den Anfang.',
      },
      {
        title: 'Besichtigung vor Ort',
        desc: 'Kostenlos in Neumünster: Wir gehen Büros, Sozialräume, Sanitär und Bodenbeläge gemeinsam durch und klären, was wie oft gereinigt wird.',
      },
      {
        title: 'Festpreis-Angebot',
        desc: 'Mit klarem Leistungsverzeichnis nach Bereichen und Rhythmus – Sie sehen genau, was Sie bekommen.',
      },
      {
        title: 'Start mit Einweisung',
        desc: 'Zutritt, Alarmregelung, Zeiten und Zuständigkeiten halten wir vor dem ersten Einsatz schriftlich fest.',
      },
      {
        title: 'Laufende Betreuung',
        desc: 'Fester Ansprechpartner, regelmäßige Kontrollen und eine eingearbeitete Vertretung bei Urlaub oder Krankheit.',
      },
    ],
    faqs: [
      {
        question: 'Reinigen Sie Büros in ganz Neumünster?',
        answer:
          'Ja. Wir betreuen Büros in allen Stadtteilen von Neumünster und im Umland, etwa in Wasbek, Boostedt und Großenaspe. Unser Sitz in Bordesholm liegt direkt nördlich der Stadt.',
      },
      {
        question: 'Reinigen Sie auch Sozialräume und Umkleiden im Betrieb?',
        answer:
          'Ja. Sozial- und Pausenräume, Teeküchen, Umkleiden und Sanitärbereiche nehmen wir in den Reinigungsplan auf. Lager- und Produktionsflächen bieten wir getrennt an.',
      },
      {
        question: 'Wann wird gereinigt?',
        answer:
          'Außerhalb Ihrer Arbeitszeiten: abends, früh morgens oder – bei Schichtbetrieb – nach Absprache zwischen den Schichten.',
      },
      {
        question: 'Wer reinigt bei Urlaub oder Krankheit?',
        answer:
          'Eine eingearbeitete Vertretung, die Ihr Objekt und den Reinigungsplan kennt. Ihr fester Ansprechpartner bleibt derselbe.',
      },
      {
        question: 'Wie läuft das mit Schlüssel und Alarmanlage?',
        answer:
          'Schlüssel oder Transponder behandeln wir vertraulich. Übergabe, Zutrittszeiten und Alarmregelung halten wir vor dem ersten Einsatz schriftlich fest.',
      },
      {
        question: 'Wie oft sollte ein Büro gereinigt werden?',
        answer:
          'Das hängt von Fläche, Mitarbeiterzahl und Kundenverkehr ab. Nach der Besichtigung empfehlen wir einen passenden Rhythmus – von täglich bis zu festen Wochentagen.',
      },
      {
        question: 'Was kostet die Büroreinigung in Neumünster?',
        answer:
          'Das hängt von Fläche, Bodenbelägen, Ausstattung und Rhythmus ab. Nach einer kostenlosen Besichtigung erhalten Sie ein Festpreis-Angebot mit klarem Leistungsverzeichnis.',
      },
    ],
    ergaenzungen: [
      { serviceId: 'glasreinigung', text: 'Bürofenster, Glastüren und Eingang – im festen Turnus, innen und außen.' },
      { serviceId: 'lagerhallenreinigung', text: 'Lager- und Logistikflächen im selben Betrieb, mit eigenem Plan.' },
      { serviceId: 'unterhaltsreinigung', text: 'Weitere Bereiche wie Treppenhaus oder Verkaufsfläche nach festem Plan.' },
    ],
    texte: {
      zielgruppenLabel: 'Für Ihr Büro',
      zielgruppenTitel: 'Büros in Neumünster – von der Innenstadt bis zum Gewerbegebiet',
      zielgruppenText: 'Wir richten Reinigungsplan und Rhythmus nach Ihrem Betrieb aus – nicht nach einer Standardliste.',
      grenzenTitel: 'Das bleibt bei Ihnen',
      grenzenText: 'Klare Absprachen schützen Ihre Unterlagen, Ihre Technik und Ihre Abläufe.',
      ablaufTitel: 'So starten wir in Ihrem Büro',
      vertrauenLabel: 'Verlässlichkeit',
      ergaenzungTitel: 'Alles für Ihren Betrieb aus einer Hand',
      ctaText:
        'Wir kommen zur kostenlosen Besichtigung in Ihr Büro in Neumünster und erstellen Ihnen ein Festpreis-Angebot mit klarem Leistungsverzeichnis.',
    },
    icons: {
      zielgruppen: [Building2, Truck, Scale, Car, Briefcase],
      vertrauen: [UserCheck, ClipboardCheck, Users, KeyRound],
    },
  },

  {
    serviceId: 'praxisreinigung',
    citySlug: 'neumuenster',
    leistung: 'Praxisreinigung',
    ort: 'Neumünster',
    seo: {
      title: 'Praxisreinigung in Neumünster | KlarWerk Service',
      description:
        'Praxisreinigung in Neumünster für Arzt-, Zahnarzt- und Therapiepraxen: nach Ihrem Hygieneplan, außerhalb der Sprechzeiten, fester Ansprechpartner.',
      keywords:
        'Praxisreinigung Neumünster, Reinigung Arztpraxis Neumünster, Zahnarztpraxis Reinigung Neumünster, Physiotherapie Reinigung Neumünster, Reinigungsfirma Praxis Neumünster',
    },
    h1: 'Praxisreinigung in Neumünster',
    intro:
      'Morgens soll die Praxis bereitstehen: Wartezimmer gepflegt, Behandlungsräume hygienisch, Sanitär frisch – ohne dass Ihr Team nachputzen oder nachfragen muss. KlarWerk Service reinigt Arzt-, Zahnarzt- und Therapiepraxen in Neumünster nach Ihrem Hygieneplan, außerhalb der Sprechzeiten und mit einem festen Ansprechpartner. Von Bordesholm aus sind wir schnell in jedem Stadtteil.',
    bild: {
      // gleiches Foto wie auf /leistungen/praxisreinigung (kommt aus services.ts)
      alt: 'Hygienische Praxisräume – Praxisreinigung in Neumünster durch KlarWerk Service',
    },
    eckdaten: [
      { titel: 'Nach Ihrem Hygieneplan', text: 'Bereiche, Mittel und Intervalle wie bei Ihnen festgelegt' },
      { titel: 'Nach Sprechschluss', text: 'Abends, früh morgens oder am freien Nachmittag' },
      { titel: 'Kein Ausfall', text: 'Eingearbeitete Vertretung bei Urlaub und Krankheit' },
    ],
    zielgruppen: [
      {
        titel: 'Allgemein- und Facharztpraxen',
        text: 'Viel Laufverkehr am Empfang und im Wartezimmer: Böden und häufig berührte Flächen werden bei jeder Reinigung gereinigt und nach Plan desinfiziert.',
      },
      {
        titel: 'Zahnarztpraxen',
        text: 'Böden und Oberflächen rund um die Behandlungseinheit, dazu Empfang, Wartebereich und Sanitär. Geräte und Instrumente bleiben bei Ihrem Team.',
      },
      {
        titel: 'Physio-, Ergo- und Logopädiepraxen',
        text: 'Therapieliegen, Trainingsflächen, Umkleiden und Duschen – Räume, die den ganzen Tag genutzt werden und eine feste Routine brauchen.',
      },
      {
        titel: 'Ärztehäuser und Praxisgemeinschaften',
        text: 'Mehrere Praxen unter einem Dach: ein Ansprechpartner, ein abgestimmter Plan, auf Wunsch getrennte Leistungsverzeichnisse.',
      },
      {
        titel: 'Neueröffnung und Praxisübernahme',
        text: 'Vor dem Start einmal gründlich, danach im festen Rhythmus – so beginnt die Praxis sauber und bleibt es auch.',
      },
    ],
    umfang: {
      wir: [
        'Böden in allen Räumen – feucht gewischt, in sensiblen Bereichen desinfizierend',
        'Empfang, Wartezimmer und Flure',
        'Kontaktflächen wie Türklinken, Lichtschalter, Tresen und Armlehnen',
        'Behandlungs- und Therapieräume: Liegen, Arbeitsflächen und Ablagen',
        'Sanitärbereiche für Patienten und Team',
        'Sozialraum, Teeküche, Papierkörbe und Hausmüll',
      ],
      beiIhnen: [
        'Aufbereitung von Instrumenten und Medizinprodukten',
        'Desinfektion medizinischer Geräte nach Herstellervorgabe',
        'Patientenakten, Unterlagen und Bildschirme – die fassen wir nicht an',
      ],
    },
    zeiten: {
      titel: 'Gereinigt, wenn die Praxis leer ist',
      text: 'Patienten und Team bekommen von der Reinigung nur das Ergebnis mit. Den Rhythmus – täglich oder an festen Wochentagen – legen wir nach Praxisgröße und Hygieneplan gemeinsam fest.',
      punkte: [
        'Abends nach der letzten Sprechstunde',
        'Früh morgens vor Praxisbeginn',
        'An freien Nachmittagen, etwa mittwochs oder freitags',
        'Grundreinigung der Böden in den Praxisferien',
      ],
    },
    vertrauen: [
      {
        titel: 'Ihr Hygieneplan gilt',
        text: 'Wir übernehmen Ihre Vorgaben zu Bereichen, Mitteln und Intervallen und setzen VAH-gelistete Desinfektionsmittel passend zum Einsatzbereich ein.',
      },
      {
        titel: 'Nachvollziehbar dokumentiert',
        text: 'Sie sehen, was wann gereinigt wurde – hilfreich für Ihre Hygienedokumentation und bei Begehungen.',
      },
      {
        titel: 'Diskret',
        text: 'Akten, Unterlagen und Bildschirme bleiben unberührt. Auf Wunsch unterschreiben wir eine Verschwiegenheitsvereinbarung.',
      },
      {
        titel: 'Fester Ansprechpartner',
        text: 'Regelmäßige Kontrollen durch eine Person, die Ihre Praxis kennt – und eine eingearbeitete Vertretung, wenn sie ausfällt.',
      },
    ],
    anfahrt: {
      titel: 'Praxen in ganz Neumünster',
      text: 'Von Bordesholm sind wir über das Bordesholmer Dreieck und die A7 schnell in Neumünster – in der Innenstadt, in allen Stadtteilen und im Umland.',
      gruppen: [
        { titel: 'Innenstadt & Kernbezirke', orte: ['Innenstadt', 'Nord', 'Ost', 'Süd', 'West'] },
        { titel: 'Stadtteile', orte: ['Einfeld', 'Tungendorf', 'Gartenstadt', 'Faldera', 'Böcklersiedlung', 'Brachenfeld', 'Ruthenberg', 'Wittorf', 'Gadeland', 'Stör'] },
      ],
      umland: ['Bordesholm', 'Wasbek', 'Boostedt', 'Großenaspe', 'Groß Kummerfeld', 'Aukrug'],
    },
    ablauf: [
      {
        title: 'Kurze Anfrage',
        desc: 'Praxisart, ungefähre Raumzahl und Ihre Wunschzeiten genügen für den Anfang.',
      },
      {
        title: 'Besichtigung in Ihrer Praxis',
        desc: 'Kostenlos in Neumünster: Wir gehen Räume, Bodenbeläge und Ihren Hygieneplan gemeinsam durch.',
      },
      {
        title: 'Festpreis-Angebot',
        desc: 'Mit klarem Leistungsverzeichnis nach Räumen und Rhythmus.',
      },
      {
        title: 'Start mit Einweisung',
        desc: 'Schlüssel, Alarm, Zuständigkeiten und Reinigungsplan halten wir vor dem ersten Einsatz schriftlich fest.',
      },
      {
        title: 'Laufende Betreuung',
        desc: 'Fester Ansprechpartner, regelmäßige Kontrollen und eine eingearbeitete Vertretung bei Urlaub oder Krankheit.',
      },
    ],
    faqs: [
      {
        question: 'Reinigen Sie Praxen in ganz Neumünster?',
        answer:
          'Ja. Wir betreuen Praxen in allen Stadtteilen von Neumünster und im Umland, etwa in Wasbek, Boostedt und Großenaspe. Unser Sitz in Bordesholm liegt direkt nördlich der Stadt.',
      },
      {
        question: 'Arbeiten Sie nach unserem Hygieneplan?',
        answer:
          'Ja. Wir übernehmen Ihre Vorgaben zu Bereichen, Mitteln und Intervallen, setzen VAH-gelistete Desinfektionsmittel ein und dokumentieren die Reinigung nachvollziehbar.',
      },
      {
        question: 'Reinigen Sie während der Sprechzeiten?',
        answer:
          'In der Regel nicht. Wir reinigen abends, früh morgens oder an Ihren freien Nachmittagen.',
      },
      {
        question: 'Wir reinigen bisher selbst. Wie läuft der Wechsel?',
        answer:
          'Wir sehen uns die Praxis an, nehmen Ihren Hygieneplan auf und schlagen einen Rhythmus vor. Auf Wunsch starten wir mit einer gründlichen Grundreinigung und gehen dann in die laufende Reinigung über.',
      },
      {
        question: 'Wer reinigt bei Urlaub oder Krankheit?',
        answer:
          'Eine eingearbeitete Vertretung, die Ihre Praxis und den Reinigungsplan kennt. Ihr Ansprechpartner bleibt derselbe.',
      },
      {
        question: 'Übernehmen Sie die Aufbereitung von Instrumenten?',
        answer:
          'Nein. Die Aufbereitung von Medizinprodukten und die Desinfektion medizinischer Geräte bleiben bei Ihrem Praxisteam.',
      },
      {
        question: 'Was kostet die Praxisreinigung in Neumünster?',
        answer:
          'Das hängt von Praxisgröße, Raumanzahl, Bodenbelägen und Rhythmus ab. Nach einer kostenlosen Besichtigung erhalten Sie ein Festpreis-Angebot mit klarem Leistungsverzeichnis.',
      },
    ],
    ergaenzungen: [
      { serviceId: 'glasreinigung', text: 'Praxisfenster, Eingangstür und Praxisschild – streifenfrei, innen und außen.' },
      { serviceId: 'grundreinigung', text: 'Böden gründlich reinigen und neu einpflegen, ideal in den Praxisferien.' },
      { serviceId: 'unterhaltsreinigung', text: 'Treppenhaus und Gemeinschaftsflächen im Ärztehaus nach festem Plan.' },
    ],
    texte: {
      zielgruppenLabel: 'Für Ihre Praxis',
      zielgruppenTitel: 'Jede Praxis in Neumünster braucht etwas anderes',
      zielgruppenText: 'Wir richten Reinigungsplan und Rhythmus nach Ihrer Praxisart aus – nicht nach einer Standardliste.',
      grenzenTitel: 'Das bleibt bei Ihrem Praxisteam',
      grenzenText: 'Klare Grenzen schützen Patienten, Geräte und Ihre Haftung.',
      ablaufTitel: 'So starten wir in Ihrer Praxis',
      vertrauenLabel: 'Hygiene & Vertrauen',
      ergaenzungTitel: 'Alles für Ihre Praxis aus einer Hand',
      ctaText:
        'Wir kommen zur kostenlosen Besichtigung in Ihre Praxis in Neumünster und erstellen Ihnen ein Festpreis-Angebot mit klarem Leistungsverzeichnis.',
    },
    icons: {
      zielgruppen: [Stethoscope, Smile, Activity, Building2, Sparkles],
      vertrauen: [ClipboardCheck, FileText, Lock, UserCheck],
    },
  },

  {
    serviceId: 'unterhaltsreinigung',
    citySlug: 'neumuenster',
    leistung: 'Unterhaltsreinigung',
    ort: 'Neumünster',
    seo: {
      title: 'Unterhaltsreinigung Neumünster | KlarWerk Service',
      description:
        'Unterhaltsreinigung in Neumünster für Gewerbe, Wohnanlagen, Kitas und Geschäfte: fester Plan, regelmäßige Kontrollen, ein Ansprechpartner. Jetzt anfragen.',
      keywords:
        'Unterhaltsreinigung Neumünster, Gebäudereinigung Neumünster, Reinigungsfirma Neumünster, Treppenhausreinigung Neumünster, Gebäudeservice Neumünster, Unterhaltsreinigung Gewerbe Neumünster',
    },
    h1: 'Unterhaltsreinigung in Neumünster',
    intro:
      'Unterhaltsreinigung heißt: Ihr Objekt bleibt dauerhaft sauber, ohne dass Sie sich darum kümmern müssen. KlarWerk Service reinigt Gewerbeflächen, Treppenhäuser, Kitas und Verkaufsflächen in Neumünster nach einem festen Leistungsverzeichnis – mit klaren Intervallen je Bereich, regelmäßigen Kontrollen und einem festen Ansprechpartner. Unser Sitz in Bordesholm liegt direkt nördlich der Stadt.',
    bild: {
      // gleiches Foto wie auf /leistungen/unterhaltsreinigung (kommt aus services.ts)
      alt: 'Gepflegte Gewerbeflächen – Unterhaltsreinigung in Neumünster durch KlarWerk Service',
    },
    eckdaten: [
      { titel: 'Fester Plan', text: 'Leistungsverzeichnis mit Intervallen je Bereich' },
      { titel: 'Regelmäßige Kontrollen', text: 'Durch Ihren festen Ansprechpartner vor Ort' },
      { titel: 'Keine Lücken', text: 'Eingearbeitete Vertretung bei Urlaub und Krankheit' },
    ],
    zielgruppen: [
      {
        titel: 'Hausverwaltungen und Wohnanlagen',
        text: 'Treppenhäuser, Eingänge, Keller- und Gemeinschaftsflächen nach festem Turnus – mit einem Ansprechpartner für Verwaltung und Hausbewohner.',
      },
      {
        titel: 'Gewerbe- und Logistikbetriebe',
        text: 'Sozial- und Pausenräume, Umkleiden, Sanitär und Bürotrakt: Bereiche mit vielen Nutzern, die jeden Tag funktionieren müssen.',
      },
      {
        titel: 'Kitas und Schulen',
        text: 'Gruppen- und Klassenräume, Sanitär und Flure nach Betreuungsschluss – sorgfältig und mit Blick auf die Sicherheit der Kinder.',
      },
      {
        titel: 'Geschäfte und Verkaufsflächen',
        text: 'Verkaufsraum, Kassenzone, Eingang und Personalräume – gereinigt vor Öffnung oder nach Ladenschluss.',
      },
      {
        titel: 'Büros und Praxen',
        text: 'Regelmäßige Reinigung von Arbeits- und Behandlungsräumen – für beides gibt es bei uns eigene Seiten mit allen Details.',
      },
    ],
    umfang: {
      wir: [
        'Böden aller Art: kehren, saugen, nass wischen – nach Belag und Nutzung',
        'Sanitärräume, Umkleiden und Duschen',
        'Sozial- und Pausenräume, Teeküchen',
        'Treppenhäuser, Flure, Eingänge und Aufzüge',
        'Kontaktflächen wie Türklinken, Handläufe und Lichtschalter',
        'Papierkörbe, Mülltrennung und Abfallbehälter',
        'Glas innen: Glastüren, Trennwände und Spiegel',
      ],
      beiIhnen: [
        'Grundreinigung und Bodenpflege mit Versiegelung – eigener Termin',
        'Fenster außen – eigener Turnus in der Glasreinigung',
        'Produktions- und Maschinenbereiche – nur nach Absprache und Einweisung',
      ],
    },
    zeiten: {
      titel: 'Jeder Bereich in seinem Intervall',
      text: 'Nicht alles muss gleich oft gereinigt werden. Sanitär und Sozialräume brauchen kürzere Abstände als ein Kellerflur. Im Leistungsverzeichnis legen wir für jeden Bereich fest, was wie oft passiert – nachvollziehbar für Sie und für uns.',
      punkte: [
        'Täglich oder mehrmals pro Woche: Sanitär, Sozialräume, Eingänge',
        'Wöchentlich oder vierzehntägig: Treppenhäuser, Flure, Nebenräume',
        'Zu Zeiten, die Ihren Betrieb nicht stören',
        'Grund- und Glasreinigung als eigene Termine im Jahresplan',
      ],
    },
    vertrauen: [
      {
        titel: 'Klares Leistungsverzeichnis',
        text: 'Sie sehen schwarz auf weiß, welcher Bereich wie oft gereinigt wird – keine Überraschungen, keine Diskussionen.',
      },
      {
        titel: 'Ein fester Ansprechpartner',
        text: 'Pro Objekt eine Person, die Ihre Räume kennt und für Rückfragen und Anpassungen da ist.',
      },
      {
        titel: 'Eingearbeitete Vertretung',
        text: 'Bei Urlaub und Krankheit übernimmt jemand, der das Objekt kennt. Die Reinigung läuft weiter.',
      },
      {
        titel: 'Regelmäßige Kontrollen',
        text: 'Wir prüfen das Ergebnis vor Ort und passen den Plan an, wenn sich die Nutzung ändert.',
      },
    ],
    anfahrt: {
      titel: 'Unterhaltsreinigung in ganz Neumünster',
      text: 'Von Bordesholm sind wir über das Bordesholmer Dreieck und die A7 schnell in Neumünster – in Wohnanlagen der Stadtteile ebenso wie in den Gewerbegebieten und in der Innenstadt.',
      gruppen: [
        { titel: 'Innenstadt & Kernbezirke', orte: ['Innenstadt', 'Nord', 'Ost', 'Süd', 'West'] },
        { titel: 'Stadtteile', orte: ['Tungendorf', 'Einfeld', 'Faldera', 'Gartenstadt', 'Böcklersiedlung', 'Brachenfeld', 'Ruthenberg', 'Wittorf', 'Gadeland', 'Stör'] },
      ],
      umland: ['Bordesholm', 'Wasbek', 'Boostedt', 'Großenaspe', 'Groß Kummerfeld', 'Aukrug'],
    },
    ablauf: [
      {
        title: 'Kurze Anfrage',
        desc: 'Art des Objekts, Bereiche und gewünschter Rhythmus – mehr braucht es für den Anfang nicht.',
      },
      {
        title: 'Besichtigung vor Ort',
        desc: 'Kostenlos in Neumünster: Wir gehen alle Bereiche durch und klären, was wie oft gereinigt werden soll.',
      },
      {
        title: 'Leistungsverzeichnis und Festpreis',
        desc: 'Bereiche, Intervalle und Preis übersichtlich in einem Angebot.',
      },
      {
        title: 'Start mit Einweisung',
        desc: 'Zutritt, Zeiten, Ansprechpartner und Besonderheiten des Objekts halten wir vor dem ersten Einsatz fest.',
      },
      {
        title: 'Laufende Betreuung',
        desc: 'Regelmäßige Kontrollen, kurze Wege für Rückfragen und eine eingearbeitete Vertretung.',
      },
    ],
    faqs: [
      {
        question: 'Was gehört zur Unterhaltsreinigung?',
        answer:
          'Die regelmäßige Reinigung nach festem Plan: Böden, Sanitär, Sozialräume, Treppenhäuser, Kontaktflächen und Abfall. Was genau dazugehört und wie oft, steht im Leistungsverzeichnis.',
      },
      {
        question: 'Was ist der Unterschied zur Grundreinigung?',
        answer:
          'Die Unterhaltsreinigung läuft regelmäßig. Die Grundreinigung ist eine seltene, besonders gründliche Reinigung – zum Beispiel ein- bis zweimal im Jahr oder nach starker Beanspruchung.',
      },
      {
        question: 'Reinigen Sie auch Treppenhäuser für Hausverwaltungen?',
        answer:
          'Ja. Treppenhäuser, Eingänge und Gemeinschaftsflächen reinigen wir im festen Turnus, mit einem Ansprechpartner für die Verwaltung.',
      },
      {
        question: 'Reinigen Sie in ganz Neumünster und im Umland?',
        answer:
          'Ja, in allen Stadtteilen und im Umland, etwa in Wasbek, Boostedt, Großenaspe und Groß Kummerfeld. Unser Sitz in Bordesholm liegt direkt nördlich der Stadt.',
      },
      {
        question: 'Wer reinigt bei Urlaub oder Krankheit?',
        answer:
          'Eine eingearbeitete Vertretung, die Ihr Objekt kennt. So entstehen keine Lücken im Plan.',
      },
      {
        question: 'Sind Reinigungsmittel und Material inklusive?',
        answer:
          'Ja, Reinigungsmittel, Material und Technik bringen wir mit. Verbrauchsmaterial wie Seife oder Papier können wir auf Wunsch mitliefern.',
      },
      {
        question: 'Was kostet die Unterhaltsreinigung in Neumünster?',
        answer:
          'Das hängt von Fläche, Bereichen und Intervallen ab. Nach einer kostenlosen Besichtigung erhalten Sie ein Festpreis-Angebot mit Leistungsverzeichnis.',
      },
    ],
    ergaenzungen: [
      { serviceId: 'glasreinigung', text: 'Fenster und Glasflächen im eigenen Turnus, abgestimmt mit der laufenden Reinigung.' },
      { serviceId: 'grundreinigung', text: 'Einmal oder zweimal im Jahr gründlich – für Böden, die lange halten sollen.' },
      { serviceId: 'hausmeisterservice', text: 'Kontrollgänge, kleine Reparaturen und Außenanlagen für Ihr Objekt.' },
    ],
    texte: {
      zielgruppenLabel: 'Für Ihr Objekt',
      zielgruppenTitel: 'Unterhaltsreinigung für jedes Objekt in Neumünster',
      zielgruppenText: 'Wohnanlage, Betrieb, Kita oder Geschäft – der Plan richtet sich nach Ihrem Objekt.',
      grenzenTitel: 'Das planen wir separat',
      grenzenText: 'Damit das Leistungsverzeichnis klar bleibt.',
      ablaufTitel: 'So starten wir in Ihrem Objekt',
      vertrauenLabel: 'Verlässlichkeit',
      ergaenzungTitel: 'Ergänzt Ihre laufende Reinigung',
      ctaText:
        'Wir kommen zur kostenlosen Besichtigung in Neumünster und erstellen Ihnen ein Festpreis-Angebot mit klarem Leistungsverzeichnis.',
    },
    icons: {
      zielgruppen: [Home, Warehouse, Baby, Store, Briefcase],
      vertrauen: [ClipboardCheck, UserCheck, Users, CalendarCheck],
    },
  },

  {
    serviceId: 'bauendreinigung',
    citySlug: 'neumuenster',
    leistung: 'Bauendreinigung',
    ort: 'Neumünster',
    seo: {
      title: 'Bauendreinigung Neumünster: grob & fein | KlarWerk Service',
      description:
        'Bauendreinigung in Neumünster: Baugrobreinigung während der Bauphase und Feinreinigung zur Übergabe – für Bauunternehmen, Bauträger und Eigentümer.',
      keywords:
        'Bauendreinigung Neumünster, Baugrobreinigung Neumünster, Grobreinigung Neumünster, Baureinigung Neumünster, Bauschlussreinigung Neumünster, Feinreinigung Neubau Neumünster',
    },
    h1: 'Bauendreinigung in Neumünster',
    intro:
      'Vom groben Bauschmutz während der Bauphase bis zur übergabefertigen Fläche: KlarWerk Service reinigt Neubauten, Umbauten und renovierte Objekte in Neumünster in den Stufen, die Ihr Bauablauf braucht. Wir stimmen uns mit Bauleitung und Gewerken ab, damit die Übergabe nicht an der Reinigung hängt. Unser Sitz in Bordesholm liegt direkt nördlich der Stadt.',
    bild: {
      // gleiches Foto wie auf /leistungen/bauendreinigung (kommt aus services.ts)
      alt: 'Übergabefertige Räume – Bauendreinigung in Neumünster durch KlarWerk Service',
    },
    eckdaten: [
      { titel: 'Grob- und Feinreinigung', text: 'Während der Bauphase und vor der Übergabe' },
      { titel: 'Nach Ihrem Bauzeitenplan', text: 'Abgestimmt mit Bauleitung und Gewerken' },
      { titel: 'Verbindliches Angebot', text: 'Festpreis und Zeitvorgabe nach Besichtigung' },
    ],
    zielgruppen: [
      {
        titel: 'Bauunternehmen und Generalunternehmer',
        text: 'Grobreinigung zwischen den Gewerken und Feinreinigung vor der Abnahme – terminiert nach Ihrem Bauzeitenplan.',
      },
      {
        titel: 'Bauträger und Projektentwickler',
        text: 'Wohnungen und Gewerbeeinheiten übergabefertig für Käufer und Mieter – Einheit für Einheit, nach Ihrer Reihenfolge.',
      },
      {
        titel: 'Hausverwaltungen nach Sanierung',
        text: 'Nach Modernisierung oder Mieterwechsel mit Renovierung: Baustaub raus, Wohnung bezugsfertig.',
      },
      {
        titel: 'Gewerbe nach Umbau',
        text: 'Ladenbau, Büroumbau, neue Praxisräume: sauber zur Eröffnung, damit der Betrieb pünktlich starten kann.',
      },
      {
        titel: 'Private Bauherren',
        text: 'Nach dem Neubau oder der Renovierung im Eigenheim – vor dem Einzug einmal richtig sauber.',
      },
    ],
    umfang: {
      wir: [
        'Baugrobreinigung: Bauschmutz, Verpackungsreste und groben Staub besenrein entfernen',
        'Baustaub von Böden, Heizkörpern, Türen, Zargen und abwaschbaren Flächen',
        'Farb-, Mörtel- und Klebereste schonend von Flächen, Rahmen und Profilen',
        'Fenster, Rahmen und Fensterbänke innen und außen',
        'Sanitär- und Küchenbereiche übergabefertig',
        'Böden je nach Belag gesaugt und gewischt, auf Wunsch mit Grundreinigung',
      ],
      beiIhnen: [
        'Bauschutt und Container – klären wir vorab, Reststoffe entsorgen wir auf Wunsch',
        'Feinreinigung erst, wenn keine staubintensiven Arbeiten mehr anstehen',
        'Baumängel und Schäden – Auffälliges melden wir, beseitigen es aber nicht',
      ],
    },
    zeiten: {
      titel: 'Die richtige Reinigung zur richtigen Bauphase',
      text: 'Eine Feinreinigung, nach der noch geschliffen wird, ist verschenktes Geld. Deshalb planen wir die Reinigung in Stufen und richten uns nach Ihrem Bauzeitenplan.',
      punkte: [
        'Baugrobreinigung während der Bauphase',
        'Zwischenreinigung, bevor empfindliche Gewerke beginnen',
        'Bauendreinigung als Feinreinigung vor Abnahme und Übergabe',
        'Auf Wunsch Grund- oder Glasreinigung im Anschluss',
      ],
    },
    vertrauen: [
      {
        titel: 'Abgestimmt mit der Bauleitung',
        text: 'Termine nach Ihrem Bauzeitenplan, Absprachen direkt mit Bauleitung oder Bauherr.',
      },
      {
        titel: 'Verbindliche Zeitvorgabe',
        text: 'Im Angebot steht, wie lange wir brauchen – damit Sie die Übergabe sicher planen können.',
      },
      {
        titel: 'Ein fester Ansprechpartner',
        text: 'Eine Person für alle Reinigungsstufen, die Ihr Objekt von der Grob- bis zur Feinreinigung kennt.',
      },
      {
        titel: 'Schonend für neue Flächen',
        text: 'Farb-, Mörtel- und Klebereste entfernen wir so, dass neue Böden, Rahmen und Profile keinen Schaden nehmen.',
      },
    ],
    anfahrt: {
      titel: 'Baureinigung in ganz Neumünster',
      text: 'Von Bordesholm sind wir über das Bordesholmer Dreieck und die A7 schnell auf Ihrer Baustelle in Neumünster – in der Stadt, in den Gewerbegebieten und im Umland.',
      gruppen: [
        { titel: 'Innenstadt & Kernbezirke', orte: ['Innenstadt', 'Nord', 'Ost', 'Süd', 'West'] },
        { titel: 'Stadtteile', orte: ['Gadeland', 'Wittorf', 'Tungendorf', 'Einfeld', 'Faldera', 'Gartenstadt', 'Brachenfeld', 'Ruthenberg', 'Böcklersiedlung', 'Stör'] },
      ],
      umland: ['Bordesholm', 'Wasbek', 'Boostedt', 'Großenaspe', 'Groß Kummerfeld', 'Aukrug'],
    },
    ablauf: [
      {
        title: 'Kurze Anfrage',
        desc: 'Objektart, ungefähre Fläche, Bauphase und geplanter Übergabetermin genügen für den Anfang.',
      },
      {
        title: 'Besichtigung auf der Baustelle',
        desc: 'Kostenlos in Neumünster: Wir sehen uns Stand, Flächen und Verschmutzung an und klären, welche Reinigungsstufen nötig sind.',
      },
      {
        title: 'Festpreis mit Zeitvorgabe',
        desc: 'Ein verbindliches Angebot je Reinigungsstufe – mit Preis und Dauer.',
      },
      {
        title: 'Reinigung nach Bauplan',
        desc: 'Grobreinigung während der Bauphase, Feinreinigung, sobald die staubintensiven Arbeiten beendet sind.',
      },
      {
        title: 'Gemeinsame Abnahme',
        desc: 'Am Ende gehen wir die Flächen mit Ihnen durch – bereit für Übergabe oder Einzug.',
      },
    ],
    faqs: [
      {
        question: 'Was ist der Unterschied zwischen Grob- und Feinreinigung?',
        answer:
          'Die Baugrobreinigung entfernt während der Bauphase groben Schmutz, Reste und Staub, damit die nächsten Gewerke sauber arbeiten können. Die Feinreinigung ist die eigentliche Bauendreinigung: Sie macht das Objekt übergabe- oder bezugsfertig.',
      },
      {
        question: 'Wann sollte die Bauendreinigung erfolgen?',
        answer:
          'Nach Abschluss aller Gewerke, sobald keine staubintensiven Arbeiten mehr anstehen – sonst ist die Feinreinigung gleich wieder hin.',
      },
      {
        question: 'Entfernen Sie auch Farb- und Mörtelreste?',
        answer:
          'Ja, wir entfernen Farb-, Mörtel- und Klebereste schonend von Flächen, Rahmen und Profilen.',
      },
      {
        question: 'Sind die Fenster inklusive?',
        answer:
          'Fenster, Rahmen und Fensterbänke gehören zur Bauendreinigung. Was genau dazugehört, steht im Angebot.',
      },
      {
        question: 'Kümmern Sie sich um den Bauschutt?',
        answer:
          'Die Entsorgung von Reststoffen organisieren wir auf Wunsch. Bauschutt und Containerstellung klären wir vorab mit Ihnen.',
      },
      {
        question: 'Reinigen Sie auch einzelne Wohnungen nach der Renovierung?',
        answer:
          'Ja. Auch einzelne Wohnungen oder Gewerbeeinheiten reinigen wir nach Renovierung oder Umbau bezugsfertig.',
      },
      {
        question: 'Was kostet die Bauendreinigung in Neumünster?',
        answer:
          'Das hängt von Fläche, Verschmutzung und Reinigungsstufen ab. Nach einer kostenlosen Besichtigung erhalten Sie ein Festpreis-Angebot mit verbindlicher Zeitvorgabe.',
      },
    ],
    ergaenzungen: [
      { serviceId: 'grundreinigung', text: 'Böden nach dem Bau gründlich reinigen und für die Nutzung einpflegen.' },
      { serviceId: 'glasreinigung', text: 'Glasfronten und Fenster nach dem Bau streifenfrei – auch im festen Turnus danach.' },
      { serviceId: 'unterhaltsreinigung', text: 'Nach dem Einzug nahtlos in die laufende Reinigung übergehen.' },
    ],
    texte: {
      zielgruppenLabel: 'Für Ihr Bauprojekt',
      zielgruppenTitel: 'Baureinigung für jedes Projekt in Neumünster',
      zielgruppenText: 'Vom Mehrfamilienhaus bis zum Ladenumbau – wir planen nach Ihrem Bauablauf.',
      grenzenTitel: 'Das klären wir vorab',
      grenzenText: 'Damit die Reinigung zum Bauablauf passt.',
      ablaufTitel: 'So läuft Ihre Bauendreinigung',
      vertrauenLabel: 'Verlässlichkeit',
      ergaenzungTitel: 'Nach dem Bau',
      ctaText:
        'Wir sehen uns Ihre Baustelle in Neumünster kostenlos an und erstellen Ihnen ein Festpreis-Angebot mit verbindlicher Zeitvorgabe.',
    },
    icons: {
      zielgruppen: [HardHat, Building2, Home, Store, Users],
      vertrauen: [CalendarCheck, ClipboardCheck, UserCheck, ShieldCheck],
    },
  },

  // ---- Glasreinigung · Kiel ------------------------------------------------------------
  {
    serviceId: 'glasreinigung',
    citySlug: 'kiel',
    leistung: 'Glasreinigung',
    ort: 'Kiel',
    seo: {
      title: 'Glasreinigung Kiel für Büros & Gewerbe | KlarWerk Service',
      description:
        'Glas- und Fensterreinigung in Kiel für Büros, Praxen, Geschäfte und Autohäuser: streifenfrei innen und außen, im Turnus oder einmalig. Jetzt anfragen.',
      keywords:
        'Glasreinigung Kiel, Fensterreinigung Kiel, Fensterputzer Kiel, Schaufensterreinigung Kiel, Glasreinigung Büro Kiel, Glasreinigung Kronshagen, Glasreinigung Altenholz',
    },
    h1: 'Glasreinigung in Kiel',
    intro:
      'An der Förde zeigt sich jede Schliere: Wind und Seeluft legen auf Fenster und Glasfronten schnell einen Film, und im tief stehenden Licht fällt er sofort auf. KlarWerk Service reinigt Fenster und Glasflächen in Kiel streifenfrei, innen und außen, im festen Turnus oder einmalig zum Anlass – für Büros, Praxen, Geschäfte, Autohäuser und Wohnanlagen. Unser Sitz in Bordesholm liegt nur rund 20 Kilometer südlich von Kiel.',
    bild: {
      // gleiches Foto wie auf /leistungen/glasreinigung (kommt aus services.ts)
      alt: 'Streifenfreie Fenster – Glasreinigung in Kiel durch KlarWerk Service',
    },
    eckdaten: [
      { titel: 'Innen und außen', text: 'Scheiben, auf Wunsch mit Rahmen und Fensterbänken' },
      { titel: 'Fester Turnus oder einmalig', text: 'Regelmäßig über das Jahr oder zum Anlass' },
      { titel: 'Ein Ansprechpartner', text: 'Termine abgestimmt, auch mit Ihrer laufenden Reinigung' },
    ],
    zielgruppen: [
      {
        titel: 'Büros und Verwaltungen',
        text: 'Mehr Tageslicht am Arbeitsplatz und ein gepflegter Eindruck für Besucher: Bürofenster, Glastüren und Glaswände im festen Rhythmus – abgestimmt auf Ihre Arbeitszeiten.',
      },
      {
        titel: 'Praxen',
        text: 'Praxisfenster, Eingangstür und Glas im Empfang – gereinigt außerhalb der Sprechzeiten, damit Wartezimmer und Behandlung ungestört bleiben.',
      },
      {
        titel: 'Geschäfte und Schaufenster',
        text: 'In der Innenstadt und in den Einkaufsstraßen entscheidet das Schaufenster, ob jemand stehen bleibt. Scheiben und Eingangstür reinigen wir vor Ladenöffnung oder nach Geschäftsschluss.',
      },
      {
        titel: 'Autohäuser und Ausstellungsflächen',
        text: 'Große Glasfronten zeigen, was drinnen steht. Wir stimmen die Termine so ab, dass Ausstellung und Verkauf weiterlaufen.',
      },
      {
        titel: 'Wohnanlagen und Hausverwaltungen',
        text: 'Treppenhausfenster, Haustüren und Glas in Gemeinschaftsbereichen – planbar im Turnus, mit einem Ansprechpartner für die ganze Anlage.',
      },
    ],
    umfang: {
      wir: [
        'Fensterscheiben innen und außen, streifenfrei',
        'Rahmen, Falze und Fensterbänke auf Wunsch',
        'Schaufenster, Eingangstüren und Glasvordächer, soweit sicher erreichbar',
        'Glastüren, Glaswände und Trennwände im Innenbereich',
        'Spiegel und Glas in Empfang, Treppenhaus und Sanitär',
        'Höher gelegene Flächen mit Teleskop- und Leitersystemen',
      ],
      beiIhnen: [
        'Fensterbänke freiräumen, Deko und Pflanzen zur Seite stellen',
        'Fassadenflächen, die Hubsteiger oder Gerüst brauchen – nur nach Absprache',
        'Beschädigte oder undichte Fenster – Auffälliges melden wir, reparieren aber nicht',
      ],
    },
    zeiten: {
      titel: 'Glasreinigung im passenden Rhythmus',
      text: 'Seeluft und Wind an der Förde, Pollen im Frühjahr, Regen und Spritzwasser im Herbst: Wie oft sich eine Glasreinigung lohnt, hängt von Lage, Laufkundschaft und Witterung ab. Ein Schaufenster an einer belebten Straße braucht mehr Pflege als ein Bürofenster zum Hof. Den Rhythmus legen wir nach der Besichtigung gemeinsam fest.',
      punkte: [
        'Schaufenster und Eingangstüren in kurzen Abständen',
        'Bürofenster im festen Turnus über das Jahr',
        'Einmalig nach dem Winter, nach Bauarbeiten oder vor einem Anlass',
        'Früh morgens vor Ladenöffnung oder nach Geschäftsschluss',
      ],
    },
    vertrauen: [
      {
        titel: 'Streifenfrei mit Profi-Technik',
        text: 'Professionelle Wischtechnik statt Haushaltsmittel – damit die Scheibe auch im Gegenlicht klar bleibt.',
      },
      {
        titel: 'Ein fester Ansprechpartner',
        text: 'Eine Person für Termine, Rückfragen und Kontrollen. Sie müssen niemandem Ihr Objekt zweimal erklären.',
      },
      {
        titel: 'Sicher in der Höhe',
        text: 'Teleskop- und Leitersysteme für höher gelegene Fenster. Was nur mit Hubsteiger oder Gerüst geht, klären wir vorab offen.',
      },
      {
        titel: 'Kombinierbar',
        text: 'Glasreinigung lässt sich mit Büro-, Praxis- oder Unterhaltsreinigung verbinden: ein Plan, ein Ansprechpartner, abgestimmte Termine.',
      },
    ],
    anfahrt: {
      titel: 'Glasreinigung in ganz Kiel',
      text: 'Von Bordesholm sind wir über die A215 schnell in Kiel – an den Büro- und Praxisstandorten auf dem Westufer, bei den Geschäften in der Innenstadt und in den Gewerbegebieten auf dem Ostufer. Kurze Wege machen Besichtigung, festen Turnus und kurzfristige Termine einfach.',
      gruppen: [
        { titel: 'Kiel Westufer', orte: ['Innenstadt', 'Wik', 'Ravensberg', 'Brunswik', 'Südfriedhof', 'Schreventeich', 'Suchsdorf', 'Hassee', 'Mettenhof', 'Friedrichsort'] },
        { titel: 'Kiel Ostufer', orte: ['Wellsee', 'Gaarden-Ost', 'Neumühlen-Dietrichsdorf'] },
      ],
      umland: ['Kronshagen', 'Altenholz', 'Molfsee', 'Flintbek', 'Schwentinental', 'Heikendorf'],
    },
    ablauf: [
      {
        title: 'Kurze Anfrage',
        desc: 'Art des Objekts, ungefähre Zahl und Größe der Fenster – ein paar Fotos genügen für eine erste Einschätzung.',
      },
      {
        title: 'Besichtigung vor Ort',
        desc: 'Kostenlos in Kiel: Wir sehen uns Glasflächen, Höhen und Zugänge an und klären, was innen und außen dazugehört.',
      },
      {
        title: 'Festpreis-Angebot',
        desc: 'Ein fester Preis je Termin oder für den Turnus – Sie wissen vorher genau, was Sie zahlen.',
      },
      {
        title: 'Erster Termin',
        desc: 'Zu einer Zeit, die Ihren Betrieb nicht stört: vor Öffnung, nach Feierabend oder am Wochenende nach Absprache.',
      },
      {
        title: 'Fester Turnus',
        desc: 'Auf Wunsch kommen wir regelmäßig wieder – Ihr Ansprechpartner hält die Termine im Blick.',
      },
    ],
    faqs: [
      {
        question: 'Reinigen Sie Fenster in ganz Kiel?',
        answer:
          'Ja. Wir sind auf dem Westufer und dem Ostufer unterwegs und im Umland, etwa in Kronshagen, Altenholz, Molfsee und Schwentinental. Unser Sitz in Bordesholm liegt nur rund 20 Kilometer südlich von Kiel.',
      },
      {
        question: 'Wie oft sollten Fenster in Kiel gereinigt werden?',
        answer:
          'Das hängt von Lage und Nutzung ab. Nahe am Wasser und an viel befahrenen Straßen setzen sich Fenster schneller zu, Schaufenster und Eingangstüren brauchen kurze Abstände, Bürofenster meist einen festen Turnus über das Jahr. Nach der Besichtigung empfehlen wir einen passenden Rhythmus.',
      },
      {
        question: 'Reinigen Sie auch Fenster in oberen Etagen?',
        answer:
          'Ja, soweit sie mit Teleskop- und Leitersystemen sicher erreichbar sind. Flächen, die einen Hubsteiger oder ein Gerüst brauchen, besprechen wir vorab mit Ihnen.',
      },
      {
        question: 'Gehören Rahmen und Fensterbänke dazu?',
        answer:
          'Auf Wunsch ja. Rahmen, Falze und Fensterbänke reinigen wir mit, wenn das im Angebot so vereinbart ist.',
      },
      {
        question: 'Können Sie außerhalb der Öffnungszeiten reinigen?',
        answer:
          'Ja. Schaufenster und Eingänge reinigen wir gern vor Ladenöffnung oder nach Geschäftsschluss, Praxisfenster außerhalb der Sprechzeiten.',
      },
      {
        question: 'Lässt sich die Glasreinigung mit der Büro- oder Praxisreinigung verbinden?',
        answer:
          'Ja. Glas innen kann Teil der laufenden Reinigung sein, Fenster außen kommen im eigenen Turnus dazu – mit einem gemeinsamen Plan und einem Ansprechpartner.',
      },
      {
        question: 'Was kostet die Glasreinigung in Kiel?',
        answer:
          'Das hängt von Anzahl, Größe und Erreichbarkeit der Glasflächen ab. Nach einer kostenlosen Besichtigung erhalten Sie ein Festpreis-Angebot – einmalig oder für den Turnus.',
      },
    ],
    ergaenzungen: [
      { serviceId: 'bueroreinigung', text: 'Büros, Teeküchen und Sanitärräume in Kiel aus einer Hand mit Ihren Fenstern.' },
      { serviceId: 'praxisreinigung', text: 'Praxisräume nach Hygieneplan, außerhalb der Sprechzeiten – Glas gleich mit eingeplant.' },
      { serviceId: 'unterhaltsreinigung', text: 'Glas innen gleich in die laufende Reinigung einplanen – mit festem Rhythmus.' },
    ],
    texte: {
      zielgruppenLabel: 'Für Ihr Objekt',
      zielgruppenTitel: 'Glasflächen in Kiel – je nach Objekt anders',
      zielgruppenText: 'Ein Schaufenster braucht einen anderen Rhythmus als ein Treppenhausfenster. Wir planen nach Ihrem Objekt.',
      grenzenTitel: 'Das klären wir vorab',
      grenzenText: 'Damit am Termin nichts überrascht.',
      ablaufTitel: 'So läuft Ihre Glasreinigung',
      vertrauenLabel: 'Qualität',
      ergaenzungTitel: 'Rund um Ihr Objekt aus einer Hand',
      ctaText:
        'Wir sehen uns Ihre Glasflächen in Kiel kostenlos an und erstellen Ihnen ein Festpreis-Angebot – einmalig oder im festen Turnus.',
    },
    icons: {
      zielgruppen: [Building2, Stethoscope, Store, Car, Home],
      vertrauen: [Sparkles, UserCheck, ShieldCheck, CalendarCheck],
    },
  },

  // ---- Büroreinigung · Rendsburg -------------------------------------------------------
  {
    serviceId: 'bueroreinigung',
    citySlug: 'rendsburg',
    leistung: 'Büroreinigung',
    ort: 'Rendsburg',
    seo: {
      title: 'Büroreinigung Rendsburg nach Feierabend | KlarWerk Service',
      description:
        'Büroreinigung in Rendsburg für Kanzleien, Verwaltungen und Betriebe am Kanal: außerhalb der Arbeitszeit, fester Ansprechpartner, eingearbeitete Vertretung.',
      keywords:
        'Büroreinigung Rendsburg, Reinigungsfirma Büro Rendsburg, Büroreinigung Kanzlei Rendsburg, Unterhaltsreinigung Büro Rendsburg, Büroreinigung Büdelsdorf, Büroreinigung Osterrönfeld, Büroreinigung Fockbek',
    },
    h1: 'Büroreinigung in Rendsburg',
    intro:
      'Rendsburg ist Kreisstadt und Verwaltungssitz, Standort von Kanzleien und Dienstleistern und zugleich Industrie- und Hafenstadt am Nord-Ostsee-Kanal. Entsprechend verschieden sind die Büros: vom Altbau in der Altstadt bis zum Bürotrakt im Gewerbegebiet. KlarWerk Service reinigt Büros in Rendsburg nach festem Plan, außerhalb Ihrer Arbeitszeiten und mit einem festen Ansprechpartner, der Ihre Räume kennt. Von Bordesholm aus sind wir über die A7 schnell bei Ihnen.',
    bild: {
      // gleiches Foto wie auf /leistungen/bueroreinigung (kommt aus services.ts)
      alt: 'Saubere Büroräume – Büroreinigung in Rendsburg durch KlarWerk Service',
    },
    eckdaten: [
      { titel: 'Außerhalb der Arbeitszeit', text: 'Nach Büroschluss, früh morgens oder an festen Wochentagen' },
      { titel: 'Ein fester Ansprechpartner', text: 'Für Plan, Schlüssel, Rückfragen und Kontrollen' },
      { titel: 'Vertretung, die Ihr Büro kennt', text: 'Bei Urlaub und Krankheit läuft die Reinigung weiter' },
    ],
    zielgruppen: [
      {
        titel: 'Kanzleien und Steuerbüros',
        text: 'Mandantengespräche, Akten auf dem Tisch, Diskretion als Pflicht: Wir reinigen freigeräumte Flächen, Böden, Besprechungsraum und Empfang – Unterlagen bleiben, wo sie liegen.',
      },
      {
        titel: 'Verwaltungen und Dienstleister',
        text: 'Büroetagen mit Empfang, Besprechungsräumen und Teeküche – gereinigt, bevor der erste Termin beginnt, und mit festen Zeiten für Küche und Sanitär.',
      },
      {
        titel: 'Büros in Industrie- und Hafenbetrieben',
        text: 'Bürotrakt, Sozial- und Pausenräume, Umkleiden und Sanitär am Kanal und in den Gewerbegebieten: Bereiche, die von vielen Menschen genutzt werden und eine feste Routine brauchen.',
      },
      {
        titel: 'Autohäuser mit Verkaufsräumen',
        text: 'Verkaufsbüros, Kundenbereich und Sanitär im Autohaus – abgestimmt auf Öffnungszeiten und Ausstellung.',
      },
      {
        titel: 'Kleine Büros',
        text: 'Wenige Arbeitsplätze, überschaubare Fläche: Oft reichen ein oder zwei feste Wochentage – mit genauso festem Ansprechpartner.',
      },
    ],
    umfang: {
      wir: [
        'Arbeitsplätze: freigeräumte Schreibtische, Ablagen und Fensterbänke',
        'Böden in allen Räumen – Hartböden gewischt, Teppichböden gesaugt',
        'Teeküche, Sozial- und Pausenräume',
        'Sanitärräume und Umkleiden gründlich und hygienisch',
        'Kontaktflächen wie Türklinken, Lichtschalter und Handläufe',
        'Empfang, Flure und Besprechungsräume, Papierkörbe und Mülltrennung',
        'Glas innen: Glastüren, Glaswände und Spiegel',
      ],
      beiIhnen: [
        'Akten, Unterlagen und volle Schreibtische – die räumen wir nicht um',
        'Lager-, Werkstatt- und Produktionsflächen – dafür gibt es ein eigenes Angebot',
        'Server- und Technikräume nur nach Absprache und Einweisung',
      ],
    },
    zeiten: {
      titel: 'Reinigung, die zu Ihrem Betrieb passt',
      text: 'Ob klassische Bürozeiten, Publikumsverkehr oder Schichtbetrieb: Wir reinigen dann, wenn die Räume frei sind. Wie oft, hängt von Fläche, Mitarbeiterzahl und Kundenverkehr ab – das legen wir nach der Besichtigung gemeinsam fest.',
      punkte: [
        'Abends nach Büroschluss',
        'Früh morgens vor Arbeitsbeginn',
        'Im Schichtbetrieb zwischen den Schichten, nach Absprache',
        'An festen Wochentagen statt täglich, wenn das reicht',
      ],
    },
    vertrauen: [
      {
        titel: 'Ein fester Ansprechpartner',
        text: 'Pro Objekt eine Person, die Ihre Räume und Wünsche kennt – auch wenn Büro, Sozialräume und Umkleiden dazugehören.',
      },
      {
        titel: 'Regelmäßige Qualitätskontrollen',
        text: 'Wir prüfen das Ergebnis vor Ort und stimmen Anpassungen mit Ihnen ab, bevor Ihnen etwas auffällt.',
      },
      {
        titel: 'Eingearbeitete Vertretung',
        text: 'Bei Urlaub und Krankheit übernimmt jemand, der Ihr Objekt und den Reinigungsplan kennt. Keine Lücke, keine neue Einweisung.',
      },
      {
        titel: 'Schlüssel in guten Händen',
        text: 'Schlüssel, Transponder und Alarmregelung halten wir vor dem ersten Einsatz schriftlich fest.',
      },
    ],
    anfahrt: {
      titel: 'Büroreinigung in ganz Rendsburg',
      text: 'Von Bordesholm sind wir über die A7 schnell in Rendsburg – in der Altstadt und in Neuwerk, in den Büro- und Wohnlagen nördlich der Eider und in den Gewerbegebieten am Kanal, ebenso in Büdelsdorf, Osterrönfeld und Fockbek. Kurze Wege machen Besichtigung, Kontrollen und kurzfristige Absprachen einfach.',
      gruppen: [
        { titel: 'Nördlich der Eider', orte: ['Rendsburg-Nord', 'Mastbrook', 'Rotenhof', 'Kronwerk', 'Duten', 'Seemühlen', 'Suhmsheide'] },
        { titel: 'An Eider und Kanal', orte: ['Altstadt', 'Neuwerk', 'Parksiedlung', 'Nobiskrug', 'Hoheluft', 'Schleife', 'Hochfeld', 'Kreishafen', 'Rendsburg-Süd', 'Marienhöh'] },
      ],
      umland: ['Büdelsdorf', 'Osterrönfeld', 'Westerrönfeld', 'Schacht-Audorf', 'Fockbek', 'Alt Duvenstedt', 'Rickert', 'Nübbel'],
    },
    ablauf: [
      {
        title: 'Kurze Anfrage',
        desc: 'Per Telefon, E-Mail oder Formular: Art des Büros, ungefähre Fläche und Ihre Wunschzeiten genügen für den Anfang.',
      },
      {
        title: 'Besichtigung vor Ort',
        desc: 'Kostenlos in Rendsburg: Wir gehen Büros, Sozialräume, Sanitär und Bodenbeläge gemeinsam durch und klären, was wie oft gereinigt wird.',
      },
      {
        title: 'Festpreis-Angebot',
        desc: 'Mit klarem Leistungsverzeichnis nach Bereichen und Rhythmus – Sie sehen genau, was Sie bekommen.',
      },
      {
        title: 'Start mit Einweisung',
        desc: 'Zutritt, Alarmregelung, Zeiten und Zuständigkeiten halten wir vor dem ersten Einsatz schriftlich fest.',
      },
      {
        title: 'Laufende Betreuung',
        desc: 'Fester Ansprechpartner, regelmäßige Kontrollen und eine eingearbeitete Vertretung bei Urlaub oder Krankheit.',
      },
    ],
    faqs: [
      {
        question: 'Reinigen Sie Büros in ganz Rendsburg?',
        answer:
          'Ja. Wir betreuen Büros in allen Stadtteilen von Rendsburg und in den Nachbargemeinden, etwa in Büdelsdorf, Osterrönfeld, Westerrönfeld und Fockbek. Von unserem Sitz in Bordesholm sind wir über die A7 schnell vor Ort.',
      },
      {
        question: 'Reinigen Sie auch Sozialräume und Umkleiden im Betrieb?',
        answer:
          'Ja. Sozial- und Pausenräume, Teeküchen, Umkleiden und Sanitärbereiche nehmen wir in den Reinigungsplan auf. Lager-, Werkstatt- und Produktionsflächen bieten wir getrennt an.',
      },
      {
        question: 'Wann wird gereinigt?',
        answer:
          'Außerhalb Ihrer Arbeitszeiten: abends, früh morgens oder – bei Schichtbetrieb – nach Absprache zwischen den Schichten.',
      },
      {
        question: 'Wer reinigt bei Urlaub oder Krankheit?',
        answer:
          'Eine eingearbeitete Vertretung, die Ihr Objekt und den Reinigungsplan kennt. Ihr fester Ansprechpartner bleibt derselbe.',
      },
      {
        question: 'Wie läuft das mit Schlüssel und Alarmanlage?',
        answer:
          'Schlüssel oder Transponder behandeln wir vertraulich. Übergabe, Zutrittszeiten und Alarmregelung halten wir vor dem ersten Einsatz schriftlich fest.',
      },
      {
        question: 'Übernehmen Sie auch die Fenster?',
        answer:
          'Glastüren, Glaswände und Spiegel innen gehören zur laufenden Büroreinigung. Fenster innen und außen reinigen wir auf Wunsch als eigenen Termin im Rahmen der Glasreinigung.',
      },
      {
        question: 'Was kostet die Büroreinigung in Rendsburg?',
        answer:
          'Das hängt von Fläche, Bodenbelägen, Ausstattung und Rhythmus ab. Nach einer kostenlosen Besichtigung erhalten Sie ein Festpreis-Angebot mit klarem Leistungsverzeichnis.',
      },
    ],
    ergaenzungen: [
      { serviceId: 'glasreinigung', text: 'Bürofenster, Glastüren und Eingang – im festen Turnus, innen und außen.' },
      { serviceId: 'unterhaltsreinigung', text: 'Weitere Bereiche wie Treppenhaus, Lager oder Verkaufsfläche nach festem Plan.' },
      { serviceId: 'grundreinigung', text: 'Böden und Flächen einmal gründlich aufarbeiten – vor dem Einzug oder zum Jahreswechsel.' },
    ],
    texte: {
      zielgruppenLabel: 'Für Ihr Büro',
      zielgruppenTitel: 'Büros in Rendsburg – von der Altstadt bis zum Gewerbegebiet am Kanal',
      zielgruppenText: 'Wir richten Reinigungsplan und Rhythmus nach Ihrem Betrieb aus – nicht nach einer Standardliste.',
      grenzenTitel: 'Das bleibt bei Ihnen',
      grenzenText: 'Klare Absprachen schützen Ihre Unterlagen, Ihre Technik und Ihre Abläufe.',
      ablaufTitel: 'So starten wir in Ihrem Büro',
      vertrauenLabel: 'Verlässlichkeit',
      ergaenzungTitel: 'Alles für Ihren Betrieb aus einer Hand',
      ctaText:
        'Wir kommen zur kostenlosen Besichtigung in Ihr Büro in Rendsburg und erstellen Ihnen ein Festpreis-Angebot mit klarem Leistungsverzeichnis.',
    },
    icons: {
      zielgruppen: [Scale, Building2, Warehouse, Car, Briefcase],
      vertrauen: [UserCheck, ClipboardCheck, Users, KeyRound],
    },
  },
  // ── Praxisreinigung Rendsburg (Entwurf Mira, 31.10.2026; Einsatzgebiet wie Büroreinigung Rendsburg) ──
  {
    serviceId: 'praxisreinigung',
    citySlug: 'rendsburg',
    leistung: 'Praxisreinigung',
    ort: 'Rendsburg',
    seo: {
      title: 'Praxisreinigung Rendsburg nach Feierabend | KlarWerk Service',
      description:
        'Praxisreinigung in Rendsburg für Arzt-, Zahnarzt- und Therapiepraxen: nach Ihrem Hygieneplan, außerhalb der Sprechzeiten, mit festem Ansprechpartner.',
      keywords:
        'Praxisreinigung Rendsburg, Reinigung Arztpraxis Rendsburg, Zahnarztpraxis Reinigung Rendsburg, Physiotherapie Reinigung Rendsburg, Praxisreinigung Büdelsdorf, Praxisreinigung Osterrönfeld',
    },
    h1: 'Praxisreinigung in Rendsburg',
    intro:
      'Rendsburg ist Kreisstadt und Versorgungszentrum für den Kreis Rendsburg-Eckernförde: Hausarzt- und Facharztpraxen in der Altstadt und in Neuwerk, Ärztehäuser und Therapiepraxen in den Wohnlagen nördlich der Eider, dazu Praxen in Büdelsdorf, Osterrönfeld und Fockbek. KlarWerk Service reinigt Praxen in Rendsburg nach Ihrem Hygieneplan, außerhalb der Sprechzeiten und mit einem festen Ansprechpartner, der Ihre Räume kennt. Von Bordesholm aus sind wir über die A7 in rund 30 Minuten bei Ihnen.',
    bild: {
      // gleiches Foto wie auf /leistungen/praxisreinigung (kommt aus services.ts)
      alt: 'Saubere Praxisräume – Praxisreinigung in Rendsburg durch KlarWerk Service',
    },
    eckdaten: [
      { titel: 'Außerhalb der Sprechzeiten', text: 'Abends, früh morgens oder am freien Nachmittag' },
      { titel: 'Nach Ihrem Hygieneplan', text: 'Bereiche, Mittel und Intervalle wie bei Ihnen festgelegt' },
      { titel: 'Fester Ansprechpartner', text: 'Auch bei Urlaub und Krankheit eine eingearbeitete Vertretung' },
    ],
    zielgruppen: [
      {
        titel: 'Hausarzt- und Facharztpraxen',
        text: 'Volles Wartezimmer, viel Laufverkehr am Empfang – in der Altstadt wie in den Praxen nördlich der Eider: Böden, Wartebereich und häufig berührte Flächen wie Türklinken, Tresen und Armlehnen werden bei jeder Reinigung gereinigt und nach Plan desinfiziert.',
      },
      {
        titel: 'Zahnarztpraxen',
        text: 'Behandlungszimmer mit Böden und Oberflächen rund um die Behandlungseinheit, dazu Rezeption, Wartebereich und Sanitär. Was am Gerät selbst passiert, bleibt bei Ihrem Praxisteam.',
      },
      {
        titel: 'Physio-, Ergo- und Logopädiepraxen',
        text: 'Therapieliegen, Ablagen, Trainingsflächen, Umkleiden und Duschen – Räume, die den ganzen Tag genutzt werden und dafür eine feste Routine brauchen.',
      },
      {
        titel: 'Psychotherapie und kleine Praxen',
        text: 'Wenige Räume, ruhige Atmosphäre, Diskretion zählt. Hier reicht oft eine Reinigung an festen Wochentagen statt täglich.',
      },
      {
        titel: 'MVZ, Praxisgemeinschaften und Ärztehäuser',
        text: 'Mehrere Praxen auf einer Etage oder in einem Haus: ein Ansprechpartner, ein abgestimmter Plan – und auf Wunsch Leistungsverzeichnis und Rechnung getrennt nach Praxis.',
      },
    ],
    umfang: {
      wir: [
        'Böden in allen Räumen – feucht gewischt, in sensiblen Bereichen desinfizierend',
        'Wartebereich, Empfang und Flure',
        'Kontaktflächen wie Türklinken, Lichtschalter, Tresen und Armlehnen',
        'Behandlungs- und Therapieräume: Liegen, Arbeitsflächen und Ablagen',
        'Sanitärbereiche für Patienten und Team',
        'Sozialraum und Teeküche, Papierkörbe und Hausmüll',
        'Glasflächen innen: Eingangstür, Glaswände und Spiegel',
      ],
      beiIhnen: [
        'Aufbereitung von Instrumenten und Medizinprodukten',
        'Desinfektion medizinischer Geräte nach Herstellervorgabe',
        'Patientenakten, Unterlagen und Bildschirme – die fassen wir nicht an',
      ],
    },
    zeiten: {
      titel: 'Reinigung, wenn Ihre Praxis leer ist',
      text: 'Patienten und Team sollen von der Reinigung nichts merken außer dem Ergebnis. Den Rhythmus – täglich oder an festen Wochentagen – legen wir nach Praxisgröße und Hygieneplan gemeinsam fest.',
      punkte: [
        'Abends nach der letzten Sprechstunde',
        'Früh morgens vor Praxisbeginn',
        'An Ihren freien Nachmittagen, etwa mittwochs oder freitags',
        'Grundreinigung der Böden in den Praxisferien',
      ],
    },
    vertrauen: [
      {
        titel: 'Ihr Hygieneplan ist die Vorgabe',
        text: 'Wir übernehmen Ihre Festlegungen zu Bereichen, Mitteln und Intervallen und setzen VAH-gelistete Desinfektionsmittel passend zum Einsatzbereich ein.',
      },
      {
        titel: 'Jede Reinigung dokumentiert',
        text: 'Sie sehen jederzeit, was wann gereinigt wurde – hilfreich für Ihre Hygienedokumentation und bei Begehungen.',
      },
      {
        titel: 'Diskret und verschwiegen',
        text: 'Wer in einer Praxis reinigt, sieht vieles. Auf Wunsch unterschreiben wir eine Verschwiegenheitsvereinbarung für Ihre Praxis.',
      },
      {
        titel: 'Kontrolle statt Hoffnung',
        text: 'Regelmäßige Qualitätskontrollen durch Ihren festen Ansprechpartner – Mängel werden behoben, bevor sie Ihnen auffallen.',
      },
    ],
    anfahrt: {
      titel: 'Praxisreinigung in ganz Rendsburg',
      text: 'Von Bordesholm sind wir über die A7 in rund 30 Minuten in Rendsburg – in der Altstadt und in Neuwerk, in den Wohn- und Praxislagen nördlich der Eider und ebenso in Büdelsdorf, Osterrönfeld und Fockbek. Kurze Wege machen Besichtigung, Kontrollen und kurzfristige Absprachen einfach.',
      gruppen: [
        { titel: 'Nördlich der Eider', orte: ['Rendsburg-Nord', 'Mastbrook', 'Rotenhof', 'Kronwerk', 'Duten', 'Seemühlen', 'Suhmsheide'] },
        { titel: 'An Eider und Kanal', orte: ['Altstadt', 'Neuwerk', 'Parksiedlung', 'Nobiskrug', 'Hoheluft', 'Schleife', 'Hochfeld', 'Kreishafen', 'Rendsburg-Süd', 'Marienhöh'] },
      ],
      umland: ['Büdelsdorf', 'Osterrönfeld', 'Westerrönfeld', 'Schacht-Audorf', 'Fockbek', 'Alt Duvenstedt', 'Rickert', 'Nübbel'],
    },
    ablauf: [
      {
        title: 'Kurze Anfrage',
        desc: 'Per Telefon, E-Mail oder Formular: Praxisart, ungefähre Raumzahl und Ihre Wunschzeiten genügen für den Anfang.',
      },
      {
        title: 'Besichtigung in Ihrer Praxis',
        desc: 'Kostenlos vor Ort in Rendsburg: Wir gehen Räume, Bodenbeläge und Ihren Hygieneplan gemeinsam durch.',
      },
      {
        title: 'Festpreis-Angebot',
        desc: 'Mit klarem Leistungsverzeichnis nach Räumen und Rhythmus, kalkuliert mit unserem eigenen Programm für die Gebäudereinigung.',
      },
      {
        title: 'Start mit Einweisung',
        desc: 'Schlüssel- und Alarmregelung, Zuständigkeiten und Reinigungsplan halten wir vor dem ersten Einsatz schriftlich fest.',
      },
      {
        title: 'Laufende Betreuung',
        desc: 'Fester Ansprechpartner, regelmäßige Kontrollen und eine eingearbeitete Vertretung bei Urlaub oder Krankheit.',
      },
    ],
    faqs: [
      {
        question: 'Reinigen Sie Praxen in ganz Rendsburg?',
        answer:
          'Ja. Wir betreuen Praxen in allen Stadtteilen von Rendsburg – nördlich der Eider ebenso wie in der Altstadt, in Neuwerk und am Kanal – sowie in den Nachbargemeinden, etwa in Büdelsdorf, Osterrönfeld, Westerrönfeld und Fockbek. Von unserem Sitz in Bordesholm sind wir über die A7 in rund 30 Minuten vor Ort.',
      },
      {
        question: 'Reinigen Sie während der Sprechzeiten?',
        answer:
          'In der Regel nicht. Wir reinigen abends nach der letzten Sprechstunde, früh morgens vor Praxisbeginn oder an Ihren freien Nachmittagen. Ob täglich oder an festen Wochentagen, richtet sich nach Ihrer Praxisgröße und Ihrem Hygieneplan.',
      },
      {
        question: 'Arbeiten Sie nach unserem Hygieneplan?',
        answer:
          'Ja. Wir übernehmen die Vorgaben Ihres Hygieneplans zu Bereichen, Mitteln und Intervallen, setzen VAH-gelistete Desinfektionsmittel ein und dokumentieren jede Reinigung nachvollziehbar.',
      },
      {
        question: 'Wer reinigt bei Urlaub oder Krankheit?',
        answer:
          'Eine eingearbeitete Vertretung, die Ihre Praxis und den Reinigungsplan kennt. Ihr fester Ansprechpartner bleibt derselbe – Sie müssen nichts neu erklären.',
      },
      {
        question: 'Übernehmen Sie auch die Aufbereitung von Instrumenten?',
        answer:
          'Nein. Die Aufbereitung von Medizinprodukten und die Desinfektion medizinischer Geräte bleiben bei Ihrem Praxisteam. Wir reinigen und desinfizieren Böden, Oberflächen, Kontaktflächen und Sanitärbereiche.',
      },
      {
        question: 'Wie gehen Sie mit Patientendaten um?',
        answer:
          'Diskret: Akten, Unterlagen und Bildschirme fassen wir nicht an. Auf Wunsch unterschreiben wir eine Verschwiegenheitsvereinbarung für Ihre Praxis.',
      },
      {
        question: 'Was kostet die Praxisreinigung in Rendsburg?',
        answer:
          'Das hängt von Praxisgröße, Raumanzahl, Bodenbelägen und Reinigungsrhythmus ab. Nach einer kostenlosen Besichtigung in Ihrer Praxis erhalten Sie ein Festpreis-Angebot mit klarem Leistungsverzeichnis – ohne versteckte Kosten.',
      },
    ],
    ergaenzungen: [
      { serviceId: 'glasreinigung', text: 'Praxisfenster, Eingangstür und Praxisschild – streifenfrei, innen und außen.' },
      { serviceId: 'grundreinigung', text: 'Böden gründlich reinigen und neu einpflegen, ideal in den Praxisferien.' },
      { serviceId: 'bueroreinigung', text: 'Für Büro- und Verwaltungsflächen im selben Haus – unsere Büroreinigung in Rendsburg.' },
    ],
    texte: {
      zielgruppenLabel: 'Für Ihre Praxis',
      zielgruppenTitel: 'Jede Praxis in Rendsburg braucht etwas anderes',
      zielgruppenText: 'Wir richten Reinigungsplan und Rhythmus nach Ihrer Praxisart aus – nicht nach einer Standardliste.',
      grenzenTitel: 'Das bleibt bei Ihrem Praxisteam',
      grenzenText: 'Klare Grenzen schützen Patienten, Geräte und Ihre Haftung.',
      ablaufTitel: 'So starten wir in Ihrer Praxis',
      vertrauenLabel: 'Hygiene & Vertrauen',
      ergaenzungTitel: 'Alles für Ihre Praxis aus einer Hand',
      ctaText:
        'Wir kommen zur kostenlosen Besichtigung in Ihre Praxis in Rendsburg und erstellen Ihnen ein Festpreis-Angebot mit klarem Leistungsverzeichnis.',
    },
    icons: {
      zielgruppen: [Stethoscope, Smile, Activity, Brain, Building2],
      vertrauen: [ClipboardCheck, FileText, Lock, UserCheck],
    },
  },
];

export function getLokaleSeite(serviceId: string, citySlug: string): LokaleSeite | undefined {
  return lokaleSeiten.find((s) => s.serviceId === serviceId && s.citySlug === citySlug);
}

export function lokaleSeitenFuerStadt(citySlug: string): LokaleSeite[] {
  return lokaleSeiten.filter((s) => s.citySlug === citySlug);
}

export function lokalerPfad(seite: Pick<LokaleSeite, 'serviceId' | 'citySlug'>): string {
  return `/leistungen/${seite.serviceId}/${seite.citySlug}`;
}
