import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const labels = {
  commit: { accent: 'amber', badge: 'amber', bg: 'bg-amber/5', label: 'Commit' },
  explore: { accent: 'coral', badge: 'coral', bg: 'bg-coral/5', label: 'Explore' },
  surprise: { accent: 'near-black', badge: 'gray', bg: 'bg-near-black/5', label: 'Surprise' },
};

export default function SuggestionCard({ suggestion, onMatch }) {
  const s = labels[suggestion.mode] || labels.commit;
  const initials = suggestion.user_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <Card className="border border-dashed border-border">
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-full ${s.bg} text-near-black flex items-center justify-center font-body font-bold text-xs flex-shrink-0`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-body font-semibold text-[0.9rem] text-near-black truncate">{suggestion.user_name}</h4>
            <Badge color={s.badge}>{s.label}</Badge>
          </div>
          <p className="font-body text-[0.85rem] text-warm-gray mt-0.5">{suggestion.category || 'Goal'}</p>
          {suggestion.description && <p className="font-body text-[0.8rem] text-warm-gray truncate">{suggestion.description}</p>}
          {suggestion.user_location && <p className="font-body text-[0.75rem] text-warm-gray mt-0.5">{suggestion.user_location}</p>}
        </div>
      </div>
      {onMatch && (
        <Button variant="secondary" className="w-full !py-2 !px-4 text-sm mt-3" onClick={() => onMatch(suggestion)}>
          Match →
        </Button>
      )}
    </Card>
  );
}
