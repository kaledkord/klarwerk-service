/**
 * Angebots-Tab: Editor für den Leistungsumfang (Reihenfolge, Turnus,
 * Bezeichnungen, Sichtbarkeit), Texte und Live-Vorschau des Kundenangebots.
 * Interne Kalkulation und Kundenansicht sind strikt getrennt.
 */

import { useMemo, useState } from 'react';
import { Eye, EyeOff, FileText, Printer } from 'lucide-react';
import type { Calculation, CleaningObject, Customer } from '../../lib/types';
import { useKwStore } from '../../lib/store';
import { addDays } from '../../lib/format';
import type { CalcResults } from '../domain';
import { FrequencyPicker } from '../domain';
import {
  Button,
  Callout,
  Card,
  FieldLabel,
  SectionTitle,
  SegmentedControl,
  Textarea,
  TextInput,
  toast,
  Toggle,
} from '../ui';
import { OfferDocument } from './OfferDocument';
import { BASE, openAppRoute } from '../shell';

export function OfferTab({
  calc,
  results,
  update,
  customer,
  object,
}: {
  calc: Calculation;
  results: CalcResults;
  update: (fn: (c: Calculation) => void, undoable?: boolean) => void;
  customer?: Customer;
  object?: CleaningObject;
}) {
  const data = useKwStore((st) => st.data);
  const { totals } = results;
  const [view, setView] = useState<'editor' | 'vorschau'>('editor');

  const offer = calc.offer;

  const createOffer = () => {
    const s = data.settings;
    const year = new Date().getFullYear();
    const n = data.counters.offer + 1;
    useKwStore.setState((st) => {
      st.data.counters.offer = n;
    });
    update((c) => {
      c.offer = {
        offerNumber: `A-${year}-${String(n).padStart(3, '0')}`,
        date: new Date().toISOString().slice(0, 10),
        validUntil: addDays(new Date(), s.offer.validityDays).toISOString().slice(0, 10),
        intro: s.offer.introTemplate,
        outro: s.offer.outroTemplate,
        terms: s.offer.termsTemplate,
        showQuantities: false,
        layout: 'table',
        priceNote: '',
        lineOverrides: {},
      };
      if (c.status === 'entwurf' || c.status === 'in_bearbeitung') c.status = 'angebot_erstellt';
    }, false);
    toast('Angebot erstellt — Texte und Leistungsumfang können jetzt angepasst werden.');
  };

  const sortedLines = useMemo(() => [...calc.lines].sort((a, b) => a.sortOrder - b.sortOrder), [calc.lines]);

  if (!offer) {
    return (
      <Card>
        <div className="max-w-xl">
          <SectionTitle>Angebot erstellen</SectionTitle>
          <p className="text-sm text-slate-600">
            Aus der Kalkulation wird ein professionelles Kundenangebot erzeugt — mit dem Turnus jeder einzelnen
            Leistung, gruppiert nach Bereichen. Interne Kosten, Stunden und Margen erscheinen darin nicht.
          </p>
          {calc.lines.length === 0 ? (
            <Callout tone="warn" className="mt-3">
              Die Kalkulation enthält noch keine Leistungspositionen.
            </Callout>
          ) : null}
          <Button className="mt-4" icon={<FileText size={14} />} onClick={createOffer} disabled={calc.lines.length === 0}>
            Angebot jetzt erstellen
          </Button>
        </div>
      </Card>
    );
  }

  const patch = (fn: (o: NonNullable<Calculation['offer']>) => void) =>
    update((c) => {
      if (c.offer) fn(c.offer);
    });

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <SegmentedControl
          value={view}
          onChange={setView}
          options={[
            { value: 'editor', label: 'Leistungsumfang & Texte' },
            { value: 'vorschau', label: 'Kundenvorschau' },
          ]}
        />
        <span className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            icon={<Printer size={14} />}
            onClick={() => openAppRoute(`${BASE}/druck/angebot/${calc.id}`)}
          >
            Angebot als PDF
          </Button>
          <Button
            variant="outline"
            icon={<Printer size={14} />}
            onClick={() => openAppRoute(`${BASE}/druck/intern/${calc.id}`)}
          >
            Interne Kalkulation als PDF
          </Button>
        </span>
      </div>

      {view === 'vorschau' ? (
        <div className="rounded-xl border border-[color:var(--kw-border)] bg-slate-100 p-4 sm:p-8 overflow-x-auto">
          <div className="mx-auto max-w-[210mm] bg-white shadow-glass-lg rounded-sm">
            <OfferDocument calc={calc} totals={totals} offer={offer} customer={customer} object={object} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="space-y-4">
            <Card>
              <SectionTitle>Angebotsdaten</SectionTitle>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <FieldLabel>Angebotsnummer</FieldLabel>
                  <TextInput value={offer.offerNumber} onChange={(e) => patch((o) => void (o.offerNumber = e.target.value))} />
                </div>
                <div>
                  <FieldLabel>Datum</FieldLabel>
                  <TextInput type="date" value={offer.date} onChange={(e) => patch((o) => void (o.date = e.target.value))} />
                </div>
                <div>
                  <FieldLabel>Gültig bis</FieldLabel>
                  <TextInput type="date" value={offer.validUntil} onChange={(e) => patch((o) => void (o.validUntil = e.target.value))} />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div>
                  <FieldLabel>Darstellung des Leistungsumfangs</FieldLabel>
                  <SegmentedControl
                    size="sm"
                    value={offer.layout}
                    onChange={(v) => patch((o) => void (o.layout = v))}
                    options={[
                      { value: 'table', label: 'Tabelle' },
                      { value: 'text', label: 'Textform' },
                      { value: 'both', label: 'Beides' },
                    ]}
                  />
                </div>
                <Toggle
                  checked={offer.showQuantities}
                  onChange={(v) => patch((o) => void (o.showQuantities = v))}
                  label={<span className="text-xs">Mengen im Angebot zeigen</span>}
                />
              </div>
            </Card>

            <Card>
              <SectionTitle>Texte</SectionTitle>
              <div className="space-y-3">
                <div>
                  <FieldLabel>Einleitung</FieldLabel>
                  <Textarea rows={4} value={offer.intro} onChange={(e) => patch((o) => void (o.intro = e.target.value))} />
                </div>
                <div>
                  <FieldLabel>Vertragsbedingungen</FieldLabel>
                  <Textarea rows={4} value={offer.terms} onChange={(e) => patch((o) => void (o.terms = e.target.value))} />
                </div>
                <div>
                  <FieldLabel>Schlusstext</FieldLabel>
                  <Textarea rows={2} value={offer.outro} onChange={(e) => patch((o) => void (o.outro = e.target.value))} />
                </div>
                <div>
                  <FieldLabel hint="(erscheint unter dem Preis)">Hinweis zum Preis</FieldLabel>
                  <TextInput
                    value={offer.priceNote}
                    onChange={(e) => patch((o) => void (o.priceNote = e.target.value))}
                    placeholder="z. B. Preisbindung 12 Monate"
                  />
                </div>
              </div>
            </Card>
          </div>

          <Card padded={false}>
            <div className="px-5 pt-4">
              <SectionTitle>Leistungsumfang bearbeiten</SectionTitle>
              <p className="-mt-2 mb-2 text-[11px] text-slate-400">
                Bezeichnung fürs Angebot anpassen, Turnus ändern oder Positionen ausblenden — die Kalkulation bleibt
                unverändert, ausgeblendete Positionen werden weiterhin kalkuliert.
              </p>
            </div>
            <div className="max-h-[560px] overflow-y-auto px-3 pb-3">
              {sortedLines.map((line) => {
                const ov = offer.lineOverrides[line.id] ?? {};
                const hidden = Boolean(ov.hidden);
                return (
                  <div
                    key={line.id}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${hidden ? 'opacity-45' : ''}`}
                  >
                    <button
                      type="button"
                      title={hidden ? 'Im Angebot anzeigen' : 'Im Angebot ausblenden'}
                      className="kw-press shrink-0 rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                      onClick={() =>
                        patch((o) => {
                          o.lineOverrides[line.id] = { ...o.lineOverrides[line.id], hidden: !hidden };
                        })
                      }
                    >
                      {hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <span className="w-32 shrink-0 truncate text-[10px] text-slate-400" title={`${line.areaLabel} · ${line.roomLabel}`}>
                      {line.areaLabel}
                    </span>
                    <TextInput
                      className="!py-1 !text-xs"
                      value={ov.displayName ?? line.serviceName}
                      onChange={(e) =>
                        patch((o) => {
                          o.lineOverrides[line.id] = {
                            ...o.lineOverrides[line.id],
                            displayName: e.target.value === line.serviceName ? undefined : e.target.value,
                          };
                        })
                      }
                    />
                    <span className="w-40 shrink-0">
                      <FrequencyPicker
                        cell
                        value={line.frequencyId}
                        onChange={(fid) =>
                          update((c) => {
                            const l = c.lines.find((x) => x.id === line.id);
                            if (l) l.frequencyId = fid;
                          })
                        }
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
