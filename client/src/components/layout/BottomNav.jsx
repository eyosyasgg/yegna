import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const tabs = [
  { path: '/commit', label: 'Commit', icon: '★' },
  { path: '/explore', label: 'Explore', icon: '✦' },
  { path: '/surprise', label: 'Surprise', icon: '◆' },
  { path: '/profile', label: 'Profile', icon: '●' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const loc = useLocation();
  const { user } = useAuth();
  if (!user) return null;

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-cream-light border-t border-border flex safe-area-bottom">
        {tabs.map((t) => {
          const active = loc.pathname === t.path;
          return (
            <button key={t.path} onClick={() => navigate(t.path)}
              className={`flex-1 flex flex-col items-center justify-center py-2 min-h-[56px] transition-colors cursor-pointer ${active ? 'text-amber' : 'text-warm-gray'}`}>
              <span className={`text-lg ${active ? 'text-amber' : ''}`}>{t.icon}</span>
              <span className="font-body text-[0.6rem] uppercase tracking-[0.08em] font-semibold mt-0.5">{t.label}</span>
            </button>
          );
        })}
      </nav>

      <aside className="hidden md:flex flex-col w-[200px] min-h-screen bg-cream-light border-r border-border p-6 pt-24 fixed left-0 top-0">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-amber/20 text-near-black flex items-center justify-center font-body font-bold text-base">
            {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
          </div>
          <h3 className="font-display text-[1rem] text-near-black mt-2">{user.name}</h3>
        </div>
        <nav className="flex flex-col gap-1">
          {tabs.map((t) => {
            const active = loc.pathname === t.path;
            return (
              <button key={t.path} onClick={() => navigate(t.path)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-body text-[0.9rem] transition-all text-left cursor-pointer ${active ? 'text-near-black font-semibold bg-amber/5 border-l-2 border-amber' : 'text-warm-gray hover:text-near-black'}`}>
                <span className={active ? 'text-amber' : ''}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto pt-6">
          <button onClick={() => { localStorage.removeItem('yegna_token'); localStorage.removeItem('yegna_user'); navigate('/'); }}
            className="font-body text-[0.8rem] text-warm-gray hover:text-near-black transition-colors cursor-pointer">Sign Out</button>
        </div>
      </aside>
    </>
  );
}
