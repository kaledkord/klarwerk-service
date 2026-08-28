/** Deutsche Zahlen-, Währungs- und Datumsformate. */

const EUR = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const EUR0 = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function fmtEur(v: number): string {
  return EUR.format(safe(v));
}

export function fmtEur0(v: number): string {
  return EUR0.format(safe(v));
}

export function fmtNum(v: number, digits = 2): string {
  return safe(v).toLocaleString('de-DE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

export function fmtNumFixed(v: number, digits = 2): string {
  return safe(v).toLocaleString('de-DE', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function fmtHours(v: number, digits = 2): string {
  return `${fmtNum(v, digits)} h`;
}

export function fmtPct(v: number, digits = 1): string {
  return `${fmtNum(v, digits)} %`;
}

export function fmtSqm(v: number): string {
  return `${fmtNum(v, 1)} m²`;
}

export function fmtDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function fmtDateTime(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}, ${d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`;
}

export function fmtMonth(yyyyMm: string): string {
  const [y, m] = yyyyMm.split('-').map(Number);
  if (!y || !m) return yyyyMm;
  return new Date(y, m - 1, 1).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
}

/** Parst deutsche Zahleneingaben („1.234,56“ oder „1234.56“). */
export function parseGermanNumber(input: string): number | null {
  const trimmed = input.trim().replace(/\s/g, '').replace('€', '').replace('%', '');
  if (trimmed === '') return null;
  let normalized = trimmed;
  if (trimmed.includes(',')) {
    normalized = trimmed.replace(/\./g, '').replace(',', '.');
  }
  const v = Number(normalized);
  return Number.isFinite(v) ? v : null;
}

function safe(v: number): number {
  return Number.isFinite(v) ? v : 0;
}

export function todayIso(): string {
  return new Date().toISOString();
}

export function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
