import { useEffect } from 'react';

export default function Modal({ children, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-near-black/50 animate-fadeIn" onClick={onClose}>
      <div className="bg-cream-light rounded-[20px] p-10 max-w-[480px] w-[90%] shadow-2xl animate-slideIn" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
