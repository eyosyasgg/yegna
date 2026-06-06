export default function BadgeIcon({ badge }) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-[72px]">
      <div className="w-12 h-12 rounded-full bg-cream-light border border-border flex items-center justify-center text-[1.4rem] shadow-sm">
        {badge.icon || '🏆'}
      </div>
      <span className="font-body text-[0.65rem] text-warm-gray text-center leading-tight">{badge.name}</span>
    </div>
  );
}
