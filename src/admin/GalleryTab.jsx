import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { subscribeGallery, addGalleryItem, deleteGalleryItem } from '../firebase';
import ImageUploader from '../components/ImageUploader';
import { useToast } from '../context/ToastContext';
import { Loader, EmptyState, AdminInput } from './Common';

export default function GalleryTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ img: '', cam: '', desc: '' });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const unsub = subscribeGallery(data => { setItems(data); setLoading(false); });
    return () => unsub?.();
  }, []);

  const handleSave = async () => {
    if (!form.img) return;
    setSaving(true);
    try {
      await addGalleryItem({ ...form, cam: form.cam || `CAM_0${items.length+1}`, desc: form.desc || 'NEW_ASSET' });
      setForm({ img: '', cam: '', desc: '' });
      showToast('Photo added to gallery');
    } catch (e) { showToast('Action failed', 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader text="Memuat galeri..." />;

  return (
    <div className="space-y-6">
      <div className="border border-black p-4 sm:p-6 bg-neutral-50 space-y-4 shadow-brutal-sm">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">// Tambah Foto Galeri</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ImageUploader label="Pilih Foto & Crop" aspect={1} folder="gallery" onUpload={(url) => setForm({ ...form, img: url })} />
          <div className="space-y-4">
            <AdminInput label="Camera ID" value={form.cam} onChange={e => setForm({ ...form, cam: e.target.value })} placeholder="CAM_01" />
            <AdminInput label="Deskripsi" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="ROAST_AREA" />
            <button onClick={handleSave} disabled={saving || !form.img} className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-4 font-mono text-xs uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-all border border-black shadow-brutal active:translate-y-1">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />} Tambah Ke Galeri
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map(item => (
          <div key={item.id} className="relative group border border-neutral-200 hover:border-black transition-colors overflow-hidden aspect-square flex flex-col bg-neutral-100 shadow-brutal-sm">
            <img src={item.img} alt={item.desc} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center text-white backdrop-blur-[2px]">
              <p className="font-mono text-[10px] uppercase font-bold tracking-widest">{item.cam}</p>
              <p className="font-mono text-[8px] uppercase mt-1">{item.desc}</p>
              <button 
                onClick={() => deleteGalleryItem(item.id).then(() => showToast('Deleted from gallery'))} 
                className="mt-4 bg-white text-black p-2 hover:bg-red-600 hover:text-white transition-all shadow-brutal-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
