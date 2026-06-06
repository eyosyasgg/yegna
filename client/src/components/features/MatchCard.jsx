import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Spinner from '../ui/Spinner';
import ProgressRing from '../ui/ProgressRing';
import Button from '../ui/Button';
import CheckInModal from './CheckInModal';
import { useNavigate } from 'react-router-dom';
import { getCheckins } from '../../api/checkins';

const modeColors = {
  commit: { accent: 'amber', badge: 'amber', bg: 'bg-amber/10' },
  explore: { accent: 'coral', badge: 'coral', bg: 'bg-coral/10' },
  surprise: { accent: 'near-black', badge: 'gray', bg: 'bg-near-black/5' },
};

export default function MatchCard({ matchData, user, profile, goal, onCheckin }) {
  const [showModal, setShowModal] = useState(false);
  const [checkedToday, setCheckedToday] = useState(false);
  const navigate = useNavigate();

  const uMode = profile?.user?.mode || user?.mode || 'commit';
  const mc = modeColors[uMode] || modeColors.commit;

  useEffect(() => {
    getCheckins().then((res) => {
      const data = res.data || [];
      const today = new Date().toISOString().split('T')[0];
      setCheckedToday(data.some((c) => c.checkin_date === today && c.user_id === user?.id));
    }).catch(() => {});
  }, [user?.id]);

  if (!matchData?.matched) {
    return (
      <Card className="border-[1.5px] border-dashed border-warm-gray text-center">
        <Spinner className="mb-4" />
        <h3 className="font-display text-[1.25rem] text-near-black">Your match is being found</h3>
        <p className="font-body text-warm-gray mt-2">We're looking for someone with the same mode.</p>
      </Card>
    );
  }

  const partner = matchData.partner;
  const daysActive = matchData.daysActive || 0;
  const progress = goal?.duration_days ? Math.min(100, Math.round((daysActive / goal.duration_days) * 100)) : 0;
  const partnerInitials = partner?.name ? partner.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <>
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full ${mc.bg} text-near-black flex items-center justify-center font-body font-bold text-base flex-shrink-0`}>
            {partnerInitials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-[1.25rem] text-near-black truncate">{partner?.name || 'Partner'}</h3>
            <Badge color={mc.badge}>{uMode.charAt(0).toUpperCase() + uMode.slice(1)} Matched</Badge>
          </div>
        </div>

        <p className="font-body text-[0.85rem] text-warm-gray mb-1">Shared Goal</p>
        <p className="font-body text-near-black mb-2">{goal?.category || 'Wellness'} — {goal?.description || 'Growing together'}</p>

        {uMode === 'commit' && goal?.duration_days && (
          <div className="flex justify-center my-4">
            <ProgressRing percent={progress} size={80} />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 border-y border-border py-4 my-4">
          {[
            { label: 'Days Active', value: daysActive },
            { label: 'Your Streak', value: matchData.userStreak || 0 },
            { label: `${partner?.name?.split(' ')[0] || 'Partner'}'s Streak`, value: matchData.partnerStreak || 0 },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-body font-bold text-near-black text-lg">{s.value}</div>
              <div className="font-body text-[0.65rem] text-warm-gray uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button variant="secondary" className="flex-1" onClick={() => navigate('/profile')}>View Profile</Button>
          {checkedToday ? (
            <Button variant="secondary" className="flex-1 opacity-60 cursor-not-allowed" disabled>Checked In ✓</Button>
          ) : (
            <Button variant="primary" className="flex-1" onClick={() => setShowModal(true)}>Check In Today</Button>
          )}
        </div>
      </Card>
      {showModal && (
        <CheckInModal onClose={() => setShowModal(false)} onSuccess={(d) => { setCheckedToday(true); onCheckin?.(d); setShowModal(false); }} />
      )}
    </>
  );
}
