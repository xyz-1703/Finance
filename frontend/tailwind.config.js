/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finance: {
          bg: '#0B0E14',
          card: '#151A22',
          border: '#2A303C',
          text: '#FFFFFF',
          muted: '#8B94A5',
          primary: '#2962FF',
          primaryHover: '#1E4DB7',
          success: '#00C853',
          danger: '#D50000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
