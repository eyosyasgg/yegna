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
  { id: 'commit', label: 'Commit', badge: 'amber', accent: 'border-amber', bg: 'bg-amber/5', text: 'text-amber', icon: '★',
    desc: 'Long-term accountability partner. Daily check-ins, shared goals, streaks.' },
  { id: 'explore', label: 'Explore', badge: 'coral', accent: 'border-coral', bg: 'bg-coral/5', text: 'text-coral', icon: '✦',
    desc: 'One-time experience companion. Try something new with a partner.' },
  { id: 'surprise', label: 'Surprise', badge: 'gray', accent: 'border-near-black', bg: 'bg-near-black/5', text: 'text-near-black', icon: '◆',
    desc: 'Cross-interest challenge. Get matched on what you love.' },
];

const cats = {
  commit: ['Fitness', 'Language Learning', 'Reading', 'Coding', 'Meditation', 'Writing', 'Art', 'Other'],
  explore: ['Hiking', 'Cooking Class', 'Museum Visit', 'Volunteering', 'Sports', 'Food Tasting', 'Music', 'Other'],
};
const interestTags = ['Reading', 'Fitness', 'Cooking', 'Music', 'Photography', 'Travel', 'Tech', 'Art', 'Nature', 'Writing', 'Gaming', 'Food', 'Yoga', 'Dancing'];

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

  const modeAccent = (id) => modes.find((m) => m.id === id);
  const currentMode = modeAccent(mode);
  const accent = currentMode || { accent: 'border-amber', bg: 'bg-amber/5', text: 'text-amber' };

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
    setLoading(true); setError('');
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
      <div className="max-w-[580px] mx-auto px-6 pt-20 pb-12">
        <div className="flex items-center justify-between mb-12">
          {steps.map((s, i) => {
            const idx = i + 1;
            const active = idx === step;
            const done = idx < step;
            const isCurrentStep = active || done;
            return (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 ${i > 0 ? 'ml-2' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-body font-bold text-xs transition-all duration-300 ${active ? `${accent.bg} ${accent.text} border-2 ${accent.accent}` : done ? 'bg-amber text-white' : 'bg-white border border-border text-warm-gray'}`}>
                    {done ? '✓' : idx}
                  </div>
                  <span className={`font-body text-[0.65rem] uppercase tracking-wider hidden sm:inline ${active ? 'text-near-black font-semibold' : 'text-warm-gray'}`}>{s}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-[1px] ${isCurrentStep ? 'bg-amber' : 'bg-border'}`} />}
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div className="animate-fadeUp">
            <h1 className="font-display text-[2.5rem] text-near-black">How do you want to grow?</h1>
            <p className="font-body text-warm-gray mt-2 mb-8">Your mode shapes who we match you with.</p>
            <div className="flex flex-col gap-3">
              {modes.map((m) => {
                const sel = mode === m.id;
                return (
                  <Card key={m.id} hover onClick={() => setMode(m.id)}
                    className={`${sel ? `border-2 ${m.accent} ${m.bg}` : ''} transition-all duration-200`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${sel ? m.bg : 'bg-white border border-border'} flex items-center justify-center font-body font-bold text-lg ${m.text} flex-shrink-0`}>
                        {m.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-[1.15rem] text-near-black">{m.label}</h3>
                          <Badge color={m.badge}>{m.id.toUpperCase()}</Badge>
                        </div>
                        <p className="font-body text-warm-gray text-[0.85rem] mt-0.5">{m.desc}</p>
                      </div>
                      {sel && <span className={`${m.text} text-lg font-bold`}>✓</span>}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && mode && (
          <div className="animate-fadeUp">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-8 h-8 rounded-lg ${accent.bg} flex items-center justify-center font-body font-bold text-sm ${accent.text}`}>
                {currentMode?.icon}
              </div>
              <div>
                <p className="font-body text-[0.7rem] uppercase tracking-wider text-warm-gray font-medium">{currentMode?.label} MODE</p>
                <h1 className="font-display text-[2.2rem] text-near-black leading-tight">Set your goal</h1>
              </div>
            </div>

            {mode === 'commit' && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  {cats.commit.map((c) => (
                    <button key={c} onClick={() => setGoal({ ...goal, category: c })}
                      className={`px-4 py-3 rounded-xl font-body text-[0.9rem] text-center transition-all cursor-pointer ${goal.category === c ? `${accent.bg} ${accent.text} font-semibold border-2 ${accent.accent}` : 'bg-white border-[1.5px] border-border hover:border-amber text-near-black'}`}>
                      {c}
                    </button>
                  ))}
                </div>
                <Input label="What do you want to achieve?" as="textarea" rows={3} placeholder="e.g. Run 5km without stopping" value={goal.description || ''} onChange={(e) => setGoal({ ...goal, description: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <select className="bg-white border-[1.5px] border-border rounded-[12px] px-[16px] py-[14px] font-body text-[0.95rem] text-near-black outline-none focus:border-amber" value={goal.duration_days || ''} onChange={(e) => setGoal({ ...goal, duration_days: parseInt(e.target.value) })}>
                    <option value="">Duration</option>
                    {[30, 60, 90, 180].map((d) => <option key={d} value={d}>{d} days</option>)}
                  </select>
                  <select className="bg-white border-[1.5px] border-border rounded-[12px] px-[16px] py-[14px] font-body text-[0.95rem] text-near-black outline-none focus:border-amber" value={goal.daily_commitment || ''} onChange={(e) => setGoal({ ...goal, daily_commitment: e.target.value })}>
                    <option value="">Daily time</option>
                    {['15 min', '30 min', '1 hour', '2+ hours'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )}

            {mode === 'explore' && (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  {cats.explore.map((c) => (
                    <button key={c} onClick={() => setGoal({ ...goal, category: c })}
                      className={`px-4 py-3 rounded-xl font-body text-[0.9rem] text-center transition-all cursor-pointer ${goal.category === c ? `${accent.bg} ${accent.text} font-semibold border-2 ${accent.accent}` : 'bg-white border-[1.5px] border-border hover:border-coral text-near-black'}`}>
                      {c}
                    </button>
                  ))}
                </div>
                <Input label="Your city / area" placeholder="e.g. Addis Ababa" value={goal.location || ''} onChange={(e) => setGoal({ ...goal, location: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="From" type="date" value={goal.date_from || ''} onChange={(e) => setGoal({ ...goal, date_from: e.target.value })} />
                  <Input label="To" type="date" value={goal.date_to || ''} onChange={(e) => setGoal({ ...goal, date_to: e.target.value })} />
                </div>
                <Input label="Note (optional)" as="textarea" rows={2} placeholder="Any preferences or details?" value={goal.note || ''} onChange={(e) => setGoal({ ...goal, note: e.target.value })} />
              </div>
            )}

            {mode === 'surprise' && (
              <div className="flex flex-col gap-4">
                <p className="font-body text-[0.9rem] text-warm-gray">Select at least 2 interests. We'll match you with someone whose interests complement yours.</p>
                <div className="flex flex-wrap gap-2">
                  {interestTags.map((tag) => {
                    const sel = interests.includes(tag);
                    return (
                      <button key={tag} onClick={() => setInterests((p) => sel ? p.filter((t) => t !== tag) : [...p, tag])}
                        className={`px-4 py-2.5 rounded-[9999px] font-body text-[0.85rem] transition-all cursor-pointer ${sel ? 'bg-near-black text-white' : 'bg-white text-near-black border-[1.5px] border-border hover:border-near-black'}`}>
                        {tag}
                      </button>
                    );
                  })}
                </div>
                {interests.length < 2 && <p className="font-body text-[0.8rem] text-warm-gray">Pick at least {2 - interests.length} more</p>}

                <div className="mt-4">
                  <p className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium mb-1">Openness to new experiences</p>
                  <p className="font-body text-[0.85rem] text-warm-gray">How far outside your comfort zone?</p>
                  <input type="range" min="1" max="5" step="1" value={openness} onChange={(e) => setOpenness(parseInt(e.target.value))}
                    className="w-full appearance-none h-1.5 bg-border rounded-full outline-none mt-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-near-black [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:cursor-pointer" />
                  <div className="flex justify-between mt-2">
                    <span className="font-body text-[0.8rem] text-warm-gray">Cautious</span>
                    <span className="font-body text-[0.8rem] text-warm-gray">Bold</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="animate-fadeUp">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-8 h-8 rounded-lg ${accent.bg} flex items-center justify-center font-body font-bold text-sm ${accent.text}`}>
                {currentMode?.icon}
              </div>
              <div>
                <p className="font-body text-[0.7rem] uppercase tracking-wider text-warm-gray font-medium">{currentMode?.label} MODE</p>
                <h1 className="font-display text-[2.2rem] text-near-black leading-tight">Complete your profile</h1>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Input label="About you" as="textarea" rows={3} placeholder="Tell your future partner about yourself..." value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
              <Input label="Your city" placeholder="e.g. Addis Ababa" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
              <div>
                <p className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium mb-2">Preferred language</p>
                <div className="flex gap-2">
                  {['amharic', 'english', 'both'].map((l) => (
                    <button key={l} onClick={() => setProfile({ ...profile, language: l })}
                      className={`px-5 py-2.5 rounded-[9999px] font-body text-[0.9rem] transition-all cursor-pointer ${profile.language === l ? `bg-near-black text-white` : 'bg-white text-near-black border-[1.5px] border-border hover:border-near-black'}`}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p className="font-body text-[0.85rem] text-coral">{error}</p>}
              <Button variant="primary" className="w-full mt-2" disabled={loading} onClick={handleSubmit}>
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
