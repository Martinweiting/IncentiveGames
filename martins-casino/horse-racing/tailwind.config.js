/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'race-bg': '#0a1628',
        'race-track': '#1a3a1a',
        'race-gold': '#d4af37',
        'race-surface': '#0f2040',
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        noto: ['"Noto Sans TC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
