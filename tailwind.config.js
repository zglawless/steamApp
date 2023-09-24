/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/App.css",
    "./src/index.css",
    "./src/Home.js",
    "./src/profile.js"
  ],
  theme: {
    screens: {
      'xs': '400px',
      'sm': '640px',
      'md': '768px',
      'lg': '900px',
    },
    extend: {
    },
  },
  plugins: [],
}

