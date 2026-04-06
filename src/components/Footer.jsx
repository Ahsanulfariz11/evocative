import React from 'react';
import { Coffee, MapPin, Clock, Instagram, Heart, Globe, ArrowUpRight } from 'lucide-react';

function Footer({ settings, onOpenReservation }) {
  const contact = settings?.contact;
  
  return (
    <footer id="location" className="bg-white text-black border-t-4 border-black overflow-hidden select-none">
      
      {/* ── BENTO INFO GRID ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y-4 md:divide-y-0 md:divide-x-4 divide-black">
        
        {/* Kolom 1: Status & Info */}
        <div className="p-6 sm:p-10 flex flex-col justify-between group overflow-hidden relative">
          <div className="relative z-10 pt-4">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden">
                 {settings?.logo ? (
                   <img 
                     src={settings.logo} 
                     alt="Logo" 
                     className="w-full h-full object-cover"
                   />
                 ) : (
                   <Coffee className="w-6 h-6 text-black" />
                 )}
               </div>
               <div>
                  <h3 className="font-black text-2xl uppercase tracking-tighter leading-none">EVOCATIVE<span className="text-neutral-400 font-medium">SPACE</span></h3>
               </div>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed text-black/60 mt-4 sm:mt-6 max-w-xs">
              {settings?.hero?.description || "High-speed caffeine extraction and industrial aesthetic bar located in the heart of North Borneo."}
            </p>
          </div>
          {/* Decorative background number */}
          <span className="absolute bottom-[-15%] right-[-10%] text-[10rem] sm:text-[15rem] font-black text-neutral-50 pointer-events-none -z-0 leading-none">01</span>
        </div>

        {/* Kolom 2: Connect & Transmit */}
        <div className="p-6 sm:p-10 flex flex-col justify-between bg-neutral-50 min-h-[400px]">
           <div className="pt-4 space-y-10">
              {/* SOCIAL LINKS */}
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.4em] font-black text-neutral-400 mb-6 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-black animate-pulse" /> CONNECT
                </div>
                <div className="space-y-4">
                   <a href={`https://instagram.com/${contact?.instagram || 'evocatiive.space'}`} target="_blank" rel="noreferrer" className="flex items-center justify-between group py-2 border-b border-black/10 hover:border-black transition-all">
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-3">
                         <Instagram className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" /> @{contact?.instagram || 'evocatiive.space'}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                   </a>
                   <a href={`https://tiktok.com/@${contact?.tiktok || 'evocative.space'}`} target="_blank" rel="noreferrer" className="flex items-center justify-between group py-2 border-b border-black/10 hover:border-black transition-all">
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-3">
                         <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M12.525.02c1.31-.032 2.512.309 3.511.951 1.25.79 2.089 2.21 2.245 3.82.02.261.03.52.03.78v4.61c.88-.07 1.76-.32 2.52-.72.69-.37 1.26-.88 1.71-1.5 0-.01.01-.01.01-.02.04-.06.08-.12.11-.18l.06-.09.04-.06.04-.07.03-.06.02-.05v9.11c0 4.14-3.36 7.5-7.5 7.5s-7.5-3.36-7.5-7.5c0-4.08 3.25-7.39 7.31-7.49V9.11c-2.45.1-4.81 1.34-6.31 3.42C7.31 15.02 7.02 17.52 8.1 19.82c.98 2.08 2.92 3.53 5.16 3.88 2.52.39 5.09-.59 6.64-2.61.81-1.06 1.25-2.35 1.25-3.69V10.22c-1.3.8-2.73 1.24-4.22 1.28v-3.7c1.3-.01 2.54-.42 3.58-1.18.23-.17.44-.35.64-.55V0c-1.95.03-3.84.6-5.43 1.63V.02z" />
                         </svg> @{contact?.tiktok || 'evocative.space'}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                   </a>
                   <a href={`https://wa.me/${contact?.whatsapp?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center justify-between group py-2 border-b border-black/10 hover:border-black transition-all">
                      <span className="font-mono text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-3">
                         <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                         </svg> {contact?.whatsapp || '+62_PROTOCOL'}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                   </a>
                </div>
              </div>

              {/* EXTERNAL SERVICES */}
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.4em] font-black text-neutral-400 mb-6 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-neutral-300" /> SERVICES
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <a href="#" className="border-2 border-black p-3.5 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest font-black bg-white hover:bg-black hover:text-white transition-all shadow-brutal-sm">GoFood</a>
                   <a href="#" className="border-2 border-black p-3.5 flex items-center justify-center font-mono text-[10px] uppercase tracking-widest font-black bg-white hover:bg-black hover:text-white transition-all shadow-brutal-sm">GrabFood</a>
                </div>
              </div>
           </div>
           
           <button 
             onClick={onOpenReservation}
             className="w-full mt-10 border-[4px] border-black bg-black text-white p-5 flex items-center justify-between group hover:bg-neutral-800 transition-all shadow-[10px_10px_0px_0px_rgba(0,0,0,0.1)] active:shadow-none active:translate-x-1 active:translate-y-1"
           >
              <div className="text-left font-black">
                 <p className="text-xl uppercase tracking-tighter leading-none">Enter Secure Line</p>
              </div>
              <ArrowUpRight className="w-7 h-7" />
           </button>
        </div>
      </div>

      {/* ── MASSIVE BRANDING FOOTER ────────────────────────────────── */}
      <div className="py-8 md:py-24 border-t-4 border-black relative overflow-hidden bg-white select-none pointer-events-none">
         <h2 className="text-[12vw] md:text-[22vw] leading-none font-[1000] uppercase tracking-[-0.08em] opacity-10 whitespace-nowrap -mb-4 md:-mb-10 pointer-events-none">
            EVOCATIVE
         </h2>
         <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center pointer-events-none">
            <p className="font-mono text-[10px] md:text-sm uppercase tracking-[0.4em] md:tracking-[0.6em] font-black text-black/20">
               NORTH BORNEO INDUSTRIAL COFFEE COMPLEX
            </p>
         </div>
      </div>

      {/* ── BOTTOM BAR ────────────────────────────────────────────── */}
      <div className="border-t border-black bg-black text-white py-12 px-6 sm:px-10">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
           <div className="flex flex-col items-center sm:items-start gap-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] font-black text-white/40">
                Crafting Coffee & Community
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] font-black">
                © 2026 EVOCATIVE SPACE
              </p>
           </div>
           <div className="flex items-center gap-8">
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/30 hidden md:inline">
                Tarakan, North Borneo
              </span>
              <div className="h-1px w-8 bg-white/20 hidden md:block" />
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/30">
                All Rights Reserved
              </span>
           </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;
