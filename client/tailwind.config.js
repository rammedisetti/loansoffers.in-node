/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0B1C2D',
        accent: '#2E6BFF',
        success: '#18C79C',
        lightbg: '#F5F7FA',
        darktext: '#1F2937',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(11,28,45,0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
