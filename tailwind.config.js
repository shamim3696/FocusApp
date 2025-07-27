/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        slideInUp: 'slideInUp 0.5s ease-out forwards',
      },
      backdropBlur: {
        sm: '4px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
