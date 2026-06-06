import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6 p-8 text-center">
      <span className="font-display text-[clamp(6rem,15vw,10rem)] text-amber leading-none">404</span>
      <h1 className="font-display text-[2rem] text-near-black">Page not found</h1>
      <p className="font-body text-warm-gray max-w-md">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/"><Button variant="primary">Go Home</Button></Link>
    </div>
  );
}
