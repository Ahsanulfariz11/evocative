import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import Reveal from './Reveal';
import { optimizeImage } from '../utils/image';

const CATEGORIES = ['All', 'Signature', 'Kopi', 'Non-Kopi', 'Pastry', 'Makanan'];



const MenuSkeleton = () => (
  <div className="menu-grid border-t border-l border-black">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="border-b border-r border-black flex flex-col bg-white">
        <div className="aspect-square skeleton" />
        <div className="p-3 sm:p-5 space-y-3">
          <div className="h-3 skeleton w-16" />
          <div className="h-5 skeleton w-3/4" />
          <div className="h-3 skeleton w-full" />
          <div className="h-3 skeleton w-2/3" />
          <div className="h-10 skeleton mt-4" />
        </div>
      </div>
    ))}
  </div>
);

function MenuSection({ menuItems, loading }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const items = menuItems || [];

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, activeCategory, searchQuery]);

  useEffect(() => {
    document.body.style.overflow = selectedItem ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedItem]);

  return (
    <section id="menu" className="border-b border-black">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-0 max-w-screen-2xl mx-auto">
        <Reveal>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-5 sm:mb-8">
            <div>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-1">Catalog</h2>
              <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest">/ Curated Selection · {items.length} items</p>
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border border-black px-4 py-2.5 pl-9 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-black bg-white"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 h-auto min-h-0 p-0">
                  <X className="w-4 h-4 text-neutral-400 hover:text-black" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="sticky top-[var(--header-h)] z-30 bg-white/90 backdrop-blur-md -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 border-y border-black flex flex-nowrap overflow-x-auto gap-2 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  const el = document.getElementById('menu-start');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`flex-none px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest border border-black transition-all min-h-0 h-auto ${
                  activeCategory === cat ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-50'
                }`}
                style={{ minHeight: 'unset' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <div id="menu-start" className="scroll-mt-32"></div>

      {/* Grid */}
      {loading ? <MenuSkeleton /> : (
        <div className="max-w-[1600px] mx-auto border-t border-l border-black bg-white">
          <div className="menu-grid">
          {activeCategory === 'All' ? (
            CATEGORIES.filter(c => c !== 'All').map(cat => {
              const catItems = items.filter(item => item.category === cat);
              if (catItems.length === 0) return null;
              return (
                <React.Fragment key={cat}>
                  {/* Category Header */}
                  <div className="col-span-full bg-neutral-50 border-b border-r border-black px-6 py-4 flex items-center justify-between">
                    <h3 className="font-mono text-sm font-black uppercase tracking-[0.2em]">{cat}</h3>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[10px] text-neutral-400">/ {catItems.length} items</span>
                      <div className="hidden sm:flex gap-1 text-neutral-400">
                        <kbd className="text-[9px] font-mono border border-neutral-200 px-1 rounded">Shift + Scroll</kbd>
                      </div>
                    </div>
                  </div>
                  
                  {/* Horizontal Scroll Row */}
                  <div className="col-span-full menu-horizontal border-b border-r border-black scrollbar-none">
                    {catItems.map((item, idx) => (
                      <MenuItem 
                        key={item.id} 
                        item={item} 
                        idx={idx} 
                        setSelectedItem={setSelectedItem} 
                        isSignature={cat === 'Signature'}
                      />
                    ))}
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            filtered.length > 0 ? (
              <div className="col-span-full menu-horizontal border-b border-r border-black scrollbar-none">
                {filtered.map((item, idx) => (
                  <MenuItem 
                    key={item.id} 
                    item={item} 
                    idx={idx} 
                    setSelectedItem={setSelectedItem} 
                    isSignature={activeCategory === 'Signature'}
                  />
                ))}
              </div>
            ) : (
              <div className="col-span-full py-24 text-center font-mono text-neutral-400 border-b border-r border-black bg-neutral-50">
                <span className="bg-black text-white px-6 py-3 font-bold text-xs uppercase tracking-widest">[ 404: Menu not found ]</span>
              </div>
            )
          )}
        </div>
      </div>
    )}

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white border-t-2 sm:border-2 border-black w-full sm:max-w-3xl flex flex-col md:flex-row max-h-[92vh] overflow-y-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Unified Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-0 right-0 z-50 w-12 h-12 bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Product Image Section */}
            <div className="w-full md:w-[45%] aspect-square md:h-auto bg-neutral-100 relative overflow-hidden shrink-0 border-b md:border-b-0 md:border-r-2 border-black">
              <img
                src={selectedItem.img}
                alt={selectedItem.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Scanline Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-10" />
              <div className="absolute inset-0 bg-black/10 z-5" />
              
              <div className="absolute bottom-4 left-4 bg-black text-white font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1 z-20 font-black">
                {selectedItem.category}
              </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6 sm:p-10 flex flex-col relative">
              <div className="mb-6 pt-4">
                <h3 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-4 leading-[0.85] italic">
                  {selectedItem.name}
                </h3>
                <div className="inline-flex items-center gap-3 bg-black text-white px-5 py-2">
                   <span className="text-xl font-mono font-black">{selectedItem.price}</span>
                </div>
              </div>

              <p className="text-sm text-neutral-500 leading-relaxed mb-8 font-medium border-l-2 border-neutral-100 pl-4">
                {selectedItem.desc}
              </p>

              {/* Dynamic Info Grid */}
              <div className="grid grid-cols-2 gap-px bg-black border-2 border-black mb-8 overflow-hidden">
                <div className="bg-white p-4">
                  <span className="block font-mono text-[8px] text-neutral-400 uppercase tracking-[0.2em] mb-1.5 font-bold italic">Preparation_Protocol</span>
                  <span className="font-mono font-black text-xs uppercase tracking-widest text-black">
                    {selectedItem.prepTime || '< 60 SEC'}
                  </span>
                </div>
                <div className="bg-white p-4">
                  <span className="block font-mono text-[8px] text-neutral-400 uppercase tracking-[0.2em] mb-1.5 font-bold italic">Flavor_Notes</span>
                  <span className="font-mono font-black text-[10px] uppercase tracking-tight text-neutral-600 leading-tight block">
                    {selectedItem.notes || 'Curated Selection'}
                  </span>
                </div>
              </div>

              {/* Delivery Action Units */}
              <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="https://gofood.co.id/"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex items-center justify-between bg-black text-white px-5 py-4 text-[10px] font-mono uppercase tracking-widest hover:bg-neutral-800 transition-all border-2 border-black"
                >
                  <span className="font-black">VIA GOFOOD</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="https://grab.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex items-center justify-between bg-white text-black px-5 py-4 text-[10px] font-mono uppercase tracking-widest hover:bg-neutral-50 transition-all border-2 border-black"
                >
                  <span className="font-black">VIA GRABFOOD</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Helper Component — no Reveal animation inside horizontal scroll (avoids translateY overflow glitch)
const MenuItem = ({ item, idx, setSelectedItem, isSignature }) => (
  <div
    className={`group flex flex-col bg-white border-b border-r border-black relative overflow-hidden ${
      isSignature ? 'md:bg-neutral-50/50' : ''
    }`}
    style={{
      opacity: 1,
      animation: `fadeIn 0.4s ease ${idx * 60}ms both`,
    }}
  >
    <div className="relative aspect-square overflow-hidden bg-neutral-100 shrink-0">
      <img
        src={item.img}
        alt={item.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ color: 'transparent' }}  
      />
      {/* Price badge — always visible */}
      <div className={`absolute top-0 right-0 font-bold font-mono text-xs px-2.5 py-1 ${
        isSignature ? 'bg-amber-500 text-black' : 'bg-black text-white'
      }`}>
        {item.price}
      </div>
      {isSignature && (
        <div className="absolute bottom-2 left-2 bg-amber-500 text-black font-black font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-black">
          ★ Signature
        </div>
      )}
    </div>

    <div className="p-3 flex-1 flex flex-col">
      <h3 className="text-[11px] sm:text-sm font-bold uppercase tracking-tight mb-1 leading-tight">
        {item.name}
      </h3>
      <p className="text-[10px] text-neutral-500 mb-3 flex-1 leading-relaxed line-clamp-2">{item.desc}</p>
      <button
        onClick={() => setSelectedItem(item)}
        className={`w-full border border-black px-2 py-2 text-[9px] sm:text-[10px] font-mono uppercase tracking-widest transition-colors min-h-0 h-auto ${
          isSignature 
          ? 'bg-black text-white hover:bg-neutral-800' 
          : 'hover:bg-black hover:text-white'
        }`}
        style={{ minHeight: 'unset' }}
      >
        View Details
      </button>
    </div>
  </div>
);

export default MenuSection;

