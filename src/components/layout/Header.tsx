import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, ArrowRight } from 'lucide-react';
import { services } from '../../data/services';
import { dropdownMotion, mobileMenuMotion, easeOut } from '../../lib/motion';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-brand-700' : 'text-slate-600 hover:text-slate-900'}`;

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav border-b border-slate-200' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 py-4 flex items-center justify-between gap-8">
        <Link to="/" className="shrink-0" onClick={closeMobile}>
          <img
            src="/Kein_Titel_(580_x_140_px)_20260715_025604_0000.svg"
            alt="KlarWerk Service"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>
            Startseite
          </NavLink>
          <NavLink to="/ueber-uns" className={navLinkClass}>
            Über uns
          </NavLink>

          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              onClick={() => navigate('/leistungen')}
              className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                servicesOpen ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Leistungen
              <motion.span animate={{ rotate: servicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={15} />
              </motion.span>
            </button>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  {...dropdownMotion}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-900/8 p-4 w-[680px] z-50"
                >
                  <div className="grid grid-cols-3 gap-1">
                    {services.map((s) => {
                      const Icon = s.icon;
                      return (
                        <Link
                          key={s.id}
                          to={`/leistungen/${s.id}`}
                          onClick={() => setServicesOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 group transition-colors"
                        >
                          <Icon
                            size={16}
                            className="shrink-0 text-slate-400 group-hover:text-brand-700 transition-colors"
                          />
                          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                            {s.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <Link
                      to="/leistungen"
                      onClick={() => setServicesOpen(false)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:gap-2.5 transition-all px-3"
                    >
                      Alle Leistungen ansehen
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink to="/einsatzgebiet" className={navLinkClass}>
            Einsatzgebiet
          </NavLink>
          <NavLink to="/nachhaltigkeit" className={navLinkClass}>
            Nachhaltigkeit
          </NavLink>

          <NavLink to="/kontakt" className={navLinkClass}>
            Kontakt
          </NavLink>
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link to="/kontakt" className="btn-primary text-sm px-5 py-2.5">
            Angebot anfordern
            <ArrowRight size={14} />
          </Link>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            {...mobileMenuMotion}
            className="lg:hidden overflow-hidden border-t border-slate-200 bg-white"
          >
            <div className="px-6 py-5 space-y-1">
              <Link to="/" onClick={closeMobile} className="block py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900">
                Startseite
              </Link>
              <Link to="/ueber-uns" onClick={closeMobile} className="block py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900">
                Über uns
              </Link>

              <div>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-slate-700"
                >
                  Leistungen
                  <motion.span animate={{ rotate: mobileServicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: easeOut }}
                      className="overflow-hidden pl-4 border-l border-slate-200 ml-2"
                    >
                      {services.map((s) => (
                        <Link
                          key={s.id}
                          to={`/leistungen/${s.id}`}
                          onClick={closeMobile}
                          className="block py-2 text-sm text-slate-600 hover:text-slate-900"
                        >
                          {s.title}
                        </Link>
                      ))}
                      <Link to="/leistungen" onClick={closeMobile} className="block py-2 text-sm font-semibold text-brand-700">
                        Alle Leistungen →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/einsatzgebiet" onClick={closeMobile} className="block py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900">
                Einsatzgebiet
              </Link>
              <Link to="/nachhaltigkeit" onClick={closeMobile} className="block py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900">
                Nachhaltigkeit
              </Link>

              <Link to="/kontakt" onClick={closeMobile} className="block py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900">
                Kontakt
              </Link>

              <div className="pt-4">
                <Link to="/kontakt" onClick={closeMobile} className="block w-full text-center bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
                  Angebot anfordern
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
