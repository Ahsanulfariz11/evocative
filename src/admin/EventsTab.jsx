import React, { useState, useEffect } from 'react';
import { Plus, Check, X, Edit3, Loader2, Calendar, Image as ImageIcon } from 'lucide-react';
import { subscribeEvents, addEvent, updateEvent, deleteEvent } from '../firebase.js';
import { useToast } from '../context/ToastContext.jsx';
import ImageUploader from '../components/ImageUploader.jsx';
import { Loader, EmptyState, AdminInput, AdminSelect, Badge, ConfirmBtn } from './Common.jsx';

const EVENT_TYPES = ['Tournament', 'Workshop', 'Exhibition', 'Special', 'Music', 'Community'];

export default function EventsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', date: '', type: 'Workshop', img: '' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const unsub = subscribeEvents(data => { setItems(data); setLoading(false); });
    return () => unsub?.();
  }, []);

  const handleSave = async () => {
    if (!form.title || !form.date) return;
    setSaving(true);
    try {
      if (editId) await updateEvent(editId, form);
      else await addEvent(form);
      setForm({ title: '', date: '', type: 'Workshop', img: '' });
      setEditId(null);
      showToast(editId ? 'Event updated' : 'Event added');
    } catch (e) { showToast('Action failed', 'error'); }
    finally { setSaving(false); }
  };

  if (loading) return <Loader text="Memuat events..." />;

  return (
    <div className="space-y-8 pb-20">
      <div className="border-2 border-black p-6 sm:p-10 bg-white space-y-10 shadow-brutal-sm">
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] font-black text-neutral-400">
            {editId ? 'Editing Event Details' : 'Initialize New Event'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <AdminInput label="Nama Event *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Latte Art Class" />
            <AdminInput label="Tanggal *" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="e.g. 15 Mei 2026" />
            <div className="sm:col-span-2">
              <AdminSelect label="Tipe Misi / Event" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} options={EVENT_TYPES} />
            </div>
          </div>
          
          <div className="lg:col-span-4 border-2 border-black bg-neutral-50 p-6 flex flex-col justify-center">
             <ImageUploader 
                label="Poster / Thumbnail" 
                aspect={16/9} 
                folder="events"
                onUpload={(url) => setForm({ ...form, img: url })} 
             />
             {form.img && (
               <p className="mt-4 text-[9px] font-mono text-green-600 font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                 <Check className="w-3.5 h-3.5" /> Visual Asset Loaded
               </p>
             )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4 border-t-2 border-neutral-100">
          <button onClick={handleSave} disabled={saving || !form.title || !form.date}
            className="flex items-center gap-3 bg-black text-white px-10 py-4 font-mono text-[12px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} {editId ? 'Update Event' : 'Deploy Event'}
          </button>
          {editId && (
            <button 
              onClick={() => { setEditId(null); setForm({ title: '', date: '', type: 'Workshop', img: '' }); }} 
              className="flex items-center gap-3 border-2 border-black px-10 py-4 font-mono text-[12px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-0 border-t-4 border-black">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between border-b-2 border-black py-6 px-4 sm:px-8 hover:bg-neutral-50 transition-colors gap-8 group">
            <div className="flex items-center gap-8 min-w-0">
               {/* Thumbnail Preview */}
               <div className="w-20 h-20 sm:w-32 sm:h-20 border-2 border-black bg-white shrink-0 overflow-hidden relative shadow-brutal-sm group-hover:shadow-none transition-all">
                 {item.img ? (
                   <img src={item.img} alt="" className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-700 scale-105 group-hover:scale-100" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.05)_5px,rgba(0,0,0,0.05)_6px)]">
                     <ImageIcon className="w-6 h-6 text-neutral-300" />
                   </div>
                 )}
               </div>

              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="default">{item.type}</Badge>
                  <p className="text-[10px] font-mono text-neutral-400 font-black uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> {item.date}
                  </p>
                </div>
                <p className="font-black text-base sm:text-xl uppercase tracking-tighter truncate text-black group-hover:underline decoration-2 underline-offset-4">
                  {item.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => { setForm(item); setEditId(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="p-3 border-2 border-transparent hover:border-black hover:bg-white text-neutral-400 hover:text-black transition-all group/edit"
              >
                <Edit3 className="w-5 h-5 group-hover/edit:rotate-12 transition-transform" />
              </button>
              <ConfirmBtn onConfirm={() => deleteEvent(item.id)} />
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <EmptyState text="No upcoming events scheduled" />}
    </div>
  );
}
