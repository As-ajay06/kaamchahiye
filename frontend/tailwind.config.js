/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Mono"', 'monospace'],
        display: ['"VT323"', 'monospace'],
      },
      colors: {
        brand: {
          50: '#ffffff',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          500: '#000000',
          600: '#111111',
          700: '#1f2937',
          900: '#000000',
        },
      },
      boxShadow: {
        'hard': '6px 6px 0px 0px rgba(0,0,0,1)',
        'hard-sm': '4px 4px 0px 0px rgba(0,0,0,1)',
        'hard-lg': '10px 10px 0px 0px rgba(0,0,0,1)',
      },
    },
  },
  plugins: [],
}
