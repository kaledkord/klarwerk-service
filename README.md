# KlarWerk Service — Website & KlarWerk Kalkulation

Dieses Repository enthält zwei **voneinander getrennte** Dinge:

1. **Website** (`src/pages`, `src/components`, …) — die öffentliche
   KlarWerk-Service-Website. Sie ist und bleibt von der Kalkulations-App
   **vollständig unberührt**: kein Link, keine Route, kein App-Code im
   Website-Build.
2. **KlarWerk Kalkulation** (`src/kalkulation`) — die private Kalkulations-,
   Angebots-, Objektmanagement- und Nachkalkulationssoftware für die
   Gebäudereinigung. Sie wird als **eigenständige Einzeldatei** gebaut und
   läuft komplett offline im Browser — ohne Server, ohne Installation,
   ohne Verbindung zur Website.

---

## KlarWerk Kalkulation — Nutzung (Standalone)

```bash
npm install
npm run build:kalkulation
# → dist-kalkulation/KlarWerk-Kalkulation.html  (eine einzige Datei, ~0,9 MB)
```

Die Datei `KlarWerk-Kalkulation.html` einfach auf den eigenen Rechner
kopieren (z. B. Desktop oder Dokumente) und **per Doppelklick öffnen** —
sie läuft in jedem modernen Browser (Chrome, Edge, Firefox), auch ohne
Internet.

**Wichtig zur Datenhaltung:**

- Alle Daten (Kunden, Objekte, Kalkulationen, Einstellungen) werden
  automatisch **im Browser des jeweiligen Rechners** gespeichert
  (localStorage) — nichts verlässt das Gerät.
- Regelmäßig sichern: *Einstellungen → Daten → „Daten exportieren“*
  erzeugt eine JSON-Datei, die sich jederzeit (auch auf einem anderen
  Rechner oder nach einem Browser-Wechsel) wieder importieren lässt.
- Beim ersten Start sind realistische Beispieldaten geladen; sie sind
  vollständig editier- und löschbar (*Einstellungen → Daten*).

Zum Entwickeln an der App: `npm run dev:kalkulation` und
`http://localhost:5173/kalkulation-standalone.html` öffnen.
(`npm run dev` startet nur die Website — sie enthält die App nicht.)

### Module

| Modul | Beschreibung |
| --- | --- |
| Dashboard | Begrüßung, Unternehmenskennzahlen, aktuelle Kalkulationen, Wirtschaftlichkeitswarnungen |
| Schnellkalkulation | 7 Eingaben → sofortiger Entwurf → Übernahme als Profi-Kalkulation |
| Profi-Wizard | Geführte Kalkulation in 6 Schritten mit Objektstruktur-Übernahme |
| Kalkulations-Workspace | Zentrale Leistungstabelle, Kosten, Preisstrategien, Szenarien, Nachkalkulation, Angebot |
| Kunden & Objekte | Kundenakten mit Kennzahlen; Objekte mit Gebäude → Etage → Raum inkl. Bodenart und Faktoren |
| Bibliothek | ~70 Leistungen mit Richt-Leistungswerten, Turnusse, Material, Maschinen, lernende Kalkulation |
| Angebotsgenerator | Kundenangebot ohne interne Kosten, Turnus je Einzelleistung, PDF über den Druckdialog |
| Einstellungen | Alle Kennzahlen zentral: Margen, AG-Kosten, Gemeinkosten, Fahrt, Faktoren, KI-Budget, Datenexport |
| KI-Assistent | Analyse von Freitext-Anfragen → geprüfter Kalkulationsentwurf (lokale Analyse eingebaut; volle Gemini-KI optional) |

### Kernprinzip: Jede Leistung hat ihren eigenen Turnus

Jede Zeile der Kalkulation (`CalcLine`) trägt ihren **eigenen** Turnus,
eigene Leistungswerte, Faktoren und Kosten. Ein Büro kann gleichzeitig
enthalten: Saugen 2× wöchentlich, Feuchtwischen 1× wöchentlich,
Sockelleisten 1× monatlich — jede Position wird einzeln in Monatsstunden
und Kosten umgerechnet und erst dann zur Objektkalkulation summiert.
Das Angebot weist den Turnus jeder Einzelleistung aus und fasst niemals
pauschal zusammen.

### Berechnungslogik (zentral in `src/kalkulation/lib/engine/`)

