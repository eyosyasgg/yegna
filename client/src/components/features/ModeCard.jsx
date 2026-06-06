import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const modeStyles = {
  commit: {
    accent: 'amber',
    border: 'hover:border-amber',
    bg: 'bg-amber/5',
    badgeColor: 'amber',
  },
  explore: {
    accent: 'coral',
    border: 'hover:border-coral',
    bg: 'bg-coral/5',
    badgeColor: 'coral',
  },
  surprise: {
    accent: 'near-black',
    border: 'hover:border-near-black',
    bg: 'bg-near-black/5',
    badgeColor: 'gray',
  },
};

export default function ModeCard({ mode: modeId, title, description, examples, icon, onJoin }) {
  const s = modeStyles[modeId] || modeStyles.commit;

  return (
    <Card hover className={`border-t-4 ${s.border}`}>
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl border border-border flex items-center justify-center">
          {icon || <span className={`w-5 h-5 rounded-full ${s.bg}`} />}
        </div>
        <Badge color={s.badgeColor}>{modeId.toUpperCase()}</Badge>
      </div>
      <h3 className="font-display text-[1.5rem] text-near-black my-3">{title}</h3>
      <p className="font-body text-warm-gray leading-relaxed text-[0.92rem]">{description}</p>
      <hr className="border-border my-4" />
      <div className="flex flex-wrap gap-2 mb-5">
        {examples.map((ex) => (
          <span key={ex} className={`px-3 py-1 rounded-full ${s.bg} font-body text-[0.8rem]`}>{ex}</span>
        ))}
      </div>
      <Button variant="secondary" className="w-full" onClick={() => onJoin?.(modeId)}>Join as {title} →</Button>
    </Card>
  );
}
