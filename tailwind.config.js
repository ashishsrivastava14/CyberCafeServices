/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f5f0',
          100: '#e8e6dd',
          200: '#d4d0c0',
          300: '#b5ae97',
          400: '#8a8168',
          500: '#6b6246',
          600: '#55503a',
          700: '#3e3b2b',
          800: '#2e2c20',
          900: '#1a1914',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#e87a20',
          600: '#d4690e',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        cream: {
          50: '#fefcf3',
          100: '#fdf6e3',
          200: '#f5edd6',
          300: '#ede3c8',
          400: '#e0d5b7',
          500: '#cfc4a0',
        },
        olive: {
          50: '#f5f5ef',
          100: '#e7e7d8',
          200: '#d1d0b4',
          300: '#b3b28b',
          400: '#8d8b5e',
          500: '#6e6c42',
          600: '#565434',
          700: '#434229',
          800: '#363521',
          900: '#2a291a',
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
