import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { services } from '../../data/services';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    service: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="flex flex-col items-center justify-center text-center py-16 px-8">
        <div className="w-16 h-16 bg-success-500/15 rounded-full flex items-center justify-center mb-5">
          <CheckCircle size={32} className="text-success-500" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">Vielen Dank!</h3>
        <p className="text-slate-300 max-w-sm leading-relaxed">
          Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns zeitnah bei Ihnen, um eine kostenlose Besichtigung zu vereinbaren.
        </p>
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors bg-paper-100';
  const labelClass = 'block text-sm font-medium text-slate-200 mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            Name <span className="text-error-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Max Mustermann"
            value={formData.name}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="company" className={labelClass}>
            Firma
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Musterfirma GmbH"
            value={formData.company}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className={labelClass}>
            E-Mail <span className="text-error-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="max@musterfirma.de"
            value={formData.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Telefon
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+49 176 12345678"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className={labelClass}>
          Gewünschte Leistung
        </label>
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
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Nachricht <span className="text-error-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Beschreiben Sie kurz Ihr Anliegen oder Objekt…"
          value={formData.message}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      {error && (
        <p className="text-sm text-error-600 bg-error-50 border border-error-100 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:bg-white/15 text-white font-semibold py-3.5 rounded-xl transition-colors"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Wird gesendet…
          </>
        ) : (
          'Anfrage absenden'
        )}
      </button>

      <p className="text-xs text-slate-400 text-center">
        Mit dem Absenden stimmen Sie unserer{' '}
        <Link to="/datenschutz" className="underline hover:text-slate-300">Datenschutzerklärung</Link>{' '}
        zu.
      </p>
    </form>
  );
}
