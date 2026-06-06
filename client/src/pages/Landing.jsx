import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Footer from '../components/layout/Footer';

const modes = [
  {
    id: 'commit',
    label: 'Commit',
    tag: 'ACCOUNTABILITY',
    accent: 'amber',
    bg: 'bg-amber/5',
    border: 'border-amber/20',
    icon: <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M24 4L30 14H42L32 22L36 34L24 28L12 34L16 22L6 14H18L24 4Z" className="text-amber" /></svg>,
    headline: 'Find a partner who shows up.',
    desc: 'Daily check-ins, shared goals, and mutual accountability. Commit pairs you with someone working toward the same long-term goal — fitness, reading, coding, language, or meditation.',
    how: [
      'Pick a goal category and set your duration',
      'Tell us your daily commitment',
      'Get matched with an accountability partner',
      'Check in every day and grow your streak together',
    ],
    examples: ['Fitness & Health', 'Language Learning', 'Reading', 'Coding', 'Meditation', 'Writing'],
    cta: 'Start a Commitment',
  },
  {
    id: 'explore',
    label: 'Explore',
    tag: 'ADVENTURE',
    accent: 'coral',
    bg: 'bg-coral/5',
    border: 'border-coral/20',
    icon: <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="24" cy="24" r="18" className="text-coral" /><path d="M24 14V24L30 30" className="text-coral" /></svg>,
    headline: 'Find a companion for the experience.',
    desc: 'One-time experiences are better together. Explore pairs you with someone who wants to do the same activity — hiking, cooking, museum visits, volunteering, or sports.',
    how: [
      'Choose an activity and set a date window',
      'Share your city and preferences',
      'Get matched with an experience companion',
      'Meet up and share the adventure together',
    ],
    examples: ['Hiking & Nature', 'Cooking Class', 'Museum Visit', 'Volunteering', 'Sports', 'Food Tasting'],
    cta: 'Plan an Adventure',
  },
  {
    id: 'surprise',
    label: 'Surprise',
    tag: 'DISCOVERY',
    accent: 'near-black',
    bg: 'bg-cream-light',
    border: 'border-near-black/10',
    icon: <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M24 6L27.5 16.5H38L29.5 23L32.5 34L24 28L15.5 34L18.5 23L10 16.5H20.5L24 6Z" className="text-near-black" fill="currentColor" fillOpacity="0.2" /></svg>,
    headline: 'Get matched on what you love.',
    desc: 'Cross-interest matching that pushes you outside your comfort zone. Surprise connects you with someone who shares your interests but challenges your perspective.',
    how: [
      'Select your interests from a diverse set of tags',
      'Set your openness level for new experiences',
      'Get matched with someone who complements you',
      'Take on a surprise challenge together',
    ],
    examples: ['Photography Week', 'Gratitude Log', 'New Skill Sprint', 'Creative Project', 'Reading Swap'],
    cta: 'Get Surprised',
  },
];

const accentColors = {
  commit: { border: 'border-amber', bg: 'bg-amber', text: 'text-amber', light: 'bg-amber/10' },
  explore: { border: 'border-coral', bg: 'bg-coral', text: 'text-coral', light: 'bg-coral/10' },
  surprise: { border: 'border-near-black', bg: 'bg-near-black', text: 'text-near-black', light: 'bg-near-black/5' },
};

