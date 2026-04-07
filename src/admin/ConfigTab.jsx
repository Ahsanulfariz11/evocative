import React, { useState, useEffect } from 'react';
import { Database, Loader2 } from 'lucide-react';
import { subscribeSettings, updateSettings } from '../firebase.js';
import { useToast } from '../context/ToastContext.jsx';
import ImageUploader from '../components/ImageUploader.jsx';
import { Loader, AdminInput, AdminSelect, AdminTextarea } from './Common.jsx';

export default function ConfigTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const unsub = subscribeSettings(val => { setData(val); setLoading(false); });
    return () => unsub?.();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try { 
      await updateSettings(data); 
      showToast('Settings successfully deployed'); 
    }
    catch (e) { showToast('Save failed', 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader text="Memuat pengaturan..." />;

  return (
    <form onSubmit={handleSave} className="space-y-10 pb-24 animate-in fade-in duration-500">
      <div className="border-2 border-black bg-white shadow-brutal-sm">
        <div className="p-4 bg-black text-white font-mono text-[10px] uppercase tracking_widest relative overflow-hidden group">
          <span className="relative z-10 font-black">// Hero & Branding</span>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_11px)]" />
        </div>
        <div className="p-6 sm:p-10 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Logo Section - Delicate Circular */}
            <div className="lg:col-span-3 flex flex-col items-center justify-center">
               <ImageUploader 
                 label="Custom Logo" 
                 aspect={1/1} 
                 circular={true}
                 previewUrl={data.logo}
                 folder="branding" 
                 onUpload={(url) => setData({...data, logo: url})} 
               />
               <p className="mt-4 text-center text-[8px] font-mono text-neutral-400 leading-tight uppercase tracking-widest max-w-[120px] opacity-60">
                 PNG Transparent Recommended. (1:1 Aspect)
               </p>
            </div>

            {/* Text Identity Section */}
            <div className="lg:col-span-9 space-y-8">
               <AdminInput label="Hero Title" value={data.hero?.title} onChange={e => setData({...data, hero: {...data.hero, title: e.target.value}})} />
               <AdminTextarea 
                 label="Hero Description" 
                 rows={3}
                 value={data.hero?.description} 
                 onChange={e => setData({...data, hero: {...data.hero, description: e.target.value}})} 
               />
            </div>
          </div>

          <div className="pt-8">
            <div className="flex flex-col gap-6">
              <p className="font-mono text-[10px] uppercase font-black text-black tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-black" /> Hero Background Sequence
              </p>
              <ImageUploader 
                aspect={16/9} 
                previewUrl={data.hero?.img}
                folder="branding" 
                onUpload={(url) => setData({...data, hero: {...data.hero, img: url}})} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-black bg-white shadow-brutal-sm">
        <div className="p-4 bg-black text-white font-mono text-[10px] uppercase tracking_widest relative overflow-hidden group">
          <span className="relative z-10 font-black">// Contact & Coordinates</span>
          <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_11px)]" />
        </div>
        <div className="p-6 sm:p-10 space-y-8">
          <AdminInput label="Full Address" value={data.contact?.address} onChange={e => setData({...data, contact: {...data.contact, address: e.target.value}})} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <AdminInput label="WhatsApp" value={data.contact?.whatsapp} onChange={e => setData({...data, contact: {...data.contact, whatsapp: e.target.value}})} />
            <AdminInput label="Instagram" value={data.contact?.instagram} onChange={e => setData({...data, contact: {...data.contact, instagram: e.target.value}})} />
            <AdminInput label="TikTok" value={data.contact?.tiktok} onChange={e => setData({...data, contact: {...data.contact, tiktok: e.target.value}})} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <AdminInput label="Latitude" type="number" step="any" value={data.contact?.coordinates?.lat || ''} onChange={e => setData({...data, contact: {...data.contact, coordinates: {...data.contact.coordinates, lat: e.target.value === '' ? 0 : parseFloat(e.target.value)}}})} />
            <AdminInput label="Longitude" type="number" step="any" value={data.contact?.coordinates?.lng || ''} onChange={e => setData({...data, contact: {...data.contact, coordinates: {...data.contact.coordinates, lng: e.target.value === '' ? 0 : parseFloat(e.target.value)}}})} />
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button type="submit" disabled={saving} className="bg-black text-white px-10 py-4 font-mono text-sm uppercase tracking-widest shadow-brutal-sm hover:bg-neutral-800 transition-all flex items-center gap-3 active:translate-y-1 active:shadow-none">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />} {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>
    </form>
  );
}
