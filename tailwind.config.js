/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8edf5',
          100: '#c5d0e6',
          200: '#9eb2d4',
          300: '#7794c2',
          400: '#597db5',
          500: '#3b66a8',
          600: '#325a96',
          700: '#274a7f',
          800: '#1a3a6b',
          900: '#0d2449',
        },
        accent: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#f59e0b',
          600: '#e8960a',
          700: '#d48806',
          800: '#c27b03',
          900: '#a56600',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
    },
  },
  plugins: [],
};
