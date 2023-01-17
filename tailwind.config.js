/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      scale: {
        101: '101%',
        102: '102%',
      },
      borderWidth: {
        3: '3px',
      },
      backgroundColor: {
        'almost-black': '#222',
        'almost-black-lighter': '#444',
      },
      letterSpacing: {
        hover: '0.15em',
      },
      height: {
        '7/8': '87.5%',
      },
      spacing: {
        '1/8': '12.5%',
      },
      fontSize: {
        max: '20rem',
      },
    },
  },
  plugins: [],
};
