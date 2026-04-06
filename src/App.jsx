import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { useParams } from 'react-router-dom';

// Core Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Archive from './components/Archive';
import MenuSection from './components/MenuSection';
import Space from './components/Space';
import CommunityHub from './components/CommunityHub';
import Location from './components/Location';
import Footer from './components/Footer';
import SEO from './components/SEO';
import ReservationModal from './components/ReservationModal';

// Hooks & Utils
import { 
  useMenuItems, 
  useEvents, 
  useReviews, 
  useGallery, 
  useSettings, 
  useSpace 
} from './hooks/useFirebase';
import { useScrollSpy } from './hooks/useScrollSpy';
import { NAV_LINKS } from './constants/navLinks';

export default function App() {
  const { section } = useParams();
  const activeSection = useScrollSpy(NAV_LINKS.map(l => l.id));

  // Firebase Data Hooks
  const { data: settings, loading: settingsLoading } = useSettings();
  const { items: menuItems, loading: menuLoading } = useMenuItems();
  const { items: eventsData, loading: eventsLoading } = useEvents();
  const { items: reviewsData, loading: reviewsLoading } = useReviews();
  const { items: galleryItems, loading: galleryLoading } = useGallery();
  const { items: spaceItems, loading: spaceLoading } = useSpace();

  const [isResModalOpen, setIsResModalOpen] = useState(false);

  // Auto-Scroll Protocol
  useEffect(() => {
    if (section && !settingsLoading && !menuLoading) {
      const timer = setTimeout(() => {
        const el = document.getElementById(section);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 64;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [section, settingsLoading, menuLoading]);

  // Smooth Scroll Initialization (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden" style={{ paddingTop: '64px' }}>
      <SEO settings={settings} />
      
      <Navbar
        activeSection={activeSection}
        settings={settings}
        settingsLoading={settingsLoading}
        onOpenReservation={() => setIsResModalOpen(true)}
      />

      <Hero
        settings={settings}
        loading={settingsLoading}
        onOpenReservation={() => setIsResModalOpen(true)}
      />
      
      <About settings={settings} />
      
      <Archive 
        galleryItems={galleryItems || []} 
        loading={galleryLoading} 
      />
      
      <MenuSection 
        menuItems={menuItems || []} 
        loading={menuLoading} 
      />
      
      <Space 
        spaceItems={spaceItems || []} 
        loading={spaceLoading} 
        settings={settings} 
      />
      
      <CommunityHub
        eventsData={eventsData || []}
        reviewsData={reviewsData || []}
        eventsLoading={eventsLoading}
        reviewsLoading={reviewsLoading}
      />
      
      <Location settings={settings} />

      <Footer
        settings={settings}
        onOpenReservation={() => setIsResModalOpen(true)}
      />

      <ReservationModal
        isOpen={isResModalOpen}
        onClose={() => setIsResModalOpen(false)}
        settings={settings}
      />
    </div>
  );
}