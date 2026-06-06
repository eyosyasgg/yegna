import { useState, useEffect } from 'react';
import BottomNav from '../components/layout/BottomNav';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { getSurprise, createGoal } from '../api/goals';

const modeColors = {
  commit: { accent: 'amber', badge: 'amber', bg: 'bg-amber/5', label: 'Commit' },
  explore: { accent: 'coral', badge: 'coral', bg: 'bg-coral/5', label: 'Explore' },
  surprise: { accent: 'near-black', badge: 'gray', bg: 'bg-near-black/5', label: 'Surprise' },
};

export default function Surprise() {
  const { token } = useAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(null);

  const refresh = () => {
    setLoading(true);
    getSurprise().then((res) => setSuggestions(res.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, [token]);

  const handleMatch = async (s) => {
    setMatching(s.id);
    try {
      await createGoal({
        mode: s.mode,
        category: s.category,
        description: s.description,
        duration_days: s.duration_days,
        daily_commitment: s.daily_commitment,
        location: s.location,
        date_from: s.date_from,
        date_to: s.date_to,
      });
      refresh();
    } catch {}
    setMatching(null);
  };

  return (
    <div className="min-h-screen bg-cream">
      <BottomNav />
      <div className="md:ml-[200px] pt-6 pb-24 md:pb-8">
        <div className="max-w-[700px] mx-auto px-6">
          <div className="text-center mb-8">
            <span className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-warm-gray font-medium">SURPRISE MODE</span>
            <h1 className="font-display text-[2.5rem] text-near-black mt-1">Something Unexpected</h1>
            <p className="font-body text-warm-gray mt-2">Three random challenges picked just for you. Step outside your comfort zone.</p>
          </div>

          {loading ? <Spinner className="py-16" /> : (
            <>
              {suggestions.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {suggestions.map((s, i) => {
                    const mc = modeColors[s.mode] || modeColors.surprise;
                    const initials = s.user_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
                    return (
                      <Card key={s.id} className="relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-1 ${mc.bg}`} />
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-cream-light border border-border flex items-center justify-center font-display font-bold text-near-black text-lg flex-shrink-0">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-display font-bold text-[1.15rem] text-near-black">{s.category || 'Challenge'}</h3>
                              <Badge color={mc.badge}>{mc.label}</Badge>
                            </div>
                            {s.description && <p className="font-body text-[0.9rem] text-warm-gray mt-1">{s.description}</p>}
                            <div className="flex items-center gap-2 mt-3">
                              <div className="w-6 h-6 rounded-full bg-near-black/10 text-near-black flex items-center justify-center font-body font-bold text-[0.55rem]">{initials}</div>
                              <span className="font-body text-[0.8rem] text-warm-gray">{s.user_name}</span>
                            </div>
                            <Button variant="primary" className="!py-2 !px-4 text-sm mt-3" disabled={matching === s.id} onClick={() => handleMatch(s)}>
                              {matching === s.id ? 'Matching...' : 'Take This Challenge →'}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <span className="text-[4rem]">🎲</span>
                  <p className="font-body text-warm-gray mt-4">No surprises right now.</p>
                </div>
              )}

              <div className="text-center mt-8">
                <Button variant="secondary" onClick={refresh} disabled={loading}>Roll Again 🎲</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
