import Logo from '../ui/Logo';

export default function Footer() {
  return (
    <footer className="bg-near-black py-[60px]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <Logo size="sm" dark />
          <div className="flex gap-6">
            <a href="#how-it-works" className="font-body text-warm-gray hover:text-white transition-colors text-[0.9rem]">How It Works</a>
            <a href="#modes" className="font-body text-warm-gray hover:text-white transition-colors text-[0.9rem]">The Modes</a>
          </div>
          <span className="font-body text-warm-gray text-[0.85rem]">Built in Addis Ababa 🌍</span>
        </div>
        <hr className="border-border/20 mb-6" />
        <p className="text-center font-body text-[0.85rem] text-warm-gray">© 2026 Yegna. All rights reserved.</p>
      </div>
    </footer>
  );
}
