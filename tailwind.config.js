/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif']
      },
      colors: {
        primary: '#478C3C'
      },
      scale: {
        101: '101%',
        102: '102%'
      },
      borderWidth: {
        3: '3px'
      },
      backgroundColor: {
        'almost-black': '#222',
        'almost-black-lighter': '#444'
      },
      letterSpacing: {
        hover: '0.15em'
      },
      height: {
        '9/10': '90%'
      },
      spacing: {
        '1/2': '50%',
        '1/10': '10%',
        30: '7.5rem'
      },
      fontSize: {
        '7.5xl': '5rem',
        humongous: '18.5rem'
      },
      width: {
        '50s': '50vw'
      },
      borderRadius: {
        '2.5xl': '1.25rem',
        '4xl': '1.75rem',
        '5xl': '2rem'
      }
    }
  },
  plugins: []
};
