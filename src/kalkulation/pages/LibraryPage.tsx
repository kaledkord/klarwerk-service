/**
 * Bibliothek: Leistungen mit Leistungswerten, Turnusse, Material, Maschinen —
 * inklusive Empfehlung aus der lernenden Kalkulation (Nachkalkulationsdaten).
 */

import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, RotateCcw, Trash2, TrendingDown } from 'lucide-react';
import type { Machine, Material, Service, Unit } from '../lib/types';
import { engineContext, useKwStore } from '../lib/store';
import {
  computeCalculation,
  executionsPerMonth,
  frequencyFormula,
  learningInsight,
} from '../lib/engine';
import { SEED_SERVICES } from '../lib/seed';
import { fmtEur, fmtNum } from '../lib/format';
import {
  Badge,
  Button,
  Callout,
  Card,
  FieldLabel,
  Modal,
  NumberInput,
  Select,
  Tabs,
  TextInput,
  toast,
  Toggle,
} from '../components/ui';
import { CustomFrequencyModal } from '../components/domain';
import { BASE, PageHeader } from '../components/shell';

type TabKey = 'leistungen' | 'turnusse' | 'material' | 'maschinen';

export default function LibraryPage() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as TabKey) ?? 'leistungen';
  const setTab = (t: TabKey) => {
    params.set('tab', t);
    setParams(params, { replace: true });
  };

  return (
    <div className="max-w-[1300px] mx-auto">
      <PageHeader
        crumbs={[{ label: 'KlarWerk Kalkulation', to: BASE }, { label: 'Bibliothek' }]}
        title="Bibliothek"
        sub="Leistungen, Leistungswerte, Turnusse, Material und Maschinen — die Stammdaten Ihrer Kalkulationen."
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'leistungen', label: 'Leistungen & Leistungswerte' },
          { value: 'turnusse', label: 'Turnusse' },
          { value: 'material', label: 'Material' },
          { value: 'maschinen', label: 'Maschinen' },
        ]}
      />
      <div className="pt-4">
        {tab === 'leistungen' ? <ServicesTab /> : null}
        {tab === 'turnusse' ? <FrequenciesTab /> : null}
        {tab === 'material' ? <MaterialsTab /> : null}
        {tab === 'maschinen' ? <MachinesTab /> : null}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Leistungen
// ─────────────────────────────────────────────────────────────────────────────

