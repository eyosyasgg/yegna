export default function Button({ variant = 'primary', children, className = '', disabled, onClick, type = 'button' }) {
  const base = 'font-body font-semibold text-[0.95rem] px-8 py-[14px] rounded-[9999px] transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-amber text-white hover:bg-amber-light hover:-translate-y-[1px] hover:shadow-[0_4px_20px_rgba(245,166,35,0.35)]',
    secondary: 'bg-cream-light text-near-black border-[1.5px] border-border hover:bg-white hover:border-amber',
    danger: 'bg-coral text-white hover:opacity-90',
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
