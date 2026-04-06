import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, Check, X, Edit3, Image, Loader2 } from 'lucide-react';
import { subscribeMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../firebase';
import { useToast } from '../context/ToastContext';
import ImageUploader from '../components/ImageUploader';
import { Loader, EmptyState, AdminInput, AdminSelect, Badge, ConfirmBtn } from './Common';

const CATEGORIES = ['Signature', 'Kopi', 'Non-Kopi', 'Pastry', 'Makanan'];

export default function CatalogTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Signature', price: '', img: '', desc: '', notes: '', prepTime: '45s' });
  const { showToast } = useToast();

  useEffect(() => {
    const unsub = subscribeMenu(data => { setItems(data); setLoading(false); });
    return () => unsub?.();
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.price) return;
    setSaving(true);
    try {
      if (editId) await updateMenuItem(editId, form);
      else await addMenuItem(form);
      setEditId(null);
      setForm({ name: '', category: 'Signature', price: '', img: '', desc: '', notes: '', prepTime: '45s' });
      setShowForm(false);
      showToast(editId ? 'Menu item updated' : 'Menu item added');
    } catch (e) {
      showToast('Action failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader text="Memuat menu..." />;

  return (
    <div className="space-y-8">
      <div className="border-2 border-black bg-white shadow-brutal-sm group overflow-hidden">
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', category: 'Signature', price: '', img: '', desc: '', notes: '', prepTime: '45s' }); }}
          className="w-full p-5 sm:p-6 flex items-center justify-between bg-black text-white font-mono text-xs uppercase tracking-[0.2em] hover:bg-neutral-900 transition-all relative"
        >
          <span className="flex items-center gap-3 font-black z-10">
            {editId ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
            {editId ? 'Editing Menu Item' : 'Add New Catalog Entry'}
          </span>
          <ChevronDown className={`w-5 h-5 transition-transform duration-500 z-10 ${showForm ? 'rotate-180' : ''}`} />
          <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_11px)]" />
        </button>

        {showForm && (
          <div className="p-6 sm:p-10 space-y-10 bg-white border-t-2 border-black animate-in slide-in-from-top duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <AdminInput label="Menu Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Espresso Tonic" />
              <AdminSelect label="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} options={CATEGORIES} />
              <AdminInput label="Price *" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="e.g. 35K" />
              <AdminInput label="Prep Time" value={form.prepTime} onChange={e => setForm({ ...form, prepTime: e.target.value })} placeholder="e.g. 45s" />
              <div className="sm:col-span-2">
                <AdminInput label="Flavor Notes / Ingredients" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="e.g. Chocolatey, Nutty, Full Body" />
              </div>
              <div className="sm:col-start-1 sm:col-end-3">
                <ImageUploader 
                  label="Menu Asset / Photo" 
                  aspect={1} 
                  folder="menu"
                  onUpload={(url) => setForm({ ...form, img: url })} 
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-6 border-t-2 border-neutral-100">
              <button onClick={handleSave} disabled={saving || !form.name || !form.price}
                className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-black text-white px-10 py-4 font-mono text-[11px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save Item
              </button>
              <button 
                onClick={() => setShowForm(false)} 
                className="flex-1 sm:flex-none flex items-center justify-center gap-3 border-2 border-black px-10 py-4 font-mono text-[11px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <div key={item.id} className="border-2 border-black bg-white group overflow-hidden hover:shadow-brutal-sm transition-all duration-300 flex flex-col">
            <div className="relative aspect-square bg-neutral-100 overflow-hidden">
              {item.img ? (
                <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.03)_5px,rgba(0,0,0,0.03)_6px)]">
                  <Image className="w-8 h-8 text-neutral-200" />
                </div>
              )}
              <div className="absolute top-3 left-3"><Badge variant="default">{item.category}</Badge></div>
              <div className="absolute bottom-4 right-0 bg-black text-white font-mono text-[11px] font-black px-4 py-1.5 shadow-[-4px_0px_0px_0px_rgba(255,255,255,1)]">{item.price}</div>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="font-black text-lg uppercase tracking-tighter mb-6 flex-1 group-hover:underline decoration-2 underline-offset-4">{item.name}</h3>
              <div className="flex items-center gap-3 mt-auto pt-4 border-t-2 border-neutral-50">
                <button 
                  onClick={() => { setForm(item); setEditId(item.id); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="flex-1 flex items-center justify-center gap-2 text-[10px] font-mono font-black uppercase tracking-widest border-2 border-black py-2.5 hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-none"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Data
                </button>
                <div className="shrink-0 bg-neutral-50 px-1 border-2 border-transparent hover:border-red-600 transition-colors">
                   <ConfirmBtn onConfirm={() => deleteMenuItem(item.id).then(() => showToast('Item purged'))} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
