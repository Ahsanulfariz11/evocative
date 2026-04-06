import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { Play, Maximize2 } from 'lucide-react';
import Reveal from './Reveal';
import { optimizeImage } from '../utils/image';



// ── Build YARL slides from media items ────────────────────────────────────
function buildSlides(items) {
  return items.map((item) => {
    if (item.type === 'video') {
      return {
        type: 'video',
        poster: optimizeImage(item.poster || item.img),
        sources: [{ src: item.video, type: 'video/mp4' }],
        width: 1280,
        height: 720,
      };
    }
    return {
      type: 'image',
      src: optimizeImage(item.img),
      alt: item.alt,
      width: 1200,
      height: 800,
    };
  });
}

// ── MediaCard — shared card used in both mobile strip & desktop grid ───────
function MediaCard({ item, index, onOpen, className = '', style = {} }) {
  const isVideo = item.type === 'video';
  const thumb = item.img || item.poster;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${item.alt}`}
      onClick={() => onOpen(index)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(index)}
      className={`group relative overflow-hidden bg-black cursor-pointer ${className}`}
      style={style}
    >
      <img
        src={optimizeImage(thumb)}
        alt={item.alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        style={{ color: 'transparent' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Play button for videos */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
            <Play className="w-6 h-6 text-white fill-white ml-0.5" />
          </div>
        </div>
      )}

      {/* Expand icon on hover for images */}
      {!isVideo && (
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-7 h-7 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <Maximize2 className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      )}

      {/* Item type badge for videos */}
      {isVideo && (
        <div className="absolute top-3 left-3 z-20 bg-red-600 text-white font-mono font-black text-[8px] uppercase tracking-widest px-2 py-0.5">
          VIDEO
        </div>
      )}

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <p className="text-white font-black font-mono text-[9px] uppercase tracking-widest leading-tight">{item.alt}</p>
        {item.desc && (
          <p className="text-white/50 font-mono text-[8px] uppercase tracking-widest mt-0.5 line-clamp-1">{item.desc}</p>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
function Space({ spaceItems, loading, settings }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [heroIndex, setHeroIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const rawItems = spaceItems || [];
  const slides = buildSlides(rawItems);
  const heroItem = rawItems[heroIndex];
  
  const stats = settings?.space?.stats || [
    { id: 1, label: 'Total Area', value: '±350 m²' },
    { id: 2, label: 'Seating Cap.', value: '80 pax' },
    { id: 3, label: 'Bar Stations', value: '3 units' },
  ];

  const lastTick = React.useRef(0);
  const videoRefs = React.useRef([]);

  // Reset video refs on every render to repopulate
  videoRefs.current = [];

  const goToNextSlide = React.useCallback(() => {
    const now = Date.now();
    if (now - lastTick.current < 500) return; // Prevent double-firing from multiple mounted players
    lastTick.current = now;
    setHeroIndex((prev) => (prev + 1) % rawItems.length);
  }, [rawItems.length]);

  React.useEffect(() => {
    // Jangan ganti frame jika Lightbox sedang terbuka, atau mouse sedang mengambang di atas gambar
    if (!rawItems || rawItems.length <= 1 || lightboxIndex >= 0 || isHovered) return;

    let timer;
    if (rawItems[heroIndex]?.type !== 'video') {
      timer = setTimeout(goToNextSlide, 8000); // 8 detik untuk foto agar dibaca
    } 
    // Jika type = 'video', kita tidak pasang timer apa-apa.
    // Slideshow benar-benar akan "nge-freeze" menunggu sampai event onEnded dari file video terpanggil.
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [heroIndex, rawItems, goToNextSlide]);

  React.useEffect(() => {
    // Control all video players based on current slide index
    videoRefs.current.forEach((vid) => {
      const idx = parseInt(vid.getAttribute('data-index'), 10);
      if (idx === heroIndex) {
        if (!isHovered && lightboxIndex < 0) {
           vid.currentTime = 0;
           vid.play().catch(() => {}); // Silence autoplay prevented
        } else if (lightboxIndex >= 0) {
           // Jika Lightbox buka, berhentikan yang di background
           vid.pause();
        }
      } else {
        vid.pause();
      }
    });
  }, [heroIndex, isHovered, lightboxIndex]);

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(-1);

  if (loading) {
    return (
      <div className="p-4 grid grid-cols-1 min-[340px]:grid-cols-2 md:grid-cols-4 gap-3 h-auto md:h-[560px]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`skeleton h-48 md:h-full ${i === 0 ? 'min-[340px]:col-span-2 min-[340px]:row-span-2' : ''}`} />
        ))}
      </div>
    );
  }

  return (
    <section id="space" className="border-b border-black bg-white">

      {/* ── LIGHTBOX ─────────────────────────────────────────── */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={closeLightbox}
        slides={slides}
        plugins={[Video, Zoom, Thumbnails]}
        video={{ autoPlay: true, muted: false, controls: true }}
        zoom={{ maxZoomPixelRatio: 3 }}
        thumbnails={{ position: 'bottom', width: 80, height: 56, gap: 4, border: 1 }}
        styles={{
          container: { backgroundColor: 'rgba(0,0,0,0.95)' },
          thumbnail: { border: '1px solid rgba(255,255,255,0.15)', borderRadius: 0 },
          thumbnailsContainer: { backgroundColor: 'rgba(0,0,0,0.8)' },
        }}
        carousel={{ finite: false }}
        on={{ click: () => {} }}
      />

      {/* ── MOBILE LAYOUT ────────────────────────────────────── */}
      <div className="md:hidden">

        {/* Hero — featured item, full width slideshow */}
        {heroItem && (
          <div
            role="button"
            tabIndex={0}
            aria-label={`Open ${heroItem.alt}`}
            onClick={() => openLightbox(heroIndex)}
            onKeyDown={(e) => e.key === 'Enter' && openLightbox(heroIndex)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)} 
            onTouchStart={() => setIsHovered(true)}
            className="relative w-full overflow-hidden bg-black border-b border-black cursor-pointer group"
            style={{ height: '300px' }}
          >
            {rawItems.map((item, idx) => {
              const isActive = idx === heroIndex;
              const isNearby = Math.abs(idx - heroIndex) <= 1 || (heroIndex === 0 && idx === rawItems.length - 1) || (heroIndex === rawItems.length - 1 && idx === 0);
              const shouldLoad = isNearby;
              
              const activeClass = isActive ? 'opacity-100 group-hover:scale-105' : 'opacity-0 scale-105';
              const uniqueKey = `mobile-hero-${item.id || idx}`;
              
              return item.type === 'video' ? (
                <video
                  data-index={idx}
                  ref={(el) => { if (el) videoRefs.current.push(el); }}
                  key={uniqueKey}
                  src={shouldLoad ? item.video : ''}
                  muted
                  playsInline
                  preload="auto"
                  onEnded={goToNextSlide}
                  poster={optimizeImage(item.poster || item.img)}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${activeClass}`}
                />
              ) : (
                <img
                  key={uniqueKey}
                  src={shouldLoad ? optimizeImage(item.img || item.poster) : ''}
                  alt={item.alt}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${activeClass}`}
                  style={{ color: 'transparent' }}
                />
              );
            })}
            {rawItems.length > 1 && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
            )}

            {heroItem.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white/80 fill-white/80 ml-1" />
                </div>
              </div>
            )}

            <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <Maximize2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 z-10 text-white">
               {/* Pagination Dots */}
              <div className="flex gap-1 mb-3">
                {rawItems.map((_, i) => (
                  <div key={`mobile-dot-${i}`} className={`h-1 transition-all duration-500 rounded-full ${i === heroIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/30'}`} />
                ))}
              </div>
              <span className="inline-block bg-white text-black font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 mb-2">
                {heroItem.type === 'video' ? '▶ Video' : 'Featured'}
              </span>
              <h3 className="text-xl font-black uppercase tracking-tighter leading-tight">{heroItem.alt}</h3>
              <p className="text-white/60 font-mono text-[9px] uppercase tracking-widest mt-1">{heroItem.desc}</p>
            </div>
          </div>
        )}

        {/* Stats strip */}
        <div className="bg-black text-white border-b border-black">
          <div className="grid grid-cols-3 divide-x divide-white/10">
            {stats.map((s) => (
              <div key={`stat-mobile-${s.id}`} className="px-3 py-4 flex flex-col items-center text-center">
                <span className="text-base font-black text-white leading-none">{s.value}</span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal media strip */}
        <div className="border-b border-black">
          {rawItems.length > 1 ? (
            <div
              className="flex overflow-x-auto scrollbar-none"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {rawItems.slice(1).map((item, idx) => (
                <MediaCard
                  key={`mobile-strip-${item.id || idx}`}
                  item={item}
                  index={idx + 1}
                  onOpen={openLightbox}
                  className="border-r border-black"
                  style={{
                    flexShrink: 0,
                    width: '72vw',
                    minWidth: '240px',
                    maxWidth: '300px',
                    height: '200px',
                    scrollSnapAlign: 'start',
                  }}
                />
              ))}
              <div className="flex-none w-6 shrink-0" />
            </div>
          ) : !loading && rawItems.length <= 1 && (
            <div className="p-8 text-center bg-neutral-50">
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">Belum ada media tambahan</p>
            </div>
          )}
          {rawItems.length > 1 && (
            <div className="px-4 py-2 bg-neutral-50 border-t border-black flex items-center gap-2">
              <div className="flex gap-1">
                {rawItems.slice(1).map((item, i) => (
                  <div
                    key={`dot-strip-${i}`}
                    className={`w-1.5 h-1.5 rounded-full ${item.type === 'video' ? 'bg-red-500' : 'bg-black/20'}`}
                  />
                ))}
              </div>
              <span className="font-mono text-[8px] text-neutral-400 uppercase tracking-widest ml-auto">
                Tap to expand · Swipe to explore
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── DESKTOP LAYOUT ───────────────────────────────────── */}
      <div className="hidden md:block">
        <div className="p-3 sm:p-4 grid grid-cols-1 min-[450px]:grid-cols-12 gap-3" style={{ minHeight: '560px' }}>

          {/* Hero — large featured slideshow */}
          {heroItem && (
            <Reveal
              delay={0}
              className="relative col-span-7 group bg-black overflow-hidden border border-black cursor-pointer"
              style={{ minHeight: '280px' }}
            >
              <div
                onClick={() => openLightbox(heroIndex)}
                onKeyDown={(e) => e.key === 'Enter' && openLightbox(heroIndex)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                role="button"
                tabIndex={0}
                aria-label={`Open ${heroItem.alt}`}
                className="absolute inset-0"
              >
                {rawItems.map((item, idx) => {
                  const isActive = idx === heroIndex;
                  const isNearby = Math.abs(idx - heroIndex) <= 1 || (heroIndex === 0 && idx === rawItems.length - 1) || (heroIndex === rawItems.length - 1 && idx === 0);
                  const shouldLoad = isNearby;
                  
                  const activeClass = isActive ? 'opacity-100 group-hover:scale-105' : 'opacity-0 scale-105';
                  const uniqueKey = `desktop-hero-${item.id || idx}`;
                  
                  return item.type === 'video' ? (
                    <video
                      data-index={idx}
                      ref={(el) => { if (el) videoRefs.current.push(el); }}
                      key={uniqueKey}
                      src={shouldLoad ? item.video : ''}
                      muted
                      playsInline
                      preload="auto"
                      onEnded={goToNextSlide}
                      poster={optimizeImage(item.poster || item.img)}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${activeClass}`}
                    />
                  ) : (
                    <img
                      key={uniqueKey}
                      src={shouldLoad ? optimizeImage(item.img || item.poster) : ''}
                      alt={item.alt}
                      loading={idx === 0 ? "eager" : "lazy"}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${activeClass}`}
                      style={{ color: 'transparent' }}
                    />
                  );
                })}
                {rawItems.length > 1 && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                )}
                
                {heroItem.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                      <Play className="w-7 h-7 text-white/80 fill-white/80 ml-1" />
                    </div>
                  </div>
                )}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10 text-white">
                  {/* Pagination Dots */}
                  <div className="flex gap-1 mb-3">
                    {rawItems.map((_, i) => (
                      <div key={`desktop-dot-${i}`} className={`h-1 transition-all duration-500 rounded-full ${i === heroIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/30'}`} />
                    ))}
                  </div>
                  <span className="inline-block bg-white text-black font-mono text-[10px] uppercase tracking-widest px-3 py-1 mb-2">Featured</span>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-tight">{heroItem.alt}</h3>
                  <p className="text-white/60 font-mono text-[10px] uppercase tracking-widest mt-1">{heroItem.desc}</p>
                </div>
              </div>
            </Reveal>
          )}

          {/* Second large item */}
          {rawItems[3] && (
            <Reveal delay={100} className="relative col-span-5 bg-black overflow-hidden border border-black cursor-pointer" style={{ minHeight: '260px' }}>
              <MediaCard
                item={rawItems[3]}
                index={3}
                onOpen={openLightbox}
                className="absolute inset-0"
                style={{ width: '100%', height: '100%' }}
              />
            </Reveal>
          )}

          {/* Stats card */}
          <Reveal delay={150} className="col-span-4 bg-black text-white border border-black flex flex-col justify-between p-5" style={{ minHeight: '180px' }}>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500">// Infrastructure Data</span>
            <div className="space-y-3 font-mono">
              {stats.map((s) => (
                <div key={`stat-desktop-${s.id}`} className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400">{s.label}</span>
                  <span className="text-sm font-bold text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Small items */}
          {rawItems[1] ? (
            <Reveal delay={180} className="relative col-span-4 bg-black overflow-hidden border border-black cursor-pointer" style={{ minHeight: '180px' }}>
              <MediaCard item={rawItems[1]} index={1} onOpen={openLightbox} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
            </Reveal>
          ) : (
            <div className="col-span-4 border border-black border-dashed flex items-center justify-center p-4 bg-neutral-50 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              Media Empty
            </div>
          )}

          {rawItems[2] ? (
            <Reveal delay={220} className="relative col-span-4 bg-black overflow-hidden border border-black cursor-pointer" style={{ minHeight: '180px' }}>
              <MediaCard item={rawItems[2]} index={2} onOpen={openLightbox} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
            </Reveal>
          ) : (
             <div className="col-span-4 border border-black border-dashed flex items-center justify-center p-4 bg-neutral-50 font-mono text-[10px] uppercase tracking-widest text-neutral-400">
               Media Empty
             </div>
          )}
        </div>
      </div>

    </section>
  );
}

export default Space;
