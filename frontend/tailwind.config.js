/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(0, 229, 255, 0.14)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '50%': { transform: 'translateX(10px) translateY(-8px)' },
        },
        pulseLine: {
          '0%, 100%': { opacity: 0.35 },
          '50%': { opacity: 1 },
        },
      },
      animation: {
        drift: 'drift 7s ease-in-out infinite',
        pulseLine: 'pulseLine 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
