/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'three-radial':
          'radial-gradient(circle at -25% 110%, #005577, transparent 50%), radial-gradient(circle at 125% 110%, #3b005d, transparent 50%), radial-gradient(circle at 50% -20%, #00179b, transparent 50%), linear-gradient(#090032, #090032)',
      },
      colors: {
        primary: '#243f5f',
        secondary: '#212121',
        contrast: '#000f52',
      },
    },
  },
  plugins: [],
};
