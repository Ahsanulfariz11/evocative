import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { X, Users, Calendar, Clock, ChevronRight, Loader2, Utensils, ArrowLeft, Check, Plus, Minus, AlertTriangle, Monitor, Layout, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { addReservation, subscribeMenu, subscribeTables } from '../firebase';
import { useToast } from '../context/ToastContext';
import { useReservations } from '../hooks/useFirebase';
import { optimizeImage } from '../utils/image';

const ReservationModal = ({ isOpen, onClose, settings }) => {
  const [step, setStep] = useState(1);
  const [menuItems, setMenuItems] = useState([]);
  const [allTables, setAllTables] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  
  const [form, setForm] = useState({
    name: '',
    date: '',
    time: '',
    guests: '2',
    notes: '',
    tableId: '',
    tableName: '',
    preOrder: []
  });
  
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { items: allReservations } = useReservations();

  // 1. Sync Data (Menu & Tables)
  useEffect(() => {
    if (isOpen) {
      setMenuLoading(true);
      const unsubMenu = subscribeMenu(data => {
        setMenuItems(Array.isArray(data) ? data : []);
        setMenuLoading(false);
      });
      const unsubTables = subscribeTables(data => {
        setAllTables(Array.isArray(data) ? data : []);
      });
      return () => {
        unsubMenu();
        unsubTables();
      };
    }
  }, [isOpen]);

  // 2. Reset Step & Table when Logistics change
  useEffect(() => {
    setForm(prev => ({ ...prev, tableId: '', tableName: '' }));
  }, [form.date, form.time]);

  // 3. Table Availability Logic
  const occupiedTableIds = useMemo(() => {
    if (!form.date || !form.time || !Array.isArray(allReservations)) return [];
    const selectedHour = parseInt(form.time.split(':')[0]);
    return allReservations
      .filter(r => {
        if (!r.date || !r.time || r.status === 'cancelled') return false;
        const resHour = parseInt(r.time.split(':')[0]);
        return r.date === form.date && resHour === selectedHour;
      })
      .map(r => r.tableId)
      .filter(Boolean);
  }, [form.date, form.time, allReservations]);

  // 4. State Handlers
  const togglePreOrderItem = useCallback((item) => {
    if (!item?.id) return;
    setForm(prev => {
      const currentList = Array.isArray(prev?.preOrder) ? [...prev.preOrder] : [];
      const index = currentList.findIndex(p => p.id === item.id);
      if (index > -1) currentList.splice(index, 1);
      else currentList.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
      return { ...prev, preOrder: currentList };
    });
  }, []);

  const updatePreOrderQty = useCallback((id, delta) => {
    setForm(prev => {
      const currentList = Array.isArray(prev?.preOrder) ? [...prev.preOrder] : [];
      const updatedList = currentList.map(p => 
        p.id === id ? { ...p, qty: Math.max(1, (p.qty || 1) + delta) } : p
      );
      return { ...prev, preOrder: updatedList };
    });
  }, []);

  const calculateTotal = useCallback(() => {
    if (!Array.isArray(form.preOrder)) return 0;
    return form.preOrder.reduce((sum, item) => {
      const priceNum = parseInt(item.price?.replace(/\D/g, '') || '0') || 0;
      return sum + (priceNum * (item.qty || 1));
    }, 0);
  }, [form.preOrder]);

  const handleSubmit = async () => {
    if (!form.name || !form.date || !form.time || !form.tableId) {
      showToast('Logistics incomplete: Ensure table selection is valid', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const finalForm = {
        ...form,
        preOrder: Array.isArray(form.preOrder) ? form.preOrder : [],
        createdAt: Date.now()
      };

      await addReservation(finalForm);
      showToast('Tactical reservation established');

      const whatsappNum = settings?.contact?.whatsapp || '6282154443194';
      const preOrderText = finalForm.preOrder.length > 0
        ? `\n\n📌 Pre-order Menu:\n${finalForm.preOrder.map(p => `- ${p.name} (x${p.qty})`).join('\n')}\nTotal Est: Rp ${calculateTotal().toLocaleString()}`
        : '';

      const message = `Halo Evocative Space, saya ingin reservasi:
Nama: ${finalForm.name}
Tanggal: ${finalForm.date}
Pukul: ${finalForm.time}
Meja: ${finalForm.tableName}
Jumlah Orang: ${finalForm.guests} orang
Catatan: ${finalForm.notes || '-'}${preOrderText}`;
      
      window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`, '_blank');
      onClose();
    } catch (err) {
      showToast('Transmission Interrupted', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/95 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white border-2 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* HEADER */}
        <div className="bg-black text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/50 animate-pulse">// STAGE_{step.toString().padStart(2, '0')}/03</p>
            <h3 className="text-2xl font-black uppercase tracking-tighter">Unit Deployment</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 transition-colors border border-white/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="h-1 bg-neutral-200 w-full flex">
          {[1,2,3].map(s => (
            <div key={s} className={`flex-1 transition-all duration-500 ${s <= step ? 'bg-black' : 'bg-transparent'}`} />
          ))}
        </div>

        {/* CONTENT */}
        <div className="overflow-y-auto p-6 custom-scrollbar flex-1 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [bg-size:20px_20px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">Target Identifier (Name)</label>
                  <input required placeholder="CAPT. ADHIATMANA" className="w-full border-2 border-black p-4 text-sm font-bold uppercase tracking-tighter bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] focus:shadow-none transition-all outline-none"
                    value={form.name} onChange={e => setForm({...form, name: e.target.value.toUpperCase()})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black z-10" />
                      <input required type="date" className="w-full border-2 border-black p-4 pl-12 text-xs font-bold bg-white focus:bg-neutral-50 outline-none uppercase"
                        value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black z-10" />
                      <input required type="time" className="w-full border-2 border-black p-4 pl-12 text-xs font-bold bg-white focus:bg-neutral-50 outline-none"
                        value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-neutral-500">Unit Size (Guests)</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black z-10 pointer-events-none" />
                    <select className="w-full border-2 border-black p-4 pl-12 text-xs font-bold bg-white appearance-none outline-none"
                      value={form.guests} onChange={e => setForm({...form, guests: e.target.value})}>
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} PERSONS</option>)}
                      <option value="12">GROUP (8-12)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
                  <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black">// COORDINATE_SELECTION</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {allTables.length === 0 ? (
                    <div className="col-span-full py-10 text-center border-2 border-dashed border-black">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                      <p className="font-mono text-[10px] uppercase text-neutral-400">Fetching_Grid_Data...</p>
                    </div>
                  ) : (
                    allTables.map(table => {
                      const isOccupied = occupiedTableIds.includes(table.id);
                      const isTooSmall = parseInt(form.guests) > (table.capacity || 0);
                      const isSelected = form.tableId === table.id;
                      const isDisabled = isOccupied || isTooSmall;

                      return (
                        <button
                          key={table.id}
                          disabled={isDisabled}
                          onClick={() => setForm({ ...form, tableId: table.id, tableName: table.name })}
                          className={`
                            relative h-24 border-2 p-3 flex flex-col justify-between transition-all group
                            ${isSelected ? 'border-black bg-black text-white shadow-brutal-sm' : 'border-neutral-200 bg-white hover:border-black'}
                            ${isDisabled ? 'opacity-30 cursor-not-allowed bg-neutral-100 grayscale' : 'cursor-pointer'}
                          `}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-mono text-[10px] font-black uppercase leading-none">{table.name}</span>
                            <Users className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-neutral-300'}`} />
                          </div>
                          
                          <div className="flex justify-between items-end">
                            <span className="font-mono text-[8px] uppercase font-bold tracking-tight opacity-50">CAP: {table.capacity}</span>
                            {isOccupied && <span className="font-mono text-[8px] text-red-600 font-black tracking-tighter">RESERVED</span>}
                            {isTooSmall && !isOccupied && <span className="font-mono text-[8px] text-orange-500 font-black tracking-tighter">SMALL</span>}
                            {isSelected && <Check className="w-4 h-4 text-green-400" />}
                          </div>

                          {isSelected && <div className="absolute top-0 right-0 w-2 h-2 bg-green-400" />}
                        </button>
                      );
                    })
                  )}
                </div>

                <div className="p-4 bg-neutral-100 border-2 border-black border-dashed">
                  <p className="font-mono text-[9px] uppercase font-bold text-neutral-500 leading-relaxed tracking-widest">
                    *MEJA YANG BERWARNA ABU-ABU TIDAK TERSEDIA PADA SLOT WAKTU INI ATAU TIDAK CUKUP UNTUK JUMLAH TAMU ANDA.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-5">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                   <p className="font-mono text-[10px] font-black uppercase tracking-widest text-black">// OPTIONAL_RESOURCES</p>
                   <span className="bg-black text-white px-3 py-1 text-[9px] font-mono font-bold uppercase">
                     {form.preOrder?.length || 0} SELECTED
                   </span>
                </div>
                
                {menuLoading ? (
                  <div className="h-48 flex flex-col items-center justify-center border-2 border-black border-dashed bg-neutral-50">
                    <Loader2 className="w-8 h-8 animate-spin text-black mb-2" />
                    <p className="font-mono text-[10px] uppercase text-neutral-400">Loading_Menu_Database...</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {menuItems.map((item) => {
                      const selected = (form.preOrder || []).find(p => p.id === item.id);
                      return (
                        <div key={item.id} 
                          className={`flex items-center gap-4 p-3 border-2 transition-all group ${selected ? 'border-black bg-neutral-100' : 'border-neutral-200 hover:border-black bg-white'}`}>
                          <img src={optimizeImage(item.img)} className="w-16 h-16 object-cover border-2 border-black grayscale group-hover:grayscale-0 transition-all shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-black uppercase truncate leading-none mb-1">{item.name}</p>
                            <p className="text-[10px] font-mono text-neutral-500 uppercase font-bold tracking-tighter">{item.price}</p>
                          </div>
                          {selected ? (
                            <div className="flex items-center gap-2 bg-white border-2 border-black p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              <button onClick={() => updatePreOrderQty(item.id, -1)} className="p-1 hover:bg-neutral-100 active:scale-95"><Minus className="w-3 h-3" /></button>
                              <span className="font-mono text-[11px] font-black w-6 text-center">{selected.qty || 1}</span>
                              <button onClick={() => updatePreOrderQty(item.id, 1)} className="p-1 hover:bg-neutral-100 active:scale-95"><Plus className="w-3 h-3" /></button>
                              <button onClick={() => togglePreOrderItem(item)} className="ml-1 bg-red-600 text-white p-1 hover:bg-red-700"><X className="w-3 h-3" /></button>
                            </div>
                          ) : (
                            <button onClick={() => togglePreOrderItem(item)} className="px-4 py-2 border-2 border-black font-mono text-[10px] font-black uppercase hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                              ADD
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {(form.preOrder?.length || 0) > 0 && (
                  <div className="bg-black p-4 text-white flex justify-between items-center font-mono text-[11px] uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(34,197,94,0.5)]">
                    <span className="font-bold flex items-center gap-2 text-green-400">
                      <Check className="w-4 h-4" /> TOTAL EST.
                    </span>
                    <span className="text-xl font-black">Rp {calculateTotal().toLocaleString()}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER */}
        <div className="p-6 pt-0 shrink-0 space-y-4 bg-white border-t-2 border-black">
          <div className="flex gap-4 mt-6">
            {step > 1 && (
              <button onClick={() => setStep(prev => prev - 1)} className="flex items-center justify-center border-2 border-black p-4 hover:bg-neutral-100 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <button
              onClick={() => step < 3 ? setStep(prev => prev + 1) : handleSubmit()}
              disabled={
                submitting || 
                (step === 1 && (!form.name || !form.date || !form.time)) ||
                (step === 2 && !form.tableId)
              }
              className="flex-1 bg-black text-white p-4 font-mono text-md font-black uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none relative overflow-hidden group"
            >
              <div className="flex items-center justify-center gap-3 z-10 relative">
                {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                <span>
                  {submitting ? 'PROCESSING...' : step === 3 ? 'FINALIZE ⚡' : 'PROCEED →'}
                </span>
              </div>
            </button>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400 text-center font-bold">
            // STATUS: {submitting ? 'WRITING_TO_DB' : 'ACTIVE_LOG'} // SLOT: {form.date || 'TBD'} // TABLE: {form.tableName || 'PENDING'}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ReservationModal;
