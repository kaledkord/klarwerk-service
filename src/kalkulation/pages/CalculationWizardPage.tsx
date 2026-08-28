/**
 * Profi-Kalkulation: geführter Wizard mit Fortschrittsanzeige.
 * Alle Eingaben bleiben beim Vor- und Zurückgehen erhalten;
 * die Kalkulation wird erst im letzten Schritt angelegt.
 */

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from 'lucide-react';
import type { CalcLine, Calculation } from '../lib/types';
import { engineContext, useKwStore } from '../lib/store';
import { computeCalculation, computeHealth, computeWarnings } from '../lib/engine';
import { lineFromService } from '../lib/lines';
import { ROOM_TEMPLATES, templateForRoomTypeName, type TemplateKey } from '../lib/templates';
import { NEUTRAL_FACTORS } from '../lib/types';
import { uid } from '../lib/id';
import { fmtEur, fmtEur0, fmtHours, fmtNum, fmtPct } from '../lib/format';
import {
  Button,
  Card,
  cx,
  FieldLabel,
  NumberInput,
  SectionTitle,
  Select,
  TextInput,
  toast,
  Toggle,
} from '../components/ui';
import { CostBreakdown, FrequencyPicker, HealthChecklist, WarningsList } from '../components/domain';
import { BASE, PageHeader } from '../components/shell';
import { CustomerFormModal, ObjectFormModal } from '../components/forms';

const STEPS = [
  'Kunde & Objekt',
  'Räume & Flächen',
  'Leistungen & Turnus',
  'Kosten & Personal',
  'Marge & Preis',
  'Prüfung',
] as const;

interface WizardRoom {
  id: string;
  name: string;
  areaLabel: string;
  areaSqm: number | null;
  template: TemplateKey;
  fromStructure?: boolean;
  structureRoomId?: string;
  soiling: string;
}

