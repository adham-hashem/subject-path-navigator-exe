/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./renderer/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a8a', // Dark blue
        secondary: '#3b82f6', // Bright blue
        accent: '#f59e0b', // Amber
        neutral: '#f4f4f9', // Light gray
        text: '#1f2937', // Dark gray
      },
    },
  },
  darkMode: 'class', // Enables dark mode support
  plugins: [],
};