```
Durchführungen/Monat   = Turnus-Umrechnung (z. B. 2×/Woche → 2 × 52 ÷ 12 = 8,667)
Effektiver Leistungswert = Standardwert × Faktoren (Verschmutzung, Frequentierung,
                           Möblierung, Zugänglichkeit, Hygiene) — oder manuell (gekennzeichnet)
Zeit je Durchführung   = Menge ÷ effektiver Leistungswert
Monatsstunden          = Zeit je Durchführung × Durchführungen/Monat
Personalkosten         = Monatsstunden × AG-Stundensatz × (1 + Positionszuschlag)
AG-Stundensatz         = Stundenlohn × (1 + Σ Arbeitgeberanteile)   (15,00 € → 22,50 € bei 50 %)
Fahrtkosten            = km × 2 × Fahrten × €/km + Fahrzeit × AG-Satz (optional)
Gemeinkosten           = Gemeinkostensatz/h × Monatsstunden (Satz = Σ Gemeinkosten ÷ produktive Stunden)
Risiko                 = Risikosatz × (Personal + Material + Maschinen + Fahrt + GK)
Selbstkosten           = Summe aller Kostenblöcke
Verkaufspreis (Marge)  = Selbstkosten ÷ (1 − Zielmarge)      ← echte Marge vom Umsatz
Verkaufspreis (Aufschlag) = Selbstkosten × (1 + Aufschlag)   ← optionaler Modus
```

Mindest-, Ziel- und Premiumpreis werden parallel berechnet; Warnungen und
der Kalkulations-Health-Score (0–100, transparent aufgeschlüsselt) prüfen
Marge, Selbstkosten, Material, Fahrt, Gemeinkosten, Plausibilität der
Leistungswerte und manuelle Eingriffe. Alle Formeln sind mit Vitest
getestet (`npm run test`, 27 Tests).

### KI-Assistent

Der Assistent besitzt eine **eingebaute lokale Analyse** (Regel-Parser),
die ohne jede Einrichtung funktioniert und klar gekennzeichnet ist.

Optional kann die volle **Google-Gemini-KI** angebunden werden — über
eine Supabase Edge Function, damit der API-Schlüssel niemals im Browser
liegt:

```bash
supabase secrets set GEMINI_API_KEY=IHR_SCHLUESSEL
supabase functions deploy ai-kalkulation
```

Die Function (`supabase/functions/ai-kalkulation`) nutzt Function Calling
auf die eigenen Stammdaten und liefert schema-validierte Entwürfe; die
Mathematik bleibt immer bei der Kalkulations-Engine. Budget, Modellwahl
und Protokoll: *Einstellungen → KI*. In der Standalone-Datei greift ohne
konfiguriertes Backend automatisch die lokale Analyse.

---

## Website

Unverändert wie bisher:

```bash
npm run dev        # Entwicklung
npm run build      # Produktions-Build (dist/) — enthält KEINEN Kalkulations-Code
```

Deployment über Netlify (`netlify.toml`).

---

## Projektstruktur (Kalkulation)

```
src/kalkulation/
├── KalkulationApp.tsx        App-Routing + Shell
├── standalone-main.tsx       Einstieg der Einzeldatei-Version (Hash-Routing, offline)
├── kalkulation.css           Design-Tokens & Basiskomponenten (Logo-Farbwelt)
├── lib/
│   ├── types.ts              Datenmodell (Kunde → Objekt → Raum → Leistung → …)
│   ├── engine/               Kalkulations-Engine (pur, getestet)
│   ├── seed/                 Stammdaten & Beispieldaten
│   ├── store.ts              Zustand + Persistenz + Undo + Versionen
│   ├── templates.ts          Leistungspakete je Raumtyp
│   ├── quick.ts              Schnellkalkulations-Generator
│   └── ai/                   KI-Schema, Auflösung, Client, lokale Analyse
├── components/               UI-Primitive, Shell, Fachkomponenten, Workspace-Tabs
└── pages/                    Dashboard, Kunden, Objekte, Kalkulationen, Wizard,
                              Schnellkalkulation, Bibliothek, Einstellungen,
                              Assistent, Druckansichten
vite.standalone.config.ts     Einzeldatei-Build (vite-plugin-singlefile)
supabase/functions/ai-kalkulation/   optionales Gemini-Backend
```

## Roadmap (vorbereitet im Datenmodell)

Dokumenten-/LV-Import (PDF, Excel), Mitarbeiter-App & Zeiterfassung,
Einsatz- und Tourenplanung, Qualitätskontrolle mit Fotodokumentation,
Rechnungsstellung, Kundenportal, Mehrbenutzer mit Rollen/Rechten,
zentrale Datenbank, White-Label.
