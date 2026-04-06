import React from 'react';
import { TrendingUp, QrCode, Smartphone, MapPin, Coffee, Calendar } from 'lucide-react';
import { useAnalytics } from '../hooks/useFirebase';
import { Loader } from './Common';

export default function StatsTab() {
  const { stats, loading } = useAnalytics();
  const menuUrl = window.location.origin + '/#menu';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(menuUrl)}&bgcolor=ffffff&color=000000&margin=10`;

  const cards = [
    { label: 'Total Reservations', value: stats.reservations || 0, icon: Calendar, color: 'text-blue-600' },
    { label: 'Map Interactions', value: stats.maps_view || 0, icon: MapPin, color: 'text-green-600' },
    { label: 'Menu Interest', value: stats.menu_view || 0, icon: Coffee, color: 'text-orange-600' },
  ];

  if (loading) return <Loader text="Memuat statistik..." />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map(card => (
          <div key={card.label} className="border border-black bg-white p-6 shadow-brutal-sm hover:translate-y-[-2px] transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-neutral-100 rounded">
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-neutral-300" />
            </div>
            <p className="text-3xl font-black tracking-tighter mb-1">{card.value}</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-black bg-black text-white p-8 group overflow-hidden relative">
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <QrCode className="w-8 h-8 text-white animate-pulse" />
            <h3 className="text-2xl font-black uppercase tracking-tighter">QR Menu Generator</h3>
          </div>
          <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest leading-relaxed mb-8 relative z-10">
            Gunakan QR Code ini untuk akses Menu Digital di kafe Anda. Pelanggan cukup scan untuk langsung melihat daftar menu premium Anda.
          </p>
          <div className="space-y-4 relative z-10">
            <div className="p-4 bg-neutral-900 border border-white/10">
              <p className="text-[10px] font-mono uppercase text-neutral-500 mb-2">Target Link:</p>
              <code className="text-xs text-green-400 break-all">{menuUrl}</code>
            </div>
            <a 
              href={qrUrl} 
              target="_blank" 
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 font-mono text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors"
            >
              Open/Download QR Image
            </a>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="border border-black bg-white p-8 flex flex-col items-center justify-center">
          <div className="p-4 bg-white border border-black shadow-brutal">
            <img src={qrUrl} alt="Store Menu QR" className="w-48 h-48" />
          </div>
          <p className="mt-6 font-mono text-[9px] uppercase tracking-widest text-neutral-400">
            Preview: Scan to open live menu
          </p>
        </div>
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 flex items-start gap-3">
        <Smartphone className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[10px] font-mono text-blue-800 uppercase tracking-widest leading-relaxed">
          Statistik ini bersifat anonim dan real-time. Data diperbarui setiap kali pengunjung mengklik tombol aksi di landing page.
        </p>
      </div>
    </div>
  );
}
