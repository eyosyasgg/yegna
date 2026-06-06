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

export default function Explore() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newGoal, setNewGoal] = useState({ category: '', location: '', date_from: '', date_to: '', note: '' });
  const [creating, setCreating] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([getGoals('explore'), getSuggestions('explore')]).then(([g, s]) => {
      setGoals(g.data || []);
      setSuggestions(s.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [token]);

  const handleNewExplore = async () => {
    if (!newGoal.category) return;
    setCreating(true);
    try {
      await createGoal({ mode: 'explore', category: newGoal.category, location: newGoal.location, date_from: newGoal.date_from, date_to: newGoal.date_to, description: newGoal.note });
      await fetchData();
      setShowNew(false);
      setNewGoal({ category: '', location: '', date_from: '', date_to: '', note: '' });
    } catch {}
    setCreating(false);
  };

  const activities = ['Hiking', 'Cooking Class', 'Museum Visit', 'Volunteering', 'Sports', 'Food Tasting', 'Music', 'Other'];
  const filteredSuggestions = suggestions.filter((s) =>
    !search || s.category?.toLowerCase().includes(search.toLowerCase()) || s.user_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream">
      <BottomNav />
      <div className="md:ml-[200px] pt-6 pb-24 md:pb-8">
        <div className="max-w-[900px] mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-warm-gray font-medium">EXPLORE MODE</p>
              <h1 className="font-display text-[2rem] text-near-black">My Explores</h1>
            </div>
            <Button variant="primary" className="!py-2 !px-4 text-sm" onClick={() => setShowNew(true)}>+ New</Button>
          </div>

          {showNew && (
            <div className="border-2 border-dashed border-coral rounded-[16px] p-6 mb-6 bg-coral/5">
              <h3 className="font-display text-[1.15rem] text-near-black mb-4">New Explore</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {activities.map((c) => (
                  <button key={c} onClick={() => setNewGoal({ ...newGoal, category: c })}
                    className={`px-3 py-2.5 rounded-xl font-body text-[0.85rem] text-center transition-all cursor-pointer ${newGoal.category === c ? 'bg-coral text-white font-semibold' : 'bg-white border border-border hover:border-coral text-near-black'}`}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="City / area" value={newGoal.location} onChange={(e) => setNewGoal({ ...newGoal, location: e.target.value })} />
                <Input placeholder="Any notes?" value={newGoal.note} onChange={(e) => setNewGoal({ ...newGoal, note: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Input type="date" value={newGoal.date_from} onChange={(e) => setNewGoal({ ...newGoal, date_from: e.target.value })} />
                <Input type="date" value={newGoal.date_to} onChange={(e) => setNewGoal({ ...newGoal, date_to: e.target.value })} />
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="primary" className="!py-2 !px-4 text-sm" disabled={!newGoal.category || creating} onClick={handleNewExplore}>
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
                  {goals.map((g) => <CommitmentCard key={g.id} goal={g} />)}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="font-body text-warm-gray">No explores yet.</p>
                  <Button variant="secondary" className="mt-3 !py-2 !px-4 text-sm" onClick={() => setShowNew(true)}>Plan Your First Adventure</Button>
                </div>
              )}

              <hr className="border-border mb-6" />

              <div className="mb-6">
                <h2 className="font-display text-[1.3rem] text-near-black mb-1">Discover Explores</h2>
                <p className="font-body text-[0.85rem] text-warm-gray mb-4">Find experiences or people nearby.</p>
                <Input placeholder="Search activities or people..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>

              {filteredSuggestions.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSuggestions.map((s) => (
                    <SuggestionCard key={s.id} suggestion={s} onMatch={async () => {
                      await createGoal({ mode: 'explore', category: s.category, location: s.location, date_from: s.date_from, date_to: s.date_to });
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
