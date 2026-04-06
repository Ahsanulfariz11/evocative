import React, { useState, useEffect } from 'react';
import { Coffee, X, Menu, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoSkeleton } from './Skeletons';
import { NAV_LINKS } from '../constants/navLinks';
import { trackClick } from '../hooks/useFirebase';

function Navbar({ activeSection, settings, settingsLoading, onOpenReservation }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleReservation = () => {
    trackClick('reservations');
    onOpenReservation();
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white" style={{ height: '64px' }}>
      <div className="max-width-screen-2xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 min-h-0 h-auto" style={{ minHeight: 'unset' }}>
          {(settingsLoading || !settings) ? (
            <LogoSkeleton />
          ) : (
            <div className="w-8 h-8 flex items-center justify-center shrink-0 rounded-full overflow-hidden">
              {settings.logo ? (
                <img 
                  src={settings.logo} 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Coffee className="w-5 h-5 text-black" />
              )}
            </div>
          )}
          <h1 className="font-black text-[13px] sm:text-lg tracking-tighter uppercase leading-none">
            EVOCATIVE<span className="hidden min-[320px]:inline text-neutral-400">SPACE</span>
          </h1>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={e => scrollTo(e, link.id)}
              className={`text-[12px] font-mono uppercase tracking-[0.2em] px-4 py-2 transition-all border border-transparent min-h-0 h-auto font-bold ${
                activeSection === link.id
                  ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]'
                  : 'text-black hover:border-black'
              }`}
              style={{ minHeight: 'unset' }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={handleReservation}
            className="ml-2 text-[11px] font-mono uppercase tracking-widest px-4 py-2 bg-black text-white hover:bg-neutral-800 transition-colors border border-black min-h-0 h-auto"
            style={{ minHeight: 'unset' }}
          >
            Reservation
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center transition-colors hover:bg-black hover:text-white min-h-0 h-auto"
          style={{ minHeight: 'unset' }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="md:hidden fixed inset-0 z-[60] bg-white scanlines flex flex-col pt-[64px]"
          >
            {/* Nav Links — High Impact Typography */}
            <div className="flex-1 px-6 sm:px-10 flex flex-col justify-center min-h-0">
              <div className="flex flex-col justify-center space-y-0 sm:space-y-4">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.id}
                    href={`#${link.id}`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: 0.1 + i * 0.05,
                      type: 'spring',
                      stiffness: 100,
                      damping: 15
                    }}
                    onClick={e => scrollTo(e, link.id)}
                    className={`block text-[clamp(3.5rem,15vw,7rem)] font-black uppercase tracking-tighter leading-[0.85] transition-all hover:pl-6 italic ${
                      activeSection === link.id 
                        ? 'text-black opacity-100' 
                        : 'text-neutral-200 hover:text-black'
                    }`}
                    style={{ minHeight: 'unset' }}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Bento Info Grid at Bottom */}
            <div className="grid grid-cols-2 border-t border-black bg-black text-white">
              <div className="border-r border-white/10 p-6 flex flex-col justify-center min-h-[140px]">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm uppercase">OPEN DAILY</span>
                  </div>
                  <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                    {settings?.contact?.hours || '10:00 — 23:00 WITA'}
                  </p>
                </div>
              </div>

              <div className="p-6 flex flex-col justify-center min-h-[140px]">
                <div>
                  <p className="text-3xl font-black tracking-tighter leading-none mb-1">
                    {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Makassar' })}
                  </p>
                  <p className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest uppercase">TARAKAN / WITA</p>
                </div>
              </div>

              <button
                onClick={handleReservation}
                className="col-span-2 border-t border-white/10 p-6 bg-white text-black flex items-center justify-between group hover:bg-neutral-50 transition-colors h-auto min-h-0"
                style={{ minHeight: 'unset' }}
              >
                <span className="text-xl font-black uppercase tracking-tighter">Book a Station</span>
                <div className="w-12 h-12 bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
