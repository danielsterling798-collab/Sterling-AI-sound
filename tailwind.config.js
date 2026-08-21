/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sterling: {
          950: '#070a0f',
          900: '#0d131d',
          850: '#121a28',
          800: '#172234',
          700: '#23344f',
          500: '#3b82f6',
          400: '#60a5fa',
          cyan: '#06b6d4'
        }
      }
    },
  },
  plugins: [],
}
