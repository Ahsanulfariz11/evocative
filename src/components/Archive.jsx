import React from 'react';
import Reveal from './Reveal';
import { optimizeImage } from '../utils/image';
import { ArchiveSkeleton } from './Skeletons';

function Archive({ galleryItems, loading }) {
  // 1. Loading State
  if (loading) return <ArchiveSkeleton />;

  const items = galleryItems || [];

  // 2. Empty State (No Data)
  if (items.length === 0) {
    return (
      <section id="archive" className="border-b border-black bg-white overflow-hidden">
      <div className="px-4 sm:px-6 md:px-8 py-5 border-b border-black flex flex-wrap justify-between items-center bg-neutral-50 gap-2">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
          Archive
        </h2>
      </div>
      <div className="p-16 text-center text-xs font-mono text-neutral-400 tracking-[0.2em] uppercase">
        No records found
      </div>
    </section>
  );
}

// 3. Render Data
return (
  <section id="archive" className="border-b border-black bg-white overflow-hidden">
    {/* Header */}
    <div className="px-4 sm:px-6 md:px-8 py-5 border-b border-black flex flex-wrap justify-between items-center bg-neutral-50 gap-2">
      <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
        <span className="w-2.5 h-2.5 bg-black rounded-full" />
        Archive
      </h2>
    </div>

    {/* Horizontal Filmstrip Track */}
    <div className="relative group/track">
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8 pt-4 px-4 sm:px-6 md:px-8 gap-4 sm:gap-6">
        {items.map((item, idx) => (
          <Reveal 
            key={item.id || idx} 
            delay={idx * 50} 
            className="shrink-0 w-[85vw] sm:w-[45vw] md:w-[35vw] lg:w-[28vw] snap-center sm:snap-start bg-neutral-100 border-2 border-black relative aspect-square overflow-hidden group/card shadow-none hover:shadow-brutal-sm transition-all duration-500"
          >
              <img 
                src={optimizeImage(item.img)} 
                alt={item.desc} 
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-all duration-1000 opacity-90 group-hover/card:opacity-100" 
              />
              
              {/* Scanline Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10" />

              {/* Data Overlay Bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500">
                <p className="text-white font-mono text-xs uppercase tracking-[0.2em] font-black mb-1 truncate">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Shadow Indicators for Scroll Hint */}
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-30 opacity-60 sm:opacity-100" />
      </div>
    </section>
  );
}

export default Archive;
