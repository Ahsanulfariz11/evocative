import React, { useState, useEffect } from 'react';
import { Plus, Check, Edit3, Trash2, Loader2, X } from 'lucide-react';
import { subscribeSpace, addSpaceItem, updateSpaceItem, deleteSpaceItem } from '../firebase.js';
import ImageUploader from '../components/ImageUploader.jsx';
import VideoUploader from '../components/VideoUploader.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Loader, EmptyState, AdminInput, AdminTextarea, ConfirmBtn } from './Common.jsx';

export default function SpaceTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mediaType, setMediaType] = useState('image');
  const [form, setForm] = useState({ img: '', video: '', alt: '', desc: '', filename: '' });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const unsub = subscribeSpace(data => { setItems(data); setLoading(false); });
    return () => unsub?.();
  }, []);

  const handleSave = async () => {
    if (mediaType === 'image' && !form.img) return;
    if (mediaType === 'video' && (!form.video || !form.img)) return;
    setSaving(true);
    try {
      const payload = { type: mediaType, img: form.img, alt: form.alt || 'SPACE_ASSET', desc: form.desc || 'Media' };
      if (mediaType === 'video') { payload.video = form.video; payload.poster = form.img; }
      if (editId) await updateSpaceItem(editId, payload);
      else await addSpaceItem(payload);
      setForm({ img: '', video: '', alt: '', desc: '', filename: '' });
      setEditId(null);
      showToast('Space media updated');
    } catch (e) { showToast('Action failed', 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader text="Memuat space..." />;

  return (
    <div className="space-y-8 pb-20">
      <div className="border-2 border-black p-6 sm:p-10 bg-white space-y-10 shadow-brutal-sm relative overflow-hidden group">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b-2 border-black pb-6 relative z-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] font-black text-neutral-400 animate-pulse">// INFRASTRUCTURE_BENTO_SEQUENCE</p>
          <div className="flex border-2 border-black font-mono text-[10px] uppercase font-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button onClick={() => setMediaType('image')} className={`px-6 py-2.5 transition-all ${mediaType === 'image' ? 'bg-black text-white' : 'bg-white hover:bg-neutral-50'}`}>PHOTO_ASSET</button>
            <button onClick={() => setMediaType('video')} className={`px-6 py-2.5 border-l-2 border-black transition-all ${mediaType === 'video' ? 'bg-black text-white' : 'bg-white hover:bg-neutral-50'}`}>VIDEO_LOG</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
          <div className="bg-neutral-50 p-6 border-2 border-black border-dashed flex flex-col justify-center">
            {mediaType === 'image' ? (
              <ImageUploader label="Asset Preview" aspect={16/9} folder="space" onUpload={(url) => setForm({ ...form, img: url })} />
            ) : (
              <VideoUploader label="Source Video" folder="space" onUpload={(d) => setForm({ ...form, video: d.videoUrl, img: d.posterUrl, filename: d.filename })} />
            )}
          </div>
          <div className="space-y-6">
            <AdminInput label="Asset_Title_ID" value={form.alt} onChange={e => setForm({ ...form, alt: e.target.value })} placeholder="e.g. OUTDOOR_MAIN_ZONE" />
            <AdminTextarea label="Asset_Metadata_Desc" rows={3} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Mission parameters..." />
            <div className="pt-4 border-t-2 border-neutral-100 flex gap-4">
              <button onClick={handleSave} disabled={saving} className="flex-1 bg-black text-white px-10 py-4 font-mono text-[11px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] transition-all active:translate-y-1 active:shadow-none flex items-center justify-center gap-3">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />)} 
                {editId ? 'COMMIT_PATCH' : 'INIT_DEPLOYMENT'}
              </button>
              {editId && (
                <button 
                  onClick={() => { setEditId(null); setForm({ img: '', video: '', alt: '', desc: '', filename: '' }); }}
                  className="border-2 border-black px-6 py-4 font-mono text-[11px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <div key={item.id} className="border-2 border-black bg-white group relative aspect-video overflow-hidden shadow-none hover:shadow-brutal-sm transition-all duration-300">
            <img src={item.poster || item.img} alt={item.alt} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" />
            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6 text-center backdrop-blur-[2px]">
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-500 mb-2">// UNIT_IDENTITY</span>
              <p className="font-black text-lg uppercase tracking-tighter leading-tight mb-4 ">{item.alt}</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => { setEditId(item.id); setMediaType(item.type || 'image'); setForm(item); window.scrollTo({top:0, behavior:'smooth'}); }} 
                  className="bg-white text-black p-3 hover:bg-neutral-200 transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-y-0.5 active:shadow-none"
                >
                  <Edit3 className="w-5 h-5" />
                </button>
                <div className="bg-red-600/20 p-2 border-2 border-transparent hover:border-red-600 transition-all">
                  <ConfirmBtn onConfirm={() => deleteSpaceItem(item.id).then(() => showToast('Asset purged'))} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
