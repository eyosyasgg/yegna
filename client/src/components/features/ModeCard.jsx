import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function ModeCard({ mode, badgeColor, title, description, examples, onJoin }) {
  return (
    <Card className="flex flex-col h-full">
      <Badge color={badgeColor}>{mode}</Badge>
      <h3 className="font-display text-[1.5rem] text-near-black my-3">{title}</h3>
      <p className="font-body text-warm-gray flex-1 leading-relaxed">{description}</p>
      <hr className="border-border my-5" />
      <ul className="flex flex-col gap-1.5 mb-6">
        {examples.map((ex) => (
          <li key={ex} className="font-body text-[0.85rem] text-warm-gray">→ {ex}</li>
        ))}
      </ul>
      <Button variant="secondary" className="w-full" onClick={() => onJoin?.(mode.toLowerCase())}>Join as {title} →</Button>
    </Card>
  );
}
