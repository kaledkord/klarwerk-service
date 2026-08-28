/**
 * Einstellungen: ALLE Kennzahlen zentral änderbar — Unternehmen, Kalkulation,
 * Personal, Gemeinkosten, Fahrzeuge, Material, Leistungswert-Faktoren,
 * KI-Konfiguration mit Budget & Protokoll, Datenverwaltung.
 */

import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Download, Eye, EyeOff, Key, Loader2, Plus, RotateCcw, Trash2, Upload, XCircle } from 'lucide-react';
import { getGeminiKey, looksLikeGeminiKey, maskKey, setGeminiKey } from '../lib/ai/keyStore';
import { testGeminiKey } from '../lib/ai/geminiDirect';
import type { FactorGroupKey, RoundingMode } from '../lib/types';
import { FACTOR_GROUP_LABELS, ROUNDING_LABELS } from '../lib/types';
import { employerRate, overheadInfo, FACTOR_GROUP_ORDER } from '../lib/engine';
import { useKwStore } from '../lib/store';
import { SEED_SETTINGS } from '../lib/seed';
import { fmtDateTime, fmtEur, fmtNum, fmtPct } from '../lib/format';
import {
  Badge,
  Button,
  Callout,
  Card,
  ConfirmModal,
  FieldLabel,
  NumberInput,
  SectionTitle,
  SegmentedControl,
  Select,
  Tabs,
  Textarea,
  TextInput,
  toast,
} from '../components/ui';
import { BASE, PageHeader } from '../components/shell';

type TabKey = 'allgemein' | 'kalkulation' | 'personal' | 'gemeinkosten' | 'fahrt-material' | 'faktoren' | 'ki' | 'daten';

