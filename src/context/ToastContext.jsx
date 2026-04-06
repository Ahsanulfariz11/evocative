import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success', duration = 4000) => {
    setToast({ message, type, duration });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const value = useMemo(() => ({ showToast, hideToast }), [showToast, hideToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {toast && (
          <Toast
            key={toast.message + Date.now()}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={hideToast}
          />
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};
