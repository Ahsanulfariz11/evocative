import React from 'react';
import { ChevronRight } from 'lucide-react';
import Reveal from './Reveal';
import { optimizeImage } from '../utils/image';
import { HeroSkeleton } from './Skeletons';
import { trackClick } from '../firebase';

function Hero({ settings, loading, onOpenReservation }) {
  if (loading) return <HeroSkeleton />;

  const hero = settings?.hero || {
    title: "Fast. Raw. Caffeine.",
    description: "The fastest coffee bar in Tarakan. Pendekatan industrialis, ekstraksi presisi, tanpa basa-basi."
  };

  const scrollToMenu = () => {
    trackClick('menu_view');
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReservation = () => {
    trackClick('reservations');
    onOpenReservation();
  };

  return (
    <section id="home" className="relative w-full min-h-[85vh] flex flex-col md:flex-row">
      {/* Left */}
      <div className="w-full md:w-[55%] flex flex-col justify-center px-5 py-10 sm:px-10 md:px-16 lg:px-24 border-none order-2 md:order-1 bg-white">
        <Reveal delay={100}>
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-6 block">
            EST. 2026 / {settings?.contact?.city || 'TARAKAN'}
          </span>
        </Reveal>
        <Reveal delay={200}>
          <h1 className="text-4xl min-[340px]:text-5xl sm:text-6xl font-black uppercase leading-[0.88] tracking-tighter mb-6 whitespace-pre-line">
            {hero.title}
          </h1>
        </Reveal>
        <Reveal delay={300}>
          <p className="text-neutral-500 mb-8 max-w-sm text-sm sm:text-base leading-relaxed font-medium">
            {hero.description}
          </p>
        </Reveal>
        <Reveal delay={400}>
          <div className="flex flex-col gap-3">
            <button
              onClick={scrollToMenu}
              className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors border border-black min-h-0 w-full sm:w-auto"
              style={{ minHeight: 'unset' }}
            >
              Explore Menu <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleReservation}
              className="flex items-center justify-center gap-2 bg-white text-black px-8 py-4 text-xs font-mono uppercase tracking-widest hover:bg-neutral-50 transition-colors border border-black min-h-0 w-full sm:w-auto"
              style={{ minHeight: 'unset' }}
            >
              Reservation
            </button>
          </div>
        </Reveal>

        {/* Stats Bar */}
        <Reveal delay={500}>
          <div className="mt-10 pt-6 border-t border-black grid grid-cols-3 gap-4">
            {(settings?.hero?.stats || [
              { label: 'Delivery', value: '< 15s' },
              { label: 'Menu Items', value: '20+' },
              { label: 'Rating', value: '5.0 ★' },
            ]).map(stat => (
              <div key={stat.label}>
                <p className="text-xl sm:text-2xl font-black tracking-tighter">{stat.value}</p>
                <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-neutral-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Right — Image */}
      <div className="w-full md:w-[45%] relative min-h-[45vh] md:min-h-full bg-black overflow-hidden order-1 md:order-2">
        <img
          src={optimizeImage(settings?.hero?.img) || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1920"}
          alt="Evocative Space Coffee Bar"
          className="absolute inset-0 w-full h-full object-cover opacity-70 scale-105 hover:scale-100 transition-transform duration-[2s] ease-[cubic-bezier(0.16,1,0.3,1)]"
          loading="eager"
        />
        <div className="absolute bottom-10 left-0 right-0 z-10 pointer-events-none px-8 sm:px-12">
          <div className="max-w-[1440px] mx-auto w-full flex flex-col items-start gap-4">
            <div className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.5em] mb-0 leading-none font-black italic">
                LOCATION
              </p>
              <p className="font-black text-sm sm:text-lg uppercase text-white leading-tight tracking-tighter">
                {(settings?.contact?.address || 'Jl. Slamet Riady No. 24, Tarakan').split(',').slice(0, 2).join(',')}
              </p>
            </div>
            <div className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              <p className="font-mono text-[9px] text-white/40 uppercase tracking-[0.5em] mb-0 leading-none font-black italic">
                OPERATIONAL
              </p>
              <p className="font-black text-sm sm:text-lg text-white uppercase tracking-tighter leading-none">
                {(settings?.contact?.hours || '10:00 — 23:00 WITA').replace(/OPEN DAILY:?/i, '').trim().split(' ').slice(0, 4).join(' ')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
