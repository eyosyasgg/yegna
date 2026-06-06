export default function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-cream-light border border-border rounded-[16px] p-8 shadow-[0_2px_16px_rgba(28,26,24,0.06)] ${hover ? 'cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(28,26,24,0.1)] transition-all duration-200' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
