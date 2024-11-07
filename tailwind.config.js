/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        frame: 'rgba(2,0,10,0.5)',
        card: 'rgba(2,0,10,0.8)',
        ghost: '#4D7DDC',
        button: '#4D7DDC',
        'button-hover': '#4068B6',
        'card-border': '#444444',
        'input-border': 'rgba(234,234,234,0.3)',
        'content-primary': '#EAEAEA',
        'primary-action': '#0177FC',
      },
    },
  },
  plugins: [],
};
