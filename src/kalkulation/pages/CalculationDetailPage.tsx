/**
 * Kalkulations-Workspace — die wichtigste Seite der Anwendung.
 * KPI-Leiste, Tabs (Übersicht, Räume & Leistungen, Kosten, Preis & Szenarien,
 * Nachkalkulation, Angebot), Undo/Redo, Versionen.
 */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Clock,
  Copy,
  Euro,
  FileText,
  History,
  MoreHorizontal,
  Percent,
  Redo2,
  Save,
  Trash2,
  Undo2,
} from 'lucide-react';
import type { Calculation, CalculationStatus } from '../lib/types';
import { CALCULATION_STATUS_LABELS } from '../lib/types';
import { useKwStore } from '../lib/store';
import { fmtDateTime, fmtEur, fmtEur0, fmtHours, fmtPct, fmtSqm } from '../lib/format';
import {
  Badge,
  Button,
  ConfirmModal,
  EmptyState,
  InfoTip,
  KpiCard,
  Modal,
  Select,
  Tabs,
  TextInput,
  toast,
} from '../components/ui';
import { CostBreakdown, HealthChecklist, HealthRing, useCalcResults } from '../components/domain';
import { BASE, PageHeader } from '../components/shell';
import { OverviewTab } from '../components/calc/OverviewTab';
import { LinesTab } from '../components/calc/LinesTab';
import { CostsTab } from '../components/calc/CostsTab';
import { PriceTab } from '../components/calc/PriceTab';
import { PostCalcTab } from '../components/calc/PostCalcTab';
import { OfferTab } from '../components/calc/OfferTab';

type TabKey = 'uebersicht' | 'leistungen' | 'kosten' | 'preis' | 'nachkalkulation' | 'angebot';

