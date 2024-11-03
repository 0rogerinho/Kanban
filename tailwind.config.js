/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Frame
        'frame-bg': '#181818',
        'frame-border': '#333333',
        // Card
        'card-bg': '#2C2C2C',
        'card-border': '#444444',
        'card-hover': '#383838',
        // Background
        background: '#121212',
        // Text
        primary: '#EAEAEA',
        secondary: '#B0B0B0',
        // Background actions
        'text-disabled': '#757575',
        'primary-action': '#4CAF50',
        'secondary-action': '#F44336',
        highlight: '#FF9800',
        'in-progress': '#FFC107',
        completed: '#8BC34A',
        overdue: '#FF5252',
        review: '#03A9F4',
      },
      boxShadow: {
        card: '0px 4px 10px rgba(0, 0, 0, 0.25)',
        column: '0px 4px 15px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
