import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import MatchCard from '../components/features/MatchCard';
import ActivityFeed from '../components/features/ActivityFeed';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { getMatch } from '../api/match';

const modeConfig = {
  commit: { accent: 'amber', bg: 'bg-amber/5', text: 'text-amber', border: 'border-amber', label: 'Commit', icon: '★' },
  explore: { accent: 'coral', bg: 'bg-coral/5', text: 'text-coral', border: 'border-coral', label: 'Explore', icon: '✦' },
  surprise: { accent: 'near-black', bg: 'bg-near-black/5', text: 'text-near-black', border: 'border-near-black', label: 'Surprise', icon: '◆' },
};

export default function Dashboard() {
  const { user, token } = useAuth();
  const [params] = useSearchParams();
  const isPending = params.get('matched') === 'pending';
  const [matchData, setMatchData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const uMode = profile?.user?.mode || user?.mode || '';
  const mc = modeConfig[uMode] || modeConfig.commit;
  const goal = profile?.goal;
  const totalCheckins = profile?.totalCheckins || 0;

  const fetchMatch = () => {
    if (!token) return;
    setLoading(true);
    getMatch().then((res) => setMatchData(res.data || null)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!token) return;
    fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(j => { if (j.success) setProfile(j.data); }).catch(() => {});
    fetchMatch();
  }, [token]);

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <div className="md:ml-[280px] pt-20 pb-24 md:pb-8">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          {isPending && (
            <div className={`border-[1.5px] border-dashed ${mc.border} ${mc.bg} rounded-[16px] p-6 mb-8 flex items-center gap-4`}>
              <span className={`w-3 h-3 rounded-full ${mc.bg} animate-pulse-dot`} />
              <div>
                <p className="font-body font-semibold text-near-black">Finding your perfect match...</p>
                <p className="font-body text-[0.85rem] text-warm-gray">We'll pair you with someone who shares your goal. Check back soon.</p>
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center gap-3">
              {uMode && (
                <div className={`w-8 h-8 rounded-lg ${mc.bg} flex items-center justify-center font-body font-bold text-sm ${mc.text}`}>
                  {mc.icon}
                </div>
              )}
              <div>
                <p className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-warm-gray font-medium">{uMode ? `${mc.label} MODE` : ''}</p>
                <h1 className="font-display text-[2rem] text-near-black">Welcome back, {user?.name?.split(' ')[0] || 'there'}.</h1>
              </div>
            </div>
            {goal?.description && <p className="font-body text-warm-gray mt-2 ml-11">{goal.description}</p>}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className={`border-l-4 ${mc.border}`}>
              <p className="font-body text-[0.7rem] uppercase tracking-[0.1em] text-warm-gray font-medium">Streak</p>
              <p className={`font-display text-[2rem] ${mc.text} mt-1`}>{profile?.user?.current_streak || 0}<span className="font-body text-[0.9rem] text-warm-gray"> days</span></p>
            </Card>
            <Card className={`border-l-4 ${mc.border}`}>
              <p className="font-body text-[0.7rem] uppercase tracking-[0.1em] text-warm-gray font-medium">Check-ins</p>
              <p className={`font-display text-[2rem] ${mc.text} mt-1`}>{totalCheckins}</p>
            </Card>
            <Card className={`border-l-4 ${mc.border}`}>
              <p className="font-body text-[0.7rem] uppercase tracking-[0.1em] text-warm-gray font-medium">Matched</p>
              <p className={`font-display text-[2rem] ${mc.text} mt-1`}>{matchData?.matched ? 'Yes' : 'Pending'}</p>
            </Card>
          </div>

          <div id="match" className="mb-8">
            <h3 className="font-body font-semibold text-[0.85rem] uppercase tracking-[0.1em] text-warm-gray mb-4">Your Match</h3>
            {loading ? <Spinner className="py-12" /> : <MatchCard matchData={matchData} user={user} profile={profile} goal={goal} onCheckin={fetchMatch} />}
          </div>

          <div id="activity"><ActivityFeed /></div>
        </div>
      </div>
    </div>
  );
}
