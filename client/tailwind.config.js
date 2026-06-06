/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        amber: 'var(--color-amber)',
        'amber-light': 'var(--color-amber-light)',
        cream: 'var(--color-cream)',
        'cream-light': 'var(--color-cream-light)',
        coral: 'var(--color-coral)',
        'near-black': 'var(--color-near-black)',
        'warm-gray': 'var(--color-warm-gray)',
        border: 'var(--color-border)',
        white: 'var(--color-white)',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
