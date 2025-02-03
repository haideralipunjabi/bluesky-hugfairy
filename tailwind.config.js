/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#A8E0FF",
          secondary: "#8EE3F5",
        },
        foreground: {
          primary: "#3E517A",
        },
        accent: {
          primary: "#70CAD1",
          secondary: "#B08EA2",
        },
        link: "#03a9f4",
        bluesky: "#0c7aff"
      },
    },
  },
  plugins: [],
}
