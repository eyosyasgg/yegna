export default function Badge({ children, color = 'gray', className = '' }) {
  const styles = {
    amber: 'bg-amber/15',
    coral: 'bg-coral/15',
    gray: 'bg-warm-gray/15',
  };
  const textColors = { amber: '#B87D0E', coral: '#B84537', gray: '#5A5652' };
  return (
    <span className={`inline-block font-body font-semibold text-[0.7rem] uppercase tracking-[0.06em] px-3 py-1 rounded-[9999px] ${styles[color]} ${className}`}
      style={{ color: textColors[color] }}>
      {children}
    </span>
  );
}
