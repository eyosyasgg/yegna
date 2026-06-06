import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';

const steps = ['Mode', 'Goal', 'Profile'];
const modes = [
  { id: 'commit', label: 'Commit', badge: 'amber', desc: 'Long-term accountability partner' },
  { id: 'explore', label: 'Explore', badge: 'coral', desc: 'One-time experience companion' },
  { id: 'surprise', label: 'Surprise', badge: 'gray', desc: 'Cross-interest challenge' },
];
const cats = { commit: ['Fitness', 'Language Learning', 'Reading', 'Coding', 'Meditation', 'Other'], explore: ['Hiking', 'Cooking Class', 'Museum Visit', 'Volunteering', 'Sports', 'Other'] };
const interestTags = ['Reading', 'Fitness', 'Cooking', 'Music', 'Photography', 'Travel', 'Tech', 'Art', 'Nature', 'Writing', 'Gaming', 'Food'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState(null);
  const [goal, setGoal] = useState({});
  const [profile, setProfile] = useState({ bio: '', location: '', language: 'both' });
  const [interests, setInterests] = useState([]);
  const [openness, setOpenness] = useState(3);

  useEffect(() => {
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(j => {
      if (j.success && j.data.mode) navigate('/dashboard', { replace: true });
      else setChecking(false);
    }).catch(() => setChecking(false));
  }, [token, navigate]);

  const canContinue = () => {
    if (step === 1) return !!mode;
    if (step === 2) {
      if (mode === 'commit') return goal.category && goal.description && goal.duration_days && goal.daily_commitment;
      if (mode === 'explore') return goal.category && goal.date_from && goal.date_to;
      if (mode === 'surprise') return interests.length >= 2;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mode, goalData: mode === 'surprise' ? { interests, openness_level: openness } : goal, profileData: profile }),
      });
      const json = await res.json();
      if (!json.success) { setError(json.error); return; }
      navigate(`/dashboard?matched=${json.data.matched ? 'true' : 'pending'}`);
    } catch { setError('Something went wrong'); }
    finally { setLoading(false); }
  };

  if (checking) return <div className="min-h-screen bg-cream flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-[600px] mx-auto px-6 pt-24 pb-12">
        <div className="flex items-center justify-center gap-2 mb-16">
          {steps.map((s, i) => {
            const idx = i + 1;
            const active = idx === step;
            const done = idx < step;
            return (
              <div key={s} className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-body font-bold text-sm transition-colors ${active ? 'bg-amber text-white' : done ? 'bg-amber text-white' : 'bg-white border border-border text-warm-gray'}`}>
                    {done ? '✓' : idx}
                  </div>
                  <span className={`font-body text-[0.65rem] uppercase tracking-wider ${active ? 'text-near-black font-semibold' : 'text-warm-gray'}`}>{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`w-10 h-[2px] ${done ? 'bg-amber' : 'bg-border'}`} />}
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div className="animate-fadeUp">
            <h1 className="font-display text-[2.5rem] text-near-black">How do you want to grow?</h1>
            <p className="font-body text-warm-gray mt-2">This shapes how we'll match you.</p>
            <div className="flex flex-col gap-4 mt-8">
              {modes.map((m) => (
                <Card key={m.id} hover onClick={() => setMode(m.id)} className={`${mode === m.id ? 'border-2 border-amber bg-amber/5' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-display font-bold text-[1.25rem] text-near-black">{m.label}</h3>
                        <Badge color={m.badge}>{m.id.toUpperCase()}</Badge>
                      </div>
                      <p className="font-body text-warm-gray text-[0.9rem] mt-1">{m.desc}</p>
                    </div>
                    {mode === m.id && <span className="text-amber text-xl font-bold">✓</span>}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fadeUp">
            <h1 className="font-display text-[2.5rem] text-near-black">Tell us about your goal.</h1>
            {mode === 'commit' && (
              <div className="flex flex-col gap-4 mt-8">
                <div>
                  <label className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium">Category</label>
                  <select className="w-full bg-white border-[1.5px] border-border rounded-[12px] px-[18px] py-[14px] font-body text-[1rem] text-near-black outline-none focus:border-amber mt-1.5" value={goal.category || ''} onChange={(e) => setGoal({ ...goal, category: e.target.value })}>
                    <option value="">Select category</option>
                    {cats.commit.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <Input label="What do you want to achieve?" as="textarea" rows={3} placeholder="e.g. Run 5km without stopping" value={goal.description || ''} onChange={(e) => setGoal({ ...goal, description: e.target.value })} />
                <div>
                  <label className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium">Duration</label>
                  <select className="w-full bg-white border-[1.5px] border-border rounded-[12px] px-[18px] py-[14px] font-body text-[1rem] text-near-black outline-none focus:border-amber mt-1.5" value={goal.duration_days || ''} onChange={(e) => setGoal({ ...goal, duration_days: parseInt(e.target.value) })}>
                    <option value="">Select duration</option>
                    {[30, 60, 90].map((d) => <option key={d} value={d}>{d} days</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium">Daily Commitment</label>
                  <select className="w-full bg-white border-[1.5px] border-border rounded-[12px] px-[18px] py-[14px] font-body text-[1rem] text-near-black outline-none focus:border-amber mt-1.5" value={goal.daily_commitment || ''} onChange={(e) => setGoal({ ...goal, daily_commitment: e.target.value })}>
                    <option value="">Select daily commitment</option>
                    {['15 min', '30 min', '1 hour', '2+ hours'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )}
            {mode === 'explore' && (
              <div className="flex flex-col gap-4 mt-8">
                <div>
                  <label className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium">Activity</label>
                  <select className="w-full bg-white border-[1.5px] border-border rounded-[12px] px-[18px] py-[14px] font-body text-[1rem] text-near-black outline-none focus:border-amber mt-1.5" value={goal.category || ''} onChange={(e) => setGoal({ ...goal, category: e.target.value })}>
                    <option value="">Select activity</option>
                    {cats.explore.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <Input label="Your city" placeholder="e.g. Addis Ababa" value={goal.location || ''} onChange={(e) => setGoal({ ...goal, location: e.target.value })} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="From" type="date" value={goal.date_from || ''} onChange={(e) => setGoal({ ...goal, date_from: e.target.value })} />
                  <Input label="To" type="date" value={goal.date_to || ''} onChange={(e) => setGoal({ ...goal, date_to: e.target.value })} />
                </div>
                <Input label="Note (optional)" as="textarea" rows={2} placeholder="Any details?" value={goal.note || ''} onChange={(e) => setGoal({ ...goal, note: e.target.value })} />
              </div>
            )}
            {mode === 'surprise' && (
              <div className="flex flex-col gap-4 mt-8">
                <div>
                  <label className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium">Your Current Interests</label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {interestTags.map((tag) => {
                      const sel = interests.includes(tag);
                      return (
                        <button key={tag} onClick={() => setInterests((p) => sel ? p.filter((t) => t !== tag) : [...p, tag])}
                          className={`px-4 py-2 rounded-[9999px] font-body text-[0.85rem] transition-all cursor-pointer ${sel ? 'bg-amber text-white border-amber' : 'bg-cream-light text-near-black border-[1.5px] border-border hover:border-amber'}`}>
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                  {interests.length < 2 && <p className="font-body text-[0.8rem] text-warm-gray mt-2">Select at least 2 interests</p>}
                </div>
                <div className="mt-4">
                  <label className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium">Openness to New Experiences</label>
                  <p className="font-body text-[0.85rem] text-warm-gray mt-1">How far outside your comfort zone are you willing to go?</p>
                  <div className="mt-6">
                    <input type="range" min="1" max="5" step="1" value={openness} onChange={(e) => setOpenness(parseInt(e.target.value))}
                      className="w-full appearance-none h-1 bg-border rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-amber [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:cursor-pointer" />
                    <div className="flex justify-between mt-2">
                      <span className="font-body text-[0.8rem] text-warm-gray">Cautious</span>
                      <span className="font-body text-[0.8rem] text-warm-gray">Bold</span>
                    </div>
                    <p className="font-display text-[2rem] text-amber text-center mt-2">{openness}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="animate-fadeUp">
            <h1 className="font-display text-[2.5rem] text-near-black">Complete your profile.</h1>
            <div className="flex flex-col gap-4 mt-8">
              <Input label="About you" as="textarea" rows={3} placeholder="Tell your future partner a little about yourself..." value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
              <Input label="Your city" placeholder="e.g. Addis Ababa, Bole" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
              <div>
                <label className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium mb-2 block">Preferred Partner Language</label>
                <div className="flex gap-2">
                  {['amharic', 'english', 'both'].map((l) => (
                    <button key={l} onClick={() => setProfile({ ...profile, language: l })}
                      className={`px-5 py-2.5 rounded-[9999px] font-body text-[0.9rem] transition-all cursor-pointer ${profile.language === l ? 'bg-amber text-white' : 'bg-cream-light text-near-black border-[1.5px] border-border'}`}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="font-body text-[0.85rem] text-coral">{error}</p>}
              <Button variant="primary" className="w-full mt-4" disabled={loading} onClick={handleSubmit}>
                {loading ? <><Spinner className="!inline-block !w-5 !h-5" /> Finding your match...</> : 'Find My Match →'}
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10">
          {step > 1 ? <Button variant="secondary" onClick={() => setStep(step - 1)}>← Back</Button> : <div />}
          {step < 3 && <Button variant="primary" disabled={!canContinue()} onClick={() => setStep(step + 1)}>Continue →</Button>}
        </div>
      </div>
    </div>
  );
}