export default function CalculationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const data = useKwStore((st) => st.data);
  const updateCalculation = useKwStore((st) => st.updateCalculation);
  const deleteCalculation = useKwStore((st) => st.deleteCalculation);
  const duplicateCalculation = useKwStore((st) => st.duplicateCalculation);
  const undoCalculation = useKwStore((st) => st.undoCalculation);
  const redoCalculation = useKwStore((st) => st.redoCalculation);
  const saveVersion = useKwStore((st) => st.saveCalculationVersion);
  const restoreVersion = useKwStore((st) => st.restoreCalculationVersion);
  const undoState = useKwStore((st) => (id ? st.undo[id] : undefined));

  const calc = data.calculations.find((c) => c.id === id);
  const results = useCalcResults(calc);
  const customer = data.customers.find((c) => c.id === calc?.customerId);
  const object = data.objects.find((o) => o.id === calc?.objectId);

  const tab = (params.get('tab') as TabKey) ?? 'uebersicht';
  const setTab = (t: TabKey) => {
    params.set('tab', t);
    setParams(params, { replace: true });
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [versionsOpen, setVersionsOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState('');

  const update = useMemo(
    () =>
      calc
        ? (fn: (c: Calculation) => void, undoable = true) =>
            updateCalculation(calc.id, fn, { undoable })
        : () => {},
    [calc, updateCalculation]
  );

  // Undo/Redo per Tastatur
  useEffect(() => {
    if (!calc) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT'))
        return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redoCalculation(calc.id);
        else undoCalculation(calc.id);
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redoCalculation(calc.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [calc, undoCalculation, redoCalculation]);

  if (!calc || !results) {
    return (
      <EmptyState
        title="Kalkulation nicht gefunden"
        action={<Button onClick={() => navigate(`${BASE}/kalkulationen`)}>Zur Übersicht</Button>}
      />
    );
  }

  const { totals, health } = results;
  const recurring = totals.monthlyHours > 0;

  return (
    <div className="max-w-[1500px] mx-auto">
      <PageHeader
        className="!mb-4"
        crumbs={[
          { label: 'Kunden', to: `${BASE}/kunden` },
          ...(customer ? [{ label: customer.company, to: `${BASE}/kunden/${customer.id}` }] : []),
          ...(object ? [{ label: object.name, to: `${BASE}/objekte/${object.id}` }] : []),
          { label: calc.number },
        ]}
        title={
          renaming ? (
            <TextInput
              className="!text-lg !font-bold max-w-md"
              value={nameDraft}
              autoFocus
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={() => {
                setRenaming(false);
                if (nameDraft.trim()) update((c) => void (c.name = nameDraft.trim()));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
                if (e.key === 'Escape') setRenaming(false);
              }}
            />
          ) : (
            <button
              type="button"
              className="text-left hover:underline decoration-dotted underline-offset-4"
              title="Umbenennen"
              onClick={() => {
                setNameDraft(calc.name);
                setRenaming(true);
              }}
            >
              {calc.name}
            </button>
          )
        }
        sub={
          <span className="flex flex-wrap items-center gap-2">
            <span>{calc.number}</span>
            <Select
              className="!w-auto !py-0.5 !px-2 !text-[11px] !rounded-full !border-slate-300"
              value={calc.status}
              onChange={(e) => update((c) => void (c.status = e.target.value as CalculationStatus), false)}
            >
              {(Object.keys(CALCULATION_STATUS_LABELS) as CalculationStatus[]).map((s) => (
                <option key={s} value={s}>
                  {CALCULATION_STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
            {calc.aiOrigin?.isDraft ? <Badge tone="blue">KI-Entwurf — bitte prüfen</Badge> : null}
            <span className="text-slate-400">Zuletzt geändert {fmtDateTime(calc.updatedAt)}</span>
          </span>
        }
        actions={
          <>
            <span className="flex items-center rounded-lg border border-[color:var(--kw-border)] bg-white">
              <button
                type="button"
                title="Rückgängig (Strg+Z)"
                disabled={!undoState || undoState.past.length === 0}
                onClick={() => undoCalculation(calc.id)}
                className="kw-press p-2 text-slate-500 hover:text-slate-800 disabled:text-slate-300"
              >
                <Undo2 size={14} />
              </button>
              <span className="h-5 w-px bg-slate-200" />
              <button
                type="button"
                title="Wiederholen (Strg+Umschalt+Z)"
                disabled={!undoState || undoState.future.length === 0}
                onClick={() => redoCalculation(calc.id)}
                className="kw-press p-2 text-slate-500 hover:text-slate-800 disabled:text-slate-300"
              >
                <Redo2 size={14} />
              </button>
            </span>
            <Button
              variant="outline"
              icon={<Save size={14} />}
              onClick={() => {
                saveVersion(calc.id, `Stand ${new Date().toLocaleString('de-DE')}`);
                toast('Version gespeichert.');
              }}
            >
              Version sichern
            </Button>
            <Button icon={<FileText size={14} />} onClick={() => setTab('angebot')}>
              Angebot erstellen
            </Button>
            <div className="relative">
              <Button variant="outline" icon={<MoreHorizontal size={14} />} onClick={() => setMenuOpen((v) => !v)} aria-label="Weitere Aktionen" />
              {menuOpen ? (
                <div
                  className="absolute right-0 top-full z-50 mt-1 w-52 rounded-lg border border-[color:var(--kw-border)] bg-white py-1 shadow-glass-lg"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <MenuItem
                    icon={<Copy size={13} />}
                    label="Duplizieren"
                    onClick={() => {
                      const copy = duplicateCalculation(calc.id);
                      setMenuOpen(false);
                      if (copy) {
                        toast(`Als ${copy.number} dupliziert.`);
                        navigate(`${BASE}/kalkulationen/${copy.id}`);
                      }
                    }}
                  />
                  <MenuItem
                    icon={<History size={13} />}
                    label={`Versionen (${calc.versions.length})`}
                    onClick={() => {
                      setMenuOpen(false);
                      setVersionsOpen(true);
                    }}
                  />
                  <MenuItem
                    icon={<Trash2 size={13} />}
                    label="Löschen"
                    danger
                    onClick={() => {
                      setMenuOpen(false);
                      setDeleteOpen(true);
                    }}
                  />
                </div>
              ) : null}
            </div>
          </>
        }
      />

      {/* KPI-Leiste */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard label="Gesamtfläche" value={totals.totalAreaSqm > 0 ? fmtSqm(totals.totalAreaSqm) : '—'} sub={`${calc.lines.length} Positionen`} />
        <KpiCard
          label="Sollstunden"
          value={recurring ? fmtHours(totals.monthlyHours, 1) : '—'}
          sub={recurring ? `${fmtHours(totals.yearlyHours, 0)} pro Jahr` : 'keine wiederkehrenden Leistungen'}
          icon={<Clock size={15} />}
        />
        <KpiCard
          label="Gesamtkosten"
          value={fmtEur0(totals.selfCost)}
          sub={`inkl. Fahrt, GK, Risiko`}
          icon={<Euro size={15} />}
          info={
            <InfoTip>
              <CostBreakdown totals={totals} />
            </InfoTip>
          }
        />
        <KpiCard
          label="Zielmarge"
          value={fmtPct(calc.targetMarginPct, 1)}
          sub={calc.marginMode === 'margin' ? 'echte Marge vom VK' : 'Aufschlag auf Kosten'}
          icon={<Percent size={15} />}
        />
        <KpiCard
          label="Angebotspreis"
          value={`${fmtEur0(totals.selected.net)}`}
          sub={
            recurring
              ? `netto/Monat · ${fmtEur(totals.avgHourlyRevenue)}/h`
              : totals.oneTime
                ? 'einmalig netto'
                : '—'
          }
          tone={totals.selected.marginPct >= data.settings.calculation.minMarginPct ? 'green' : 'red'}
          info={
            <InfoTip>
              <CostBreakdown totals={totals} />
            </InfoTip>
          }
        />
        <div className="kw-card p-4 flex items-center gap-3">
          <HealthRing score={health.score} size={46} />
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Kalkulationsqualität</p>
            <p className="text-sm font-bold text-slate-800 kw-tnum">{health.score}/100</p>
            <InfoTip label="Prüfungen anzeigen">
              <HealthChecklist health={health} />
            </InfoTip>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5">
        <Tabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: 'uebersicht', label: 'Übersicht' },
            {
              value: 'leistungen',
              label: 'Räume & Leistungen',
              badge: (
                <Badge tone="neutral" className="!px-1.5">
                  {calc.lines.length}
                </Badge>
              ),
            },
            { value: 'kosten', label: 'Kosten & Personal' },
            { value: 'preis', label: 'Preis & Szenarien' },
            {
              value: 'nachkalkulation',
              label: 'Nachkalkulation',
              badge:
                calc.postCalc.length > 0 ? (
                  <Badge tone="blue" className="!px-1.5">
                    {calc.postCalc.length}
                  </Badge>
                ) : undefined,
            },
            { value: 'angebot', label: 'Angebot' },
          ]}
        />
        <div className="pt-4">
          {tab === 'uebersicht' ? <OverviewTab calc={calc} results={results} update={update} /> : null}
          {tab === 'leistungen' ? <LinesTab calc={calc} results={results} update={update} object={object} /> : null}
          {tab === 'kosten' ? <CostsTab calc={calc} results={results} update={update} /> : null}
          {tab === 'preis' ? <PriceTab calc={calc} results={results} update={update} /> : null}
          {tab === 'nachkalkulation' ? <PostCalcTab calc={calc} results={results} update={update} /> : null}
          {tab === 'angebot' ? <OfferTab calc={calc} results={results} update={update} customer={customer} object={object} /> : null}
        </div>
      </div>

      {/* Versionen */}
      <Modal open={versionsOpen} onClose={() => setVersionsOpen(false)} title="Gespeicherte Versionen" width="max-w-md">
        {calc.versions.length === 0 ? (
          <p className="text-sm text-slate-500">
            Noch keine Versionen gesichert. Über „Version sichern“ legen Sie jederzeit einen wiederherstellbaren Stand an.
          </p>
        ) : (
          <div className="space-y-1.5">
            {calc.versions.map((v) => (
              <div key={v.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-800">{v.label}</p>
                  <p className="text-[10px] text-slate-400">{fmtDateTime(v.at)}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    restoreVersion(calc.id, v.id);
                    setVersionsOpen(false);
                    toast('Version wiederhergestellt.');
                  }}
                >
                  Wiederherstellen
                </Button>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteCalculation(calc.id);
          navigate(`${BASE}/kalkulationen`);
          toast('Kalkulation gelöscht.');
        }}
        title="Kalkulation löschen?"
        message={`„${calc.name}“ (${calc.number}) wird unwiderruflich gelöscht.`}
      />
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-semibold transition-colors ${
        danger ? 'text-error-600 hover:bg-error-50' : 'text-slate-700 hover:bg-slate-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
