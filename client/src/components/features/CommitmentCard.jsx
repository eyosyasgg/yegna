import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ProgressRing from '../ui/ProgressRing';

const modeStyles = {
  commit: { accent: 'amber', bg: 'bg-amber/5', border: 'border-amber/30', badge: 'amber', label: 'Commit' },
  explore: { accent: 'coral', bg: 'bg-coral/5', border: 'border-coral/30', badge: 'coral', label: 'Explore' },
  surprise: { accent: 'near-black', bg: 'bg-near-black/5', border: 'border-near-black/30', badge: 'gray', label: 'Surprise' },
};

export default function CommitmentCard({ goal, onCheckin, onView }) {
  const ms = modeStyles[goal.mode] || modeStyles.commit;
  const partner = goal.partner;
  const progress = goal.duration_days ? Math.min(100, Math.round(((goal.daysActive || 0) / goal.duration_days) * 100)) : 0;

  return (
    <Card hover className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${ms.border.replace('border', 'bg')}`} />
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl ${ms.bg} flex items-center justify-center font-body font-bold text-sm flex-shrink-0`}>
          {goal.category?.charAt(0) || 'G'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display font-bold text-[1.05rem] text-near-black truncate">{goal.category || 'Goal'}</h3>
            <Badge color={ms.badge}>{ms.label}</Badge>
          </div>
          {goal.description && <p className="font-body text-[0.85rem] text-warm-gray mt-0.5 truncate">{goal.description}</p>}
        </div>
      </div>

      {partner && (
        <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-cream-light">
          <div className="w-9 h-9 rounded-full bg-amber/30 text-near-black flex items-center justify-center font-body font-bold text-xs flex-shrink-0">
            {partner.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-body text-[0.85rem] text-near-black font-medium truncate">{partner.name}</p>
            <p className="font-body text-[0.75rem] text-warm-gray">Streak: {partner.streak || 0} days</p>
          </div>
          <div className="text-right">
            <p className="font-body font-bold text-near-black text-sm">{goal.daysActive || 0}</p>
            <p className="font-body text-[0.65rem] text-warm-gray uppercase tracking-wider">Days</p>
          </div>
        </div>
      )}

      {goal.mode === 'commit' && goal.duration_days > 0 && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex-1">
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div className={`h-full rounded-full ${ms.bg} transition-all`} style={{ width: `${progress}%` }} />
            </div>
            <p className="font-body text-[0.7rem] text-warm-gray mt-1">{progress}% · {goal.duration_days} day goal</p>
          </div>
          <ProgressRing percent={progress} size={40} />
        </div>
      )}

      {goal.mode === 'explore' && goal.date_from && (
        <div className="mt-3 font-body text-[0.8rem] text-warm-gray">
          {goal.date_from}{goal.date_to ? ` → ${goal.date_to}` : ''}
        </div>
      )}

      {goal.mode === 'surprise' && goal.interests?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {goal.interests.map((t) => (
            <span key={t} className={`px-2.5 py-0.5 rounded-full text-[0.7rem] ${ms.bg}`}>{t}</span>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        {onCheckin && <Button variant="primary" className="!py-2 !px-4 text-sm flex-1" onClick={() => onCheckin(goal)}>Check In</Button>}
        {onView && <Button variant="secondary" className="!py-2 !px-4 text-sm" onClick={() => onView(goal)}>View</Button>}
      </div>
    </Card>
  );
}
