const uid = () => Math.random().toString(36).slice(2, 8);

export default function Input({ label, error, as, id, className = '', ...props }) {
  const inputId = id || (label ? `input-${uid()}` : undefined);
  const inputClass = 'w-full bg-white border-[1.5px] border-border rounded-[12px] px-[18px] py-[14px] font-body text-[1rem] text-near-black placeholder-warm-gray outline-none transition-all duration-200 focus:border-amber focus:shadow-[0_0_0_3px_rgba(245,166,35,0.15)]';
  const Tag = as === 'textarea' ? 'textarea' : 'input';

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium">{label}</label>}
      <Tag id={inputId} className={`${inputClass} ${as === 'textarea' ? 'resize-none' : ''} ${className}`} {...props} />
      {error && <span className="font-body text-[0.85rem] text-coral mt-0.5">{error}</span>}
    </div>
  );
}
