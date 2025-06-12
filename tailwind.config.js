// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media' for OS-based preference
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // add any other directories where you're using Tailwind
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
