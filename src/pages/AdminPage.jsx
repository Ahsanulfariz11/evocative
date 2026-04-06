import React, { useState } from 'react';
import { 
  Coffee, Calendar, Settings, LayoutGrid, Image, Clock, MessageSquare, TrendingUp, Grid,
  Database, Eye, ShieldCheck, AlertTriangle, EyeOff, Loader2 
} from 'lucide-react';
import { seedDatabase } from '../firebase';
import { useToast } from '../context/ToastContext';

// Modular Tab Components
import StatsTab from '../admin/StatsTab';
import ReservationsTab from '../admin/ReservationsTab';
import ConfigTab from '../admin/ConfigTab';
import CatalogTab from '../admin/CatalogTab';
import SpaceTab from '../admin/SpaceTab';
import TablesTab from '../admin/TablesTab';
import GalleryTab from '../admin/GalleryTab';
import EventsTab from '../admin/EventsTab';
import ReviewsTab from '../admin/ReviewsTab';
import { AdminInput } from '../admin/Common';

const TABS = [
  { id: 'insights', label: 'Insights', icon: TrendingUp },
  { id: 'reservations', label: 'Reservations', icon: Calendar },
  { id: 'tables', label: 'Tables', icon: Grid },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'menu', label: 'Menu', icon: Coffee },
  { id: 'space', label: 'Space', icon: LayoutGrid },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'events', label: 'Events', icon: Clock },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('insights');
  const [seeding, setSeeding] = useState(false);
  const { showToast } = useToast();

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedDatabase();
      showToast('Database seeded successfully');
    } catch (e) {
      showToast('Seed failed', 'error');
    } finally {
      setSeeding(false);
    }
  };

  const ActiveIcon = TABS.find(t => t.id === activeTab)?.icon || Coffee;

  return (
    <div className="min-h-screen bg-neutral-50 font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-black h-14 flex items-center px-4 sm:px-6 justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-black flex items-center justify-center shrink-0 shadow-brutal-sm">
            <Coffee className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-sm uppercase tracking-tighter">Evocative<span className="text-neutral-400">Space</span></span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={handleSeed} disabled={seeding}
            className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors disabled:opacity-50">
            {seeding ? <Loader2 className="w-3 h-3 animate-spin" /> : <Database className="w-3 h-3" />}
            <span className="hidden sm:inline">Seed</span>
          </button>
          <a href="/"
            className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest border border-neutral-300 px-3 py-1.5 hover:border-black transition-colors">
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Site</span>
          </a>
        </div>
      </header>

      <div className="pt-20 max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-32">
        {/* Page Title + Tabs */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ActiveIcon className="w-6 h-6 animate-in zoom-in duration-300" />
            <h1 className="text-2xl font-black uppercase tracking-tighter">
              {TABS.find(t => t.id === activeTab)?.label}
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-0 border border-black overflow-x-auto no-scrollbar shadow-brutal-sm bg-white">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 font-mono text-[10px] uppercase tracking-widest whitespace-nowrap border-r border-black last:border-r-0 transition-all ${
                  activeTab === tab.id ? 'bg-black text-white' : 'bg-white hover:bg-neutral-50'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="bg-white p-4 sm:p-8 border border-black shadow-brutal min-h-[400px]">
          {activeTab === 'insights' && <StatsTab />}
          {activeTab === 'reservations' && <ReservationsTab />}
          {activeTab === 'tables' && <TablesTab />}
          {activeTab === 'settings' && <ConfigTab />}
          {activeTab === 'menu' && <CatalogTab />}
          {activeTab === 'space' && <SpaceTab />}
          {activeTab === 'gallery' && <GalleryTab />}
          {activeTab === 'events' && <EventsTab />}
          {activeTab === 'reviews' && <ReviewsTab />}
        </div>
      </div>
    </div>
  );
}
