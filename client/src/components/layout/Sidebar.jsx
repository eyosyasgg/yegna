import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Badge from '../ui/Badge';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const navigate = useNavigate();

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  const isActive = (path) => loc.pathname === path;
  const isHash = (h) => loc.pathname === '/dashboard' && loc.hash === h;

  const links = [
    { path: '/dashboard', label: 'Overview' },
    { path: '/dashboard', label: 'My Match', hash: '#match' },
    { path: '/dashboard', label: 'Activity', hash: '#activity' },
    { path: '/profile', label: 'Profile' },
  ];

  const modeColor = user?.mode === 'commit' ? 'amber' : user?.mode === 'explore' ? 'coral' : 'gray';

  return (
    <>
      <aside className="hidden md:flex flex-col w-[280px] min-h-screen bg-cream-light border-r border-border p-8 pt-24 fixed left-0 top-0">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-full bg-amber text-white flex items-center justify-center font-body font-bold text-lg">{initials}</div>
          <h3 className="font-display text-[1.1rem] text-near-black mt-3">{user?.name || 'User'}</h3>
          {user?.mode && <Badge color={modeColor} className="mt-1.5">{user.mode}</Badge>}
        </div>
        <hr className="border-border mb-6" />
        <nav className="flex flex-col gap-0.5">
          {links.map((link) => {
            const active = link.hash ? isHash(link.hash) : isActive(link.path);
            return (
              <Link key={link.label} to={link.path + (link.hash || '')}
                className={`px-4 py-2.5 rounded-lg font-body text-[0.9rem] transition-colors ${active ? 'text-near-black font-semibold bg-amber/5 border-l-2 border-amber' : 'text-warm-gray hover:text-near-black'}`}>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6">
          <button onClick={() => { logout(); navigate('/'); }} className="font-body text-[0.85rem] text-warm-gray hover:text-near-black transition-colors cursor-pointer">Sign Out</button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-light border-t border-border flex justify-around py-1 safe-area-bottom">
        {links.map((link) => {
          const active = link.hash ? isHash(link.hash) : isActive(link.path);
          return (
            <Link key={link.label} to={link.path + (link.hash || '')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[56px] ${active ? 'text-amber' : 'text-warm-gray'}`}>
              <span className="text-[0.65rem] uppercase tracking-wider font-body font-semibold">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
