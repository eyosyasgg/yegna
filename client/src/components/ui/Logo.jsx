const sizes = { sm: 20, md: 28, lg: 48 };

export default function Logo({ size = 'md', dark = false }) {
  const px = sizes[size];
  const color = dark ? '#FFFFFF' : 'var(--color-near-black)';
  const taglineColor = '#F5A623';

  return (
    <div className="flex items-center gap-2.5">
      <svg width={px} height={px * 1.15} viewBox="0 0 44 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 48 C22 48 8 34 8 20 C8 11 14 5 24 5 C34 5 40 11 40 20 C40 26 36 32 30 36" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse cx="30" cy="15" rx="7" ry="9" transform="rotate(-18 30 15)" fill={color} opacity="0.85" />
        <ellipse cx="14" cy="13" rx="6" ry="8" transform="rotate(18 14 13)" fill={color} opacity="0.85" />
        <path d="M22 48 L22 36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="font-display font-bold" style={{ color: dark ? '#FFFFFF' : 'var(--color-near-black)', fontSize: px * 0.85 }}>
          Yegna
        </span>
        <span className="font-body italic text-[0.55em]" style={{ color: taglineColor }}>
          Grow Together
        </span>
      </div>
    </div>
  );
}
