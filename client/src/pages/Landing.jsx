import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import ModeCard from '../components/features/ModeCard';
import Footer from '../components/layout/Footer';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-cream">
      <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
        <span className="absolute top-1/2 right-[-5%] -translate-y-1/2 font-display text-[clamp(10rem,25vw,20rem)] text-near-black/5 pointer-events-none select-none z-0 leading-none">GROW</span>
        <div className="max-w-[1280px] mx-auto px-6 w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="lg:w-3/5">
              <span className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium">01 / WELLNESS REIMAGINED</span>
              <div className="mt-6">
                <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-bold text-near-black leading-[0.95] animate-fadeUp" style={{ animationDelay: '0ms' }}>Meet people.</h1>
                <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-bold text-near-black leading-[0.95] animate-fadeUp pl-[10%]" style={{ animationDelay: '150ms' }}>Learn together.</h1>
                <h1 className="font-display text-[clamp(3rem,8vw,7rem)] font-bold text-near-black leading-[0.95] animate-fadeUp pl-[20%]" style={{ animationDelay: '300ms' }}>Grow together.</h1>
              </div>
              <p className="font-body text-[1rem] text-warm-gray max-w-[480px] mt-8 leading-relaxed">
                Yegna connects you with a growth partner who shares your goals — so you can build meaningful habits together, not alone.
              </p>
              <div className="flex gap-4 mt-10 flex-wrap">
                <Button variant="primary" onClick={() => navigate('/register')}>Get Started →</Button>
                <Button variant="secondary" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>Learn More</Button>
              </div>
            </div>
            <div className="lg:w-2/5 relative hidden lg:block">
              <div className="w-[320px] h-[400px] bg-border rounded-[12px] -rotate-[2deg]" />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-[12px] p-4 shadow-lg dark:bg-cream-light">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber" />
                  <span className="font-body text-[0.85rem] text-near-black font-medium">5 check-ins today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-[64px] md:py-[120px] relative">
        <span className="absolute top-10 left-10 font-display text-[clamp(8rem,20vw,18rem)] text-near-black/5 pointer-events-none select-none z-0 leading-none">STEPS</span>
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <span className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium">02 / HOW IT WORKS</span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold text-near-black mt-3 mb-14">Five steps. One transformation.</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
            {[
              { num: '01', title: 'Sign Up', desc: 'Create your account in seconds.' },
              { num: '02', title: 'Choose Mode', desc: 'Pick how you want to grow.' },
              { num: '03', title: 'Get Matched', desc: 'We find your ideal partner.' },
              { num: '04', title: 'Do The Thing', desc: 'Work on your goal daily.' },
              { num: '05', title: 'Build Connection', desc: 'Grow stronger together.' },
            ].map((s) => (
              <div key={s.num}>
                <span className="font-display text-[3.5rem] md:text-[4.5rem] text-amber leading-none">{s.num}</span>
                <h4 className="font-body font-bold text-[1rem] text-near-black mt-3">{s.title}</h4>
                <p className="font-body text-[0.9rem] text-warm-gray mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="modes" className="py-[64px] md:py-[120px] relative bg-cream-light">
        <span className="absolute bottom-10 right-10 font-display text-[clamp(8rem,20vw,18rem)] text-near-black/5 pointer-events-none select-none z-0 leading-none">MODES</span>
        <div className="max-w-[1280px] mx-auto px-6 relative z-10">
          <span className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium">03 / THE MODES</span>
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold text-near-black mt-3 mb-14">One platform. Three ways to grow.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ModeCard mode="COMMIT" badgeColor="amber" title="Commit" description="Long-term accountability partner for sustained growth. Stay committed together over weeks and months." examples={['Fitness & Health', 'Language Learning', 'Coding']} onJoin={() => navigate('/register')} />
            <ModeCard mode="EXPLORE" badgeColor="coral" title="Explore" description="One-time experience companion for trying something new. Perfect for adventures and discoveries." examples={['Hiking', 'Cooking Class', 'Volunteering']} onJoin={() => navigate('/register')} />
            <ModeCard mode="SURPRISE" badgeColor="gray" title="Surprise" description="Cross-interest challenge that pushes you outside your comfort zone. Unexpected growth awaits." examples={['Photography week', 'Gratitude log', 'New skill sprint']} onJoin={() => navigate('/register')} />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
