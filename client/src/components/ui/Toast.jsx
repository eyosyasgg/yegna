import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id}
            className={`pointer-events-auto px-5 py-3.5 rounded-[12px] font-body text-[0.9rem] shadow-lg border-l-4 animate-fadeUp bg-white ${t.type === 'success' ? 'border-l-amber' : 'border-l-coral'}`}>
            {t.type === 'success' ? '🌱 ' : ''}{t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
