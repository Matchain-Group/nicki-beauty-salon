/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2c1a0e',
          light: '#5c3317',
          mid: '#8b5e3c',
          pale: '#c49a6c',
        },
        gold: {
          DEFAULT: '#f5c87a',
          deep: '#c49a6c',
        },
        cream: {
          DEFAULT: '#f6f0e8',
          light: '#fdfaf5',
        },
        accent: '#f1641e',
        surface: '#ffffff',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg,#2c1a0e 0%,#5c3317 40%,#8b5e3c 70%,#c49a6c 100%)',
      },
    },
  },
  plugins: [],
}
