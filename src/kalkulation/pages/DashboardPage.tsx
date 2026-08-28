/**
 * Dashboard: persönliche Begrüßung, echte Unternehmenskennzahlen aus dem
 * Datenbestand, aktuelle Kalkulationen, Wirtschaftlichkeitswarnungen.
 */

import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  Clock,
  Euro,
  FileText,
  Percent,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useKwStore, engineContext } from '../lib/store';
import { computeCalculation, computeWarnings, analyzePostCalc } from '../lib/engine';
import { fmtDate, fmtEur0, fmtHours, fmtNum, fmtPct } from '../lib/format';
import { Badge, Button, Card, EmptyState, KpiCard, SectionTitle } from '../components/ui';
import { StatusBadge } from '../components/domain';
import { BASE, PageHeader } from '../components/shell';

const OPEN_STATUSES = new Set(['entwurf', 'in_bearbeitung', 'angebot_erstellt', 'angebot_versendet']);

function greeting(): string {
  const h = new Date().getHours();
  if (h < 11) return 'Guten Morgen';
  if (h < 18) return 'Guten Tag';
  return 'Guten Abend';
}

export default function DashboardPage() {
  const data = useKwStore((st) => st.data);
  const navigate = useNavigate();

  const model = useMemo(() => {
    const ctx = engineContext(data);
    const rows = data.calculations
      .filter((c) => c.status !== 'archiviert')
      .map((calc) => {
        const totals = computeCalculation(calc, ctx);
        const warnings = computeWarnings(calc, totals, ctx);
        const customer = data.customers.find((k) => k.id === calc.customerId);
        const object = data.objects.find((o) => o.id === calc.objectId);
        const post = analyzePostCalc(calc, totals, ctx);
        return { calc, totals, warnings, customer, object, post };
      });

    const active = rows.filter((r) => OPEN_STATUSES.has(r.calc.status));
    const openOffers = rows.filter(
      (r) => r.calc.status === 'angebot_erstellt' || r.calc.status === 'angebot_versendet'
    );
    const won = rows.filter((r) => r.calc.status === 'gewonnen');

    const offerVolume = openOffers.reduce((s, r) => s + r.totals.selected.net, 0);
    const wonRevenue = won.reduce((s, r) => s + r.totals.selected.net, 0);
    const wonHours = won.reduce((s, r) => s + r.totals.monthlyHours, 0);
    const withMargin = rows.filter((r) => r.totals.monthlyHours > 0);
    const avgMargin =
      withMargin.length > 0
        ? withMargin.reduce((s, r) => s + r.totals.selected.marginPct, 0) / withMargin.length
        : 0;
    const hourlyRates = withMargin.map((r) => r.totals.avgHourlyRevenue).filter((v) => v > 0);
    const avgHourly = hourlyRates.length > 0 ? hourlyRates.reduce((s, v) => s + v, 0) / hourlyRates.length : 0;

    const minMargin = data.settings.calculation.minMarginPct;
    const unprofitable = rows.filter(
      (r) => r.totals.monthlyHours > 0 && r.totals.selected.marginPct < minMargin
    );
    const withWarnings = rows.filter((r) =>
      r.warnings.some((w) => w.severity === 'error' || w.severity === 'warn')
    );

    // Wirtschaftlichkeitswarnungen (aggregiert, mit Nachkalkulations-Abweichungen)
    const econWarnings: { key: string; severity: 'error' | 'warn'; text: string; to: string }[] = [];
    for (const r of rows) {
      const to = `${BASE}/kalkulationen/${r.calc.id}`;
      const name = r.object?.name ?? r.calc.name;
      if (r.totals.monthlyHours > 0 && r.totals.selected.marginPct < minMargin) {
        econWarnings.push({
          key: `${r.calc.id}-margin`,
          severity: 'error',
          text: `${name} – Marge ${fmtPct(r.totals.selected.marginPct, 1)} unter Mindestwert (${fmtPct(minMargin, 0)})`,
          to,
        });
      }
      if (r.post && Math.abs(r.post.hoursDeltaPct) >= 10) {
        econWarnings.push({
          key: `${r.calc.id}-hours`,
          severity: 'warn',
          text: `${name} – Tatsächliche Stunden ${r.post.hoursDeltaPct > 0 ? '+' : ''}${fmtNum(r.post.hoursDeltaPct, 0)} % gegenüber Kalkulation`,
          to,
        });
      }
      if (r.post && r.post.plannedMaterial > 0 && r.post.materialDeltaPct >= 20) {
        econWarnings.push({
          key: `${r.calc.id}-material`,
          severity: 'warn',
          text: `${name} – Materialkosten ${fmtNum(r.post.materialDeltaPct, 0)} % über Kalkulation`,
          to,
        });
      }
      for (const w of r.warnings) {
        if (w.severity === 'error' && w.code !== 'margin_below_min') {
          econWarnings.push({ key: `${r.calc.id}-${w.code}`, severity: 'error', text: `${name} – ${w.message}`, to });
        }
      }
    }

    const recent = [...rows].sort(
      (a, b) => new Date(b.calc.updatedAt).getTime() - new Date(a.calc.updatedAt).getTime()
    );

    return {
      rows,
      active,
      openOffers,
      offerVolume,
      wonRevenue,
      wonHours,
      avgMargin,
      avgHourly,
      unprofitable,
      withWarnings,
      econWarnings: econWarnings.slice(0, 8),
      recent: recent.slice(0, 8),
    };
  }, [data]);

  const ownerName = data.settings.company.ownerName || 'zusammen';

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title={`${greeting()}, ${ownerName}`}
        sub={`${fmtDate(new Date().toISOString())} · ${data.customers.length} Kunden · ${data.objects.length} Objekte · ${data.calculations.length} Kalkulationen`}
        actions={
          <>
            <Button variant="outline" icon={<Zap size={14} />} onClick={() => navigate(`${BASE}/schnellkalkulation`)}>
              Schnellkalkulation
            </Button>
            <Button variant="outline" icon={<Sparkles size={14} />} onClick={() => navigate(`${BASE}/assistent`)}>
              KI-Assistent
            </Button>
            <Button icon={<Calculator size={14} />} onClick={() => navigate(`${BASE}/kalkulationen/neu`)}>
              Neue Kalkulation
            </Button>
          </>
        }
      />

      {/* KPI-Karten */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        <KpiCard
          label="Aktive Kalkulationen"
          value={model.active.length}
          sub={`${model.withWarnings.length} mit Warnungen`}
          icon={<Calculator size={15} />}
        />
        <KpiCard
          label="Offene Angebote"
          value={model.openOffers.length}
          sub={`Volumen ${fmtEur0(model.offerVolume)}/Monat`}
          icon={<FileText size={15} />}
        />
        <KpiCard
          label="Ø Marge"
          value={fmtPct(model.avgMargin, 1)}
          tone={model.avgMargin >= data.settings.calculation.targetMarginPct ? 'green' : model.avgMargin >= data.settings.calculation.minMarginPct ? 'amber' : 'red'}
          sub={`Ziel ${fmtPct(data.settings.calculation.targetMarginPct, 0)}`}
          icon={<Percent size={15} />}
        />
        <KpiCard
          label="Ø Stundenverrechnungssatz"
          value={`${fmtNum(model.avgHourly, 2)} €/h`}
          sub="über alle aktiven Kalkulationen"
          icon={<TrendingUp size={15} />}
        />
        <KpiCard
          label="Monatliche Sollstunden"
          value={fmtHours(model.wonHours, 1)}
          sub="gewonnene Aufträge"
          icon={<Clock size={15} />}
        />
        <KpiCard
          label="Monatlicher Umsatz"
          value={fmtEur0(model.wonRevenue)}
          sub="gewonnene Aufträge (netto)"
          tone="green"
          icon={<Euro size={15} />}
        />
        <KpiCard
          label="Unprofitable Kalkulationen"
          value={model.unprofitable.length}
          tone={model.unprofitable.length > 0 ? 'red' : 'default'}
          sub={`unter Mindestmarge ${fmtPct(data.settings.calculation.minMarginPct, 0)}`}
          icon={<AlertTriangle size={15} />}
        />
        <KpiCard
          label="Kalkulationen mit Warnungen"
          value={model.withWarnings.length}
          tone={model.withWarnings.length > 0 ? 'amber' : 'default'}
          sub="offene Prüfhinweise"
          icon={<AlertTriangle size={15} />}
        />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-3">
        {/* Aktuelle Kalkulationen */}
        <Card className="xl:col-span-2" padded={false}>
          <div className="px-5 pt-4">
            <SectionTitle
              right={
                <Link
                  to={`${BASE}/kalkulationen`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-700 hover:text-cyan-800"
                >
                  Alle anzeigen <ArrowRight size={12} />
                </Link>
              }
            >
              Aktuelle Kalkulationen
            </SectionTitle>
          </div>
          {model.recent.length === 0 ? (
            <EmptyState
              icon={<Calculator size={32} />}
              title="Noch keine Kalkulationen"
              description="Starten Sie mit einer Schnellkalkulation oder legen Sie eine Profi-Kalkulation an."
              action={
                <Button onClick={() => navigate(`${BASE}/kalkulationen/neu`)}>Neue Kalkulation</Button>
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="kw-table">
                <thead>
                  <tr>
                    <th>Objekt / Kalkulation</th>
                    <th>Kunde</th>
                    <th className="!text-right">Angebotswert</th>
                    <th className="!text-right">Marge</th>
                    <th>Status</th>
                    <th className="!text-right">Geändert</th>
                  </tr>
                </thead>
                <tbody>
                  {model.recent.map(({ calc, totals, customer, object }) => (
                    <tr
                      key={calc.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`${BASE}/kalkulationen/${calc.id}`)}
                    >
                      <td>
                        <span className="block font-semibold text-slate-800 truncate max-w-[220px]">
                          {object?.name ?? calc.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{calc.number}</span>
                      </td>
                      <td className="text-slate-600 truncate max-w-[160px]">{customer?.company ?? '—'}</td>
                      <td className="text-right kw-tnum font-semibold text-slate-800">
                        {totals.monthlyHours > 0 ? `${fmtEur0(totals.selected.net)}/M.` : totals.oneTime ? fmtEur0(totals.oneTime.price.net) : '—'}
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
                      <td>
                        <StatusBadge status={calc.status} />
                      </td>
                      <td className="text-right text-slate-500 kw-tnum">{fmtDate(calc.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Wirtschaftlichkeitswarnungen */}
        <Card padded={false}>
          <div className="px-5 pt-4">
            <SectionTitle>Wirtschaftlichkeitswarnungen</SectionTitle>
          </div>
          {model.econWarnings.length === 0 ? (
            <div className="px-5 pb-5">
              <div className="rounded-lg bg-brand-50 border border-brand-200 px-3 py-2.5 text-xs font-medium text-brand-800">
                Keine wirtschaftlichen Auffälligkeiten — alle Kalkulationen im grünen Bereich.
              </div>
            </div>
          ) : (
            <div className="px-3 pb-3">
              {model.econWarnings.map((w) => (
                <Link
                  key={w.key}
                  to={w.to}
                  className="flex items-start gap-2 rounded-lg px-2 py-2 hover:bg-slate-50 transition-colors"
                >
                  <AlertTriangle
                    size={14}
                    className={w.severity === 'error' ? 'text-error-500 shrink-0 mt-0.5' : 'text-amber-500 shrink-0 mt-0.5'}
                  />
                  <span className="text-xs text-slate-700 min-w-0">{w.text}</span>
                </Link>
              ))}
            </div>
          )}
          <div className="px-5 pb-4 pt-1 border-t border-[color:var(--kw-border)]">
            <p className="text-[10px] text-slate-400 pt-2">
              Warnungen entstehen aus Mindestmarge, Selbstkosten, Nachkalkulations-Abweichungen und
              Vollständigkeitsprüfungen. Schwellenwerte in den{' '}
              <Link to={`${BASE}/einstellungen`} className="text-cyan-700 hover:underline">
                Einstellungen
              </Link>
              .
            </p>
          </div>
        </Card>
      </div>

      {/* Statusverteilung */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {(['entwurf', 'in_bearbeitung', 'angebot_erstellt', 'angebot_versendet', 'gewonnen', 'verloren'] as const).map(
          (s) => {
            const n = model.rows.filter((r) => r.calc.status === s).length;
            if (n === 0) return null;
            return (
              <Link key={s} to={`${BASE}/kalkulationen?status=${s}`} className="kw-press">
                <Badge tone="outline" className="!py-1 !px-2.5">
                  <StatusDot status={s} /> {n} × <StatusLabel status={s} />
                </Badge>
              </Link>
            );
          }
        )}
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === 'gewonnen'
      ? '#21a74a'
      : status === 'verloren'
        ? '#f0552b'
        : status === 'angebot_versendet' || status === 'angebot_erstellt'
          ? '#f5891f'
          : '#34a1da';
  return <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: color }} />;
}

function StatusLabel({ status }: { status: string }) {
  const labels: Record<string, string> = {
    entwurf: 'Entwurf',
    in_bearbeitung: 'In Bearbeitung',
    angebot_erstellt: 'Angebot erstellt',
    angebot_versendet: 'Angebot versendet',
    gewonnen: 'Gewonnen',
    verloren: 'Verloren',
  };
  return <>{labels[status] ?? status}</>;
}
