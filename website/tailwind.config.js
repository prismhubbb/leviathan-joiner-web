/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0f',
          850: '#0d0d14',
          800: '#1a1a26',
          700: '#25252f',
        },
        accent: '#6fa7fe',
      },
    },
  },
  plugins: [],
}
