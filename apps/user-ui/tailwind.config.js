const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,html}',
    './src/app/**/*.{js,ts,jsx,tsx,html}',
    './src/components/**/*.{js,ts,jsx,tsx,html}',
    join(__dirname, 'src/**/*.{ts,tsx,js,jsx,html}'),
  ],
  theme: {
    extend: {
      colors: {
        'salmon-pink': 'var(--salmon-pink)',
        'eerie-black': 'var(--eerie-black)',
        'davys-gray': 'var(--davys-gray)',
        'cultured': 'var(--cultured)',
        'ocean-green': 'var(--ocean-green)',
        'bittersweet': 'var(--bittersweet)',
      },
    },
  },
  plugins: [],
};
