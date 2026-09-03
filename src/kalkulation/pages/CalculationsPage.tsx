/** Kalkulationsübersicht mit Status-Filter, Suche und Schnellaktionen. */

import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calculator, Copy, Plus, Trash2 } from 'lucide-react';
import type { CalculationStatus } from '../lib/types';
import { CALCULATION_STATUS_LABELS } from '../lib/types';
import { engineContext, useKwStore } from '../lib/store';
import { computeCalculation, computeHealth } from '../lib/engine';
import { fmtDate, fmtEur0, fmtHours, fmtPct } from '../lib/format';
import { Button, Card, ConfirmModal, EmptyState, Select, TextInput, toast } from '../components/ui';
import { HealthRing, StatusBadge } from '../components/domain';
import { BASE, PageHeader } from '../components/shell';

export default function CalculationsPage() {
  const data = useKwStore((st) => st.data);
  const duplicateCalculation = useKwStore((st) => st.duplicateCalculation);
  const deleteCalculation = useKwStore((st) => st.deleteCalculation);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [toDelete, setToDelete] = useState<string | null>(null);

  const statusFilter = (params.get('status') ?? 'alle') as CalculationStatus | 'alle';

  const rows = useMemo(() => {
    const ctx = engineContext(data);
    const q = query.trim().toLowerCase();
    return data.calculations
      .filter((c) => statusFilter === 'alle' || c.status === statusFilter)
      .filter((c) => {
        if (!q) return true;
        const customer = data.customers.find((k) => k.id === c.customerId);
        const object = data.objects.find((o) => o.id === c.objectId);
        return `${c.name} ${c.number} ${customer?.company ?? ''} ${object?.name ?? ''}`.toLowerCase().includes(q);
      })
      .map((calc) => {
        const totals = computeCalculation(calc, ctx);
        return {
          calc,
          totals,
          health: computeHealth(calc, totals, ctx),
          customer: data.customers.find((k) => k.id === calc.customerId),
          object: data.objects.find((o) => o.id === calc.objectId),
        };
      })
      .sort((a, b) => new Date(b.calc.updatedAt).getTime() - new Date(a.calc.updatedAt).getTime());
  }, [data, query, statusFilter]);

  return (
    <div className="max-w-[1300px] mx-auto">
      <PageHeader
        crumbs={[{ label: 'KlarWerk Kalkulation', to: BASE }, { label: 'Kalkulationen' }]}
        title="Kalkulationen"
        sub={`${data.calculations.length} Kalkulationen gesamt`}
        actions={
          <Button icon={<Plus size={14} />} onClick={() => navigate(`${BASE}/kalkulationen/neu`)}>
            Neue Kalkulation
          </Button>
        }
      />

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <TextInput
          className="max-w-xs"
          placeholder="Suchen …"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select
          className="!w-auto"
          value={statusFilter}
          onChange={(e) => {
            const v = e.target.value;
            if (v === 'alle') params.delete('status');
            else params.set('status', v);
            setParams(params, { replace: true });
          }}
        >
          <option value="alle">Alle Status</option>
          {(Object.keys(CALCULATION_STATUS_LABELS) as CalculationStatus[]).map((s) => (
            <option key={s} value={s}>
              {CALCULATION_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>

      <Card padded={false}>
        {rows.length === 0 ? (
          <EmptyState
            icon={<Calculator size={32} />}
            title="Keine Kalkulationen gefunden"
            description="Starten Sie mit dem geführten Assistenten, der Schnellkalkulation oder dem KI-Assistenten."
            action={<Button onClick={() => navigate(`${BASE}/kalkulationen/neu`)}>Neue Kalkulation</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="kw-table">
              <thead>
                <tr>
                  <th>Kalkulation</th>
                  <th>Kunde / Objekt</th>
                  <th className="!text-right">Sollstunden</th>
                  <th className="!text-right">Angebotswert</th>
                  <th className="!text-right">Marge</th>
                  <th className="!text-center">Qualität</th>
                  <th>Status</th>
                  <th className="!text-right">Geändert</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ calc, totals, health, customer, object }) => (
                  <tr key={calc.id} className="cursor-pointer" onClick={() => navigate(`${BASE}/kalkulationen/${calc.id}`)}>
                    <td>
                      <span className="block font-semibold text-slate-800 truncate max-w-[240px]">{calc.name}</span>
                      <span className="text-[10px] text-slate-400">{calc.number}</span>
                    </td>
                    <td>
                      <span className="block text-slate-700 truncate max-w-[180px]">{customer?.company ?? '—'}</span>
                      <span className="text-[10px] text-slate-400 truncate">{object?.name ?? ''}</span>
                    </td>
                    <td className="text-right kw-tnum">{totals.monthlyHours > 0 ? fmtHours(totals.monthlyHours, 1) : '—'}</td>
                    <td className="text-right kw-tnum font-semibold text-slate-800">
                      {totals.monthlyHours > 0
                        ? `${fmtEur0(totals.selected.net)}/M.`
                        : totals.oneTime
                          ? fmtEur0(totals.oneTime.price.net)
                          : '—'}
                    </td>
                    <td className="text-right kw-tnum">
                      {totals.monthlyHours > 0 ? (
                        <span
                          className={
                            totals.selected.marginPct >= data.settings.calculation.warnMarginPct
                              ? 'text-brand-700 font-semibold'
                              : totals.selected.marginPct >= data.settings.calculation.minMarginPct
                                ? 'text-amber-600 font-semibold'
                                : 'text-error-600 font-semibold'
                          }
                        >
                          {fmtPct(totals.selected.marginPct, 1)}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="text-center">
                      <span className="inline-block align-middle">
                        <HealthRing score={health.score} size={30} />
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={calc.status} />
                    </td>
                    <td className="text-right kw-tnum text-slate-500">{fmtDate(calc.updatedAt)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <span className="flex items-center gap-0.5">
                        <button
                          type="button"
                          title="Duplizieren"
                          className="kw-press rounded p-1 text-slate-400 hover:text-cyan-700 hover:bg-cyan-50"
                          onClick={() => {
                            const copy = duplicateCalculation(calc.id);
                            if (copy) {
                              toast(`Als ${copy.number} dupliziert.`);
                              navigate(`${BASE}/kalkulationen/${copy.id}`);
                            }
                          }}
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          type="button"
                          title="Löschen"
                          className="kw-press rounded p-1 text-slate-400 hover:text-error-600 hover:bg-error-50"
                          onClick={() => setToDelete(calc.id)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ConfirmModal
        open={toDelete != null}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteCalculation(toDelete);
          toast('Kalkulation gelöscht.');
        }}
        title="Kalkulation löschen?"
        message="Die Kalkulation wird unwiderruflich gelöscht (inkl. Angebot und Nachkalkulation)."
      />
    </div>
  );
}
