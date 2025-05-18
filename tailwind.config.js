/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can define your custom colors here
        'acc': {
          1: '#5A5558',  // Example primary accent color
          2: '#858384',  // Example secondary accent color
          3: '#C6C5C4',  // Example tertiary accent color
        },
      },
    },
  },
  plugins: [],
} 