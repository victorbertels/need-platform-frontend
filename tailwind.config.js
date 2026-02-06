/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium Bronze & Gold Color Scheme
        primary: '#8B4513',
        'primary-dark': '#5C2E0F',
        'primary-light': '#F5F1E8',
        secondary: '#D4AF37',
        'secondary-light': '#FDF8F3',
        accent: '#2D1F00',
        success: '#2ECC71',
        warning: '#F39C12',
        error: '#E74C3C',
        info: '#3498DB',
        // Premium neutrals
        'warm-white': '#FAFAF7',
        'cream': '#F5F1E8',
        'dark-bg': '#1A1714',
        'dark-card': '#2A2218',
        // Custom grays
        gray: {
          50: '#FAFAF7',
          100: '#F5F1E8',
          200: '#E8DDD0',
          300: '#D9C7B8',
          400: '#B8A890',
          500: '#8B7B6F',
          600: '#6B5D52',
          700: '#4F4440',
          800: '#2A2218',
          900: '#1A1714',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
