import React, { useEffect } from 'react';
import { X, Check, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Toast Types: success, error, info
const TOAST_ICONS = {
  success: <Check className="w-4 h-4 text-green-500" />,
  error: <AlertTriangle className="w-4 h-4 text-red-500" />,
  info: <Info className="w-4 h-4 text-blue-500" />,
  loading: <Loader2 className="w-4 h-4 animate-spin text-black" />,
};

const Toast = ({ message, type = 'success', duration = 4000, onClose }) => {
  useEffect(() => {
    let timeout;
    if (duration > 0) {
      timeout = setTimeout(() => {
        onClose();
      }, duration);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
      className="fixed bottom-10 left-1/2 z-[200] w-full max-w-xs"
    >
      <div className="bg-white border-2 border-black p-4 flex items-center gap-3 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="shrink-0">
          {TOAST_ICONS[type] || TOAST_ICONS.info}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[11px] uppercase font-bold tracking-tight text-black truncate">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 p-1 hover:bg-neutral-100 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default Toast;
