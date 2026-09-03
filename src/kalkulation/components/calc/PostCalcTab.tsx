/**
 * Nachkalkulation: Soll/Ist je Monat, Abweichungsanalyse mit Gründen,
 * Ist-Marge — Grundlage der lernenden Kalkulation.
 */

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Calculation } from '../../lib/types';
import { analyzePostCalc, DEVIATION_REASONS } from '../../lib/engine';
import { uid } from '../../lib/id';
import { currentMonth, fmtEur, fmtHours, fmtMonth, fmtNum, fmtPct } from '../../lib/format';
import type { CalcResults } from '../domain';
import {
  Button,
  Callout,
  Card,
  cx,
  FieldLabel,
  KpiCard,
  Modal,
  NumberInput,
  SectionTitle,
  Textarea,
  TextInput,
  toast,
} from '../ui';

export function PostCalcTab({
  calc,
  results,
  update,
}: {
  calc: Calculation;
  results: CalcResults;
  update: (fn: (c: Calculation) => void, undoable?: boolean) => void;
}) {
  const { totals, ctx } = results;
  const [addOpen, setAddOpen] = useState(false);
  const analysis = analyzePostCalc(calc, totals, ctx);

  return (
    <div className="space-y-4">
      {calc.status !== 'gewonnen' && calc.postCalc.length === 0 ? (
        <Callout tone="info">
          Die Nachkalkulation vergleicht kalkulierte mit tatsächlichen Werten — typischerweise nach Auftragsbeginn
          (Status „Gewonnen“). Sie können trotzdem jederzeit Ist-Werte erfassen.
        </Callout>
      ) : null}

      {analysis ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard
            label="Stunden Soll → Ist (Ø)"
            value={`${fmtNum(analysis.plannedHours, 1)} → ${fmtNum(analysis.avgActualHours, 1)} h`}
            sub={`${analysis.hoursDeltaAbs >= 0 ? '+' : ''}${fmtNum(analysis.hoursDeltaAbs, 1)} h (${analysis.hoursDeltaPct >= 0 ? '+' : ''}${fmtNum(analysis.hoursDeltaPct, 1)} %)`}
            tone={Math.abs(analysis.hoursDeltaPct) <= 5 ? 'green' : analysis.hoursDeltaPct > 0 ? 'red' : 'blue'}
          />
          <KpiCard
            label="Material Soll → Ist (Ø)"
            value={`${fmtEur(analysis.avgActualMaterial)}`}
            sub={`kalkuliert ${fmtEur(analysis.plannedMaterial)}${analysis.plannedMaterial > 0 ? ` (${analysis.materialDeltaPct >= 0 ? '+' : ''}${fmtNum(analysis.materialDeltaPct, 0)} %)` : ''}`}
            tone={analysis.materialDeltaAbs > 0 ? 'amber' : 'default'}
          />
          <KpiCard
            label="Marge kalkuliert → tatsächlich"
            value={`${fmtPct(analysis.actualMarginPct, 1)}`}
            sub={`kalkuliert ${fmtPct(analysis.plannedMarginPct, 1)}`}
            tone={analysis.actualMarginPct >= ctx.settings.calculation.minMarginPct ? 'green' : 'red'}
          />
          <KpiCard
            label="Tatsächliche Kosten (Ø)"
            value={fmtEur(analysis.actualCost)}
            sub={`kalkuliert ${fmtEur(analysis.plannedCost)} · Erlös ${fmtEur(analysis.revenue)}`}
          />
        </div>
      ) : null}

      {analysis && Math.abs(analysis.hoursDeltaPct) > 8 ? (
        <Callout tone={analysis.hoursDeltaPct > 0 ? 'warn' : 'info'}>
          {analysis.hoursDeltaPct > 0 ? (
            <>
              Die tatsächlichen Stunden liegen im Schnitt <strong>{fmtNum(analysis.hoursDeltaPct, 0)} % über</strong> der
              Kalkulation. Mögliche Ursachen: Leistungswerte zu hoch angesetzt, Verschmutzung unterschätzt, Laufwege,
              Zusatzleistungen. Prüfen Sie die erfassten Gründe unten — die Bibliothek zeigt daraus eine
              Anpassungsempfehlung für Leistungswerte (lernende Kalkulation).
            </>
          ) : (
            <>
              Die tatsächlichen Stunden liegen <strong>{fmtNum(Math.abs(analysis.hoursDeltaPct), 0)} % unter</strong> der
              Kalkulation — hier besteht Spielraum für wettbewerbsfähigere Preise oder höhere Marge.
            </>
          )}
        </Callout>
      ) : null}

      <Card padded={false}>
        <div className="px-5 pt-4">
          <SectionTitle
            right={
              <Button size="sm" icon={<Plus size={12} />} onClick={() => setAddOpen(true)}>
                Monat erfassen
              </Button>
            }
          >
            Ist-Werte je Monat
          </SectionTitle>
        </div>
        {calc.postCalc.length === 0 ? (
          <p className="px-5 pb-5 text-xs text-slate-400">
            Noch keine Ist-Werte erfasst. Kalkulierte Basis: {fmtHours(totals.monthlyHours, 1)} und{' '}
            {fmtEur(totals.materialCost)} Material je Monat.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="kw-table">
              <thead>
                <tr>
                  <th>Monat</th>
                  <th className="!text-right">Ist-Stunden</th>
                  <th className="!text-right">Abweichung</th>
                  <th className="!text-right">Ist-Material</th>
                  <th>Gründe</th>
                  <th>Notiz</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {[...calc.postCalc]
                  .sort((a, b) => b.month.localeCompare(a.month))
                  .map((e) => {
                    const delta = totals.monthlyHours > 0 ? ((e.actualHours - totals.monthlyHours) / totals.monthlyHours) * 100 : 0;
                    return (
                      <tr key={e.id}>
                        <td className="font-semibold text-slate-800">{fmtMonth(e.month)}</td>
                        <td className="text-right kw-tnum">{fmtNum(e.actualHours, 1)} h</td>
                        <td className="text-right kw-tnum">
                          <span
                            className={cx(
                              'font-semibold',
                              Math.abs(delta) <= 5 ? 'text-brand-700' : delta > 0 ? 'text-error-600' : 'text-cyan-700'
                            )}
                          >
                            {delta >= 0 ? '+' : ''}
                            {fmtNum(delta, 1)} %
                          </span>
                        </td>
                        <td className="text-right kw-tnum">{fmtEur(e.actualMaterialCost)}</td>
                        <td className="max-w-[220px]">
                          <span className="block truncate text-[11px] text-slate-500" title={e.reasons.join(', ')}>
                            {e.reasons.length > 0 ? e.reasons.join(', ') : '—'}
                          </span>
                        </td>
                        <td className="max-w-[180px]">
                          <span className="block truncate text-[11px] text-slate-500" title={e.note}>
                            {e.note ?? '—'}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="kw-press rounded p-1 text-slate-400 hover:text-error-600 hover:bg-error-50"
                            title="Eintrag löschen"
                            onClick={() =>
                              update((c) => {
                                c.postCalc = c.postCalc.filter((x) => x.id !== e.id);
                              })
                            }
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {addOpen ? (
        <AddPostCalcModal
          plannedHours={totals.monthlyHours}
          plannedMaterial={totals.materialCost}
          onClose={() => setAddOpen(false)}
          onSave={(entry) => {
            update((c) => {
              c.postCalc.push(entry);
            });
            setAddOpen(false);
            toast('Ist-Werte erfasst.');
          }}
        />
      ) : null}
    </div>
  );
}

function AddPostCalcModal({
  plannedHours,
  plannedMaterial,
  onClose,
  onSave,
}: {
  plannedHours: number;
  plannedMaterial: number;
  onClose: () => void;
  onSave: (entry: Calculation['postCalc'][number]) => void;
}) {
  const [month, setMonth] = useState(currentMonth());
  const [hours, setHours] = useState<number | null>(null);
  const [material, setMaterial] = useState<number | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [note, setNote] = useState('');

  return (
    <Modal
      open
      onClose={onClose}
      title="Ist-Werte erfassen"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            onClick={() => {
              if (hours == null) {
                toast('Bitte die tatsächlichen Stunden angeben.', 'error');
                return;
              }
              onSave({
                id: uid('pc'),
                month,
                actualHours: hours,
                actualMaterialCost: material ?? 0,
                reasons,
                note: note.trim() || undefined,
              });
            }}
          >
            Speichern
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <FieldLabel>Monat</FieldLabel>
            <TextInput type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          </div>
          <div>
            <FieldLabel hint={`(Soll ${fmtNum(plannedHours, 1)})`}>Ist-Stunden</FieldLabel>
            <NumberInput value={hours} min={0} onChange={setHours} suffix="h" alignRight={false} />
          </div>
          <div>
            <FieldLabel hint={`(Soll ${fmtEur(plannedMaterial)})`}>Ist-Material</FieldLabel>
            <NumberInput value={material} min={0} onChange={setMaterial} suffix="€" alignRight={false} />
          </div>
        </div>
        <div>
          <FieldLabel>Gründe für Abweichungen</FieldLabel>
          <div className="grid grid-cols-2 gap-1">
            {DEVIATION_REASONS.map((r) => (
              <label key={r} className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs text-slate-600 hover:bg-slate-50">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 accent-[#188a3c]"
                  checked={reasons.includes(r)}
                  onChange={(e) =>
                    setReasons((rs) => (e.target.checked ? [...rs, r] : rs.filter((x) => x !== r)))
                  }
                />
                {r}
              </label>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel>Notiz</FieldLabel>
          <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}
