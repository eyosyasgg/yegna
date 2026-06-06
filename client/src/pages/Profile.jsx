import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';

const modeConfig = {
  commit: { accent: 'amber', bg: 'bg-amber/5', text: 'text-amber', border: 'border-amber', label: 'Commit', icon: '★' },
  explore: { accent: 'coral', bg: 'bg-coral/5', text: 'text-coral', border: 'border-coral', label: 'Explore', icon: '✦' },
  surprise: { accent: 'near-black', bg: 'bg-near-black/5', text: 'text-near-black', border: 'border-near-black', label: 'Surprise', icon: '◆' },
};

export default function Profile() {
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: '', location: '', language: 'both' });
  const [saving, setSaving] = useState(false);
  const [checkins, setCheckins] = useState([]);

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  const u = profile?.user;
  const g = profile?.goal;
  const partner = profile?.partner;
  const totalCheckins = profile?.totalCheckins || 0;
  const uMode = u?.mode || '';
  const mc = modeConfig[uMode] || modeConfig.commit;

  useEffect(() => {
    if (!token) return;
    fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(j => {
      if (j.success) {
        setProfile(j.data);
        setForm({ bio: j.data.user?.bio || '', location: j.data.user?.location || '', language: j.data.user?.language || 'both' });
      }
    }).catch(() => {}).finally(() => setLoading(false));
    fetch('/api/checkins', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).then(j => { if (j.success) setCheckins(j.data); }).catch(() => {});
  }, [token]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      const json = await res.json();
      if (json.success) { setProfile((p) => ({ ...p, user: { ...p.user, ...json.data } })); setEditing(false); addToast('Profile updated!', 'success'); }
    } catch {}
    finally { setSaving(false); }
  };

  if (loading) return <div className="min-h-screen bg-cream flex items-center justify-center"><Spinner /></div>;

  const last7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });

  const fields = uMode === 'commit' ? [
    ['Category', g?.category || '—'],
    ['Duration', g?.duration_days ? `${g.duration_days} days` : '—'],
    ['Daily Commitment', g?.daily_commitment || '—'],
    ['Goal', g?.description || '—'],
  ] : uMode === 'explore' ? [
    ['Activity', g?.category || '—'],
    ['Location', g?.location || '—'],
    ['Date Window', g?.date_from && g?.date_to ? `${g.date_from} → ${g.date_to}` : '—'],
    ['Note', g?.note || '—'],
  ] : uMode === 'surprise' ? [
    ['Interests', g?.interests ? JSON.parse(g.interests).join(', ') : '—'],
    ['Openness Level', `${g?.openness_level || 3}/5`],
  ] : [];

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <div className="md:ml-[280px] pt-20 pb-24 md:pb-8">
        <div className="max-w-[800px] mx-auto px-6 md:px-12">
          <Card>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className={`w-20 h-20 rounded-full ${mc.bg} text-near-black flex items-center justify-center font-display text-[1.75rem] flex-shrink-0 border-2 ${mc.border}`}>
                {initials}
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="w-full">
                    <div className="flex items-center gap-2">
                      <h1 className="font-display text-[2rem] text-near-black">{u?.name || 'User'}</h1>
                      {uMode && <Badge color={mc.accent}>{mc.label}</Badge>}
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {u?.location && <span className="font-body text-[0.85rem] text-warm-gray">{u.location}</span>}
                      {u?.language && <Badge color="gray">{u.language}</Badge>}
                    </div>
                    <p className="font-body text-warm-gray mt-2 max-w-[480px] leading-relaxed">{u?.bio || 'No bio yet.'}</p>
                  </div>
                  <Button variant="secondary" className="!py-2 !px-4 text-sm flex-shrink-0" onClick={() => setEditing(!editing)}>
                    {editing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
                {editing && (
                  <div className="mt-6 space-y-4 border-t border-border pt-6">
                    <Input label="About you" as="textarea" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
                    <Input label="Your city" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    <div>
                      <label className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium block mb-2">Language</label>
                      <div className="flex gap-2 flex-wrap">
                        {['amharic', 'english', 'both'].map((l) => (
                          <button key={l} onClick={() => setForm({ ...form, language: l })}
                            className={`px-4 py-2 rounded-[9999px] font-body text-[0.85rem] transition-all cursor-pointer ${form.language === l ? 'bg-near-black text-white' : 'bg-white text-near-black border border-border'}`}>
                            {l.charAt(0).toUpperCase() + l.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                      <Button variant="primary" className="!py-2 !px-5" disabled={saving} onClick={handleSave}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                      <Button variant="secondary" className="!py-2 !px-5" onClick={() => setEditing(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              {uMode && <div className={`w-6 h-6 rounded-lg ${mc.bg} flex items-center justify-center font-body font-bold text-xs ${mc.text}`}>{mc.icon}</div>}
              <h2 className="font-display text-[1.25rem] text-near-black">{uMode ? `${mc.label} Goal` : 'Goal'}</h2>
            </div>
            {fields.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {fields.map(([label, value]) => (
                  <div key={label}>
                    <span className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium">{label}</span>
                    <p className="font-body text-near-black mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body text-warm-gray italic">No goal set yet.</p>
            )}
            <hr className="border-border my-4" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3">
              {[
                ['Partner', partner?.name || 'Pending'],
                ['Total Check-ins', totalCheckins.toString()],
                ['Current Streak', `${u?.current_streak || 0} days`],
                ['Longest Streak', `${u?.longest_streak || 0} days`],
              ].map(([label, value]) => (
                <div key={label}>
                  <span className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium">{label}</span>
                  <p className="font-body text-near-black mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mt-6">
            <h2 className="font-body font-semibold text-[0.85rem] uppercase tracking-[0.1em] text-warm-gray mb-4">Check-in History — Last 7 Days</h2>
            <div className="flex gap-1.5 sm:gap-2 mb-6 flex-wrap">
              {last7.map((d, i) => {
                const dateStr = d.toISOString().split('T')[0];
                const checked = checkins.some((c) => c.checkin_date === dateStr);
                const isToday = i === 6;
                return (
                  <div key={i} className={`w-[38px] h-[38px] sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-body text-xs sm:text-sm flex-shrink-0 ${checked ? `${mc.bg} text-near-black font-bold` : isToday ? `border-2 ${mc.border} bg-white text-near-black` : 'bg-white border border-border text-warm-gray'}`}>
                    {checked ? '✓' : d.getDate()}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
