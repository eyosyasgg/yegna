import { useState, useEffect } from 'react';
import BottomNav from '../components/layout/BottomNav';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import BadgeIcon from '../components/ui/BadgeIcon';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import { getBadges } from '../api/badges';

export default function Profile() {
  const { user, token } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: '', location: '', language: 'both' });
  const [saving, setSaving] = useState(false);
  const [checkins, setCheckins] = useState([]);

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  const u = profile?.user;
  const allGoals = profile?.goals || [];
  const totalCheckins = profile?.totalCheckins || 0;
  const completedGoals = u?.completed_goals || 0;
  const completedTasks = u?.completed_tasks || 0;
  const currentStreak = u?.current_streak || 0;
  const longestStreak = u?.longest_streak || 0;

  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetch('/api/profile', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      getBadges(),
      fetch('/api/checkins', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([p, b, c]) => {
      if (p.success) { setProfile(p.data); setForm({ bio: p.data.user?.bio || '', location: p.data.user?.location || '', language: p.data.user?.language || 'both' }); }
      if (b.success) setBadges(b.data || []);
      if (c.success) setCheckins(c.data || []);
    }).catch(() => {}).finally(() => setLoading(false));
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

  return (
    <div className="min-h-screen bg-cream">
      <BottomNav />
      <div className="md:ml-[200px] pt-6 pb-24 md:pb-8">
        <div className="max-w-[800px] mx-auto px-6">
          <Card>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-amber/20 text-near-black flex items-center justify-center font-display text-[1.75rem] flex-shrink-0 border-2 border-amber/30">
                {initials}
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="w-full">
                    <h1 className="font-display text-[2rem] text-near-black">{u?.name || 'User'}</h1>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {u?.location && <span className="font-body text-[0.85rem] text-warm-gray">{u.location}</span>}
                      {u?.language && <Badge color="gray">{u.language}</Badge>}
                      {u?.mode && <Badge color="amber">{u.mode}</Badge>}
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Streak', value: `${currentStreak} days`, sub: `Best: ${longestStreak}`, icon: '🔥' },
              { label: 'Goals Done', value: completedGoals.toString(), sub: 'completed', icon: '🎯' },
              { label: 'Tasks', value: completedTasks.toString(), sub: 'total check-ins', icon: '📋' },
              { label: 'Active', value: allGoals.filter(g => g.status === 'active').length.toString(), sub: 'current goals', icon: '⚡' },
            ].map((s) => (
              <Card key={s.label} className="text-center">
                <span className="text-[1.5rem]">{s.icon}</span>
                <p className="font-display text-[1.5rem] text-near-black mt-1">{s.value}</p>
                <p className="font-body text-[0.7rem] text-warm-gray uppercase tracking-wider">{s.sub}</p>
              </Card>
            ))}
          </div>

          {badges.length > 0 && (
            <Card className="mt-6">
              <h2 className="font-display text-[1.15rem] text-near-black mb-4">Badges of Honor</h2>
              <div className="flex flex-wrap gap-4">
                {badges.map((b) => <BadgeIcon key={b.id} badge={b} />)}
              </div>
            </Card>
          )}

          <Card className="mt-6">
            <h2 className="font-display text-[1.15rem] text-near-black mb-3">My Goals</h2>
            {allGoals.length > 0 ? (
              <div className="flex flex-col gap-2">
                {allGoals.map((g) => (
                  <div key={g.id} className="flex items-center justify-between p-3 rounded-xl bg-cream-light">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-2 h-2 rounded-full ${g.status === 'active' ? 'bg-amber' : 'bg-warm-gray'}`} />
                      <div className="min-w-0">
                        <p className="font-body text-[0.9rem] text-near-black truncate font-medium">{g.category || 'Goal'}</p>
                        <p className="font-body text-[0.75rem] text-warm-gray capitalize">{g.mode} · {g.status}</p>
                      </div>
                    </div>
                    <Badge color={g.status === 'active' ? 'amber' : 'gray'}>{g.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-body text-warm-gray italic">No goals yet.</p>
            )}
          </Card>

          <Card className="mt-6">
            <h2 className="font-body font-semibold text-[0.85rem] uppercase tracking-[0.1em] text-warm-gray mb-4">Check-in History — Last 7 Days</h2>
            <div className="flex gap-1.5 sm:gap-2 flex-wrap">
              {last7.map((d, i) => {
                const dateStr = d.toISOString().split('T')[0];
                const checked = checkins.some((c) => c.checkin_date === dateStr);
                const isToday = i === 6;
                return (
                  <div key={i} className={`w-[38px] h-[38px] sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-body text-xs sm:text-sm flex-shrink-0 ${checked ? 'bg-amber/20 text-near-black font-bold' : isToday ? 'border-2 border-amber bg-white text-near-black' : 'bg-white border border-border text-warm-gray'}`}>
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
