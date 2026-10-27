import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info, X } from 'lucide-react';

interface Schritt {
  title: string;
  desc: string;
}

const SCHLIESSEN_MS = 220;

/**
 * Link „So läuft Ihre Anfrage ab“ mit Dialog. Der Dialog ist ein natives <dialog>:
 * Esc, Fokus und Bildschirmleser übernimmt der Browser, die Animation kommt aus index.css.
 */
export default function AblaufDialog({ schritte }: { schritte: Schritt[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [offen, setOffen] = useState(false);

  const oeffnen = () => {
    const dialog = ref.current;
    if (!dialog || typeof dialog.showModal !== 'function') return;
    dialog.showModal();
    // Erst nach dem ersten Bild die Klasse setzen, sonst springt die Übergangsanimation.
    requestAnimationFrame(() => requestAnimationFrame(() => setOffen(true)));
  };

  const schliessen = () => {
    setOffen(false);
    window.setTimeout(() => ref.current?.close(), SCHLIESSEN_MS);
  };

  return (
    <>
      <button
        type="button"
        onClick={oeffnen}
        className="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-brand-300 hover:text-white transition-colors"
      >
        <Info size={16} />
        So läuft Ihre Anfrage ab
      </button>

      <dialog
        ref={ref}
        aria-labelledby="ablauf-titel"
        className={`klw-dialog ${offen ? 'klw-offen' : ''}`}
        onCancel={(e) => {
          e.preventDefault();
          schliessen();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) schliessen();
        }}
      >
        <div className="relative flex flex-col gap-5 rounded-2xl border border-white/20 bg-paper-100 p-7 shadow-2xl">
          <button
            type="button"
            onClick={schliessen}
            aria-label="Schließen"
            className="absolute top-3 right-3 w-11 h-11 grid place-items-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
          <h2 id="ablauf-titel" className="pr-10 text-2xl font-black tracking-tight text-white">
            So läuft Ihre Anfrage ab
          </h2>
          <ol className="flex flex-col gap-4">
            {schritte.map((s, i) => (
              <li
                key={s.title}
                className="klw-schritt grid grid-cols-[2rem_1fr] gap-x-3"
                style={{ '--k': i } as React.CSSProperties}
              >
                <span className="row-span-2 w-8 h-8 grid place-items-center rounded-full bg-brand-500/15 text-sm font-black text-brand-300">
                  {i + 1}
                </span>
                <span className="font-bold text-white">{s.title}</span>
                <span className="text-sm text-slate-400 leading-relaxed">{s.desc}</span>
              </li>
            ))}
          </ol>
          <div className="flex justify-end">
            <Link to="/kontakt" onClick={() => ref.current?.close()} className="btn-primary text-sm px-6 py-3">
              Kostenloses Angebot
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
