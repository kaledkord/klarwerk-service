import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.25 }}
          onClick={scrollUp}
          className="klw-tooltip-anker fixed bottom-6 right-6 z-40 w-11 h-11 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-lg shadow-brand-600/20 flex items-center justify-center transition-colors"
          aria-label="Nach oben scrollen"
        >
          <ArrowUp size={18} />
          <span className="klw-tooltip" aria-hidden="true">Nach oben</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
