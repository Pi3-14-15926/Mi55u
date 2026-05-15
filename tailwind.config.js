/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        love: {
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d0cece',
          400: '#959595',
          500: '#777',
          600: '#555',
          700: '#333',
        },
        blue: {
          brand: '#2098ff',
          hover: '#10bbff',
        },
        coral: '#f16b4f',
        amber: '#ffbe27',
        teal: '#49dbb2',
        pink: '#fa5c7c',
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'serif'],
        sans: ['Noto Sans SC', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '1.5rem',
        'card-b': '2rem',
      },
      boxShadow: {
        'card': '0 8px 12px rgba(228,228,228,0.45)',
        'card-hover': '0 5px 20px rgba(218,215,215,0.8)',
        'btn': '0 2px 10px rgba(92,92,92,0.44)',
      },
      keyframes: {
        heartBeat: {
          '0%, 100%': { transform: 'scale(0.8)' },
          '70%': { transform: 'scale(1.3)' },
        },
        wave: {
          '0%': { transform: 'translate3d(-90px, 0, 0)' },
          '100%': { transform: 'translate3d(85px, 0, 0)' },
        },
      },
      animation: {
        'heart': 'heartBeat 1s ease-in-out infinite',
        'wave': 'wave 7s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite',
        'wave-slow': 'wave 11s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite',
        'wave-slower': 'wave 13s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite',
        'wave-slowest': 'wave 17s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite',
      },
    },
  },
  plugins: [],
}
