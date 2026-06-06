import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';

export default function Dashboard() {
  const navigate = useNavigate();
  useEffect(() => { navigate('/commit', { replace: true }); }, [navigate]);
  return <div className="min-h-screen bg-cream flex items-center justify-center"><Spinner /></div>;
}