function ModeSection({ mode, index }) {
  const navigate = useNavigate();
  const c = accentColors[mode.id];
  const isLeft = index % 2 === 0;

  return (
    <section id={`mode-${mode.id}`} className={`py-[80px] md:py-[120px] ${mode.bg} relative overflow-hidden`}>
      <div className={`max-w-[1280px] mx-auto px-6 relative z-10`}>
        <div className={`flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-start gap-12 md:gap-20`}>
          <div className="md:w-[45%] flex-shrink-0">
            <div className={`w-16 h-16 rounded-2xl ${mode.light} flex items-center justify-center border ${mode.border} mb-6`}>
              {mode.icon}
            </div>
            <Badge color={mode.id === 'surprise' ? 'gray' : mode.accent}>{mode.tag}</Badge>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1] font-bold text-near-black mt-4">{mode.label}</h2>
            <p className="font-body text-[1.05rem] text-warm-gray leading-relaxed mt-4">{mode.desc}</p>
            <div className="flex flex-col gap-3 mt-8">
              {mode.how.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className={`w-6 h-6 rounded-full ${c.light} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <span className={`font-body text-[0.7rem] font-bold ${c.text}`}>{i + 1}</span>
                  </span>
                  <span className="font-body text-[0.95rem] text-near-black">{step}</span>
                </div>
              ))}
            </div>
            <Button variant={mode.id === 'surprise' ? 'secondary' : 'primary'}
              className={`mt-8 !px-8`}
              onClick={() => navigate('/register')}>
              {mode.cta} →
            </Button>
          </div>

          <div className="md:w-[50%] flex-shrink-0">
            <div className={`rounded-[24px] border ${mode.border} bg-white p-8 md:p-10`}>
              <h4 className="font-body font-semibold text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray mb-5">
                {mode.id === 'commit' ? 'Popular goals' : mode.id === 'explore' ? 'Popular activities' : 'Sample challenges'}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {mode.examples.map((ex) => (
                  <div key={ex} className={`px-4 py-3 rounded-xl ${mode.light} font-body text-[0.9rem] text-near-black font-medium`}>
                    {ex}
                  </div>
                ))}
              </div>

              <hr className="border-border my-6" />

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${c.bg}/40 border-2 border-white`} />
                  ))}
                </div>
                <span className="font-body text-[0.85rem] text-warm-gray">
                  <strong className="text-near-black">1,200+</strong> {mode.label.toLowerCase()} partners active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-cream">
      <section className="min-h-[90vh] flex items-center relative overflow-hidden pt-20">
        <div className="max-w-[1280px] mx-auto px-6 w-full relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
            <div className="lg:w-3/5">
              <span className="font-body text-[0.75rem] uppercase tracking-[0.12em] text-warm-gray font-medium">GROWTH PARTNER MATCHING</span>
              <div className="mt-6">
                <h1 className="font-display text-[clamp(3rem,8vw,6.5rem)] font-bold text-near-black leading-[0.92]">
                  Grow{' '}
                  <span className="text-amber">together</span>
                  <span className="block mt-1">not alone.</span>
                </h1>
              </div>
              <p className="font-body text-[1.05rem] text-warm-gray max-w-[480px] mt-6 leading-relaxed">
                Yegna matches you with a partner based on how you want to grow — commitment, exploration, or surprise.
              </p>
              <div className="flex gap-3 mt-8 flex-wrap">
                <Button variant="primary" onClick={() => navigate('/register')}>Get Started →</Button>
                <Button variant="secondary" onClick={() => document.getElementById('mode-commit')?.scrollIntoView({ behavior: 'smooth' })}>See The Modes</Button>
              </div>

              <div className="flex gap-6 mt-12">
                {modes.map((m) => {
                  const c = accentColors[m.id];
                  return (
                    <button key={m.id} onClick={() => document.getElementById(`mode-${m.id}`)?.scrollIntoView({ behavior: 'smooth' })}
                      className="flex items-center gap-2 font-body text-[0.85rem] text-warm-gray hover:text-near-black transition-colors cursor-pointer">
                      <span className={`w-2 h-2 rounded-full ${c.bg}`} />
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="lg:w-2/5 relative hidden lg:flex flex-col items-center">
              <div className="w-[300px] h-[380px] rounded-[24px] bg-white border border-border p-6 flex flex-col gap-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-amber" />
                  <div>
                    <p className="font-body text-[0.85rem] font-semibold text-near-black">You</p>
                    <p className="font-body text-[0.7rem] text-warm-gray">Commit · 12-day streak</p>
                  </div>
                </div>
                <div className="flex-1 border border-border rounded-xl p-4">
                  <p className="font-body text-[0.8rem] text-near-black leading-relaxed">"Completed my 30-min reading session today. Halfway through the book!"</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-coral" />
                  <div>
                    <p className="font-body text-[0.85rem] font-semibold text-near-black">Partner</p>
                    <p className="font-body text-[0.7rem] text-warm-gray">Commit · 10-day streak</p>
                  </div>
                </div>
                <div className="flex-1 border border-border rounded-xl p-4">
                  <p className="font-body text-[0.8rem] text-near-black leading-relaxed">"Read 3 chapters today. The section on habits was eye-opening!"</p>
                </div>
                <div className="flex items-center justify-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-amber" />
                  <span className="w-2 h-2 rounded-full bg-amber" />
                  <span className="w-2 h-2 rounded-full bg-amber" />
                  <span className="w-2 h-2 rounded-full bg-amber" />
                  <span className="w-2 h-2 rounded-full bg-border" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {modes.map((mode, i) => <ModeSection key={mode.id} mode={mode} index={i} />)}

      <section className="py-[80px] md:py-[100px] bg-near-black text-white text-center">
        <div className="max-w-[640px] mx-auto px-6">
          <h2 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[1.1]">
            Ready to find your growth partner?
          </h2>
          <p className="font-body text-warm-gray mt-4 leading-relaxed">Three modes. One match. Start your journey in under two minutes.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button variant="primary" className="!bg-white !text-near-black !border-white hover:!bg-cream-light" onClick={() => navigate('/register')}>Create Your Account →</Button>
            <Button variant="secondary" className="!border-white/30 !text-white hover:!bg-white/10" onClick={() => document.getElementById('mode-commit')?.scrollIntoView({ behavior: 'smooth' })}>Compare Modes</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
