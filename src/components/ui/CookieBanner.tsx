import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const STORAGE_KEY = 'klw-cookie-consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
        >
          <div className="max-w-4xl mx-auto bg-paper-100 border border-white/10 rounded-2xl shadow-2xl shadow-slate-900/10 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="w-9 h-9 bg-brand-500/15 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <Shield size={16} className="text-brand-300" />
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Wir verwenden nur technisch notwendige Funktionen. Keine Tracking-Cookies.
                Mehr dazu in unserer{' '}
                <Link to="/datenschutz" className="underline underline-offset-2 text-brand-300 font-medium hover:no-underline">
                  Datenschutzerklärung
                </Link>.
              </p>
            </div>
            <button
              onClick={accept}
              className="shrink-0 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Verstanden
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