export default function SettingsPage() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as TabKey) ?? 'allgemein';
  const setTab = (t: TabKey) => {
    params.set('tab', t);
    setParams(params, { replace: true });
  };

  return (
    <div className="max-w-[1100px] mx-auto">
      <PageHeader
        crumbs={[{ label: 'KlarWerk Kalkulation', to: BASE }, { label: 'Einstellungen' }]}
        title="Einstellungen"
        sub="Alle Kennzahlen der Kalkulation an einem Ort — Änderungen wirken sofort auf neue Berechnungen."
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'allgemein', label: 'Allgemein' },
          { value: 'kalkulation', label: 'Kalkulation' },
          { value: 'personal', label: 'Personal' },
          { value: 'gemeinkosten', label: 'Gemeinkosten' },
          { value: 'fahrt-material', label: 'Fahrzeuge & Material' },
          { value: 'faktoren', label: 'Leistungswert-Faktoren' },
          { value: 'ki', label: 'KI' },
          { value: 'daten', label: 'Daten' },
        ]}
      />
      <div className="pt-4">
        {tab === 'allgemein' ? <GeneralTab /> : null}
        {tab === 'kalkulation' ? <CalculationTab /> : null}
        {tab === 'personal' ? <LaborTab /> : null}
        {tab === 'gemeinkosten' ? <OverheadTab /> : null}
        {tab === 'fahrt-material' ? <TravelMaterialTab /> : null}
        {tab === 'faktoren' ? <FactorsTab /> : null}
        {tab === 'ki' ? <AiTab /> : null}
        {tab === 'daten' ? <DataTab /> : null}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function GeneralTab() {
  const settings = useKwStore((st) => st.data.settings);
  const update = useKwStore((st) => st.updateSettings);
  const c = settings.company;
  const field = (key: keyof typeof c, label: string, placeholder = '') => (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <TextInput value={c[key]} placeholder={placeholder} onChange={(e) => update((s) => void (s.company[key] = e.target.value))} />
    </div>
  );
  return (
    <Card>
      <SectionTitle>Unternehmensdaten</SectionTitle>
      <p className="mb-3 text-xs text-slate-500">Diese Angaben erscheinen auf Angeboten und Druckausgaben.</p>
      <div className="grid gap-3 sm:grid-cols-2 max-w-2xl">
        {field('name', 'Unternehmensname')}
        {field('ownerName', 'Ihr Name (Begrüßung & Unterschrift)')}
        {field('street', 'Straße')}
        <div className="grid grid-cols-2 gap-2">
          {field('zip', 'PLZ')}
          {field('city', 'Ort')}
        </div>
        {field('phone', 'Telefon')}
        {field('email', 'E-Mail')}
        {field('website', 'Website')}
        {field('taxNumber', 'Steuernummer')}
        {field('vatId', 'USt-IdNr.')}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function CalculationTab() {
  const settings = useKwStore((st) => st.data.settings);
  const update = useKwStore((st) => st.updateSettings);
  const cal = settings.calculation;

  const num = (
    label: string,
    value: number,
    onChange: (v: number) => void,
    opts: { suffix?: string; min?: number; max?: number; decimals?: number; hint?: string } = {}
  ) => (
    <div>
      <FieldLabel hint={opts.hint}>{label}</FieldLabel>
      <NumberInput
        value={value}
        min={opts.min}
        max={opts.max}
        decimals={opts.decimals ?? 2}
        onChange={(v) => v != null && onChange(v)}
        suffix={opts.suffix}
        alignRight={false}
      />
    </div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <SectionTitle>Margen & Preise</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {num('Standard-Zielmarge', cal.targetMarginPct, (v) => update((s) => void (s.calculation.targetMarginPct = v)), { suffix: '%', min: 0, max: 95 })}
          {num('Mindestmarge', cal.minMarginPct, (v) => update((s) => void (s.calculation.minMarginPct = v)), { suffix: '%', min: 0, max: 95 })}
          {num('Warnschwelle', cal.warnMarginPct, (v) => update((s) => void (s.calculation.warnMarginPct = v)), { suffix: '%', min: 0, max: 95 })}
          {num('Premium-Marge', cal.premiumMarginPct, (v) => update((s) => void (s.calculation.premiumMarginPct = v)), { suffix: '%', min: 0, max: 95 })}
          {num('Mehrwertsteuer', cal.vatPct, (v) => update((s) => void (s.calculation.vatPct = v)), { suffix: '%', min: 0, max: 30 })}
          <div>
            <FieldLabel>Rundung von Preisen</FieldLabel>
            <Select value={cal.rounding} onChange={(e) => update((s) => void (s.calculation.rounding = e.target.value as RoundingMode))}>
              {(Object.keys(ROUNDING_LABELS) as RoundingMode[]).map((r) => (
                <option key={r} value={r}>
                  {ROUNDING_LABELS[r]}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="mt-3">
          <FieldLabel>Standard-Preismodus</FieldLabel>
          <SegmentedControl
            value={cal.marginMode}
            onChange={(v) => update((s) => void (s.calculation.marginMode = v))}
            options={[
              { value: 'margin', label: 'Echte Zielmarge (Preis = Kosten ÷ (1 − m))' },
              { value: 'markup', label: 'Kostenaufschlag (Preis = Kosten × (1 + m))' },
            ]}
          />
        </div>
        <div className="mt-3 max-w-xs">
          {num('Wochen je Monat (Turnus-Umrechnung)', cal.weeksPerMonth, (v) => update((s) => void (s.calculation.weeksPerMonth = v)), {
            min: 4,
            max: 4.5,
            decimals: 4,
            hint: '(Standard 52 ÷ 12 = 4,3333)',
          })}
        </div>
      </Card>

      <div className="space-y-4">
        <Card>
          <SectionTitle>Risikostufen</SectionTitle>
          <div className="space-y-1.5">
            {cal.riskLevels.map((r, i) => (
              <div key={r.key} className="flex items-center gap-2">
                <TextInput
                  className="!py-1.5 !text-xs"
                  value={r.label}
                  onChange={(e) => update((s) => void (s.calculation.riskLevels[i].label = e.target.value))}
                />
                <span className="w-28 shrink-0">
                  <NumberInput
                    value={r.pct}
                    min={0}
                    max={100}
                    onChange={(v) => v != null && update((s) => void (s.calculation.riskLevels[i].pct = v))}
                    suffix="%"
                  />
                </span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <SectionTitle>Angebots-Textvorlagen</SectionTitle>
          <div className="space-y-3">
            <div>
              <FieldLabel>Einleitung</FieldLabel>
              <Textarea rows={3} value={settings.offer.introTemplate} onChange={(e) => update((s) => void (s.offer.introTemplate = e.target.value))} />
            </div>
            <div>
              <FieldLabel>Vertragsbedingungen</FieldLabel>
              <Textarea rows={3} value={settings.offer.termsTemplate} onChange={(e) => update((s) => void (s.offer.termsTemplate = e.target.value))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Schlusstext</FieldLabel>
                <Textarea rows={2} value={settings.offer.outroTemplate} onChange={(e) => update((s) => void (s.offer.outroTemplate = e.target.value))} />
              </div>
              <div className="max-w-[10rem]">
                <FieldLabel>Gültigkeit</FieldLabel>
                <NumberInput
                  value={settings.offer.validityDays}
                  min={1}
                  decimals={0}
                  onChange={(v) => v != null && update((s) => void (s.offer.validityDays = v))}
                  suffix="Tage"
                  alignRight={false}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function LaborTab() {
  const settings = useKwStore((st) => st.data.settings);
  const update = useKwStore((st) => st.updateSettings);
  const rate = employerRate(settings);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <SectionTitle>Lohn & Arbeitgeberkosten</SectionTitle>
        <div className="max-w-[12rem]">
          <FieldLabel>Standard-Stundenlohn</FieldLabel>
          <NumberInput
            value={settings.labor.baseWage}
            min={0}
            onChange={(v) => v != null && update((s) => void (s.labor.baseWage = v))}
            suffix="€/h"
            alignRight={false}
          />
        </div>
        <div className="mt-3 space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Arbeitgeberanteile</p>
          {settings.labor.components.map((c, i) => (
            <div key={c.key} className="flex items-center gap-2">
              <TextInput
                className="!py-1.5 !text-xs"
                value={c.label}
                onChange={(e) => update((s) => void (s.labor.components[i].label = e.target.value))}
              />
              <span className="w-24 shrink-0">
                <NumberInput
                  value={c.pct}
                  min={0}
                  max={100}
                  onChange={(v) => v != null && update((s) => void (s.labor.components[i].pct = v))}
                  suffix="%"
                />
              </span>
              <button
                type="button"
                className="kw-press shrink-0 rounded p-1 text-slate-400 hover:text-error-600 hover:bg-error-50"
                onClick={() => update((s) => void s.labor.components.splice(i, 1))}
                title="Entfernen"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <Button
            size="sm"
            variant="ghost"
            icon={<Plus size={12} />}
            onClick={() => update((s) => void s.labor.components.push({ key: `c${Date.now()}`, label: 'Weitere Nebenkosten', pct: 0 }))}
          >
            Position hinzufügen
          </Button>
        </div>
        <div className="mt-3 rounded-lg bg-brand-50 border border-brand-200 px-3 py-2.5 text-sm">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Direkter Lohn</span>
            <span className="kw-tnum">{fmtEur(rate.baseWage)}/h</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>Nebenkosten gesamt</span>
            <span className="kw-tnum">{fmtPct(rate.componentsPct, 1)}</span>
          </div>
          <div className="flex justify-between font-bold text-brand-800 mt-1">
            <span>Tatsächliche Arbeitgeberkosten</span>
            <span className="kw-tnum">{fmtEur(rate.employerRate)}/h</span>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>Zuschläge</SectionTitle>
        <p className="mb-3 text-xs text-slate-500">
          Zuschläge werden je Leistungsposition vergeben und wirken nur auf die tatsächlich betroffenen Stunden.
        </p>
        <div className="space-y-1.5">
          {settings.labor.surcharges.map((z, i) => (
            <div key={z.key} className="flex items-center gap-2">
              <TextInput
                className="!py-1.5 !text-xs"
                value={z.label}
                onChange={(e) => update((s) => void (s.labor.surcharges[i].label = e.target.value))}
              />
              <span className="w-24 shrink-0">
                <NumberInput
                  value={z.pct}
                  min={0}
                  max={200}
                  onChange={(v) => v != null && update((s) => void (s.labor.surcharges[i].pct = v))}
                  suffix="%"
                />
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function OverheadTab() {
  const settings = useKwStore((st) => st.data.settings);
  const update = useKwStore((st) => st.updateSettings);
  const info = overheadInfo(settings);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <SectionTitle>Monatliche Gemeinkosten</SectionTitle>
        <div className="space-y-1.5">
          {settings.overhead.positions.map((p, i) => (
            <div key={p.key} className="flex items-center gap-2">
              <TextInput
                className="!py-1.5 !text-xs"
                value={p.label}
                onChange={(e) => update((s) => void (s.overhead.positions[i].label = e.target.value))}
              />
              <span className="w-28 shrink-0">
                <NumberInput
                  value={p.amount}
                  min={0}
                  decimals={0}
                  onChange={(v) => v != null && update((s) => void (s.overhead.positions[i].amount = v))}
                  suffix="€"
                />
              </span>
              <button
                type="button"
                className="kw-press shrink-0 rounded p-1 text-slate-400 hover:text-error-600 hover:bg-error-50"
                onClick={() => update((s) => void s.overhead.positions.splice(i, 1))}
                title="Entfernen"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <Button
            size="sm"
            variant="ghost"
            icon={<Plus size={12} />}
            onClick={() => update((s) => void s.overhead.positions.push({ key: `p${Date.now()}`, label: 'Sonstige', amount: 0 }))}
          >
            Position hinzufügen
          </Button>
        </div>
      </Card>

      <Card>
        <SectionTitle>Umlage auf produktive Stunden</SectionTitle>
        <div className="max-w-[14rem]">
          <FieldLabel>Produktive Stunden je Monat (gesamt)</FieldLabel>
          <NumberInput
            value={settings.overhead.productiveHoursPerMonth}
            min={1}
            decimals={0}
            onChange={(v) => v != null && update((s) => void (s.overhead.productiveHoursPerMonth = v))}
            suffix="h"
            alignRight={false}
          />
        </div>
        <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs space-y-1">
          <div className="flex justify-between text-slate-600">
            <span>Gemeinkosten gesamt/Monat</span>
            <span className="kw-tnum">{fmtEur(info.monthlyTotal)}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>÷ produktive Stunden</span>
            <span className="kw-tnum">{fmtNum(info.productiveHours, 0)} h</span>
          </div>
          <div className="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-1">
            <span>Gemeinkostensatz</span>
            <span className="kw-tnum">{fmtEur(info.ratePerHour)}/h</span>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-400">
          Dieser Satz fließt automatisch in jede Kalkulation ein (je Kalkulation deaktivier- oder übersteuerbar).
        </p>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function TravelMaterialTab() {
  const settings = useKwStore((st) => st.data.settings);
  const update = useKwStore((st) => st.updateSettings);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <SectionTitle>Fahrzeuge & Fahrtkosten</SectionTitle>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <div>
            <FieldLabel>Fahrzeugkosten je Kilometer</FieldLabel>
            <NumberInput
              value={settings.travel.costPerKm}
              min={0}
              onChange={(v) => v != null && update((s) => void (s.travel.costPerKm = v))}
              suffix="€/km"
              alignRight={false}
            />
          </div>
          <div>
            <FieldLabel>Durchschnittsgeschwindigkeit</FieldLabel>
            <NumberInput
              value={settings.travel.avgSpeedKmh}
              min={1}
              decimals={0}
              onChange={(v) => v != null && update((s) => void (s.travel.avgSpeedKmh = v))}
              suffix="km/h"
              alignRight={false}
            />
          </div>
        </div>
        <div className="mt-3">
          <FieldLabel>Fahrzeit standardmäßig vergüten</FieldLabel>
          <SegmentedControl
            value={settings.travel.payTravelTimeDefault ? 'ja' : 'nein'}
            onChange={(v) => update((s) => void (s.travel.payTravelTimeDefault = v === 'ja'))}
            options={[
              { value: 'ja', label: 'Ja' },
              { value: 'nein', label: 'Nein' },
            ]}
          />
        </div>
      </Card>

      <Card>
        <SectionTitle>Material-Standards</SectionTitle>
        <div className="grid grid-cols-2 gap-3 max-w-md">
          <div>
            <FieldLabel>Standard-Modus neuer Positionen</FieldLabel>
            <Select
              value={settings.material.defaultMode}
              onChange={(e) => update((s) => void (s.material.defaultMode = e.target.value as typeof settings.material.defaultMode))}
            >
              <option value="none">Kein Material</option>
              <option value="perHour">€ je Stunde</option>
              <option value="perExecution">€ je Durchführung</option>
              <option value="perSqmMonth">€ je m²/Monat</option>
              <option value="perMonth">€ pauschal/Monat</option>
            </Select>
          </div>
          <div>
            <FieldLabel>Standard-Materialwert</FieldLabel>
            <NumberInput
              value={settings.material.defaultValue}
              min={0}
              onChange={(v) => v != null && update((s) => void (s.material.defaultValue = v))}
              suffix="€"
              alignRight={false}
            />
          </div>
        </div>
        <div className="mt-3">
          <FieldLabel>Verbrauchsmaterial (Papier, Seife …)</FieldLabel>
          <Select
            className="max-w-xs"
            value={settings.material.consumablesDefault}
            onChange={(e) => update((s) => void (s.material.consumablesDefault = e.target.value as typeof settings.material.consumablesDefault))}
          >
            <option value="auftraggeber">Stellt der Auftraggeber</option>
            <option value="auftragnehmer">Stellen wir (einkalkulieren)</option>
            <option value="separat">Wird separat abgerechnet</option>
          </Select>
        </div>
        <div className="mt-4 border-t border-slate-100 pt-3">
          <FieldLabel>Vorschlagswerte für prozentuale Kostenermittlung (% der Personalkosten)</FieldLabel>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <div>
              <FieldLabel hint="(branchenüblich 3–6 %)">Material</FieldLabel>
              <NumberInput
                value={settings.costSuggestions.materialPctOfLabor}
                min={0}
                max={50}
                onChange={(v) => v != null && update((s) => void (s.costSuggestions.materialPctOfLabor = v))}
                suffix="%"
                alignRight={false}
              />
            </div>
            <div>
              <FieldLabel>Maschinen</FieldLabel>
              <NumberInput
                value={settings.costSuggestions.machinePctOfLabor}
                min={0}
                max={50}
                onChange={(v) => v != null && update((s) => void (s.costSuggestions.machinePctOfLabor = v))}
                suffix="%"
                alignRight={false}
              />
            </div>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Diese Sätze erscheinen im Kalkulations-Tab „Kosten & Personal“ als Vorschlag, wenn Material- oder
            Maschinenkosten prozentual vom Personal angesetzt werden — dort jederzeit durch einen eigenen Satz ersetzbar.
          </p>
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function FactorsTab() {
  const settings = useKwStore((st) => st.data.settings);
  const update = useKwStore((st) => st.updateSettings);

  return (
    <div>
      <Callout tone="info" className="mb-4">
        Faktoren passen die Standard-Leistungswerte automatisch an (multiplikativ). Beispiel: 500 m²/h × 0,85 (starke
        Verschmutzung) × 0,90 (stark möbliert) = 382,5 m²/h. Jede Kalkulationszeile zeigt die vollständige Herleitung.
      </Callout>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {FACTOR_GROUP_ORDER.map((group: FactorGroupKey) => (
          <Card key={group}>
            <SectionTitle>{FACTOR_GROUP_LABELS[group]}</SectionTitle>
            <div className="space-y-1.5">
              {settings.performanceFactors[group].map((o, i) => (
                <div key={o.key} className="flex items-center gap-2">
                  <TextInput
                    className="!py-1.5 !text-xs"
                    value={o.label}
                    onChange={(e) => update((s) => void (s.performanceFactors[group][i].label = e.target.value))}
                  />
                  <span className="w-24 shrink-0">
                    <NumberInput
                      value={Math.round((o.multiplier - 1) * 1000) / 10}
                      min={-90}
                      max={100}
                      decimals={1}
                      onChange={(v) =>
                        v != null && update((s) => void (s.performanceFactors[group][i].multiplier = 1 + v / 100))
                      }
                      suffix="%"
                    />
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-3 flex justify-end">
        <Button
          size="sm"
          variant="ghost"
          icon={<RotateCcw size={12} />}
          onClick={() => {
            update((s) => {
              s.performanceFactors = structuredClone(SEED_SETTINGS.performanceFactors);
            });
            toast('Faktoren auf Standard zurückgesetzt.');
          }}
        >
          Standard-Faktoren wiederherstellen
        </Button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function AiTab() {
  const data = useKwStore((st) => st.data);
  const update = useKwStore((st) => st.updateSettings);
  const ai = data.settings.ai;

  const usage = useMemo(() => {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthLogs = data.aiLog.filter((l) => l.at.startsWith(monthKey));
    return {
      monthKey,
      requests: monthLogs.length,
      inputTokens: monthLogs.reduce((s, l) => s + l.inputTokens, 0),
      outputTokens: monthLogs.reduce((s, l) => s + l.outputTokens, 0),
      cost: monthLogs.reduce((s, l) => s + l.costEur, 0),
    };
  }, [data.aiLog]);

  const budgetPct = ai.monthlyBudgetEur > 0 ? (usage.cost / ai.monthlyBudgetEur) * 100 : 0;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
      <GeminiKeyCard />
      <Card>
        <SectionTitle>KI-Anbieter & Modell</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Anbieter</FieldLabel>
            <Select value={ai.provider} onChange={() => undefined} disabled>
              <option value="gemini">Google Gemini</option>
            </Select>
            <p className="mt-1 text-[10px] text-slate-400">Weitere Anbieter (OpenAI, Anthropic) sind vorbereitet.</p>
          </div>
          <div>
            <FieldLabel>Modell</FieldLabel>
            <Select value={ai.model} onChange={(e) => update((s) => void (s.ai.model = e.target.value))}>
              <option value="gemini-2.5-flash">gemini-2.5-flash (empfohlen)</option>
              <option value="gemini-2.5-pro">gemini-2.5-pro</option>
              <option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite</option>
              <option value="gemini-2.0-flash">gemini-2.0-flash</option>
            </Select>
          </div>
          <div>
            <FieldLabel>Temperatur</FieldLabel>
            <NumberInput value={ai.temperature} min={0} max={2} onChange={(v) => v != null && update((s) => void (s.ai.temperature = v))} alignRight={false} />
          </div>
          <div>
            <FieldLabel>Max. Ausgabe-Tokens</FieldLabel>
            <NumberInput value={ai.maxOutputTokens} min={256} decimals={0} onChange={(v) => v != null && update((s) => void (s.ai.maxOutputTokens = v))} alignRight={false} />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone={ai.structuredOutput ? 'green' : 'outline'}>Strukturierte Ausgabe aktiv</Badge>
          <Badge tone={ai.functionCalling ? 'green' : 'outline'}>Function Calling aktiv</Badge>
        </div>
        <Callout tone="info" className="mt-3">
          Für eine später gehostete Mehrbenutzer-Version bleibt zusätzlich der Server-Weg bestehen
          (Supabase Edge Function <code className="font-mono text-[10px]">ai-kalkulation</code> mit{' '}
          <code className="font-mono text-[10px]">GEMINI_API_KEY</code> als Server-Secret) — er wird automatisch
          genutzt, wenn hier kein eigener Schlüssel hinterlegt ist.
        </Callout>
      </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <SectionTitle>Kostenkontrolle</SectionTitle>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <div>
              <FieldLabel>Monatliches KI-Budget</FieldLabel>
              <NumberInput value={ai.monthlyBudgetEur} min={0} onChange={(v) => v != null && update((s) => void (s.ai.monthlyBudgetEur = v))} suffix="€" alignRight={false} />
            </div>
            <div>
              <FieldLabel>Warnung bei</FieldLabel>
              <NumberInput value={ai.warnAtPct} min={1} max={100} decimals={0} onChange={(v) => v != null && update((s) => void (s.ai.warnAtPct = v))} suffix="%" alignRight={false} />
            </div>
            <div>
              <FieldLabel hint="(€ je 1 Mio. Tokens)">Preis Eingabe</FieldLabel>
              <NumberInput value={ai.priceInPer1M} min={0} onChange={(v) => v != null && update((s) => void (s.ai.priceInPer1M = v))} suffix="€" alignRight={false} />
            </div>
            <div>
              <FieldLabel hint="(€ je 1 Mio. Tokens)">Preis Ausgabe</FieldLabel>
              <NumberInput value={ai.priceOutPer1M} min={0} onChange={(v) => v != null && update((s) => void (s.ai.priceOutPer1M = v))} suffix="€" alignRight={false} />
            </div>
          </div>
          <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Anfragen im laufenden Monat</span>
              <span className="kw-tnum">{usage.requests}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tokens (Eingabe / Ausgabe, geschätzt)</span>
              <span className="kw-tnum">
                {fmtNum(usage.inputTokens, 0)} / {fmtNum(usage.outputTokens, 0)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-slate-800">
              <span>Geschätzte Kosten</span>
              <span className="kw-tnum">
                {fmtEur(usage.cost)} von {fmtEur(ai.monthlyBudgetEur)} ({fmtNum(budgetPct, 1)} %)
              </span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, budgetPct)}%`,
                  background: budgetPct >= 100 ? '#f0552b' : budgetPct >= ai.warnAtPct ? '#f5891f' : '#21a74a',
                }}
              />
            </div>
          </div>
        </Card>

        <Card padded={false}>
          <div className="px-5 pt-4">
            <SectionTitle>KI-Protokoll</SectionTitle>
          </div>
          {data.aiLog.length === 0 ? (
            <p className="px-5 pb-5 text-xs text-slate-400">Noch keine KI-Anfragen protokolliert.</p>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              <table className="kw-table">
                <thead>
                  <tr>
                    <th>Zeitpunkt</th>
                    <th>Anfrage</th>
                    <th className="!text-right">Tokens</th>
                    <th className="!text-right">Kosten</th>
                    <th>Übernommen</th>
                  </tr>
                </thead>
                <tbody>
                  {data.aiLog.slice(0, 30).map((l) => (
                    <tr key={l.id}>
                      <td className="text-slate-500 whitespace-nowrap">{fmtDateTime(l.at)}</td>
                      <td className="max-w-[220px]">
                        <span className="block truncate text-slate-700" title={l.userInput}>
                          {l.userInput}
                        </span>
                        <span className="text-[10px] text-slate-400">{l.model}</span>
                      </td>
                      <td className="text-right kw-tnum text-slate-600">
                        {fmtNum(l.inputTokens + l.outputTokens, 0)}
                      </td>
                      <td className="text-right kw-tnum">{fmtEur(l.costEur)}</td>
                      <td>
                        {l.accepted == null ? (
                          <Badge tone="outline">offen</Badge>
                        ) : l.accepted ? (
                          <Badge tone="green">übernommen</Badge>
                        ) : (
                          <Badge tone="neutral">verworfen</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

/** Eigener Gemini-Schlüssel für die Direktverbindung (private Nutzung). */
function GeminiKeyCard() {
  const model = useKwStore((st) => st.data.settings.ai.model);
  const [stored, setStored] = useState<string | null>(() => getGeminiKey());
  const [draft, setDraft] = useState('');
  const [show, setShow] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const save = () => {
    const key = draft.trim();
    if (!key) return;
    if (!looksLikeGeminiKey(key)) {
      toast('Das sieht nicht wie ein Google-API-Schlüssel aus (beginnt üblicherweise mit „AIza…“).', 'error');
      return;
    }
    setGeminiKey(key);
    setStored(key);
    setDraft('');
    setTestResult(null);
    toast('Schlüssel gespeichert — die KI nutzt jetzt die Direktverbindung.');
  };

  const runTest = async () => {
    const key = draft.trim() || stored;
    if (!key) return;
    setTesting(true);
    setTestResult(null);
    const res = await testGeminiKey(key, model);
    setTesting(false);
    setTestResult(res);
  };

  return (
    <Card className="!border-brand-200">
      <SectionTitle
        right={
          stored ? (
            <Badge tone="green">
              <CheckCircle2 size={11} /> Direktverbindung aktiv
            </Badge>
          ) : (
            <Badge tone="amber">Kein Schlüssel — lokale Analyse</Badge>
          )
        }
      >
        <span className="inline-flex items-center gap-1.5">
          <Key size={14} className="text-brand-600" /> Google-Gemini-Schlüssel (Direktverbindung)
        </span>
      </SectionTitle>

      {stored ? (
        <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg bg-brand-50 border border-brand-200 px-3 py-2 text-xs text-brand-800">
          <span>
            Gespeicherter Schlüssel: <span className="font-mono font-bold">{maskKey(stored)}</span> — der KI-Assistent
            spricht direkt mit Google Gemini.
          </span>
          <span className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" onClick={runTest} disabled={testing}>
              {testing ? <Loader2 size={12} className="animate-spin" /> : 'Testen'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="!text-error-600"
              onClick={() => {
                setGeminiKey(null);
                setStored(null);
                setTestResult(null);
                toast('Schlüssel entfernt — der Assistent nutzt wieder die lokale Analyse.', 'info');
              }}
            >
              Entfernen
            </Button>
          </span>
        </div>
      ) : null}

      <FieldLabel>{stored ? 'Schlüssel ersetzen' : 'API-Schlüssel eintragen'}</FieldLabel>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <TextInput
            type={show ? 'text' : 'password'}
            className="!pr-9 font-mono !text-xs"
            placeholder="AIza…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
            }}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            onClick={() => setShow((v) => !v)}
            title={show ? 'Verbergen' : 'Anzeigen'}
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <Button onClick={save} disabled={draft.trim().length === 0}>
          Speichern
        </Button>
        {!stored ? (
          <Button variant="outline" onClick={runTest} disabled={testing || draft.trim().length === 0}>
            {testing ? <Loader2 size={13} className="animate-spin" /> : 'Testen'}
          </Button>
        ) : null}
      </div>

      {testResult ? (
        <p
          className={`mt-2 flex items-start gap-1.5 rounded-lg border px-3 py-2 text-xs ${
            testResult.ok
              ? 'border-brand-200 bg-brand-50 text-brand-800'
              : 'border-error-200 bg-error-50 text-error-700'
          }`}
        >
          {testResult.ok ? (
            <CheckCircle2 size={13} className="mt-0.5 shrink-0" />
          ) : (
            <XCircle size={13} className="mt-0.5 shrink-0" />
          )}
          {testResult.message}
        </p>
      ) : null}

      <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2.5 text-[11px] text-slate-600 space-y-1">
        <p className="font-bold text-slate-700">So bekommen Sie den Schlüssel (kostenlos):</p>
        <p>
          1. <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer" className="text-cyan-700 underline">aistudio.google.com/apikey</a>{' '}
          öffnen und mit Ihrem Google-Konto anmelden
        </p>
        <p>2. „API-Schlüssel erstellen“ klicken und den Schlüssel kopieren (beginnt mit „AIza…“)</p>
        <p>3. Hier einfügen, „Speichern“, dann „Testen“</p>
        <p className="pt-1 text-slate-500">
          Der Schlüssel wird nur in diesem Browser auf diesem Gerät gespeichert — er ist <strong>nie</strong> im
          JSON-Datenexport enthalten und kann hier jederzeit entfernt werden (zusätzlich in Google AI Studio
          widerrufbar). Das monatliche KI-Budget unten gilt auch für die Direktverbindung.
        </p>
      </div>
    </Card>
  );
}

function DataTab() {
  const exportJson = useKwStore((st) => st.exportJson);
  const importJson = useKwStore((st) => st.importJson);
  const resetToSeed = useKwStore((st) => st.resetToSeed);
  const clearAllData = useKwStore((st) => st.clearAllData);
  const fileRef = useRef<HTMLInputElement>(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);

  const doExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `klarwerk-kalkulation-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Export erstellt.');
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2 max-w-3xl">
      <Card>
        <SectionTitle>Sicherung</SectionTitle>
        <p className="text-xs text-slate-500 mb-3">
          Alle Daten liegen lokal in diesem Browser (automatisch gespeichert). Exportieren Sie regelmäßig eine
          JSON-Sicherung — sie lässt sich hier oder auf einem anderen Gerät wieder importieren.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button icon={<Download size={14} />} onClick={doExport}>
            Daten exportieren (JSON)
          </Button>
          <Button variant="outline" icon={<Upload size={14} />} onClick={() => fileRef.current?.click()}>
            Daten importieren
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const text = await file.text();
              const res = importJson(text);
              if (res.ok) toast('Daten importiert.');
              else toast(res.error ?? 'Import fehlgeschlagen.', 'error');
              e.target.value = '';
            }}
          />
        </div>
      </Card>

      <Card>
        <SectionTitle>Zurücksetzen</SectionTitle>
        <div className="space-y-2">
          <Button variant="outline" icon={<RotateCcw size={14} />} onClick={() => setResetOpen(true)}>
            Auf Demo-Daten zurücksetzen
          </Button>
          <p className="text-[11px] text-slate-400">Stellt Beispielkunden, -objekte und -kalkulationen wieder her.</p>
          <Button variant="danger" icon={<Trash2 size={14} />} onClick={() => setClearOpen(true)}>
            Alle Bewegungsdaten löschen
          </Button>
          <p className="text-[11px] text-slate-400">
            Entfernt Kunden, Objekte und Kalkulationen — Bibliothek und Einstellungen bleiben im Standard erhalten.
          </p>
        </div>
      </Card>

      <ConfirmModal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={() => {
          resetToSeed();
          toast('Demo-Daten wiederhergestellt.');
        }}
        title="Auf Demo-Daten zurücksetzen?"
        message="Alle aktuellen Daten werden durch die Beispieldaten ersetzt. Vorher exportieren, falls Sie etwas behalten möchten."
        confirmLabel="Zurücksetzen"
      />
      <ConfirmModal
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        onConfirm={() => {
          clearAllData();
          toast('Bewegungsdaten gelöscht.');
        }}
        title="Alle Bewegungsdaten löschen?"
        message="Kunden, Objekte, Kalkulationen und KI-Protokoll werden unwiderruflich gelöscht."
      />
    </div>
  );
}
