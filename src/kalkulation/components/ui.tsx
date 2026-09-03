/**
 * UI-Primitive der Kalkulations-App.
 * Schlank, schnell, konsistent — deutsche Zahlenformate inklusive.
 */

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, CheckCircle2, HelpCircle, Info, X, XCircle } from 'lucide-react';
import { create } from 'zustand';
import { fmtNum, parseGermanNumber } from '../lib/format';

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// Button
// ─────────────────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';

const buttonStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 shadow-sm disabled:bg-brand-600/50',
  secondary:
    'bg-navy-950 text-white hover:bg-navy-900 shadow-sm disabled:bg-navy-950/50',
  outline:
    'bg-white text-slate-700 border border-[color:var(--kw-border)] hover:border-slate-300 hover:bg-slate-50 disabled:text-slate-400',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:text-slate-400',
  danger: 'bg-error-600 text-white hover:bg-error-700 shadow-sm disabled:bg-error-600/50',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'kw-press inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold whitespace-nowrap',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 disabled:cursor-not-allowed',
        size === 'sm' && 'text-xs px-2.5 py-1.5',
        size === 'md' && 'text-sm px-3.5 py-2',
        size === 'lg' && 'text-sm px-5 py-2.5',
        buttonStyles[variant],
        className
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card / Layoutbausteine
// ─────────────────────────────────────────────────────────────────────────────

export function Card({
  className,
  children,
  padded = true,
}: {
  className?: string;
  children: ReactNode;
  padded?: boolean;
}) {
  return <div className={cx('kw-card', padded && 'p-5', className)}>{children}</div>;
}

export function SectionTitle({
  children,
  right,
  className,
}: {
  children: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('flex items-center justify-between gap-3 mb-3', className)}>
      <h2 className="text-sm font-bold text-slate-800 tracking-tight">{children}</h2>
      {right}
    </div>
  );
}

