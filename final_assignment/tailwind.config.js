/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx,vue}'],
  theme: {
    extend: {
      spacing: {
        '15p': '15%',     // 15% margin/padding
        '70px': '70px'    // 70px margin/padding
      },
      colors: {
        'head': 'rgb(31, 41, 55)',
        'l-gray': '#F8F8FF'
      }
    },
  },
  plugins: [],
}

