export function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-xl bg-[var(--color-white)] border border-[var(--color-border)] p-4 ${className}`}>
      <div className="animate-skeleton h-4 w-24 rounded bg-[var(--color-warm-gray)] mb-3" />
      <div className="animate-skeleton h-3 w-40 rounded bg-[var(--color-warm-gray)] mb-2" />
      <div className="animate-skeleton h-3 w-32 rounded bg-[var(--color-warm-gray)] mb-4" />
      <div className="animate-skeleton h-2 w-full rounded bg-[var(--color-warm-gray)]" />
    </div>
  );
}

export function SkeletonLine({ width = 'w-full', height = 'h-4', className = '' }) {
  return (
    <div className={`animate-skeleton rounded bg-[var(--color-warm-gray)] ${width} ${height} ${className}`} />
  );
}

export function SkeletonAvatar({ size = 'w-12 h-12', className = '' }) {
  return (
    <div className={`animate-skeleton rounded-full bg-[var(--color-warm-gray)] ${size} ${className}`} />
  );
}
