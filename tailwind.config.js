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
      },
    },
  },
  plugins: [],
}
