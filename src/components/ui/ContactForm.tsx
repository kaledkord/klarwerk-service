import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { services } from '../../data/services';

type Pflichtfeld = 'name' | 'email' | 'message';

// Leerer Text heißt: in Ordnung.
const PRUEFUNG: Record<Pflichtfeld, (v: string) => string> = {
  name: (v) => (v.trim() ? '' : 'Bitte geben Sie Ihren Namen ein.'),
  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
      ? ''
      : 'Bitte geben Sie eine gültige E-Mail-Adresse ein, z. B. name@firma.de.',
  message: (v) => (v.trim() ? '' : 'Bitte beschreiben Sie kurz Ihr Anliegen.'),
};
const PFLICHTFELDER: Pflichtfeld[] = ['name', 'email', 'message'];

// Funken nach dem Absenden: acht Richtungen, abwechselnd in den Logofarben.
const FUNKEN = [
  { x: 46, y: 0, c: '#35A1DA' }, { x: 33, y: 33, c: '#F5891F' }, { x: 0, y: 46, c: '#F0552B' }, { x: -33, y: 33, c: '#21A841' },
  { x: -46, y: 0, c: '#35A1DA' }, { x: -33, y: -33, c: '#F5891F' }, { x: 0, y: -46, c: '#F0552B' }, { x: 33, y: -33, c: '#21A841' },
];

interface FeldProps {
  id: string;
  label: string;
  pflicht?: boolean;
  status?: 'ok' | 'fehler';
  hinweis?: string;
  wackelt?: boolean;
  onWackelEnde?: () => void;
  children: React.ReactNode;
}

// Eingabefeld mit Bezeichnung, die beim Antippen nach oben rutscht (Stile in index.css, „Formularfelder“).
// Das Eingabeelement muss direkt vor dem label stehen, sonst greift der Selektor „input + label“ nicht.
function Feld({ id, label, pflicht, status, hinweis, wackelt, onWackelEnde, children }: FeldProps) {
  return (
    <div>
      <div
        className={`klw-feld ${status === 'ok' ? 'klw-ok' : ''} ${status === 'fehler' ? 'klw-fehler' : ''} ${wackelt ? 'klw-wackeln' : ''}`}
        onAnimationEnd={onWackelEnde}
      >
        {children}
        <label htmlFor={id}>
          {label}
          {pflicht && <span className="text-error-500"> *</span>}
        </label>
        <span className="klw-feld-linie" aria-hidden="true" />
        <span className="klw-feld-ok" aria-hidden="true">
          <Check size={14} strokeWidth={3} />
        </span>
      </div>
      {status === 'fehler' && hinweis && (
        <p id={`${id}-hinweis`} className="klw-feld-hinweis">
          {hinweis}
        </p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  });
  const [geprueft, setGeprueft] = useState<Partial<Record<Pflichtfeld, boolean>>>({});
  const [wackeln, setWackeln] = useState<Partial<Record<Pflichtfeld, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const pruefeBeimVerlassen = (feld: Pflichtfeld) => {
    // Leere Felder erst beim Absenden anmahnen, nicht schon beim Durchklicken.
    if (formData[feld].trim()) setGeprueft((g) => ({ ...g, [feld]: true }));
  };

  const fehlerVon = (feld: Pflichtfeld) => PRUEFUNG[feld](formData[feld]);

  const statusVon = (feld: Pflichtfeld): FeldProps['status'] => {
    if (!geprueft[feld]) return undefined;
    return fehlerVon(feld) ? 'fehler' : 'ok';
  };

  const pflichtProps = (feld: Pflichtfeld) => {
    const status = statusVon(feld);
    return {
      'aria-invalid': status === 'fehler' ? true : undefined,
      'aria-describedby': status === 'fehler' ? `${feld}-hinweis` : undefined,
      onBlur: () => pruefeBeimVerlassen(feld),
    };
  };

  const feldProps = (feld: Pflichtfeld) => ({
    status: statusVon(feld),
    hinweis: fehlerVon(feld),
    wackelt: wackeln[feld],
    onWackelEnde: () => setWackeln((w) => ({ ...w, [feld]: false })),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const falsch = PFLICHTFELDER.filter((f) => fehlerVon(f));
    if (falsch.length > 0) {
      setGeprueft({ name: true, email: true, message: true });
      setWackeln(Object.fromEntries(falsch.map((f) => [f, true])));
      document.getElementById(falsch[0])?.focus();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            company: formData.company || null,
            phone: formData.phone || null,
            email: formData.email,
            message: formData.message,
            service: formData.service || null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns per Telefon.');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns per Telefon.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-8" role="status">
        <div className="relative mb-5">
          <div className="klw-erfolg-kreis w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path className="klw-haken" pathLength={1} d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </div>
          <span className="klw-funken absolute inset-0" aria-hidden="true">
            {FUNKEN.map((f, i) => (
              <i key={i} style={{ background: f.c, '--x': `${f.x}px`, '--y': `${f.y}px` } as React.CSSProperties} />
            ))}
          </span>
        </div>
        <h3 className="klw-erfolg-text text-2xl font-bold text-white mb-3">Vielen Dank!</h3>
        <p className="klw-erfolg-text text-slate-300 max-w-sm leading-relaxed">
          Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns zeitnah bei Ihnen, um eine kostenlose Besichtigung zu vereinbaren.
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full px-4 pt-6 pb-2 rounded-xl border border-white/10 text-white placeholder-transparent text-sm focus:outline-none focus:border-brand-500/60 transition-colors bg-paper-100';

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Feld id="name" label="Name" pflicht {...feldProps('name')}>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder=" "
            value={formData.name}
            onChange={handleChange}
            className={`${inputClass} pr-11`}
            {...pflichtProps('name')}
          />
        </Feld>
        <Feld id="company" label="Firma">
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder=" "
            value={formData.company}
            onChange={handleChange}
            className={inputClass}
          />
        </Feld>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Feld id="email" label="E-Mail" pflicht {...feldProps('email')}>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder=" "
            value={formData.email}
            onChange={handleChange}
            className={`${inputClass} pr-11`}
            {...pflichtProps('email')}
          />
        </Feld>
        <Feld id="phone" label="Telefon">
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder=" "
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
          />
        </Feld>
      </div>

      <Feld id="service" label="Gewünschte Leistung">
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Leistung auswählen…</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </Feld>

      <Feld id="message" label="Nachricht" pflicht {...feldProps('message')}>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder=" "
          value={formData.message}
          onChange={handleChange}
          className={`${inputClass} block pt-7 pr-11`}
          {...pflichtProps('message')}
        />
      </Feld>

      {error && (
        <p className="animate-fade-in-up text-sm text-error-600 bg-error-50 border border-error-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* Beim Senden wird der Knopf zum Ladekreis (index.css, „Absenden“). */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={loading}
          data-laedt={loading}
          aria-busy={loading}
          className="klw-senden w-full h-[3.25rem] flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl"
        >
          {loading ? (
            <>
              <span className="klw-ring" aria-hidden="true" />
              <span className="sr-only">Wird gesendet…</span>
            </>
          ) : (
            'Anfrage absenden'
          )}
        </button>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Mit dem Absenden stimmen Sie unserer{' '}
        <Link to="/datenschutz" className="underline hover:text-slate-300">Datenschutzerklärung</Link>{' '}
        zu.
      </p>
    </form>
  );
}
