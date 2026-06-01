/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#BA0304',
          dark: '#8B0203',
          light: '#D94040',
        },
        brand: {
          white: '#FFFFFF',
          lightgray: '#F8F9FA',
          gray: '#E5E7EB',
          midgray: '#9CA3AF',
          text: '#4B5563',
          dark: '#1F2937',
          whatsapp: '#25D366',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
        nav: '0 2px 12px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};
