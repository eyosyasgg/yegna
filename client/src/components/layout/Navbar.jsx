import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

const modeLinks = [
  { label: 'Commit', href: '#mode-commit' },
  { label: 'Explore', href: '#mode-explore' },
  { label: 'Surprise', href: '#mode-surprise' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-cream/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/"><Logo size="md" /></Link>

        <div className="hidden md:flex items-center gap-6">
          {!isAuthenticated && modeLinks.map((l) => (
            <a key={l.label} href={l.href} className="font-body text-[0.85rem] text-warm-gray hover:text-near-black transition-colors">{l.label}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={toggleDarkMode} className="w-10 h-10 flex items-center justify-center rounded-full text-warm-gray hover:text-near-black hover:bg-border/50 transition-all cursor-pointer" aria-label="Toggle dark mode">
            {darkMode ? '☀️' : '🌙'}
          </button>
          {isAuthenticated ? (
            <div className="relative group">
              <button className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-amber text-white font-body font-bold text-sm flex items-center justify-center">
                {initials}
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-cream-light border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                <Link to="/dashboard" className="block px-4 py-2.5 font-body text-[0.9rem] text-near-black hover:bg-amber/5">Dashboard</Link>
                <Link to="/profile" className="block px-4 py-2.5 font-body text-[0.9rem] text-near-black hover:bg-amber/5">Profile</Link>
                <hr className="border-border my-1" />
                <button onClick={() => { logout(); navigate('/'); }} className="block w-full text-left px-4 py-2.5 font-body text-[0.9rem] text-warm-gray hover:bg-amber/5 cursor-pointer">Sign Out</button>
              </div>
            </div>
          ) : (
            <Link to="/login"><Button variant="secondary" className="!py-2 !px-5">Sign In</Button></Link>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button onClick={toggleDarkMode} className="w-10 h-10 flex items-center justify-center rounded-full text-warm-gray cursor-pointer">{darkMode ? '☀️' : '🌙'}</button>
          <button className="min-w-[44px] min-h-[44px] flex flex-col items-center justify-center gap-1.5 cursor-pointer" onClick={() => setOpen(!open)}>
            <span className={`block w-6 h-[2px] bg-near-black transition-all ${open ? 'rotate-45 translate-y-[5px]' : ''}`} />
            <span className={`block w-6 h-[2px] bg-near-black transition-all ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[2px] bg-near-black transition-all ${open ? '-rotate-45 -translate-y-[5px]' : ''}`} />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-cream border-b border-border px-6 py-4 flex flex-col gap-3 animate-fadeUp">
          {!isAuthenticated ? (
            <>
              {modeLinks.map((l) => (
                <a key={l.label} href={l.href} className="font-body text-warm-gray min-h-[44px] flex items-center" onClick={() => setOpen(false)}>{l.label}</a>
              ))}
              <Link to="/login" onClick={() => setOpen(false)}><Button variant="secondary" className="!py-2 !px-5 w-full">Sign In</Button></Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="font-body text-warm-gray min-h-[44px] flex items-center" onClick={() => setOpen(false)}>Dashboard</Link>
              <Link to="/profile" className="font-body text-warm-gray min-h-[44px] flex items-center" onClick={() => setOpen(false)}>Profile</Link>
              <button onClick={() => { logout(); navigate('/'); setOpen(false); }} className="font-body text-warm-gray text-left min-h-[44px] flex items-center cursor-pointer">Sign Out</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
