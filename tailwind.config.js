/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        prose: '65ch'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
