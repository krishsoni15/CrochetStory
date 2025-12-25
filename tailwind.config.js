/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'], // Primary display font
        sans: ['Inter', 'system-ui', 'sans-serif'], // Body font
        handwritten: ['Kalam', 'Caveat', 'cursive'], // Handwritten style
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        cream: {
          50: '#fefbf7',
          100: '#fdf6ef',
          200: '#faedd9',
          300: '#f6e0c0',
          400: '#f0cfa0',
          500: '#eab676',
          600: '#e19a4a',
          700: '#d17a2a',
          800: '#b8641f',
          900: '#97521c',
        },
        yarn: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        cozy: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        playful: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        gentle: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      fontSize: {
        'display-xs': ['clamp(1.5rem, 4vw, 2rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(3rem, 7vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(4rem, 10vw, 7rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['clamp(5rem, 12vw, 10rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      spacing: {
        'section-sm': 'clamp(3rem, 8vw, 6rem)',
        'section-md': 'clamp(4rem, 10vw, 8rem)',
        'section-lg': 'clamp(6rem, 15vw, 12rem)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 2s',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}
