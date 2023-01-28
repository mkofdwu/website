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
        '9/10': '90%',
      },
      spacing: {
        '1/2': '50%',
        '1/10': '10%',
      },
      fontSize: {
        humongous: '18rem',
      },
      width: {
        '50s': '50vw',
      },
    },
  },
  plugins: [],
};
