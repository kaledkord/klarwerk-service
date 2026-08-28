/**
 * App-Shell: Sidebar (Navy, Logo), Topbar mit Suche & Schnellaktionen,
 * Seitenkopf mit Breadcrumbs, Befehlspalette (Strg/Cmd+K).
 */

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Building2,
  Calculator,
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  Menu,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useKwStore } from '../lib/store';
import { CALCULATION_STATUS_LABELS } from '../lib/types';
import { cx } from './ui';
import logoUrl from '../assets/klarwerk-logo.png';

export const BASE = '/kalkulation';

/**
 * Öffnet eine App-Route in neuem Tab — funktioniert im Web (Pfad-Routing)
 * und in der Standalone-Datei (Hash-Routing, file://) gleichermaßen.
 */
export function openAppRoute(path: string) {
  if (window.location.hash.startsWith('#/')) {
    window.open(`${window.location.pathname}${window.location.search}#${path}`, '_blank');
  } else {
    window.open(path, '_blank');
  }
}

const NAV_ITEMS = [
  { to: `${BASE}`, label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: `${BASE}/schnellkalkulation`, label: 'Schnellkalkulation', icon: Zap },
  { to: `${BASE}/kalkulationen`, label: 'Kalkulationen', icon: Calculator },
  { to: `${BASE}/assistent`, label: 'KI-Assistent', icon: Sparkles },
  { to: `${BASE}/kunden`, label: 'Kunden', icon: Users },
  { to: `${BASE}/objekte`, label: 'Objekte', icon: Building2 },
  { to: `${BASE}/bibliothek`, label: 'Bibliothek', icon: BookOpen },
  { to: `${BASE}/einstellungen`, label: 'Einstellungen', icon: Settings },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col" style={{ background: 'var(--kw-navy)' }}>
      <Link
        to={BASE}
        onClick={onNavigate}
        className="flex items-center gap-3 px-4 pt-5 pb-4"
      >
        <img src={logoUrl} alt="KlarWerk Service Logo" className="h-11 w-11 rounded-xl" />
        <div className="min-w-0">
          <p className="text-[15px] font-extrabold leading-tight text-white tracking-tight">
            KlarWerk <span className="bg-gradient-to-r from-cyan-400 to-brand-400 bg-clip-text text-transparent">Kalkulation</span>
          </p>
          <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
            Intelligente Objektkalkulation
          </p>
        </div>
      </Link>

      <nav className="flex-1 overflow-y-auto px-2.5 py-2 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cx(
                'group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition-colors duration-150',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-gradient-to-b from-cyan-400 to-brand-400" />
                ) : null}
                <item.icon size={16} className={isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <a
          href="https://www.klarwerk-service.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-300 transition-colors"
        >
          <ExternalLink size={12} />
          klarwerk-service.com
        </a>
        <p className="mt-1 text-[10px] text-slate-600">KlarWerk Kalkulation · v1.2</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Befehlspalette (Strg/Cmd+K)
// ─────────────────────────────────────────────────────────────────────────────

interface PaletteEntry {
  id: string;
  title: string;
  sub: string;
  to: string;
  group: string;
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const data = useKwStore((st) => st.data);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const entries = useMemo<PaletteEntry[]>(() => {
    const pages: PaletteEntry[] = NAV_ITEMS.map((n) => ({
      id: n.to,
      title: n.label,
      sub: 'Seite',
      to: n.to,
      group: 'Navigation',
    }));
    const calcs: PaletteEntry[] = data.calculations.map((c) => ({
      id: c.id,
      title: c.name,
      sub: `${c.number} · ${CALCULATION_STATUS_LABELS[c.status]}`,
      to: `${BASE}/kalkulationen/${c.id}`,
      group: 'Kalkulationen',
    }));
    const customers: PaletteEntry[] = data.customers.map((c) => ({
      id: c.id,
      title: c.company,
      sub: `Kunde ${c.number}`,
      to: `${BASE}/kunden/${c.id}`,
      group: 'Kunden',
    }));
    const objects: PaletteEntry[] = data.objects.map((o) => ({
      id: o.id,
      title: o.name,
      sub: `Objekt · ${o.city ?? ''}`,
      to: `${BASE}/objekte/${o.id}`,
      group: 'Objekte',
    }));
    return [...pages, ...calcs, ...customers, ...objects];
  }, [data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.slice(0, 12);
    return entries
      .filter((e) => `${e.title} ${e.sub}`.toLowerCase().includes(q))
      .slice(0, 12);
  }, [entries, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setIndex(0), [query]);

  const go = useCallback(
    (entry: PaletteEntry | undefined) => {
      if (!entry) return;
      onClose();
      navigate(entry.to);
    },
    [navigate, onClose]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="absolute left-1/2 top-[12%] w-full max-w-xl -translate-x-1/2 px-4">
        <div className="kw-card overflow-hidden !rounded-xl">
          <div className="flex items-center gap-2 border-b border-[color:var(--kw-border)] px-4">
            <Search size={16} className="text-slate-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setIndex((i) => Math.min(i + 1, filtered.length - 1));
                } else if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  setIndex((i) => Math.max(i - 1, 0));
                } else if (e.key === 'Enter') {
                  go(filtered[index]);
                } else if (e.key === 'Escape') {
                  onClose();
                }
              }}
              placeholder="Kunden, Objekte, Kalkulationen oder Seiten suchen …"
              className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-slate-400"
            />
            <kbd className="hidden sm:block rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400">
              ESC
            </kbd>
          </div>
          <div className="max-h-80 overflow-y-auto py-1.5">
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-slate-400">Keine Treffer.</p>
            ) : (
              filtered.map((e, i) => (
                <button
                  key={`${e.group}-${e.id}`}
                  type="button"
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => go(e)}
                  className={cx(
                    'flex w-full items-center justify-between gap-3 px-4 py-2 text-left',
                    i === index ? 'bg-slate-100' : ''
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-slate-800">{e.title}</span>
                    <span className="block truncate text-[11px] text-slate-500">{e.sub}</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    {e.group}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AppShell
// ─────────────────────────────────────────────────────────────────────────────

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileNav, setMobileNav] = useState(false);
  const [palette, setPalette] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setMobileNav(false), [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="kw-app font-sans">
      <div className="flex min-h-screen">
        {/* Desktop-Sidebar */}
        <aside className="hidden lg:block w-60 shrink-0 sticky top-0 h-screen">
          <SidebarContent />
        </aside>

        {/* Mobile-Sidebar */}
        {mobileNav ? (
          <div className="fixed inset-0 z-[75] lg:hidden">
            <div className="absolute inset-0 bg-navy-950/50" onClick={() => setMobileNav(false)} />
            <div className="absolute inset-y-0 left-0 w-64 shadow-glass-lg">
              <SidebarContent onNavigate={() => setMobileNav(false)} />
              <button
                type="button"
                onClick={() => setMobileNav(false)}
                className="absolute right-2 top-4 rounded-md p-1.5 text-slate-400 hover:text-white"
                aria-label="Navigation schließen"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-40 border-b border-[color:var(--kw-border)] bg-white/85 backdrop-blur">
            <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
              <button
                type="button"
                className="kw-press rounded-md p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
                onClick={() => setMobileNav(true)}
                aria-label="Navigation öffnen"
              >
                <Menu size={18} />
              </button>

              <button
                type="button"
                onClick={() => setPalette(true)}
                className="kw-press flex flex-1 sm:flex-none sm:w-72 items-center gap-2 rounded-lg border border-[color:var(--kw-border)] bg-slate-50 px-3 py-1.5 text-left text-xs text-slate-400 hover:border-slate-300"
              >
                <Search size={13} />
                <span className="flex-1">Suchen …</span>
                <kbd className="hidden sm:block rounded border border-slate-200 bg-white px-1 py-px text-[9px] font-bold text-slate-400">
                  Strg K
                </kbd>
              </button>

              <div className="ml-auto flex items-center gap-2.5">
                <span className="hidden md:block text-[11px] text-slate-400">
                  Änderungen werden automatisch gespeichert
                </span>
                <button
                  type="button"
                  onClick={() => navigate(`${BASE}/kalkulationen/neu`)}
                  className="kw-press inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-brand-700"
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">Neue Kalkulation</span>
                  <span className="sm:hidden">Neu</span>
                </button>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>

      <CommandPalette open={palette} onClose={() => setPalette(false)} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Seitenkopf mit Breadcrumbs
// ─────────────────────────────────────────────────────────────────────────────

export function PageHeader({
  crumbs,
  title,
  sub,
  actions,
  className,
}: {
  crumbs?: { label: string; to?: string }[];
  title: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('mb-5', className)}>
      {crumbs && crumbs.length > 0 ? (
        <nav className="mb-1.5 flex items-center gap-1 text-[11px] font-medium text-slate-400 overflow-x-auto">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1 whitespace-nowrap">
              {i > 0 ? <ChevronRight size={11} className="shrink-0" /> : null}
              {c.to ? (
                <Link to={c.to} className="hover:text-cyan-700 transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span className="text-slate-500">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">{title}</h1>
          {sub ? <div className="mt-0.5 text-xs text-slate-500">{sub}</div> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
