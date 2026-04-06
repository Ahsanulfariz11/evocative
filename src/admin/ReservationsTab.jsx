import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, 
  User, 
  Users, 
  MessageSquare, 
  CheckCircle, 
  List, 
  Grid, 
  ChevronLeft, 
  ChevronRight, 
  Utensils, 
  Clock, 
  Trash2, 
  MapPin 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { subscribeReservations, updateReservation, deleteReservation } from '../firebase';
import { useToast } from '../context/ToastContext';
import { Loader, EmptyState, Badge, ConfirmBtn } from './Common';

// --- CUSTOM BRUTALIST CALENDAR COMPONENT ---
const BrutalistCalendar = ({ items, selectedDate, onSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    
    const firstDay = date.getDay();
    for (let i = 0; i < firstDay; i++) days.push(null);
    
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentMonth]);

  const changeMonth = (offset) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const getResCount = useCallback((date) => {
    if (!date || !Array.isArray(items)) return 0;
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const targetIso = `${y}-${m}-${d}`;
    return items.filter(r => r.date === targetIso && r.status !== 'cancelled').length;
  }, [items]);

  return (
    <div className="border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="bg-black text-white p-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.3em]">
        <button onClick={() => changeMonth(-1)} className="hover:bg-neutral-800 p-2 border border-white/20"><ChevronLeft className="w-4 h-4" /></button>
        <span className="font-black underline decoration-2 underline-offset-4">{currentMonth.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => changeMonth(1)} className="hover:bg-neutral-800 p-2 border border-white/20"><ChevronRight className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-7 border-b-2 border-black bg-neutral-100/50 text-[10px] font-black uppercase text-center py-2 tracking-widest">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="opacity-50">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 auto-rows-[70px] sm:auto-rows-[90px]">
        {daysInMonth.map((date, idx) => {
          if (!date) return <div key={`empty-${idx}`} className="border-r-2 border-b-2 border-black bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,#f3f4f6_5px,#f3f4f6_10px)] last:border-r-0" />;
          
          const y = date.getFullYear();
          const m = String(date.getMonth() + 1).padStart(2, '0');
          const d = String(date.getDate()).padStart(2, '0');
          const iso = `${y}-${m}-${d}`;
          
          const isActive = selectedDate === iso;
          const count = getResCount(date);
          const isToday = new Date().toISOString().split('T')[0] === iso;
          
          return (
            <button
              key={iso}
              onClick={() => onSelect(isActive ? null : iso)}
              className={`relative border-r-2 border-b-2 border-black last:border-r-0 flex flex-col items-center justify-center transition-all group overflow-hidden ${isActive ? 'bg-black text-white z-10' : 'hover:bg-neutral-50'}`}
            >
              <span className={`text-md font-black mb-1 font-mono ${isActive ? 'text-white' : isToday ? 'text-blue-600 underline' : 'text-neutral-300'}`}>
                {date.getDate().toString().padStart(2, '0')}
              </span>
              {count > 0 && (
                <div className="flex gap-1 flex-wrap justify-center px-1">
                  {[...Array(Math.min(count, 5))].map((_, i) => (
                    <div key={i} className={`w-2 h-2 ${isActive ? 'bg-white' : 'bg-black'} ${count > 5 && i === 4 ? 'opacity-30' : ''}`} />
                  ))}
                </div>
              )}
              {count > 0 && <span className={`absolute top-1 right-2 text-[10px] font-black ${isActive ? 'text-white' : 'text-black'}`}>{count}</span>}
              {isActive && <div className="absolute bottom-0 w-full h-1 bg-white animate-pulse" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function ReservationsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [filterDate, setFilterDate] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const unsub = subscribeReservations(data => { 
      const mapped = (Array.isArray(data) ? data : []).map(i => ({
        ...i,
        preOrder: Array.isArray(i.preOrder) ? i.preOrder : []
      }));
      setItems([...mapped].sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0))); 
      setLoading(false); 
    });
    return () => unsub?.();
  }, []);

  const filteredItems = useMemo(() => {
    if (!filterDate) return items;
    return items.filter(i => i.date === filterDate);
  }, [items, filterDate]);

  const getStatusVariant = (s) => {
    const statusStr = typeof s === 'object' ? s?.status : s;
    if (statusStr === 'confirmed') return 'success';
    if (statusStr === 'completed') return 'info';
    if (statusStr === 'cancelled') return 'danger';
    return 'warning';
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateReservation(id, { status: newStatus });
      showToast(`Reservation marked as ${newStatus}`);
    } catch (err) {
      showToast('Status Update Failed', 'error');
    }
  };

  // HELPER TO ENSURE WE NEVER RENDER AN OBJECT
  const safeStr = (val, fallback = '') => {
    if (!val) return fallback;
    if (typeof val === 'string' || typeof val === 'number') return val;
    if (typeof val === 'object') {
      // If it's the specific "status object" we're seeing in logs
      if (val.status && typeof val.status === 'string') return val.status;
      if (val.name && typeof val.name === 'string') return val.name;
      return JSON.stringify(val);
    }
    return fallback;
  };

  if (loading) return <Loader text="Menjelajahi arsip reservasi..." />;

  return (
    <div className="space-y-8 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b-4 border-black pb-6">
        <div>
          <div className="flex items-center gap-4 mt-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter">Reservasi Log</h2>
            <div className="bg-black text-white px-3 py-1 font-mono text-sm font-bold skew-x-[-12deg]">{items.length} TOTAL</div>
          </div>
        </div>

        <div className="flex items-center gap-0 border-2 border-black p-1 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-6 py-3 font-mono text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-black text-white' : 'hover:bg-neutral-100'}`}
          >
            <List className="w-4 h-4" /> List View
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-6 py-3 font-mono text-[11px] font-black uppercase tracking-widest transition-all ${viewMode === 'calendar' ? 'bg-black text-white' : 'hover:bg-neutral-100'}`}
          >
            <Grid className="w-4 h-4" /> Calendar
          </button>
        </div>
      </div>

      {/* CALENDAR VIEW CONTENT */}
      {viewMode === 'calendar' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <BrutalistCalendar items={items} selectedDate={filterDate} onSelect={setFilterDate} />
          {filterDate && (
             <div className="mt-6 flex items-center justify-between bg-black text-white p-4 font-mono text-[11px] uppercase tracking-[0.2em] shadow-[8px_8px_0px_0px_rgba(34,197,94,0.3)]">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-ping" />
                  <span className="font-black">Selected Date: {new Date(filterDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
               <button onClick={() => setFilterDate(null)} className="bg-white text-black px-4 py-1 font-black hover:bg-neutral-200 transition-colors">Reset Filter</button>
             </div>
          )}
        </motion.div>
      )}

      {/* LIST CONTENT */}
      {filteredItems.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center border-4 border-black border-dashed bg-white">
          <EmptyState text={filterDate ? "No reservations for this date" : "No data detected"} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredItems.map(item => (
            <motion.div 
              layout
              key={item.id} 
              className="border-2 border-black bg-white p-6 flex flex-col md:flex-row md:items-start justify-between gap-8 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all relative overflow-hidden group"
            >
              {/* SIDE STATUS ACCENT */}
              <div className={`absolute top-0 left-0 w-2 h-full ${safeStr(item.status) === 'confirmed' ? 'bg-green-500' : safeStr(item.status) === 'completed' ? 'bg-blue-500' : 'bg-orange-400 animate-pulse'}`} />
              
              <div className="flex-1 space-y-6 text-black">
                <div className="flex flex-wrap items-center gap-4">
                  <Badge variant={getStatusVariant(item.status)}>
                    {safeStr(item.status, 'Pending')}
                  </Badge>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400 font-bold uppercase tracking-widest font-black">
                    <Clock className="w-3 h-3" /> {new Date(item.createdAt).toLocaleString('id-ID')}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-neutral-50 shrink-0"><User className="w-5 h-5 text-black" /></div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono text-neutral-400 font-black uppercase">Customer</p>
                      <p className="text-md font-black truncate uppercase tracking-tighter">{safeStr(item.name, 'ANONYMOUS')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-neutral-50 shrink-0"><CalendarIcon className="w-5 h-5 text-black" /></div>
                    <div>
                      <p className="text-[10px] font-mono text-neutral-400 font-black uppercase">Schedule</p>
                      <p className="text-md font-black uppercase tracking-tighter">{safeStr(item.date)} // {safeStr(item.time)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-neutral-50 shrink-0"><Users className="w-5 h-5 text-black" /></div>
                    <div>
                      <p className="text-[10px] font-mono text-neutral-400 font-black uppercase">Guests</p>
                      <p className="text-md font-black uppercase tracking-tighter">{safeStr(item.guests)} Persons</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border-2 border-black flex items-center justify-center bg-black text-white shrink-0"><MapPin className="w-5 h-5 text-white" /></div>
                    <div>
                      <p className="text-[10px] font-mono text-neutral-400 font-black uppercase">Selected Table</p>
                      <p className="text-md font-black uppercase tracking-tighter">
                        {safeStr(item.tableName, 'N/A')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 border-2 border-black flex items-center justify-center shrink-0 ${item.preOrder?.length > 0 ? 'bg-black text-white translate-x-[-2px] translate-y-[-2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]' : 'bg-neutral-50 text-neutral-300'}`}>
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-mono text-neutral-400 font-black uppercase">Pre-order Menu</p>
                      <p className="text-md font-black uppercase text-black tracking-tighter">
                        {item.preOrder?.length > 0 ? `${item.preOrder.length} Items` : 'No orders'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* PRE-ORDER DISPLAY (Industrial Grid) */}
                {item.preOrder && item.preOrder.length > 0 && (
                  <div className="mt-6 border-2 border-dashed border-black p-5 bg-neutral-50 relative">
                    <div className="absolute top-[-10px] right-4 bg-black text-white px-3 py-0.5 font-mono text-[9px] uppercase font-bold tracking-[0.3em]">
                      Ordered Menu
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                       {item.preOrder.map((m, i) => (
                         <div key={i} className="bg-white border-2 border-black p-2 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.05)] text-black">
                           <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-mono text-[12px] font-black shrink-0">
                             {safeStr(m.qty)}
                           </div>
                           <div className="min-w-0">
                             <p className="font-black text-[10px] uppercase truncate leading-tight">{safeStr(m.name)}</p>
                             <p className="font-mono text-[9px] text-neutral-400 font-bold uppercase tracking-tighter">{safeStr(m.price)}</p>
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {item.notes && (
                  <div className="flex items-start gap-3 pt-4 border-t border-neutral-100">
                    <MessageSquare className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-neutral-500 italic uppercase leading-relaxed tracking-tight">"{safeStr(item.notes)}"</p>
                  </div>
                )}
              </div>

              {/* ACTION CENTER */}
              <div className="flex flex-row md:flex-col lg:flex-row items-stretch gap-3 pt-6 md:pt-0 border-t-2 md:border-t-0 md:border-l-2 border-black md:pl-8 shrink-0">
                {(safeStr(item.status) === 'pending' || !item.status) && (
                  <button 
                    onClick={() => handleUpdateStatus(item.id, 'confirmed')}
                    className="flex-1 md:w-full lg:flex-1 flex items-center justify-center gap-3 bg-black text-white px-6 py-4 font-mono text-[11px] font-black uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none"
                  >
                    <CheckCircle className="w-4 h-4" /> CONFIRM
                  </button>
                )}
                {safeStr(item.status) === 'confirmed' && (
                  <button 
                    onClick={() => handleUpdateStatus(item.id, 'completed')}
                    className="flex-1 md:w-full lg:flex-1 flex items-center justify-center gap-3 border-4 border-black px-6 py-4 font-mono text-[11px] font-black uppercase tracking-widest hover:bg-neutral-50 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none"
                  >
                    <CheckCircle className="w-4 h-4" /> COMPLETE
                  </button>
                )}
                <ConfirmBtn onConfirm={() => deleteReservation(item.id).then(() => showToast('Log Deleted'))} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