export function FieldLabel({
  children,
  htmlFor,
  hint,
}: {
  children: ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold text-slate-600 mb-1">
      {children}
      {hint ? <span className="ml-1 font-normal text-slate-400">{hint}</span> : null}
    </label>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      {icon ? <div className="text-slate-300 mb-3">{icon}</div> : null}
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      {description ? <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Formulare
// ─────────────────────────────────────────────────────────────────────────────

export function TextInput({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx('kw-input', className)} {...rest} />;
}

export function Textarea({
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx('kw-input', className)} {...rest} />;
}

export function Select({
  className,
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx('kw-input', className)} {...rest}>
      {children}
    </select>
  );
}

export interface NumberInputProps {
  value: number | null;
  onChange: (v: number | null) => void;
  decimals?: number;
  min?: number;
  max?: number;
  suffix?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  alignRight?: boolean;
  /** Kompakte Tabellenzellen-Variante. */
  cell?: boolean;
  id?: string;
  title?: string;
}

/** Zahleneingabe mit deutschem Format (Komma), Commit bei Blur/Enter. */
export function NumberInput({
  value,
  onChange,
  decimals = 2,
  min,
  max,
  suffix,
  placeholder,
  className,
  inputClassName,
  disabled,
  alignRight = true,
  cell = false,
  id,
  title,
}: NumberInputProps) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState('');
  const [invalid, setInvalid] = useState(false);

  const display = focused
    ? draft
    : value == null
      ? ''
      : fmtNum(value, decimals);

  const commit = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === '') {
      setInvalid(false);
      if (value != null) onChange(null);
      return;
    }
    const parsed = parseGermanNumber(trimmed);
    if (parsed == null) {
      setInvalid(true);
      return;
    }
    let v = parsed;
    if (min != null && v < min) v = min;
    if (max != null && v > max) v = max;
    setInvalid(false);
    // Nur committen, wenn sich der Wert tatsächlich geändert hat —
    // verhindert ungewollte „manuell angepasst“-Markierungen.
    if (value == null || Math.abs(v - value) > 1e-9) onChange(v);
  };

  const input = (
    <input
      id={id}
      title={title}
      type="text"
      inputMode="decimal"
      className={cx(
        cell ? 'kw-cell-input' : 'kw-input',
        invalid && 'kw-input--invalid',
        alignRight && 'text-right',
        suffix && (cell ? '!pr-7' : '!pr-9'),
        inputClassName
      )}
      value={display}
      placeholder={placeholder}
      disabled={disabled}
      onFocus={(e) => {
        setFocused(true);
        setDraft(value == null ? '' : String(value).replace('.', ','));
        requestAnimationFrame(() => e.target.select());
      }}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        setFocused(false);
        commit(draft);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          (e.target as HTMLInputElement).blur();
        } else if (e.key === 'Escape') {
          setDraft(value == null ? '' : String(value).replace('.', ','));
          (e.target as HTMLInputElement).blur();
        }
      }}
    />
  );

  if (!suffix) return className ? <div className={className}>{input}</div> : input;
  return (
    <div className={cx('relative', className)}>
      {input}
      <span
        className={cx(
          'pointer-events-none absolute top-1/2 -translate-y-1/2 text-[11px] text-slate-400',
          cell ? 'right-1.5' : 'right-2.5'
        )}
      >
        {suffix}
      </span>
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className={cx('inline-flex items-center gap-2', disabled ? 'opacity-50' : 'cursor-pointer')}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cx(
          'relative h-5 w-9 rounded-full transition-colors duration-150',
          checked ? 'bg-brand-600' : 'bg-slate-300'
        )}
      >
        <span
          className={cx(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-150',
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          )}
          style={{ left: 0 }}
        />
      </button>
      {label ? <span className="text-sm text-slate-700">{label}</span> : null}
    </label>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  size = 'md',
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
}) {
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cx(
            'kw-press rounded-md font-semibold transition-colors',
            size === 'sm' ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
            o.value === value
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-800'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Badges
// ─────────────────────────────────────────────────────────────────────────────

type BadgeTone = 'neutral' | 'green' | 'blue' | 'amber' | 'red' | 'navy' | 'outline';

const badgeTones: Record<BadgeTone, string> = {
  neutral: 'bg-slate-100 text-slate-600',
  green: 'bg-brand-50 text-brand-700',
  blue: 'bg-cyan-50 text-cyan-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-error-50 text-error-700',
  navy: 'bg-navy-900 text-white',
  outline: 'bg-white border border-slate-200 text-slate-600',
};

export function Badge({
  tone = 'neutral',
  children,
  className,
  title,
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap',
        badgeTones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tabs
// ─────────────────────────────────────────────────────────────────────────────

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: ReactNode; badge?: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-1 border-b border-[color:var(--kw-border)] overflow-x-auto">
      {tabs.map((t) => (
        <button
          key={t.value}
          type="button"
          onClick={() => onChange(t.value)}
          className={cx(
            'relative px-3.5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors duration-150',
            t.value === value ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
          )}
        >
          <span className="inline-flex items-center gap-1.5">
            {t.label}
            {t.badge}
          </span>
          {t.value === value ? (
            <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-brand-500" />
          ) : null}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────────────────────────────────────

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width = 'max-w-lg',
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setMounted(true));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      setMounted(false);
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="kw-app">
      <div
        className="kw-modal-overlay"
        data-state={mounted ? 'open' : 'closed'}
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4 sm:p-8 pointer-events-none">
        <div
          className={cx('kw-modal-panel kw-card w-full pointer-events-auto my-auto', width)}
          data-state={mounted ? 'open' : 'closed'}
          role="dialog"
          aria-modal="true"
        >
          {title != null && (
            <div className="flex items-center justify-between gap-4 px-5 pt-4 pb-3 border-b border-[color:var(--kw-border)]">
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="kw-press rounded-md p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Schließen"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <div className="px-5 py-4">{children}</div>
          {footer != null && (
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[color:var(--kw-border)] bg-slate-50/60 rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Löschen',
  danger = true,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-600">{message}</p>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Info-Popover („Wie wurde dieser Wert berechnet?“)
// ─────────────────────────────────────────────────────────────────────────────

export function InfoTip({
  children,
  label = 'Wie wurde dieser Wert berechnet?',
  icon,
}: {
  children: ReactNode;
  label?: string;
  icon?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative inline-flex" ref={ref}>
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={() => setOpen((v) => !v)}
        className="kw-press inline-flex items-center justify-center rounded-full p-0.5 text-slate-400 hover:text-cyan-600"
      >
        {icon ?? <HelpCircle size={14} />}
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-72 rounded-lg border border-[color:var(--kw-border)] bg-white p-3 text-left shadow-glass-lg">
          {children}
        </div>
      ) : null}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Warnhinweise
// ─────────────────────────────────────────────────────────────────────────────

export function Callout({
  tone,
  children,
  className,
}: {
  tone: 'error' | 'warn' | 'info' | 'ok';
  children: ReactNode;
  className?: string;
}) {
  const config = {
    error: { cls: 'bg-error-50 border-error-200 text-error-800', icon: <XCircle size={15} className="text-error-500 shrink-0 mt-0.5" /> },
    warn: { cls: 'bg-amber-50 border-amber-200 text-amber-800', icon: <AlertTriangle size={15} className="text-amber-500 shrink-0 mt-0.5" /> },
    info: { cls: 'bg-cyan-50 border-cyan-200 text-cyan-900', icon: <Info size={15} className="text-cyan-500 shrink-0 mt-0.5" /> },
    ok: { cls: 'bg-brand-50 border-brand-200 text-brand-800', icon: <CheckCircle2 size={15} className="text-brand-500 shrink-0 mt-0.5" /> },
  }[tone];
  return (
    <div className={cx('flex items-start gap-2 rounded-lg border px-3 py-2 text-xs font-medium', config.cls, className)}>
      {config.icon}
      <div className="min-w-0">{children}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Toasts
// ─────────────────────────────────────────────────────────────────────────────

interface ToastItem {
  id: number;
  message: string;
  tone: 'ok' | 'error' | 'info';
}

const useToastStore = create<{
  toasts: ToastItem[];
  push: (t: Omit<ToastItem, 'id'>) => void;
  remove: (id: number) => void;
}>((set) => ({
  toasts: [],
  push: (t) =>
    set((st) => ({
      toasts: [...st.toasts, { ...t, id: Date.now() + Math.random() }].slice(-4),
    })),
  remove: (id) => set((st) => ({ toasts: st.toasts.filter((x) => x.id !== id) })),
}));

export function toast(message: string, tone: 'ok' | 'error' | 'info' = 'ok') {
  useToastStore.getState().push({ message, tone });
}

function ToastCard({ item, onDone }: { item: ToastItem; onDone: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    const t = setTimeout(onDone, 3800);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [onDone]);
  const icon =
    item.tone === 'ok' ? (
      <CheckCircle2 size={15} className="text-brand-400 shrink-0" />
    ) : item.tone === 'error' ? (
      <XCircle size={15} className="text-error-400 shrink-0" />
    ) : (
      <Info size={15} className="text-cyan-400 shrink-0" />
    );
  return (
    <div
      className="flex items-center gap-2 rounded-lg bg-navy-950 text-white text-xs font-medium pl-3 pr-2 py-2.5 shadow-glass-lg"
      style={{
        transition: 'transform 220ms var(--kw-ease), opacity 220ms var(--kw-ease)',
        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        opacity: mounted ? 1 : 0,
      }}
    >
      {icon}
      <span className="min-w-0">{item.message}</span>
      <button
        type="button"
        onClick={onDone}
        className="kw-press ml-1 rounded p-0.5 text-white/50 hover:text-white"
        aria-label="Schließen"
      >
        <X size={13} />
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts, remove } = useToastStore();
  if (toasts.length === 0) return null;
  return createPortal(
    <div className="kw-app !bg-transparent !min-h-0 fixed bottom-4 right-4 z-[90] flex flex-col items-end gap-2">
      {toasts.map((t) => (
        <ToastCard key={t.id} item={t} onDone={() => remove(t.id)} />
      ))}
    </div>,
    document.body
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KPI-Karte
// ─────────────────────────────────────────────────────────────────────────────

export function KpiCard({
  label,
  value,
  sub,
  icon,
  tone = 'default',
  info,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  tone?: 'default' | 'green' | 'red' | 'amber' | 'blue';
  info?: ReactNode;
}) {
  const valueColor = {
    default: 'text-slate-900',
    green: 'text-brand-700',
    red: 'text-error-600',
    amber: 'text-amber-600',
    blue: 'text-cyan-700',
  }[tone];
  return (
    <div className="kw-card p-4 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 truncate">{label}</p>
        <span className="flex items-center gap-1">
          {info}
          {icon ? <span className="text-slate-300">{icon}</span> : null}
        </span>
      </div>
      <p className={cx('mt-1.5 text-xl font-bold tracking-tight kw-tnum truncate', valueColor)}>{value}</p>
      {sub ? <p className="mt-0.5 text-[11px] text-slate-500 truncate">{sub}</p> : null}
    </div>
  );
}
