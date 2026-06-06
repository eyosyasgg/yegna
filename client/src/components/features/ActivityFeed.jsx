import { useState, useEffect } from 'react';
import { getActivity } from '../../api/checkins';
import { formatRelativeTime } from '../../utils/time';
import Spinner from '../ui/Spinner';

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getActivity().then((res) => { if (!cancelled) setActivities(res.data || []); }).catch(() => {}).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Spinner className="py-8" />;

  return (
    <section>
      <h3 className="font-body font-semibold text-[0.85rem] uppercase tracking-[0.1em] text-warm-gray mb-4">Recent Activity</h3>
      {activities.length === 0 ? (
        <p className="font-body italic text-warm-gray">No activity yet. Be the first to check in.</p>
      ) : (
        <div className="flex flex-col">
          {activities.map((item, i) => {
            const initials = item.user_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
            return (
              <div key={item.id} className={`flex items-start gap-3 py-3.5 ${i < activities.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-amber/30 text-near-black flex-shrink-0 flex items-center justify-center font-body font-bold text-xs">{initials}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-[0.9rem] text-near-black"><span className="font-semibold">{item.user_name}</span> checked in</p>
                  {item.note && <p className="font-body text-[0.85rem] text-warm-gray truncate">{item.note}</p>}
                </div>
                <span className="font-body text-[0.8rem] text-warm-gray flex-shrink-0">{formatRelativeTime(item.created_at)}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
