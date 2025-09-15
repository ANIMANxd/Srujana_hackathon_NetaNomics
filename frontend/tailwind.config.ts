import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        card: 'var(--card)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--border)',
        accent: 'var(--accent)',
      },
      // ADD THIS for animation
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
    },
  },
  // --- ADD THIS PLUGINS ARRAY ---
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;