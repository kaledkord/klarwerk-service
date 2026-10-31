import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { services } from '../../data/services';
import { dropdownMotion, mobileMenuMotion, easeOut } from '../../lib/motion';

// Ab hier verschwindet die Kopfzeile beim Runterscrollen und kommt beim Hochscrollen sofort zurück.
const AUSBLENDEN_AB_PX = 160;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      if (y > AUSBLENDEN_AB_PX && y > lastY + 4) setHidden(true);
      else if (y < lastY - 4 || y <= AUSBLENDEN_AB_PX) setHidden(false);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const versteckt = hidden && !mobileOpen && !servicesOpen;

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
    `text-sm font-medium transition-colors ${isActive ? 'text-brand-300' : 'text-slate-300 hover:text-white'}`;

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
  };

  return (
    <header
      className={`klw-kopf fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav border-b border-white/10 shadow-lg shadow-black/20' : 'bg-paper-100'
      } ${versteckt ? '-translate-y-full' : ''}`}
    >
      <div
        className={`max-w-7xl mx-auto px-6 flex items-center justify-between gap-8 transition-all duration-300 ${
          scrolled ? 'py-2.5' : 'h-18 py-4'
        }`}
      >
        <Link to="/" className="shrink-0" onClick={closeMobile}>
          <img
            src="/Kein_Titel_(580_x_140_px)_20260715_025604_0000.svg"
            alt="KlarWerk Service"
            width={580}
            height={140}
            decoding="async"
            className={`w-auto object-contain transition-all duration-300 ${scrolled ? 'h-8' : 'h-10'}`}
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
                servicesOpen ? 'text-white' : 'text-slate-300 hover:text-white'
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
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-paper-100 border border-white/10 rounded-2xl shadow-xl shadow-slate-900/8 p-4 w-[680px] z-50"
                >
                  <div className="grid grid-cols-3 gap-1">
                    {services.map((s) => {
                      const Icon = s.icon;
                      return (
                        <Link
                          key={s.id}
                          to={`/leistungen/${s.id}`}
                          onClick={() => setServicesOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-paper group transition-colors"
                        >
                          <Icon
                            size={16}
                            className="shrink-0 text-slate-400 group-hover:text-brand-300 transition-colors"
                          />
                          <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                            {s.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <Link
                      to="/leistungen"
                      onClick={() => setServicesOpen(false)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-brand-300 hover:gap-2.5 transition-all px-3"
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
          className="klw-burger lg:hidden w-11 h-11 grid place-content-center gap-[5px] rounded-lg text-white hover:bg-white/10 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobil-menue"
          aria-label={mobileOpen ? 'Menü schließen' : 'Menü öffnen'}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobil-menue"
            {...mobileMenuMotion}
            className="lg:hidden overflow-hidden border-t border-white/10 bg-paper-100"
          >
            <div className="px-6 py-5 space-y-1">
              <Link to="/" onClick={closeMobile} className="klw-menue-eintrag block py-2.5 text-sm font-medium text-slate-200 hover:text-white" style={{ '--k': 0 } as React.CSSProperties}>
                Startseite
              </Link>
              <Link to="/ueber-uns" onClick={closeMobile} className="klw-menue-eintrag block py-2.5 text-sm font-medium text-slate-200 hover:text-white" style={{ '--k': 1 } as React.CSSProperties}>
                Über uns
              </Link>

              <div className="klw-menue-eintrag" style={{ '--k': 2 } as React.CSSProperties}>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-slate-200"
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
                      className="overflow-hidden pl-4 border-l border-white/10 ml-2"
                    >
                      {services.map((s) => (
                        <Link
                          key={s.id}
                          to={`/leistungen/${s.id}`}
                          onClick={closeMobile}
                          className="block py-2 text-sm text-slate-300 hover:text-white"
                        >
                          {s.title}
                        </Link>
                      ))}
                      <Link to="/leistungen" onClick={closeMobile} className="block py-2 text-sm font-semibold text-brand-300">
                        Alle Leistungen →
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/einsatzgebiet" onClick={closeMobile} className="klw-menue-eintrag block py-2.5 text-sm font-medium text-slate-200 hover:text-white" style={{ '--k': 3 } as React.CSSProperties}>
                Einsatzgebiet
              </Link>
              <Link to="/nachhaltigkeit" onClick={closeMobile} className="klw-menue-eintrag block py-2.5 text-sm font-medium text-slate-200 hover:text-white" style={{ '--k': 4 } as React.CSSProperties}>
                Nachhaltigkeit
              </Link>

              <Link to="/kontakt" onClick={closeMobile} className="klw-menue-eintrag block py-2.5 text-sm font-medium text-slate-200 hover:text-white" style={{ '--k': 5 } as React.CSSProperties}>
                Kontakt
              </Link>

              <div className="klw-menue-eintrag pt-4" style={{ '--k': 7 } as React.CSSProperties}>
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