function ServicesTab() {
  const data = useKwStore((st) => st.data);
  const updateService = useKwStore((st) => st.updateService);
  const addServiceCategory = useKwStore((st) => st.addServiceCategory);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('alle');
  const [showInactive, setShowInactive] = useState(false);
  const [editService, setEditService] = useState<Service | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newCat, setNewCat] = useState('');

  // Lernende Kalkulation: Empfehlung aus Nachkalkulationsdaten
  const insight = useMemo(() => {
    const ctx = engineContext(data);
    const withTotals = data.calculations
      .filter((c) => c.postCalc.length > 0)
      .map((calc) => ({ calc, totals: computeCalculation(calc, ctx) }));
    return learningInsight(withTotals);
  }, [data]);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.serviceCategories
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .filter((c) => categoryId === 'alle' || c.id === categoryId)
      .map((cat) => ({
        cat,
        services: data.services.filter(
          (s) =>
            s.categoryId === cat.id &&
            (showInactive || s.active) &&
            (!q || s.name.toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.services.length > 0);
  }, [data, query, categoryId, showInactive]);

  const applyLearning = () => {
    if (!insight) return;
    const factor = insight.suggestedPerformanceFactor;
    useKwStore.setState((st) => {
      for (const s of st.data.services) {
        if (s.unit === 'h' || s.unit === 'Pauschale') continue;
        s.defaultPerformanceValue = Math.round(s.defaultPerformanceValue * factor * 10) / 10;
      }
    });
    toast(`Alle Leistungswerte um ${fmtNum((1 - factor) * 100, 1)} % angepasst.`);
  };

  return (
    <div>
      {insight && Math.abs(1 - insight.avgRatio) >= 0.05 ? (
        <Callout tone={insight.avgRatio > 1 ? 'warn' : 'info'} className="mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold">
              <TrendingDown size={13} /> Lernende Kalkulation
            </span>
            <span>
              Ihre tatsächlichen Stunden liegen im Schnitt{' '}
              <strong>
                {fmtNum(Math.abs(insight.avgRatio - 1) * 100, 0)} % {insight.avgRatio > 1 ? 'über' : 'unter'}
              </strong>{' '}
              den kalkulierten ({insight.calculationCount} Objekt(e) mit Nachkalkulation). Empfehlung: Leistungswerte um{' '}
              <strong>{fmtNum((1 - insight.suggestedPerformanceFactor) * 100, 1)} %</strong>{' '}
              {insight.suggestedPerformanceFactor < 1 ? 'senken' : 'anheben'}.
            </span>
            <span className="ml-auto flex gap-2">
              <Button size="sm" variant="outline" onClick={applyLearning}>
                Standardwerte anpassen
              </Button>
            </span>
          </div>
          <p className="mt-1 text-[10px] opacity-70">
            Werte werden niemals automatisch geändert — nur durch Ihre Bestätigung. Basis:{' '}
            {insight.details.map((d) => `${d.calcName} (${fmtNum(d.ratio * 100 - 100, 0)} %)`).join(' · ')}
          </p>
        </Callout>
      ) : null}

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <TextInput className="max-w-xs" placeholder="Leistung suchen …" value={query} onChange={(e) => setQuery(e.target.value)} />
        <Select className="!w-auto" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="alle">Alle Kategorien</option>
          {data.serviceCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Toggle checked={showInactive} onChange={setShowInactive} label={<span className="text-xs">Deaktivierte zeigen</span>} />
        <span className="ml-auto flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <TextInput
              className="!py-1.5 !text-xs w-40"
              placeholder="Neue Kategorie …"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (!newCat.trim()) return;
                addServiceCategory(newCat.trim());
                setNewCat('');
                toast('Kategorie angelegt.');
              }}
            >
              +
            </Button>
          </span>
          <Button icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
            Neue Leistung
          </Button>
        </span>
      </div>

      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="kw-table">
            <thead>
              <tr>
                <th>Leistung</th>
                <th>Einheit</th>
                <th className="!text-right">Standard-Leistungswert</th>
                <th>Standard-Turnus</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {grouped.map(({ cat, services }) => [
                <tr key={`cat-${cat.id}`} className="!bg-slate-50/80">
                  <td colSpan={6} className="!py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                    {cat.name}
                  </td>
                </tr>,
                ...services.map((s) => (
                  <tr key={s.id} className={!s.active ? 'opacity-45' : undefined}>
                    <td>
                      <button type="button" className="font-semibold text-slate-800 hover:text-cyan-700 text-left" onClick={() => setEditService(s)}>
                        {s.name}
                      </button>
                      {s.description ? <span className="block text-[10px] text-slate-400">{s.description}</span> : null}
                    </td>
                    <td className="text-slate-500">{s.unit}</td>
                    <td className="text-right">
                      {s.unit === 'h' || s.unit === 'Pauschale' ? (
                        <span className="text-slate-400">nach Aufwand</span>
                      ) : (
                        <span className="inline-flex justify-end w-28">
                          <NumberInput
                            cell
                            value={s.defaultPerformanceValue}
                            min={0.1}
                            decimals={1}
                            onChange={(v) => v != null && updateService(s.id, (x) => void (x.defaultPerformanceValue = v))}
                            suffix={`${s.unit}/h`}
                          />
                        </span>
                      )}
                    </td>
                    <td className="text-slate-600 text-xs">
                      {data.frequencies.find((f) => f.id === s.defaultFrequencyId)?.name ?? '—'}
                    </td>
                    <td>
                      {s.active ? <Badge tone="green">Aktiv</Badge> : <Badge tone="outline">Deaktiviert</Badge>}
                      {s.system ? null : (
                        <Badge tone="blue" className="ml-1">
                          Eigene
                        </Badge>
                      )}
                    </td>
                    <td>
                      <span className="flex items-center justify-end gap-0.5">
                        <button
                          type="button"
                          title={s.active ? 'Deaktivieren' : 'Aktivieren'}
                          className="kw-press rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          onClick={() => updateService(s.id, (x) => void (x.active = !x.active))}
                        >
                          {s.active ? <Trash2 size={13} /> : <RotateCcw size={13} />}
                        </button>
                      </span>
                    </td>
                  </tr>
                )),
              ])}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="mt-2 flex justify-end">
        <Button
          size="sm"
          variant="ghost"
          icon={<RotateCcw size={12} />}
          onClick={() => {
            useKwStore.setState((st) => {
              for (const seed of SEED_SERVICES) {
                const s = st.data.services.find((x) => x.id === seed.id);
                if (s) s.defaultPerformanceValue = seed.defaultPerformanceValue;
              }
            });
            toast('Standard-Leistungswerte wiederhergestellt.');
          }}
        >
          Standardwerte wiederherstellen
        </Button>
      </div>

      {(editService || createOpen) ? (
        <ServiceFormModal
          service={editService ?? undefined}
          onClose={() => {
            setEditService(null);
            setCreateOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

function ServiceFormModal({ service, onClose }: { service?: Service; onClose: () => void }) {
  const data = useKwStore((st) => st.data);
  const addService = useKwStore((st) => st.addService);
  const updateService = useKwStore((st) => st.updateService);
  const deleteService = useKwStore((st) => st.deleteService);
  const [name, setName] = useState(service?.name ?? '');
  const [categoryId, setCategoryId] = useState(service?.categoryId ?? data.serviceCategories[0]?.id ?? '');
  const [unit, setUnit] = useState<Unit>(service?.unit ?? 'm²');
  const [pv, setPv] = useState<number | null>(service?.defaultPerformanceValue ?? 300);
  const [freq, setFreq] = useState(service?.defaultFrequencyId ?? 'fq_1w');
  const [description, setDescription] = useState(service?.description ?? '');

  return (
    <Modal
      open
      onClose={onClose}
      title={service ? 'Leistung bearbeiten' : 'Neue Leistung'}
      footer={
        <>
          {service && !service.system ? (
            <Button
              variant="ghost"
              className="mr-auto !text-error-600"
              onClick={() => {
                deleteService(service.id);
                onClose();
                toast('Leistung gelöscht.');
              }}
            >
              Löschen
            </Button>
          ) : null}
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            onClick={() => {
              if (!name.trim()) {
                toast('Bitte einen Namen angeben.', 'error');
                return;
              }
              const isTime = unit === 'h' || unit === 'Pauschale';
              if (service) {
                updateService(service.id, (s) => {
                  s.name = name.trim();
                  s.categoryId = categoryId;
                  s.unit = unit;
                  s.defaultPerformanceValue = isTime ? 1 : (pv ?? 1);
                  s.defaultFrequencyId = freq;
                  s.description = description.trim() || undefined;
                });
              } else {
                addService({
                  name: name.trim(),
                  categoryId,
                  unit,
                  defaultPerformanceValue: isTime ? 1 : (pv ?? 1),
                  defaultFrequencyId: freq,
                  description: description.trim() || undefined,
                  active: true,
                });
              }
              onClose();
              toast('Leistung gespeichert.');
            }}
          >
            Speichern
          </Button>
        </>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FieldLabel>Bezeichnung *</FieldLabel>
          <TextInput value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div>
          <FieldLabel>Kategorie</FieldLabel>
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {data.serviceCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <FieldLabel>Einheit</FieldLabel>
          <Select value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
            {(['m²', 'Stk.', 'm', 'h', 'Pauschale'] as Unit[]).map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </Select>
        </div>
        {unit !== 'h' && unit !== 'Pauschale' ? (
          <div>
            <FieldLabel>Standard-Leistungswert ({unit}/h)</FieldLabel>
            <NumberInput value={pv} min={0.1} decimals={1} onChange={setPv} alignRight={false} />
          </div>
        ) : null}
        <div>
          <FieldLabel>Standard-Turnus</FieldLabel>
          <Select value={freq} onChange={(e) => setFreq(e.target.value)}>
            {data.frequencies
              .filter((f) => f.active)
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <FieldLabel>Beschreibung</FieldLabel>
          <TextInput value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Turnusse
// ─────────────────────────────────────────────────────────────────────────────

function FrequenciesTab() {
  const data = useKwStore((st) => st.data);
  const updateFrequency = useKwStore((st) => st.updateFrequency);
  const deleteFrequency = useKwStore((st) => st.deleteFrequency);
  const [createOpen, setCreateOpen] = useState(false);
  const weeks = data.settings.calculation.weeksPerMonth;

  const sorted = [...data.frequencies].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs text-slate-500">
          Umrechnung mit {fmtNum(weeks, 4)} Wochen/Monat (52 ÷ 12) — zentral änderbar in den Einstellungen.
        </p>
        <Button icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
          Eigener Turnus
        </Button>
      </div>
      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="kw-table">
            <thead>
              <tr>
                <th>Turnus</th>
                <th>Umrechnung</th>
                <th className="!text-right">Durchführungen/Monat</th>
                <th className="!text-right">Durchführungen/Jahr</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((f) => {
                const fm = executionsPerMonth(f, weeks);
                return (
                  <tr key={f.id} className={!f.active ? 'opacity-45' : undefined}>
                    <td className="font-semibold text-slate-800">
                      {f.name}
                      {!f.system ? (
                        <Badge tone="blue" className="ml-1.5">
                          Eigener
                        </Badge>
                      ) : null}
                    </td>
                    <td className="text-slate-500 text-xs">{frequencyFormula(f, weeks)}</td>
                    <td className="text-right kw-tnum font-semibold">
                      {fm.oneTime ? '—' : fm.onDemand ? 'je Abruf' : fmtNum(fm.executionsPerMonth, 3)}
                    </td>
                    <td className="text-right kw-tnum text-slate-600">
                      {fm.oneTime || fm.onDemand ? '—' : fmtNum(fm.executionsPerYear, 1)}
                    </td>
                    <td>{f.active ? <Badge tone="green">Aktiv</Badge> : <Badge tone="outline">Deaktiviert</Badge>}</td>
                    <td>
                      <span className="flex items-center justify-end gap-0.5">
                        <button
                          type="button"
                          title={f.active ? 'Deaktivieren' : 'Aktivieren'}
                          className="kw-press rounded p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          onClick={() =>
                            f.active && !f.system
                              ? deleteFrequency(f.id)
                              : updateFrequency(f.id, (x) => void (x.active = !x.active))
                          }
                        >
                          {f.active ? <Trash2 size={13} /> : <RotateCcw size={13} />}
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      {createOpen ? (
        <CustomFrequencyModal
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            setCreateOpen(false);
            toast('Turnus angelegt.');
          }}
        />
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Material
// ─────────────────────────────────────────────────────────────────────────────

function MaterialsTab() {
  const data = useKwStore((st) => st.data);
  const addMaterial = useKwStore((st) => st.addMaterial);
  const updateMaterial = useKwStore((st) => st.updateMaterial);
  const deleteMaterial = useKwStore((st) => st.deleteMaterial);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs text-slate-500 max-w-2xl">
          Reinigungsmaterial wird von Ihnen kalkuliert; Verbrauchsmaterial (Papier, Seife) wird laut Standardeinstellung{' '}
          <strong>
            {data.settings.material.consumablesDefault === 'auftraggeber'
              ? 'vom Auftraggeber gestellt'
              : data.settings.material.consumablesDefault === 'auftragnehmer'
                ? 'von Ihnen gestellt'
                : 'separat abgerechnet'}
          </strong>{' '}
          (änderbar in den Einstellungen, je Position übersteuerbar).
        </p>
        <Button
          icon={<Plus size={14} />}
          onClick={() =>
            addMaterial({ name: 'Neues Material', kind: 'reinigungsmaterial', unit: 'Liter', costPerUnit: 0, active: true })
          }
        >
          Material
        </Button>
      </div>
      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="kw-table">
            <thead>
              <tr>
                <th>Material</th>
                <th>Art</th>
                <th>Einheit</th>
                <th className="!text-right">Kosten je Einheit</th>
                <th>Hinweis</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.materials.map((m) => (
                <MaterialRow key={m.id} m={m} onUpdate={updateMaterial} onDelete={deleteMaterial} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function MaterialRow({
  m,
  onUpdate,
  onDelete,
}: {
  m: Material;
  onUpdate: (id: string, fn: (x: Material) => void) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <tr>
      <td>
        <TextInput
          className="!py-1 !px-1.5 !text-xs !border-transparent hover:!border-slate-200 font-semibold"
          value={m.name}
          onChange={(e) => onUpdate(m.id, (x) => void (x.name = e.target.value))}
        />
      </td>
      <td>
        <Select
          className="!py-1 !px-1.5 !text-xs !w-auto"
          value={m.kind}
          onChange={(e) => onUpdate(m.id, (x) => void (x.kind = e.target.value as Material['kind']))}
        >
          <option value="reinigungsmaterial">Reinigungsmaterial</option>
          <option value="verbrauchsmaterial">Verbrauchsmaterial</option>
        </Select>
      </td>
      <td>
        <TextInput
          className="!py-1 !px-1.5 !text-xs !w-28 !border-transparent hover:!border-slate-200"
          value={m.unit}
          onChange={(e) => onUpdate(m.id, (x) => void (x.unit = e.target.value))}
        />
      </td>
      <td className="text-right">
        <span className="inline-flex w-24 justify-end">
          <NumberInput
            cell
            value={m.costPerUnit}
            min={0}
            onChange={(v) => v != null && onUpdate(m.id, (x) => void (x.costPerUnit = v))}
            suffix="€"
          />
        </span>
      </td>
      <td className="text-[11px] text-slate-400 max-w-[220px] truncate">{m.note ?? ''}</td>
      <td>
        <button
          type="button"
          className="kw-press rounded p-1 text-slate-400 hover:text-error-600 hover:bg-error-50"
          onClick={() => onDelete(m.id)}
          title="Löschen"
        >
          <Trash2 size={13} />
        </button>
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Maschinen
// ─────────────────────────────────────────────────────────────────────────────

function MachinesTab() {
  const data = useKwStore((st) => st.data);
  const addMachine = useKwStore((st) => st.addMachine);
  const updateMachine = useKwStore((st) => st.updateMachine);
  const deleteMachine = useKwStore((st) => st.deleteMachine);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs text-slate-500 max-w-2xl">
          Der kalkulatorische Stundensatz deckt Abschreibung, Wartung, Energie und Verbrauchsmaterial ab. Er wird je
          Position auf die Monatsstunden gerechnet. Der Rechner rechts schlägt einen Satz aus den Eckdaten vor.
        </p>
        <Button icon={<Plus size={14} />} onClick={() => addMachine({ name: 'Neue Maschine', hourlyRate: 0, active: true })}>
          Maschine
        </Button>
      </div>
      <Card padded={false}>
        <div className="overflow-x-auto">
          <table className="kw-table">
            <thead>
              <tr>
                <th>Maschine</th>
                <th className="!text-right">Kaufpreis</th>
                <th className="!text-right">Nutzungsdauer</th>
                <th className="!text-right">Wartung/Jahr</th>
                <th className="!text-right">Energie/h</th>
                <th className="!text-right">Vorschlag</th>
                <th className="!text-right">Stundensatz</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.machines.map((m) => (
                <MachineRow key={m.id} m={m} onUpdate={updateMachine} onDelete={deleteMachine} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function MachineRow({
  m,
  onUpdate,
  onDelete,
}: {
  m: Machine;
  onUpdate: (id: string, fn: (x: Machine) => void) => void;
  onDelete: (id: string) => void;
}) {
  // Vorschlag: (Abschreibung + Wartung) / geschätzte 300 Einsatzstunden pro Jahr + Energie
  const suggestion =
    m.purchasePrice && m.usefulLifeYears
      ? (m.purchasePrice / m.usefulLifeYears + (m.maintenancePerYear ?? 0)) / 300 + (m.energyCostPerHour ?? 0)
      : null;

  return (
    <tr className={!m.active ? 'opacity-45' : undefined}>
      <td>
        <TextInput
          className="!py-1 !px-1.5 !text-xs !border-transparent hover:!border-slate-200 font-semibold !w-56"
          value={m.name}
          onChange={(e) => onUpdate(m.id, (x) => void (x.name = e.target.value))}
        />
        {m.note ? <span className="block text-[10px] text-slate-400 px-1.5">{m.note}</span> : null}
      </td>
      <td className="text-right">
        <span className="inline-flex w-24 justify-end">
          <NumberInput cell value={m.purchasePrice ?? null} min={0} decimals={0} onChange={(v) => onUpdate(m.id, (x) => void (x.purchasePrice = v ?? undefined))} suffix="€" />
        </span>
      </td>
      <td className="text-right">
        <span className="inline-flex w-16 justify-end">
          <NumberInput cell value={m.usefulLifeYears ?? null} min={1} decimals={0} onChange={(v) => onUpdate(m.id, (x) => void (x.usefulLifeYears = v ?? undefined))} suffix="J." />
        </span>
      </td>
      <td className="text-right">
        <span className="inline-flex w-20 justify-end">
          <NumberInput cell value={m.maintenancePerYear ?? null} min={0} decimals={0} onChange={(v) => onUpdate(m.id, (x) => void (x.maintenancePerYear = v ?? undefined))} suffix="€" />
        </span>
      </td>
      <td className="text-right">
        <span className="inline-flex w-18 justify-end">
          <NumberInput cell value={m.energyCostPerHour ?? null} min={0} onChange={(v) => onUpdate(m.id, (x) => void (x.energyCostPerHour = v ?? undefined))} suffix="€" />
        </span>
      </td>
      <td className="text-right kw-tnum text-slate-500 text-xs">
        {suggestion != null ? (
          <button
            type="button"
            className="hover:text-cyan-700 hover:underline"
            title="Vorschlag übernehmen (bei 300 Einsatzstunden/Jahr)"
            onClick={() => onUpdate(m.id, (x) => void (x.hourlyRate = Math.round(suggestion * 100) / 100))}
          >
            {fmtEur(suggestion)}/h
          </button>
        ) : (
          '—'
        )}
      </td>
      <td className="text-right">
        <span className="inline-flex w-24 justify-end">
          <NumberInput cell value={m.hourlyRate} min={0} onChange={(v) => v != null && onUpdate(m.id, (x) => void (x.hourlyRate = v))} suffix="€/h" />
        </span>
      </td>
      <td>
        <button
          type="button"
          className="kw-press rounded p-1 text-slate-400 hover:text-error-600 hover:bg-error-50"
          onClick={() => onDelete(m.id)}
          title="Löschen (bei Verwendung: deaktivieren)"
        >
          <Trash2 size={13} />
        </button>
      </td>
    </tr>
  );
}
