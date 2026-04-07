import React, { useState, useEffect } from 'react';
import { Plus, Check, Edit3, Trash2, Loader2, Users, Layout, MapPin, X } from 'lucide-react';
import { subscribeTables, addTable, updateTable, deleteTable } from '../firebase.js';
import { useToast } from '../context/ToastContext.jsx';
import { Loader, EmptyState, AdminInput, AdminSelect, Badge, ConfirmBtn } from './Common.jsx';

export default function TablesTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', capacity: 2, category: 'Indoor' });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const unsub = subscribeTables(data => {
      setItems(data.sort((a, b) => a.name.localeCompare(b.name)));
      setLoading(false);
    });
    return () => unsub?.();
  }, []);

  const handleSave = async () => {
    if (!form.name) return showToast('Table name is required', 'error');
    setSaving(true);
    try {
      const payload = { 
        ...form, 
        capacity: parseInt(form.capacity) || 2 
      };
      
      if (editId) {
        await updateTable(editId, payload);
        showToast('Table updated');
      } else {
        await addTable(payload);
        showToast('Table added to inventory');
      }
      
      setForm({ name: '', capacity: 2, category: 'Indoor' });
      setEditId(null);
    } catch (e) {
      showToast('Action failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this table from inventory?')) {
      try {
        await deleteTable(id);
        showToast('Table removed');
      } catch (e) {
        showToast('Delete failed', 'error');
      }
    }
  };

  if (loading) return <Loader text="Syncing tables..." />;

  return (
    <div className="space-y-10 pb-20">
      {/* ADD / EDIT FORM */}
      <div className="border-2 border-black p-6 sm:p-10 bg-white shadow-brutal-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity">
           <Layout className="w-20 h-20 rotate-12" />
        </div>
        
        <div className="flex items-center gap-4 mb-10 border-b-2 border-black pb-4 relative z-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] font-black text-neutral-400">
            {editId ? '// EDITMODE: TABLE_COORDINATES' : '// INIT: SEATING_EXPANSION_SEQUENCE'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <AdminInput 
            label="Table ID (e.g. T-01) *" 
            value={form.name} 
            onChange={e => setForm({ ...form, name: e.target.value.toUpperCase() })} 
            placeholder="TABLE_NAME"
          />
          <AdminInput 
            label="PAX Capacity *" 
            type="number" 
            value={form.capacity} 
            onChange={e => setForm({ ...form, capacity: e.target.value })} 
          />
          <AdminSelect 
            label="Zone / Category"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            options={['Indoor', 'Window Side', 'Outdoor', 'Private/VIP', 'Bar']}
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-4 relative z-10 pt-6 border-t-2 border-neutral-100">
          <button 
            onClick={handleSave} 
            disabled={saving} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-black text-white px-10 py-4 font-mono text-[11px] font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : (editId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
            {editId ? 'COMMIT_CHANGES' : 'DEPLOY_UNIT'}
          </button>
          
          {editId && (
            <button 
              onClick={() => { setEditId(null); setForm({ name: '', capacity: 2, category: 'Indoor' }); }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-3 border-2 border-black px-10 py-4 font-mono text-[11px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all"
            >
              <X className="w-4 h-4" /> ABORT_MOD
            </button>
          )}
        </div>
      </div>

      {/* TABLES LIST */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] font-black text-neutral-400 animate-pulse">// ACTIVE_DEPLOYMENT_LOG</p>
          <span className="font-mono text-[10px] font-black bg-black text-white px-2 py-0.5">{items.length} UNITS</span>
        </div>

        {items.length === 0 ? (
          <EmptyState text="NO_UNITS_DEPLOYED: EXPAND_INVENTORY" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div key={item.id} className="border-2 border-black p-6 bg-white hover:shadow-brutal-sm transition-all group relative overflow-hidden flex flex-col">
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="min-w-0">
                    <h4 className="text-2xl font-black uppercase tracking-tighter leading-none mb-2 truncate group-hover:underline decoration-2 underline-offset-4">{item.name}</h4>
                    <Badge variant="default">{item.category}</Badge>
                  </div>
                  <div className="flex items-center gap-2 bg-neutral-50 px-3 py-1.5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                    <Users className="w-4 h-4" />
                    <span className="font-mono text-[11px] font-black">{item.capacity}</span>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto relative z-10 pt-4 border-t-2 border-neutral-50">
                  <button 
                    onClick={() => { setEditId(item.id); setForm(item); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                    className="flex-1 border-2 border-black p-3 hover:bg-black hover:text-white transition-all flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] active:translate-y-0.5 active:shadow-none"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <div className="bg-neutral-50 p-1 border-2 border-transparent hover:border-red-600 transition-colors">
                    <ConfirmBtn onConfirm={() => deleteTable(item.id).then(() => showToast('Unit purged'))} />
                  </div>
                </div>
                
                {/* Decorative background element */}
                <Layout className="absolute -bottom-6 -right-6 w-24 h-24 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
