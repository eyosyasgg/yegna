import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import CommitmentCard from '../components/features/CommitmentCard';
import SuggestionCard from '../components/features/SuggestionCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { getGoals, getSuggestions, createGoal } from '../api/goals';

export default function Commit() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newGoal, setNewGoal] = useState({ category: '', description: '', duration_days: 90, daily_commitment: '30 min' });
  const [creating, setCreating] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([getGoals('commit'), getSuggestions('commit')]).then(([g, s]) => {
      setGoals(g.data || []);
      setSuggestions(s.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleNewCommitment = async () => {
    if (!newGoal.category) return;
    setCreating(true);
    try {
      const res = await createGoal({ mode: 'commit', ...newGoal });
      await fetchData();
      setShowNew(false);
      setNewGoal({ category: '', description: '', duration_days: 90, daily_commitment: '30 min' });
    } catch {}
    setCreating(false);
  };

  const cats = ['Fitness', 'Language Learning', 'Reading', 'Coding', 'Meditation', 'Writing', 'Art', 'Other'];
  const filteredSuggestions = suggestions.filter((s) =>
    !search || s.category?.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase()) || s.user_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream">
      <BottomNav />
      <div className="md:ml-[200px] pt-6 pb-24 md:pb-8">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-warm-gray font-medium">COMMIT MODE</p>
              <h1 className="font-display text-[2rem] text-near-black">My Commitments</h1>
            </div>
            <Button variant="primary" className="!py-2 !px-4 text-sm" onClick={() => setShowNew(true)}>+ New</Button>
          </div>

          {showNew && (
            <div className="border-2 border-dashed border-amber rounded-[16px] p-6 mb-6 bg-amber/5">
              <h3 className="font-display text-[1.15rem] text-near-black mb-4">New Commitment</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {cats.map((c) => (
                  <button key={c} onClick={() => setNewGoal({ ...newGoal, category: c })}
                    className={`px-3 py-2.5 rounded-xl font-body text-[0.85rem] text-center transition-all cursor-pointer ${newGoal.category === c ? 'bg-amber text-white font-semibold' : 'bg-white border border-border hover:border-amber text-near-black'}`}>
                    {c}
                  </button>
                ))}
              </div>
              <Input as="textarea" rows={2} placeholder="What do you want to achieve?" value={newGoal.description} onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3 mt-3">
                <select className="bg-white border border-border rounded-[12px] px-3 py-2.5 font-body text-[0.85rem] outline-none focus:border-amber" value={newGoal.duration_days} onChange={(e) => setNewGoal({ ...newGoal, duration_days: parseInt(e.target.value) })}>
                  {[30, 60, 90, 180].map((d) => <option key={d} value={d}>{d} days</option>)}
                </select>
                <select className="bg-white border border-border rounded-[12px] px-3 py-2.5 font-body text-[0.85rem] outline-none focus:border-amber" value={newGoal.daily_commitment} onChange={(e) => setNewGoal({ ...newGoal, daily_commitment: e.target.value })}>
                  {['15 min', '30 min', '1 hour', '2+ hours'].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="primary" className="!py-2 !px-4 text-sm" disabled={!newGoal.category || creating} onClick={handleNewCommitment}>
                  {creating ? 'Creating...' : 'Create & Match →'}
                </Button>
                <Button variant="secondary" className="!py-2 !px-4 text-sm" onClick={() => setShowNew(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {loading ? <Spinner className="py-12" /> : (
            <>
              {goals.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4 mb-10">
                  {goals.map((g) => <CommitmentCard key={g.id} goal={g} onCheckin={() => navigate('/profile')} onView={() => navigate('/profile')} />)}
                </div>
              ) : (
                <div className="text-center py-12 text-warm-glass">
                  <p className="font-body text-warm-gray">No commitments yet.</p>
                  <Button variant="secondary" className="mt-3 !py-2 !px-4 text-sm" onClick={() => setShowNew(true)}>Start Your First Commitment</Button>
                </div>
              )}

              <hr className="border-border mb-6" />

              <div className="mb-6">
                <h2 className="font-display text-[1.3rem] text-near-black mb-1">Discover Commitments</h2>
                <p className="font-body text-[0.85rem] text-warm-gray mb-4">Find people with similar goals or search for something new.</p>
                <Input placeholder="Search by category, goal, or name..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>

              {filteredSuggestions.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSuggestions.map((s) => (
                    <SuggestionCard key={s.id} suggestion={s} onMatch={async () => {
                      await createGoal({ mode: 'commit', category: s.category, description: s.description, duration_days: s.duration_days, daily_commitment: s.daily_commitment });
                      fetchData();
                    }} />
                  ))}
                </div>
              ) : (
                <p className="font-body text-warm-gray italic text-center py-8">
                  {search ? 'No results found.' : 'No suggestions right now. Check back later!'}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
