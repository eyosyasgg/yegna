import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Email and password are required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Invalid email format'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!json.success) { setError(json.error); return; }
      login(json.data.token, json.data.user);
      addToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch { setError('Server error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col md:flex-row-reverse min-h-screen">
      <div className="hidden md:flex w-[45%] bg-near-black items-center justify-center flex-col p-12 relative">
        <Logo size="lg" dark />
        <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] text-white mt-8 leading-tight text-center whitespace-pre-line">Welcome{'\n'}back.</h1>
        <p className="font-body text-warm-gray mt-4 text-center max-w-xs">Ready to pick up where you left off?</p>
        <div className="w-[220px] h-[280px] bg-border/20 rounded-[12px] rotate-[2deg] mt-12" />
      </div>
      <div className="flex-1 bg-cream flex items-center justify-center p-8 min-h-screen md:min-h-0 pt-24 md:pt-8">
        <div className="w-full max-w-[420px]">
          <div className="md:hidden flex justify-center mb-8"><Logo size="md" /></div>
          <h2 className="font-display text-[2rem] text-near-black mb-6">Sign in</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Email Address" type="email" placeholder="aisha@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input label="Password" type="password" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <p className="font-body text-[0.8rem] text-warm-gray -mt-2 cursor-default select-none">Forgot password?</p>
            {error && <p className="font-body text-[0.85rem] text-coral">{error}</p>}
            <Button variant="primary" className="w-full mt-2" disabled={loading} type="submit">{loading ? 'Signing In...' : 'Sign In →'}</Button>
          </form>
          <p className="font-body text-[0.9rem] text-warm-gray text-center mt-6">Don't have an account? <Link to="/register" className="text-amber hover:underline">Get started →</Link></p>
        </div>
      </div>
    </div>
  );
}
