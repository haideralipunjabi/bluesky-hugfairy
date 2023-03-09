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
          primary: "#18181b",
          secondary: "#18181b",
        },
        foreground: {
          primary: "#ffffff",
        },
        accent: {
          primary: "#1d4ed8",
          secondary: "#1e3a8a",
        },
      },
    },
  },
  plugins: [],
}
