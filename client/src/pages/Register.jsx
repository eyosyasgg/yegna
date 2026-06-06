import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/ui/Logo';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [general, setGeneral] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email format';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneral('');
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!json.success) {
        if (res.status === 409) setErrors((p) => ({ ...p, email: json.error }));
        else setGeneral(json.error);
        return;
      }
      login(json.data.token, json.data.user);
      navigate('/onboarding');
    } catch { setGeneral('Server error. Please try again.'); }
    finally { setLoading(false); }
  };

  const upd = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="hidden md:flex w-[45%] bg-near-black items-center justify-center flex-col p-12 relative">
        <Logo size="lg" dark />
        <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] text-white mt-8 leading-tight text-center whitespace-pre-line">Start your{'\n'}journey.</h1>
        <p className="font-body text-warm-gray mt-4 text-center max-w-xs">Your growth partner is waiting. Take the first step.</p>
        <div className="w-[220px] h-[280px] bg-border/20 rounded-[12px] -rotate-[2deg] mt-12" />
      </div>
      <div className="flex-1 bg-cream flex items-center justify-center p-8 min-h-screen md:min-h-0 pt-24 md:pt-8">
        <div className="w-full max-w-[420px]">
          <div className="md:hidden flex justify-center mb-8"><Logo size="md" /></div>
          <h2 className="font-display text-[2rem] text-near-black mb-6">Create account</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Full Name" placeholder="e.g. Aisha Tadesse" value={form.name} onChange={upd('name')} error={errors.name} />
            <Input label="Email Address" type="email" placeholder="aisha@example.com" value={form.email} onChange={upd('email')} error={errors.email} />
            <Input label="Password" type="password" placeholder="At least 8 characters" value={form.password} onChange={upd('password')} error={errors.password} />
            <Input label="Confirm Password" type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={upd('confirmPassword')} error={errors.confirmPassword} />
            {general && <p className="font-body text-[0.85rem] text-coral">{general}</p>}
            <Button variant="primary" className="w-full mt-2" disabled={loading} type="submit">{loading ? 'Creating Account...' : 'Create Account →'}</Button>
          </form>
          <p className="font-body text-[0.9rem] text-warm-gray text-center mt-6">Already have an account? <Link to="/login" className="text-amber hover:underline">Sign in →</Link></p>
        </div>
      </div>
    </div>
  );
}
