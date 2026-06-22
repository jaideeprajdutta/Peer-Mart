/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FFA630', // PeerMart orange
          dark: '#E6941A',
          light: '#FFB84D',
        },
        secondary: {
          DEFAULT: '#A7F2B4', // PeerMart mint green
          dark: '#8FE8A0',
          light: '#BFF6C8',
        },
        neutral: {
          DEFAULT: '#F4F4F4',
          dark: '#E5E5E5',
          light: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#FFD100', // Yellow accent
          dark: '#E6BC00',
        },
      },
    },
  },
  plugins: [],
}