import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingBag, Coffee, Star, MapPin } from 'lucide-react';

const MENU_DATA = [
  { id: 1, name: 'Signature Latte', category: 'Signature', price: '32k', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop', description: 'Our house special blend with a touch of secret nectar.' },
  { id: 2, name: 'Fastest Espresso', category: 'Kopi', price: '22k', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800&auto=format&fit=crop', description: 'Powerful double shot extracted in under 20 seconds.' },
  { id: 3, name: 'Matcha Zen', category: 'Non-Kopi', price: '28k', image: 'https://images.unsplash.com/photo-15158231492d6-0c24237a9f74?q=80&w=800&auto=format&fit=crop', description: 'Ceremonial grade matcha with creamy oat milk.' },
  { id: 4, name: 'Butter Croissant', category: 'Pastry', price: '25k', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop', description: 'Flaky, buttery perfection baked fresh daily.' },
  { id: 5, name: 'Ayam Geprek Evocative', category: 'Makanan', price: '35k', image: 'https://images.unsplash.com/photo-1562607378-07bb7d56683e?q=80&w=800&auto=format&fit=crop', description: 'Crispy chicken with our signature spicy sambal.' },
  { id: 6, name: 'Caramel Macchiato', category: 'Kopi', price: '30k', image: 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?q=80&w=800&auto=format&fit=crop', description: 'Velvety espresso with vanilla and caramel drizzle.' },
  { id: 7, name: 'Pain au Chocolat', category: 'Pastry', price: '28k', image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=800&auto=format&fit=crop', description: 'Rich chocolate nestled in buttery layers.' },
  { id: 8, name: 'Ice Lemon Tea', category: 'Non-Kopi', price: '20k', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop', description: 'Refreshing home-brewed tea with fresh lemon.' },
];

const CATEGORIES = ['All', 'Signature', 'Kopi', 'Non-Kopi', 'Pastry', 'Makanan'];

const MenuEngine = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenu = useMemo(() => {
    return MENU_DATA.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <section id="menu" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header Content */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Our <span className="text-accent italic">Crafted</span> Menu
            </h2>
            <p className="text-primary/60 font-sans text-lg">
              Each item is prepared with precision and served at the speed of light.
              Filter and search to find your perfect cup.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-primary/10 rounded-full py-4 pl-12 pr-6 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all font-sans text-sm"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex overflow-x-auto pb-8 mb-12 scrollbar-hide gap-3 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-8 py-3 rounded-full font-serif font-bold transition-all duration-300 text-sm border-2 ${
                activeCategory === cat 
                  ? 'bg-primary border-primary text-white scale-105' 
                  : 'bg-white border-primary/5 text-primary/60 hover:border-accent/40'
              }`}
            >
              {cat === 'All' ? 'Every Taste' : cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredMenu.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-white rounded-3xl overflow-hidden cinematic-shadow hover:-translate-y-2 transition-all duration-300 border border-primary/5"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-white/20">
                      {item.category}
                    </span>
                  </div>
                  {item.category === 'Signature' && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-accent text-white p-2 rounded-full">
                        <Star size={16} fill="white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-serif font-bold text-primary group-hover:text-accent transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-xl font-bold font-serif text-accent">{item.price}</span>
                  </div>
                  <p className="text-primary/50 font-sans text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                  
                  <a 
                    href={`https://wa.me/628115300024?text=Halo%20Evocative!%20Saya%20ingin%20memesan%20${encodeURIComponent(item.name)}`}
                    className="flex items-center justify-center space-x-2 w-full py-3 rounded-full bg-primary/5 border border-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-300 font-bold font-sans text-xs uppercase tracking-widest"
                  >
                    <ShoppingBag size={14} />
                    <span>Order Now</span>
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredMenu.length === 0 && (
          <div className="text-center py-20">
            <Coffee className="w-16 h-16 text-primary/10 mx-auto mb-4" />
            <h3 className="text-2xl font-serif font-bold text-primary/40">No items matched your search</h3>
            <p className="text-primary/30 mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MenuEngine;