export default function CalculationWizardPage() {
  const data = useKwStore((st) => st.data);
  const createCalculation = useKwStore((st) => st.createCalculation);
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [customerId, setCustomerId] = useState('');
  const [objectId, setObjectId] = useState('');
  const [name, setName] = useState('');
  const [rooms, setRooms] = useState<WizardRoom[]>([]);
  const [structureLoadedFor, setStructureLoadedFor] = useState<string | null>(null);
  const [mainFreq, setMainFreq] = useState('fq_2w');
  const [distance, setDistance] = useState<number | null>(null);
  const [wage, setWage] = useState<number | null>(null);
  const [overhead, setOverhead] = useState(data.settings.overhead.enabledByDefault);
  const [payTravel, setPayTravel] = useState(data.settings.travel.payTravelTimeDefault);
  const [riskKey, setRiskKey] = useState(data.settings.calculation.defaultRiskKey);
  const [margin, setMargin] = useState<number | null>(data.settings.calculation.targetMarginPct);
  const [customerModal, setCustomerModal] = useState(false);
  const [objectModal, setObjectModal] = useState(false);

  const customer = data.customers.find((c) => c.id === customerId);
  const object = data.objects.find((o) => o.id === objectId);
  const objects = data.objects.filter((o) => !customerId || o.customerId === customerId);

  // Räume aus Objektstruktur laden, sobald ein Objekt gewählt wird
  const loadStructure = (objId: string) => {
    const obj = data.objects.find((o) => o.id === objId);
    if (!obj) return;
    const structRooms: WizardRoom[] = obj.buildings.flatMap((b) =>
      b.floors.flatMap((f) =>
        f.rooms.map((r) => ({
          id: uid('wr'),
          name: r.name,
          areaLabel: r.areaLabel ?? r.name,
          areaSqm: r.areaSqm,
          template:
            templateForRoomTypeName(data.roomTypes.find((t) => t.id === r.roomTypeId)?.name ?? r.name) ?? 'buero',
          fromStructure: true,
          structureRoomId: r.id,
          soiling: r.factors.soiling,
        }))
      )
    );
    if (structRooms.length > 0) {
      setRooms(structRooms);
      setStructureLoadedFor(objId);
    }
  };

  // Zeilen für Vorschau/Fertigstellung erzeugen
  const builtLines = useMemo((): CalcLine[] => {
    const lines: CalcLine[] = [];
    let sort = 0;
    for (const room of rooms) {
      const area = room.areaSqm ?? 0;
      if (area <= 0) continue;
      const structureRoom = object?.buildings
        .flatMap((b) => b.floors.flatMap((f) => f.rooms))
        .find((r) => r.id === room.structureRoomId);
      const tpl = ROOM_TEMPLATES[room.template];
      for (const item of tpl.items) {
        const service = data.services.find((s) => s.id === item.serviceId);
        if (!service || !service.active) continue;
        sort += 10;
        lines.push(
          lineFromService(service, data.settings, {
            areaLabel: room.areaLabel || tpl.label,
            roomLabel: room.name,
            roomId: room.structureRoomId,
            quantity: service.unit === 'm²' ? area : item.qty(area),
            frequencyId: item.freq === 'main' ? mainFreq : item.freq,
            factors: structureRoom ? { ...structureRoom.factors } : { ...NEUTRAL_FACTORS, soiling: room.soiling },
            sortOrder: sort,
          })
        );
      }
    }
    return lines;
  }, [rooms, mainFreq, data, object]);

  const previewCalc = useMemo((): Calculation => {
    const s = data.settings;
    return {
      id: 'wizard-preview',
      number: 'VORSCHAU',
      name: name || 'Neue Kalkulation',
      customerId: customerId || undefined,
      objectId: objectId || undefined,
      status: 'entwurf',
      lines: builtLines,
      travel: {
        enabled: (distance ?? object?.distanceKm ?? 0) > 0,
        distanceKm: distance ?? object?.distanceKm ?? 0,
        tripsPerMonth: null,
        payTravelTime: payTravel,
      },
      overheadEnabled: overhead,
      overheadRatePerHour: null,
      riskKey,
      riskPctOverride: null,
      marginMode: s.calculation.marginMode,
      targetMarginPct: margin ?? s.calculation.targetMarginPct,
      selectedPriceStrategy: 'target',
      customPrice: null,
      competitorPrice: null,
      wageOverride: wage,
      scenarios: [],
      postCalc: [],
      createdAt: '',
      updatedAt: '',
      versions: [],
    };
  }, [builtLines, customerId, objectId, name, distance, object, payTravel, overhead, riskKey, margin, wage, data]);

  const preview = useMemo(() => {
    const ctx = engineContext(data);
    const totals = computeCalculation(previewCalc, ctx);
    return { totals, warnings: computeWarnings(previewCalc, totals, ctx), health: computeHealth(previewCalc, totals, ctx) };
  }, [previewCalc, data]);

  const finish = () => {
    // id/number/createdAt/updatedAt vergibt createCalculation selbst
    const { id: _id, number: _number, createdAt: _c, updatedAt: _u, ...init } = previewCalc;
    void _id;
    void _number;
    void _c;
    void _u;
    const calc = createCalculation({
      ...init,
      name: name || (object ? `${object.name} – Unterhaltsreinigung` : 'Neue Kalkulation'),
    });
    toast(`Kalkulation ${calc.number} angelegt.`);
    navigate(`${BASE}/kalkulationen/${calc.id}?tab=leistungen`);
  };

  const canNext =
    step === 0
      ? true
      : step === 1
        ? rooms.some((r) => (r.areaSqm ?? 0) > 0)
        : step === 2
          ? builtLines.length > 0
          : true;

  return (
    <div className="max-w-[1100px] mx-auto">
      <PageHeader
        crumbs={[
          { label: 'KlarWerk Kalkulation', to: BASE },
          { label: 'Kalkulationen', to: `${BASE}/kalkulationen` },
          { label: 'Neue Profi-Kalkulation' },
        ]}
        title="Neue Profi-Kalkulation"
        sub="Geführt in sechs Schritten — Sie können jederzeit zurückgehen, ohne Eingaben zu verlieren."
      />

      {/* Fortschritt */}
      <div className="mb-5 flex items-center gap-1 overflow-x-auto pb-1">
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => i < step && setStep(i)}
            disabled={i > step}
            className={cx(
              'flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors',
              i === step
                ? 'bg-navy-950 text-white'
                : i < step
                  ? 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                  : 'bg-slate-100 text-slate-400'
            )}
          >
            {i < step ? <Check size={11} /> : <span className="kw-tnum">{i + 1}</span>}
            {label}
          </button>
        ))}
      </div>

      {/* Schritt 1: Kunde & Objekt */}
      {step === 0 ? (
        <Card>
          <SectionTitle>Kunde und Objekt zuordnen</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2 max-w-2xl">
            <div>
              <FieldLabel>Kunde</FieldLabel>
              <Select
                value={customerId}
                onChange={(e) => {
                  setCustomerId(e.target.value);
                  setObjectId('');
                }}
              >
                <option value="">— Später zuordnen —</option>
                {data.customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company}
                  </option>
                ))}
              </Select>
              <Button size="sm" variant="ghost" icon={<Plus size={12} />} className="mt-1.5" onClick={() => setCustomerModal(true)}>
                Neuen Kunden anlegen
              </Button>
            </div>
            <div>
              <FieldLabel>Objekt</FieldLabel>
              <Select
                value={objectId}
                onChange={(e) => {
                  setObjectId(e.target.value);
                  const obj = data.objects.find((o) => o.id === e.target.value);
                  if (obj) {
                    setCustomerId(obj.customerId);
                    if (obj.distanceKm != null) setDistance(obj.distanceKm);
                    if (structureLoadedFor !== obj.id) loadStructure(obj.id);
                    if (!name) setName(`${obj.name} – Unterhaltsreinigung`);
                  }
                }}
              >
                <option value="">— Ohne Objekt / später —</option>
                {objects.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </Select>
              <Button size="sm" variant="ghost" icon={<Plus size={12} />} className="mt-1.5" onClick={() => setObjectModal(true)}>
                Neues Objekt anlegen
              </Button>
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Name der Kalkulation</FieldLabel>
              <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Büro Kiel – Unterhaltsreinigung" />
            </div>
          </div>
        </Card>
      ) : null}

      {/* Schritt 2: Räume */}
      {step === 1 ? (
        <Card>
          <SectionTitle
            right={
              <Button
                size="sm"
                variant="outline"
                icon={<Plus size={12} />}
                onClick={() =>
                  setRooms((rs) => [
                    ...rs,
                    {
                      id: uid('wr'),
                      name: `Bereich ${rs.length + 1}`,
                      areaLabel: '',
                      areaSqm: null,
                      template: 'buero',
                      soiling: 'normal',
                    },
                  ])
                }
              >
                Raum/Bereich
              </Button>
            }
          >
            Räume und Flächen
          </SectionTitle>
          {object && structureLoadedFor === object.id && rooms.some((r) => r.fromStructure) ? (
            <p className="mb-3 text-xs text-brand-700 bg-brand-50 border border-brand-200 rounded-lg px-3 py-2">
              {rooms.filter((r) => r.fromStructure).length} Räume aus der Objektstruktur von „{object.name}“ übernommen —
              Flächen und Zuordnung können hier angepasst werden.
            </p>
          ) : (
            <p className="mb-3 text-xs text-slate-500">
              Erfassen Sie die zu reinigenden Räume oder Bereiche mit Fläche. Ohne Objektstruktur können Sie auch grob
              nach Bereichen kalkulieren (z. B. „Büros gesamt“ mit 400 m²).
            </p>
          )}
          <div className="space-y-2">
            {rooms.map((room) => (
              <div key={room.id} className="grid grid-cols-12 items-end gap-2 rounded-lg border border-slate-200 p-2.5">
                <div className="col-span-6 sm:col-span-3">
                  <FieldLabel>Raum/Bereich</FieldLabel>
                  <TextInput
                    className="!py-1.5 !text-xs"
                    value={room.name}
                    onChange={(e) => setRooms((rs) => rs.map((r) => (r.id === room.id ? { ...r, name: e.target.value } : r)))}
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <FieldLabel>Fläche (m²)</FieldLabel>
                  <NumberInput
                    cell
                    value={room.areaSqm}
                    min={0}
                    onChange={(v) => setRooms((rs) => rs.map((r) => (r.id === room.id ? { ...r, areaSqm: v } : r)))}
                    inputClassName="!py-1.5 !border-slate-200 !bg-white"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <FieldLabel>Leistungspaket</FieldLabel>
                  <Select
                    className="!py-1.5 !text-xs"
                    value={room.template}
                    onChange={(e) =>
                      setRooms((rs) => rs.map((r) => (r.id === room.id ? { ...r, template: e.target.value as TemplateKey } : r)))
                    }
                  >
                    {(Object.keys(ROOM_TEMPLATES) as TemplateKey[]).map((k) => (
                      <option key={k} value={k}>
                        {ROOM_TEMPLATES[k].label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="col-span-5 sm:col-span-3">
                  <FieldLabel>Verschmutzung</FieldLabel>
                  <Select
                    className="!py-1.5 !text-xs"
                    value={room.soiling}
                    onChange={(e) => setRooms((rs) => rs.map((r) => (r.id === room.id ? { ...r, soiling: e.target.value } : r)))}
                  >
                    {data.settings.performanceFactors.soiling.map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    className="kw-press rounded p-1.5 text-slate-400 hover:text-error-600 hover:bg-error-50"
                    onClick={() => setRooms((rs) => rs.filter((r) => r.id !== room.id))}
                    title="Entfernen"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {rooms.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center text-xs text-slate-400">
                Noch keine Räume — über „+ Raum/Bereich“ hinzufügen
                {objects.length > 0 ? ' oder in Schritt 1 ein Objekt mit Struktur wählen.' : '.'}
              </p>
            ) : null}
          </div>
        </Card>
      ) : null}

      {/* Schritt 3: Leistungen */}
      {step === 2 ? (
        <Card>
          <SectionTitle>Leistungen und Turnus</SectionTitle>
          <div className="mb-4 max-w-sm">
            <FieldLabel>Haupt-Turnus der Grundleistungen</FieldLabel>
            <FrequencyPicker value={mainFreq} onChange={setMainFreq} />
            <p className="mt-1 text-[10px] text-slate-400">
              Jede Leistung behält ihren eigenen Turnus: Spezialleistungen (Sockelleisten monatlich, Fenster monatlich,
              Fliesen monatlich …) bleiben unabhängig vom Haupt-Turnus.
            </p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="kw-table">
              <thead>
                <tr>
                  <th>Raum</th>
                  <th>Leistung</th>
                  <th className="!text-right">Menge</th>
                  <th>Turnus</th>
                </tr>
              </thead>
              <tbody>
                {builtLines.map((l) => (
                  <tr key={l.id}>
                    <td className="text-slate-600">{l.roomLabel}</td>
                    <td className="font-semibold text-slate-800">{l.serviceName}</td>
                    <td className="text-right kw-tnum">
                      {fmtNum(l.quantity, 1)} {l.unit}
                    </td>
                    <td className="text-slate-600">{data.frequencies.find((f) => f.id === l.frequencyId)?.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {builtLines.length} Positionen werden erstellt. Feinschliff (einzelne Turnusse, Mengen, Leistungswerte,
            Material je Position) erfolgt anschließend im Kalkulations-Workspace.
          </p>
        </Card>
      ) : null}

      {/* Schritt 4: Kosten */}
      {step === 3 ? (
        <Card>
          <SectionTitle>Kosten und Personal</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2 max-w-2xl">
            <div>
              <FieldLabel hint={`(Standard ${fmtEur(data.settings.labor.baseWage)}/h)`}>Stundenlohn</FieldLabel>
              <NumberInput value={wage} min={0} onChange={setWage} suffix="€/h" alignRight={false} placeholder={fmtNum(data.settings.labor.baseWage, 2)} />
            </div>
            <div>
              <FieldLabel>Entfernung zum Objekt</FieldLabel>
              <NumberInput value={distance} min={0} onChange={setDistance} suffix="km" alignRight={false} />
            </div>
            <div>
              <FieldLabel>Risikoeinstufung</FieldLabel>
              <Select value={riskKey} onChange={(e) => setRiskKey(e.target.value)}>
                {data.settings.calculation.riskLevels.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.label} ({fmtNum(r.pct, 0)} %)
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col justify-end gap-2 pb-1">
              <Toggle checked={overhead} onChange={setOverhead} label={<span className="text-xs">Gemeinkosten einrechnen</span>} />
              <Toggle checked={payTravel} onChange={setPayTravel} label={<span className="text-xs">Fahrzeit vergüten</span>} />
            </div>
          </div>
        </Card>
      ) : null}

      {/* Schritt 5: Marge */}
      {step === 4 ? (
        <Card>
          <SectionTitle>Marge und Preisstrategie</SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="max-w-xs">
              <FieldLabel>Zielmarge (echte Marge vom Verkaufspreis)</FieldLabel>
              <NumberInput value={margin} min={0} max={95} onChange={setMargin} suffix="%" alignRight={false} />
              <p className="mt-2 text-[11px] text-slate-400">
                Mindestmarge {fmtPct(data.settings.calculation.minMarginPct, 0)} · Premium{' '}
                {fmtPct(data.settings.calculation.premiumMarginPct, 0)} — Preisstrategien lassen sich später im
                Workspace vergleichen und umschalten.
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3">
              <CostBreakdown totals={preview.totals} />
            </div>
          </div>
        </Card>
      ) : null}

      {/* Schritt 6: Prüfung */}
      {step === 5 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <SectionTitle>Zusammenfassung</SectionTitle>
            <div className="space-y-1.5 text-sm">
              <SummaryRow k="Kunde" v={customer?.company ?? '— später —'} />
              <SummaryRow k="Objekt" v={object?.name ?? '— später —'} />
              <SummaryRow k="Positionen" v={`${builtLines.length} (je mit eigenem Turnus)`} />
              <SummaryRow k="Sollstunden/Monat" v={fmtHours(preview.totals.monthlyHours, 1)} />
              <SummaryRow k="Selbstkosten/Monat" v={fmtEur(preview.totals.selfCost)} />
              <SummaryRow k="Angebotspreis netto" v={fmtEur0(preview.totals.selected.net)} strong />
              <SummaryRow k="Marge" v={fmtPct(preview.totals.selected.marginPct, 1)} />
              {preview.totals.oneTime ? (
                <SummaryRow k="Einmalige Leistungen" v={fmtEur0(preview.totals.oneTime.price.net)} />
              ) : null}
            </div>
          </Card>
          <div className="space-y-4">
            <Card>
              <SectionTitle>Kalkulationsprüfung</SectionTitle>
              <HealthChecklist health={preview.health} />
            </Card>
            <Card>
              <SectionTitle>Hinweise</SectionTitle>
              <WarningsList warnings={preview.warnings} compact />
            </Card>
          </div>
        </div>
      ) : null}

      {/* Navigation */}
      <div className="mt-5 flex items-center justify-between">
        <Button variant="outline" icon={<ArrowLeft size={14} />} onClick={() => (step === 0 ? navigate(`${BASE}/kalkulationen`) : setStep(step - 1))}>
          {step === 0 ? 'Abbrechen' : 'Zurück'}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button icon={<ArrowRight size={14} />} onClick={() => setStep(step + 1)} disabled={!canNext}>
            Weiter
          </Button>
        ) : (
          <Button size="lg" icon={<Check size={15} />} onClick={finish} disabled={builtLines.length === 0}>
            Kalkulation anlegen
          </Button>
        )}
      </div>

      {customerModal ? (
        <CustomerFormModal
          onClose={() => setCustomerModal(false)}
          onSaved={(id) => {
            setCustomerModal(false);
            setCustomerId(id);
          }}
        />
      ) : null}
      {objectModal ? (
        <ObjectFormModal
          defaultCustomerId={customerId || undefined}
          onClose={() => setObjectModal(false)}
          onSaved={(id) => {
            setObjectModal(false);
            setObjectId(id);
            const obj = useKwStore.getState().data.objects.find((o) => o.id === id);
            if (obj) {
              setCustomerId(obj.customerId);
              if (obj.distanceKm != null) setDistance(obj.distanceKm);
            }
          }}
        />
      ) : null}
    </div>
  );
}

function SummaryRow({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className={cx('flex items-baseline justify-between gap-3', strong && 'font-bold text-slate-900')}>
      <span className="text-slate-500 text-xs">{k}</span>
      <span className="kw-tnum text-sm">{v}</span>
    </div>
  );
}
