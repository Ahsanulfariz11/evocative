import React, { useState, useEffect } from 'react';
import { Check, X, Star, Trash2, MessageSquare, Clock } from 'lucide-react';
import { subscribeAllReviews, updateReview, deleteReview } from '../firebase';
import { useToast } from '../context/ToastContext';
import { Loader, Badge, ConfirmBtn } from './Common';

export default function ReviewsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const unsub = subscribeAllReviews(data => { 
      // Urutkan berdasarkan yang terbaru
      const sorted = data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setItems(sorted); 
      setLoading(false); 
    });
    return () => unsub?.();
  }, []);

  const handleApprove = async (id, currentStatus) => {
    try {
      await updateReview(id, { approved: !currentStatus });
      showToast(currentStatus ? 'Review hidden' : 'Review approved');
    } catch (e) { showToast('Action failed', 'error'); }
  };

  if (loading) return <Loader text="Memuat arsip review..." />;

  const pendingCount = items.filter(r => !r.approved).length;

  return (
    <div className="space-y-6 pb-16">
      {pendingCount > 0 && (
        <div className="bg-black text-white p-4 font-mono text-[10px] uppercase tracking-[0.3em] flex items-center justify-between">
          <span>Pending reviews detected: {pendingCount}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2">
        {items.map(item => (
          <div key={item.id} className={`border-2 border-black p-4 sm:p-6 transition-all ${item.approved ? 'bg-white opacity-100' : 'bg-neutral-100 opacity-80 border-dashed'}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <Badge variant={item.approved ? 'default' : 'outline'}>
                    {item.approved ? 'APPROVED' : 'PENDING'}
                  </Badge>
                  <p className="text-[10px] font-mono text-neutral-400 font-bold flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
                
                <h3 className="font-black text-sm uppercase tracking-tight text-black flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> {item.name}
                </h3>

                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < (item.rating || 5) ? 'fill-black text-black' : 'text-neutral-200'}`} />
                  ))}
                </div>

                <p className="text-sm font-medium leading-relaxed bg-white/50 p-3 border border-black/5">
                  "{item.text}"
                </p>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0">
                <button 
                  onClick={() => handleApprove(item.id, item.approved)}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 font-mono text-[10px] font-black uppercase tracking-widest transition-all border-2 border-black shadow-brutal-sm active:shadow-none active:translate-y-0.5 ${item.approved ? 'bg-white text-black hover:bg-neutral-50' : 'bg-black text-white hover:bg-neutral-800'}`}
                >
                  {item.approved ? <><X className="w-3.5 h-3.5" /> HIDE</> : <><Check className="w-3.5 h-3.5" /> APPROVE</>}
                </button>
                <div className="scale-125 origin-right sm:origin-center mt-auto sm:mt-0 flex justify-center">
                  <ConfirmBtn onConfirm={() => deleteReview(item.id)} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-[10px] font-mono text-neutral-400 py-32 border-2 border-dashed border-neutral-200 flex flex-col items-center gap-4 uppercase tracking-[0.4em] font-black italic">
          No records found
        </div>
      )}
    </div>
  );
}
