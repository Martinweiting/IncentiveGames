/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#F0D080',
          dim: '#8B6914',
          muted: '#5A4010',
        },
        crimson: {
          DEFAULT: '#7A1C2E',
          light: '#A0243D',
        },
        casino: {
          black: '#0D0D0D',
          surface: '#141414',
          surface2: '#1A1A1A',
          surface3: '#1E1E1E',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        number: ['Oswald', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'live-blink': 'live-blink 1.5s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'gold-glow': 'gold-glow 4s ease-in-out infinite',
        'float-up': 'float-up 0.6s ease-out forwards',
      },
      keyframes: {
        'live-blink': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.75)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
        'gold-glow': {
          '0%, 100%': { textShadow: '0 0 30px rgba(201,168,76,0.4)' },
          '50%': { textShadow: '0 0 60px rgba(201,168,76,0.8), 0 0 120px rgba(201,168,76,0.3)' },
        },
        'float-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
