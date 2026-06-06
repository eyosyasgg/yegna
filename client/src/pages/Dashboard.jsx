import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import MatchCard from '../components/features/MatchCard';
import ActivityFeed from '../components/features/ActivityFeed';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { getMatch } from '../api/match';

export default function Dashboard() {
  const { user, token } = useAuth();
  const [params] = useSearchParams();
  const isPending = params.get('matched') === 'pending';
  const [matchData, setMatchData] = useState(null);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMatch = () => {
    if (!token) return;
    setLoading(true);
    getMatch().then((res) => setMatchData(res.data || null)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!token) return;
    fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(j => { if (j.success) setGoal(j.data.goal); }).catch(() => {});
    fetchMatch();
  }, [token]);

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <div className="md:ml-[280px] pt-20 pb-24 md:pb-8">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          {isPending && (
            <div className="border-[1.5px] border-dashed border-amber bg-amber/5 rounded-[16px] p-6 mb-8 flex items-center gap-4">
              <span className="w-3 h-3 rounded-full bg-amber animate-pulse-dot" />
              <div>
                <p className="font-body font-semibold text-near-black">Finding your perfect match...</p>
                <p className="font-body text-[0.85rem] text-warm-gray">We'll pair you with someone who shares your goal. Check back soon.</p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h1 className="font-display text-[2rem] text-near-black">Welcome back, {user?.name?.split(' ')[0] || 'there'}.</h1>
            {goal?.description && <p className="font-body text-warm-gray mt-1">{goal.description}</p>}
          </div>

          <div id="match" className="mb-8">
            <h3 className="font-body font-semibold text-[0.85rem] uppercase tracking-[0.1em] text-warm-gray mb-4">Your Match</h3>
            {loading ? <Spinner className="py-12" /> : <MatchCard matchData={matchData} user={user} goal={goal} onCheckin={fetchMatch} />}
          </div>

          <div id="activity"><ActivityFeed /></div>
        </div>
      </div>
    </div>
  );
}
