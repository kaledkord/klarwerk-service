/**
 * Räume & Leistungen: die zentrale Kalkulationstabelle.
 * Jede Zeile = eine Leistungsposition mit EIGENEM Turnus, eigenen
 * Leistungswerten, Faktoren und Kosten. Gruppiert nach Bereichen.
 */

import { useMemo, useState } from 'react';
import { AlertTriangle, ListPlus, PenLine, Plus, Search, Settings2, Trash2 } from 'lucide-react';
import type { CalcLine, Calculation, CleaningObject, Room, Service } from '../../lib/types';
import { FACTOR_GROUP_LABELS, MATERIAL_MODE_LABELS } from '../../lib/types';
import { FACTOR_GROUP_ORDER, isPerformancePlausible } from '../../lib/engine';
import { useKwStore } from '../../lib/store';
import { lineFromService, factorsFromRoom } from '../../lib/lines';
import { ROOM_TEMPLATES, templateForRoomTypeName } from '../../lib/templates';
import { fmtEur, fmtHours, fmtNum } from '../../lib/format';
import type { CalcResults } from '../domain';
import { FrequencyPicker, PerfDerivationView } from '../domain';
import {
  Badge,
  Button,
  Card,
  cx,
  EmptyState,
  FieldLabel,
  InfoTip,
  Modal,
  NumberInput,
  Select,
  Textarea,
  TextInput,
  toast,
  Toggle,
} from '../ui';

interface TabProps {
  calc: Calculation;
  results: CalcResults;
  update: (fn: (c: Calculation) => void, undoable?: boolean) => void;
  object?: CleaningObject;
}

