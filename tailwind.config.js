/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C9A75',
        'primary-dark': '#556B47',
        accent: '#D4AF37',
        botanical: '#A8C5A0',
        'botanical-light': '#E8F3E6',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        'text-dark': '#1F2937',
        'text-light': '#6B7280',
        'bg-light': '#F9FAFB',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'checkmark': 'checkmark 0.6s ease-out',
        'float-ring-1': 'floatRing1 8s ease-in-out infinite',
        'float-ring-2': 'floatRing2 10s ease-in-out infinite',
        'image-zoom': 'imageZoom 20s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        checkmark: {
          '0%': { transform: 'scale(0) rotate(45deg)' },
          '50%': { transform: 'scale(1.2) rotate(45deg)' },
          '100%': { transform: 'scale(1) rotate(45deg)' },
        },
        floatRing1: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(30px, -20px) rotate(10deg)' },
          '50%': { transform: 'translate(0, -40px) rotate(0deg)' },
          '75%': { transform: 'translate(-30px, -20px) rotate(-10deg)' },
        },
        floatRing2: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(-40px, -30px) rotate(-15deg)' },
          '50%': { transform: 'translate(0, -50px) rotate(0deg)' },
          '75%': { transform: 'translate(40px, -30px) rotate(15deg)' },
        },
        imageZoom: {
          '0%, 100%': { transform: 'scale(1.05)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
}
