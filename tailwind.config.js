/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#D81E2C',
          50: '#FDECED',
          100: '#FAD2D5',
          200: '#F4A5AB',
          300: '#ED7882',
          400: '#E74B58',
          500: '#D81E2C',
          600: '#B01825',
          700: '#84121B',
          800: '#580C12',
          900: '#2C0609',
        },
        ink: {
          DEFAULT: '#16181D',
          50: '#F6F7F8',
          100: '#EBECEE',
          200: '#D2D5DA',
          300: '#AEB3BC',
          400: '#7E8593',
          500: '#5A616F',
          600: '#3F4654',
          700: '#2B313C',
          800: '#1C2129',
          900: '#16181D',
        },
        mist: {
          DEFAULT: '#F5F5F3',
          100: '#FBFBFA',
          200: '#F4F4F1',
          300: '#EBEBE7',
          400: '#DDDDD8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        luxe: '0.02em',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      boxShadow: {
        // Soft, layered, low-opacity shadows for a refined sense of depth.
        soft: '0 1px 2px rgba(20, 22, 28, 0.03), 0 2px 8px -2px rgba(20, 22, 28, 0.05)',
        card: '0 1px 2px rgba(20, 22, 28, 0.04), 0 8px 24px -10px rgba(20, 22, 28, 0.10), 0 24px 56px -28px rgba(20, 22, 28, 0.14)',
        lift: '0 2px 4px rgba(20, 22, 28, 0.04), 0 18px 42px -16px rgba(20, 22, 28, 0.20)',
        elevated: '0 12px 36px -14px rgba(20, 22, 28, 0.18), 0 40px 80px -32px rgba(20, 22, 28, 0.28)',
        ring: '0 0 0 1px rgba(20, 22, 28, 0.05)',
      },
      backgroundImage: {
        'lux-radial':
          'radial-gradient(60rem 36rem at 78% -8%, rgba(216,30,44,0.05), transparent 58%), radial-gradient(52rem 38rem at -8% 6%, rgba(20,22,28,0.035), transparent 56%)',
        'lux-veil': 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF8 100%)',
        'lux-sheen':
          'linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.55) 45%, transparent 70%)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        lux: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
};