export function LinesTab({ calc, results, update, object }: TabProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [detailLineId, setDetailLineId] = useState<string | null>(null);
  const [areaFilter, setAreaFilter] = useState<string>('alle');

  const { totals } = results;
  const areas = useMemo(() => {
    const seen: string[] = [];
    for (const l of calc.lines) {
      if (!seen.includes(l.areaLabel)) seen.push(l.areaLabel);
    }
    return seen;
  }, [calc.lines]);

  const grouped = useMemo(() => {
    const filtered = areaFilter === 'alle' ? calc.lines : calc.lines.filter((l) => l.areaLabel === areaFilter);
    const map = new Map<string, CalcLine[]>();
    for (const line of [...filtered].sort((a, b) => a.sortOrder - b.sortOrder)) {
      const list = map.get(line.areaLabel) ?? [];
      list.push(line);
      map.set(line.areaLabel, list);
    }
    return [...map.entries()];
  }, [calc.lines, areaFilter]);

  const detailLine = detailLineId ? calc.lines.find((l) => l.id === detailLineId) : null;
  const objectRooms = useMemo(
    () => (object ? object.buildings.flatMap((b) => b.floors.flatMap((f) => f.rooms)) : []),
    [object]
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Button icon={<Plus size={14} />} onClick={() => setAddOpen(true)}>
          Leistung hinzufügen
        </Button>
        {objectRooms.length > 0 ? (
          <Button variant="outline" icon={<ListPlus size={14} />} onClick={() => setImportOpen(true)}>
            Aus Objektstruktur übernehmen
          </Button>
        ) : null}
        {areas.length > 1 ? (
          <Select className="!w-auto" value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}>
            <option value="alle">Alle Bereiche</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </Select>
        ) : null}
        <p className="ml-auto text-[11px] text-slate-400">
          Jede Position hat ihren eigenen Turnus — Mengen, Leistungswerte und Turnusse sind direkt in der Tabelle editierbar.
        </p>
      </div>

      {calc.lines.length === 0 ? (
        <Card padded={false}>
          <EmptyState
            icon={<ListPlus size={32} />}
            title="Noch keine Leistungspositionen"
            description="Fügen Sie Leistungen aus der Bibliothek hinzu oder übernehmen Sie die Objektstruktur mit Standard-Leistungspaketen je Raumtyp."
            action={
              <span className="flex gap-2">
                <Button onClick={() => setAddOpen(true)}>Leistung hinzufügen</Button>
                {objectRooms.length > 0 ? (
                  <Button variant="outline" onClick={() => setImportOpen(true)}>
                    Objektstruktur übernehmen
                  </Button>
                ) : null}
              </span>
            }
          />
        </Card>
      ) : (
        <Card padded={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="kw-table min-w-[1080px]">
              <thead>
                <tr>
                  <th className="w-8">Nr.</th>
                  <th>Raum</th>
                  <th>Leistung</th>
                  <th className="!text-right">Menge</th>
                  <th>Einheit</th>
                  <th className="!text-right">Leistungswert</th>
                  <th className="!text-right">Zeit/Durchf.</th>
                  <th>Turnus</th>
                  <th className="!text-right">Durchf./M.</th>
                  <th className="!text-right">Std./M.</th>
                  <th className="!text-right">Kosten/M.</th>
                  <th className="!text-right">Preis/M.</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {grouped.map(([area, lines]) => {
                  const areaResults = lines.map((l) => totals.lines.find((r) => r.lineId === l.id)!);
                  const areaHours = areaResults.reduce((s, r) => s + (r?.monthlyHours ?? 0), 0);
                  const areaCost = lines.reduce((s, l) => s + (totals.perLine[l.id]?.fullCost ?? 0), 0);
                  const areaPrice = lines.reduce((s, l) => s + (totals.perLine[l.id]?.price ?? 0), 0);
                  let counter = 0;
                  return [
                    <tr key={`area-${area}`} className="!bg-slate-50/80">
                      <td colSpan={9} className="!py-1.5">
                        <span className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
                          {area || 'Ohne Bereich'}
                        </span>
                      </td>
                      <td className="!py-1.5 text-right kw-tnum text-[11px] font-bold text-slate-500">
                        {fmtNum(areaHours, 2)} h
                      </td>
                      <td className="!py-1.5 text-right kw-tnum text-[11px] font-bold text-slate-500">
                        {fmtEur(areaCost)}
                      </td>
                      <td className="!py-1.5 text-right kw-tnum text-[11px] font-bold text-slate-500">
                        {fmtEur(areaPrice)}
                      </td>
                      <td className="!py-1.5"></td>
                    </tr>,
                    ...lines.map((line) => {
                      counter += 1;
                      const r = totals.lines.find((x) => x.lineId === line.id)!;
                      const perLine = totals.perLine[line.id];
                      const implausible =
                        line.unit !== 'h' &&
                        line.unit !== 'Pauschale' &&
                        !isPerformancePlausible(line.unit, r.perf.value);
                      return (
                        <tr key={line.id}>
                          <td className="text-slate-400 kw-tnum">{counter}</td>
                          <td className="max-w-[140px]">
                            <span className="block truncate text-slate-600" title={line.roomLabel}>
                              {line.roomLabel}
                            </span>
                          </td>
                          <td className="max-w-[220px]">
                            <button
                              type="button"
                              className="block w-full truncate text-left font-semibold text-slate-800 hover:text-cyan-700"
                              title={`${line.serviceName} — Details öffnen`}
                              onClick={() => setDetailLineId(line.id)}
                            >
                              {line.serviceName}
                            </button>
                            {line.note ? (
                              <span className="block truncate text-[10px] text-slate-400" title={line.note}>
                                {line.note}
                              </span>
                            ) : null}
                          </td>
                          <td className="w-24">
                            <NumberInput
                              cell
                              value={line.quantity}
                              decimals={2}
                              min={0}
                              onChange={(v) =>
                                update((c) => {
                                  const l = c.lines.find((x) => x.id === line.id);
                                  if (l) l.quantity = v ?? 0;
                                })
                              }
                            />
                          </td>
                          <td className="text-slate-500">{line.unit}</td>
                          <td className="w-28">
                            {line.unit === 'h' || line.unit === 'Pauschale' ? (
                              <span className="block text-right text-slate-400">—</span>
                            ) : (
                              <span className="flex items-center justify-end gap-1">
                                {r.perf.manual ? (
                                  <PenLine size={11} className="shrink-0 text-amber-500" aria-label="Manuell angepasst" />
                                ) : null}
                                {implausible ? (
                                  <AlertTriangle size={11} className="shrink-0 text-error-500" aria-label="Unplausibler Leistungswert" />
                                ) : null}
                                <NumberInput
                                  cell
                                  className="w-16"
                                  value={Math.round(r.perf.value * 10) / 10}
                                  decimals={1}
                                  min={0.1}
                                  onChange={(v) =>
                                    update((c) => {
                                      const l = c.lines.find((x) => x.id === line.id);
                                      if (!l) return;
                                      l.manualPerformanceValue = v;
                                    })
                                  }
                                />
                                <InfoTip label="Herleitung des Leistungswerts">
                                  <PerfDerivationView perf={r.perf} unit={line.unit} />
                                  {r.perf.manual ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="mt-2"
                                      onClick={() =>
                                        update((c) => {
                                          const l = c.lines.find((x) => x.id === line.id);
                                          if (!l) {
                                            return;
                                          }
                                          l.manualPerformanceValue = null;
                                          l.manualPerformanceReason = undefined;
                                        })
                                      }
                                    >
                                      Auf Automatik zurücksetzen
                                    </Button>
                                  ) : null}
                                </InfoTip>
                              </span>
                            )}
                          </td>
                          <td className="text-right kw-tnum text-slate-600">
                            {fmtNum(r.timePerExecutionH, 3)} h
                          </td>
                          <td className="w-44">
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
                          </td>
                          <td className="w-20">
                            {r.oneTime || r.onDemand ? (
                              <span className="block text-right text-[10px] font-semibold text-slate-400">
                                {r.oneTime ? 'einmalig' : 'Abruf'}
                              </span>
                            ) : (
                              <span className="flex items-center justify-end gap-0.5">
                                {r.execManual ? <PenLine size={10} className="text-amber-500 shrink-0" aria-label="Manuell" /> : null}
                                <NumberInput
                                  cell
                                  className="w-14"
                                  value={Math.round(r.executionsPerMonth * 100) / 100}
                                  decimals={2}
                                  min={0}
                                  onChange={(v) =>
                                    update((c) => {
                                      const l = c.lines.find((x) => x.id === line.id);
                                      if (l) l.manualExecutionsPerMonth = v;
                                    })
                                  }
                                />
                              </span>
                            )}
                          </td>
                          <td className="text-right kw-tnum font-semibold text-slate-800">
                            {r.recurring ? fmtNum(r.monthlyHours, 2) : '—'}
                          </td>
                          <td className="text-right kw-tnum text-slate-600">
                            {r.recurring ? fmtEur(perLine?.fullCost ?? r.directCost) : fmtEur(r.perExecutionCost)}
                          </td>
                          <td className="text-right kw-tnum font-semibold text-slate-800">
                            {fmtEur(perLine?.price ?? 0)}
                            {!r.recurring ? (
                              <span className="block text-[9px] font-normal text-slate-400">je Durchf.</span>
                            ) : null}
                          </td>
                          <td>
                            <span className="flex items-center justify-end gap-0.5">
                              <button
                                type="button"
                                title="Position im Detail bearbeiten (Faktoren, Material, Maschine, Zuschläge)"
                                className="kw-press rounded p-1 text-slate-400 hover:text-cyan-700 hover:bg-cyan-50"
                                onClick={() => setDetailLineId(line.id)}
                              >
                                <Settings2 size={13} />
                              </button>
                              <button
                                type="button"
                                title="Position löschen"
                                className="kw-press rounded p-1 text-slate-400 hover:text-error-600 hover:bg-error-50"
                                onClick={() =>
                                  update((c) => {
                                    c.lines = c.lines.filter((x) => x.id !== line.id);
                                  })
                                }
                              >
                                <Trash2 size={13} />
                              </button>
                            </span>
                          </td>
                        </tr>
                      );
                    }),
                  ];
                })}
              </tbody>
              <tfoot>
                <tr className="!bg-navy-950">
                  <td colSpan={9} className="!py-2 text-[11px] font-extrabold uppercase tracking-wide text-white">
                    Summe (wiederkehrend je Monat)
                  </td>
                  <td className="!py-2 text-right kw-tnum text-xs font-extrabold text-white">
                    {fmtHours(totals.monthlyHours, 2)}
                  </td>
                  <td className="!py-2 text-right kw-tnum text-xs font-extrabold text-white">{fmtEur(totals.selfCost)}</td>
                  <td className="!py-2 text-right kw-tnum text-xs font-extrabold text-brand-300">
                    {fmtEur(totals.selected.net)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      {totals.oneTime ? (
        <p className="mt-2 text-[11px] text-slate-500">
          Zusätzlich einmalige Leistungen: {fmtHours(totals.oneTime.hours, 1)} ·{' '}
          Kosten {fmtEur(totals.oneTime.cost)} · Angebotspreis {fmtEur(totals.oneTime.price.net)} (netto, einmalig).
        </p>
      ) : null}

      {addOpen ? (
        <AddLinesModal
          calc={calc}
          object={object}
          onClose={() => setAddOpen(false)}
          update={update}
        />
      ) : null}
      {importOpen && object ? (
        <StructureImportModal calc={calc} object={object} onClose={() => setImportOpen(false)} update={update} />
      ) : null}
      {detailLine ? (
        <LineDetailModal
          line={detailLine}
          results={results}
          onClose={() => setDetailLineId(null)}
          update={update}
        />
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Leistungen hinzufügen
// ─────────────────────────────────────────────────────────────────────────────

function AddLinesModal({
  calc,
  object,
  onClose,
  update,
}: {
  calc: Calculation;
  object?: CleaningObject;
  onClose: () => void;
  update: TabProps['update'];
}) {
  const data = useKwStore((st) => st.data);
  const rooms = useMemo(
    () => (object ? object.buildings.flatMap((b) => b.floors.flatMap((f) => f.rooms.map((r) => ({ room: r, building: b.name })))) : []),
    [object]
  );
  const [roomId, setRoomId] = useState<string>(rooms[0]?.room.id ?? '');
  const [freeArea, setFreeArea] = useState('Allgemein');
  const [freeRoom, setFreeRoom] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const useStructure = rooms.length > 0 && roomId !== '__free__';
  const room: Room | undefined = useStructure ? rooms.find((r) => r.room.id === roomId)?.room : undefined;

  const services = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.serviceCategories
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((cat) => ({
        cat,
        services: data.services.filter(
          (s) => s.active && s.categoryId === cat.id && (!q || s.name.toLowerCase().includes(q))
        ),
      }))
      .filter((g) => g.services.length > 0);
  }, [data, query]);

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const add = () => {
    const chosen: Service[] = data.services.filter((s) => selected[s.id]);
    if (chosen.length === 0) {
      toast('Bitte mindestens eine Leistung auswählen.', 'error');
      return;
    }
    const areaLabel = room ? (room.areaLabel ?? room.name) : freeArea.trim() || 'Allgemein';
    const roomLabel = room ? room.name : freeRoom.trim() || areaLabel;
    const maxSort = calc.lines.reduce((m, l) => Math.max(m, l.sortOrder), 0);
    update((c) => {
      chosen.forEach((service, i) => {
        c.lines.push(
          lineFromService(service, data.settings, {
            areaLabel,
            roomLabel,
            roomId: room?.id,
            quantity: service.unit === 'm²' ? (room?.areaSqm ?? 0) : 1,
            factors: factorsFromRoom(room),
            sortOrder: maxSort + (i + 1) * 10,
          })
        );
      });
    });
    toast(`${chosen.length} Leistung(en) hinzugefügt — Turnus je Position prüfen.`);
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Leistungen hinzufügen"
      width="max-w-2xl"
      footer={
        <>
          <span className="mr-auto text-xs text-slate-500">{selectedCount} ausgewählt</span>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={add} disabled={selectedCount === 0}>
            Hinzufügen
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          {rooms.length > 0 ? (
            <div className="sm:col-span-2">
              <FieldLabel>Raum aus der Objektstruktur</FieldLabel>
              <Select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
                {rooms.map(({ room: r, building }) => (
                  <option key={r.id} value={r.id}>
                    {building} · {r.name} ({fmtNum(r.areaSqm, 1)} m²)
                  </option>
                ))}
                <option value="__free__">Freie Eingabe (ohne Raumbezug)</option>
              </Select>
            </div>
          ) : null}
          {!useStructure ? (
            <>
              <div>
                <FieldLabel>Bereich</FieldLabel>
                <TextInput value={freeArea} onChange={(e) => setFreeArea(e.target.value)} placeholder="z. B. Bürobereich" />
              </div>
              <div>
                <FieldLabel>Raum / Bezeichnung</FieldLabel>
                <TextInput value={freeRoom} onChange={(e) => setFreeRoom(e.target.value)} placeholder="z. B. Büro 1" />
              </div>
            </>
          ) : null}
        </div>

        <div className="relative">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <TextInput
            className="!pl-8"
            placeholder="Leistung suchen …"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        <div className="max-h-72 overflow-y-auto rounded-lg border border-slate-200">
          {services.map(({ cat, services: list }) => (
            <div key={cat.id}>
              <p className="sticky top-0 bg-slate-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-slate-400 border-b border-slate-100">
                {cat.name}
              </p>
              {list.map((s) => (
                <label
                  key={s.id}
                  className="flex cursor-pointer items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-slate-50 border-b border-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(selected[s.id])}
                    onChange={(e) => setSelected((sel) => ({ ...sel, [s.id]: e.target.checked }))}
                    className="h-3.5 w-3.5 accent-[#188a3c]"
                  />
                  <span className="min-w-0 flex-1 truncate text-slate-700">{s.name}</span>
                  <span className="shrink-0 text-[10px] text-slate-400 kw-tnum">
                    {s.unit === 'h' || s.unit === 'Pauschale' ? 'nach Aufwand' : `${fmtNum(s.defaultPerformanceValue, 0)} ${s.unit}/h`}
                  </span>
                  <Badge tone="outline" className="shrink-0">
                    {useKwStore.getState().data.frequencies.find((f) => f.id === s.defaultFrequencyId)?.name ?? 'Turnus wählen'}
                  </Badge>
                </label>
              ))}
            </div>
          ))}
          {services.length === 0 ? <p className="px-3 py-6 text-center text-xs text-slate-400">Keine Treffer.</p> : null}
        </div>
        <p className="text-[11px] text-slate-400">
          Der Turnus wird je Position mit dem Standard der Leistung vorbelegt und kann anschließend in der Tabelle
          einzeln angepasst werden.
        </p>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Objektstruktur übernehmen (Leistungspakete je Raumtyp)
// ─────────────────────────────────────────────────────────────────────────────

function StructureImportModal({
  calc,
  object,
  onClose,
  update,
}: {
  calc: Calculation;
  object: CleaningObject;
  onClose: () => void;
  update: TabProps['update'];
}) {
  const data = useKwStore((st) => st.data);
  const rooms = useMemo(
    () =>
      object.buildings.flatMap((b) =>
        b.floors.flatMap((f) =>
          f.rooms.map((room) => ({
            room,
            location: `${b.name} · ${f.name}`,
            template: templateForRoomTypeName(data.roomTypes.find((t) => t.id === room.roomTypeId)?.name ?? room.name),
          }))
        )
      ),
    [object, data.roomTypes]
  );
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(rooms.map((r) => [r.room.id, true]))
  );
  const [mainFreq, setMainFreq] = useState('fq_2w');
  const [skipExisting, setSkipExisting] = useState(true);

  const existingRoomIds = useMemo(() => new Set(calc.lines.map((l) => l.roomId).filter(Boolean)), [calc.lines]);

  const run = () => {
    const chosen = rooms.filter((r) => checked[r.room.id] && r.template);
    if (chosen.length === 0) {
      toast('Bitte mindestens einen Raum auswählen.', 'error');
      return;
    }
    let added = 0;
    const maxSort = calc.lines.reduce((m, l) => Math.max(m, l.sortOrder), 0);
    update((c) => {
      let sort = maxSort;
      for (const { room, template } of chosen) {
        if (skipExisting && existingRoomIds.has(room.id)) continue;
        const tpl = ROOM_TEMPLATES[template!];
        for (const item of tpl.items) {
          const service = data.services.find((s) => s.id === item.serviceId);
          if (!service || !service.active) continue;
          sort += 10;
          c.lines.push(
            lineFromService(service, data.settings, {
              areaLabel: room.areaLabel ?? tpl.label,
              roomLabel: room.name,
              roomId: room.id,
              quantity: service.unit === 'm²' ? room.areaSqm : item.qty(room.areaSqm),
              frequencyId: item.freq === 'main' ? mainFreq : item.freq,
              factors: factorsFromRoom(room),
              sortOrder: sort,
            })
          );
          added += 1;
        }
      }
    });
    toast(added > 0 ? `${added} Positionen aus der Objektstruktur erstellt.` : 'Keine neuen Positionen (Räume bereits kalkuliert).');
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Objektstruktur übernehmen"
      width="max-w-xl"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={run}>Leistungspakete erstellen</Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-xs text-slate-500">
          Für jeden ausgewählten Raum wird das passende Standard-Leistungspaket seines Raumtyps erstellt.
          Spezielle Leistungen (z. B. Sockelleisten monatlich, Fenster monatlich) behalten ihren eigenen Turnus.
        </p>
        <div>
          <FieldLabel>Haupt-Turnus für die Grundleistungen</FieldLabel>
          <FrequencyPicker value={mainFreq} onChange={setMainFreq} />
        </div>
        <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200 divide-y divide-slate-50">
          {rooms.map(({ room, location, template }) => (
            <label key={room.id} className="flex cursor-pointer items-center gap-2.5 px-3 py-1.5 text-sm hover:bg-slate-50">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 accent-[#188a3c]"
                checked={Boolean(checked[room.id])}
                onChange={(e) => setChecked((c) => ({ ...c, [room.id]: e.target.checked }))}
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold text-slate-700">
                  {room.name}
                  {existingRoomIds.has(room.id) ? (
                    <span className="ml-1.5 text-[10px] font-normal text-amber-600">bereits kalkuliert</span>
                  ) : null}
                </span>
                <span className="text-[10px] text-slate-400">{location} · {fmtNum(room.areaSqm, 1)} m²</span>
              </span>
              <Badge tone="outline">{template ? ROOM_TEMPLATES[template].label : '—'}</Badge>
            </label>
          ))}
        </div>
        <Toggle checked={skipExisting} onChange={setSkipExisting} label="Bereits kalkulierte Räume überspringen" />
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Positionsdetails
// ─────────────────────────────────────────────────────────────────────────────

function LineDetailModal({
  line,
  results,
  onClose,
  update,
}: {
  line: CalcLine;
  results: CalcResults;
  onClose: () => void;
  update: TabProps['update'];
}) {
  const data = useKwStore((st) => st.data);
  const r = results.totals.lines.find((x) => x.lineId === line.id);
  const factorConfig = data.settings.performanceFactors;

  const patch = (fn: (l: CalcLine) => void) =>
    update((c) => {
      const l = c.lines.find((x) => x.id === line.id);
      if (l) fn(l);
    });

  return (
    <Modal
      open
      onClose={onClose}
      title={
        <span>
          {line.serviceName}
          <span className="ml-2 text-[11px] font-normal text-slate-400">
            {line.areaLabel} · {line.roomLabel}
          </span>
        </span>
      }
      width="max-w-3xl"
      footer={<Button onClick={onClose}>Fertig</Button>}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <FieldLabel>Bereich</FieldLabel>
              <TextInput value={line.areaLabel} onChange={(e) => patch((l) => void (l.areaLabel = e.target.value))} />
            </div>
            <div>
              <FieldLabel>Raum</FieldLabel>
              <TextInput value={line.roomLabel} onChange={(e) => patch((l) => void (l.roomLabel = e.target.value))} />
            </div>
          </div>
          <div>
            <FieldLabel>Bezeichnung der Leistung</FieldLabel>
            <TextInput value={line.serviceName} onChange={(e) => patch((l) => void (l.serviceName = e.target.value))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <FieldLabel>Menge ({line.unit})</FieldLabel>
              <NumberInput value={line.quantity} min={0} onChange={(v) => patch((l) => void (l.quantity = v ?? 0))} />
            </div>
            <div>
              <FieldLabel>Turnus dieser Position</FieldLabel>
              <FrequencyPicker value={line.frequencyId} onChange={(fid) => patch((l) => void (l.frequencyId = fid))} />
            </div>
          </div>

          <div>
            <FieldLabel>Anpassungsfaktoren</FieldLabel>
            <div className="grid grid-cols-2 gap-2">
              {FACTOR_GROUP_ORDER.map((group) => (
                <div key={group}>
                  <span className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                    {FACTOR_GROUP_LABELS[group]}
                  </span>
                  <Select
                    className="!py-1.5 !text-xs"
                    value={line.factors[group]}
                    onChange={(e) => patch((l) => void (l.factors = { ...l.factors, [group]: e.target.value }))}
                  >
                    {factorConfig[group].map((o) => (
                      <option key={o.key} value={o.key}>
                        {o.label}
                        {o.multiplier !== 1 ? ` (${o.multiplier > 1 ? '+' : ''}${Math.round((o.multiplier - 1) * 100)} %)` : ''}
                      </option>
                    ))}
                  </Select>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
            {r ? <PerfDerivationView perf={r.perf} unit={line.unit} /> : null}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <FieldLabel hint="(leer = automatisch)">Leistungswert manuell</FieldLabel>
                <NumberInput
                  value={line.manualPerformanceValue ?? null}
                  min={0.1}
                  decimals={1}
                  onChange={(v) => patch((l) => void (l.manualPerformanceValue = v))}
                  placeholder="automatisch"
                />
              </div>
              <div>
                <FieldLabel>Grund der Anpassung</FieldLabel>
                <TextInput
                  value={line.manualPerformanceReason ?? ''}
                  onChange={(e) => patch((l) => void (l.manualPerformanceReason = e.target.value))}
                  placeholder="z. B. Erfahrungswert Objekt"
                  disabled={line.manualPerformanceValue == null}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <FieldLabel>Material-Berechnung</FieldLabel>
              <Select
                value={line.materialMode}
                onChange={(e) => patch((l) => void (l.materialMode = e.target.value as CalcLine['materialMode']))}
              >
                {(Object.keys(MATERIAL_MODE_LABELS) as (keyof typeof MATERIAL_MODE_LABELS)[]).map((m) => (
                  <option key={m} value={m}>
                    {MATERIAL_MODE_LABELS[m]}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <FieldLabel>Materialwert (€)</FieldLabel>
              <NumberInput
                value={line.materialValue}
                min={0}
                onChange={(v) => patch((l) => void (l.materialValue = v ?? 0))}
                disabled={line.materialMode === 'none'}
              />
            </div>
          </div>
          <div>
            <FieldLabel>Maschine</FieldLabel>
            <Select
              value={line.machineId ?? ''}
              onChange={(e) => patch((l) => void (l.machineId = e.target.value || null))}
            >
              <option value="">Keine Maschine</option>
              {data.machines
                .filter((m) => m.active)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({fmtEur(m.hourlyRate)}/h)
                  </option>
                ))}
            </Select>
          </div>
          <div>
            <FieldLabel>Zuschlag (nur für diese Position)</FieldLabel>
            <Select
              value={line.surchargeKey}
              onChange={(e) => patch((l) => void (l.surchargeKey = e.target.value as CalcLine['surchargeKey']))}
            >
              <option value="none">Kein Zuschlag</option>
              {data.settings.labor.surcharges.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label} (+{fmtNum(s.pct, 0)} %)
                </option>
              ))}
            </Select>
          </div>
          <div>
            <FieldLabel hint="(überschreibt die Berechnung Menge ÷ Leistungswert)">Zeit je Durchführung manuell</FieldLabel>
            <NumberInput
              value={line.manualTimePerExecutionH ?? null}
              min={0}
              decimals={3}
              onChange={(v) => patch((l) => void (l.manualTimePerExecutionH = v))}
              placeholder="automatisch"
              suffix="h"
            />
          </div>
          <div>
            <FieldLabel>Notiz zur Position</FieldLabel>
            <Textarea rows={2} value={line.note ?? ''} onChange={(e) => patch((l) => void (l.note = e.target.value))} />
          </div>

          {r ? (
            <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs space-y-1">
              <p className="font-semibold text-slate-700 mb-1.5">Berechnung dieser Position</p>
              <Row k="Zeit je Durchführung" v={`${fmtNum(r.timePerExecutionH, 3)} h`} />
              <Row k={`Durchführungen/Monat (${r.frequencyName})`} v={fmtNum(r.executionsPerMonth, 2)} />
              <Row k="Monatsstunden" v={fmtHours(r.monthlyHours, 2)} strong />
              <Row
                k={`Personalkosten (× ${fmtEur(results.totals.rate.employerRate)}/h${r.surchargePct > 0 ? ` +${fmtNum(r.surchargePct, 0)} % Zuschlag` : ''})`}
                v={fmtEur(r.laborCost)}
              />
              <Row k="Material" v={fmtEur(r.materialCost)} />
              <Row k="Maschine" v={fmtEur(r.machineCost)} />
              <Row k="Direkte Kosten/Monat" v={fmtEur(r.directCost)} strong />
              {!r.recurring ? <Row k="Kosten je Durchführung" v={fmtEur(r.perExecutionCost)} strong /> : null}
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className={cx('flex items-baseline justify-between gap-3', strong && 'font-bold text-slate-800')}>
      <span className="text-slate-500 min-w-0">{k}</span>
      <span className="kw-tnum shrink-0">{v}</span>
    </div>
  );
}
