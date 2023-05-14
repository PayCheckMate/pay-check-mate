/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,css,scss,sass}"],
  mode: process.env.NODE_ENV ? 'jit' : undefined,
  theme: {
    fontFamily: {
      sans: ['SF Pro Text','Times New Roman', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

