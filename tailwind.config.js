/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
        surface: '#FFFFFF',
        background: '#FFF5F5',
        success: '#95E1D3',
        warning: '#F3A683',
        error: '#F8B5B5',
        info: '#A8E6CF',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        heading: ['Fredoka One', 'ui-sans-serif', 'system-ui']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      boxShadow: {
        'soft': '0 8px 16px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(255, 107, 107, 0.3)'
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-heart': 'pulse-heart 1s ease-in-out',
        'confetti': 'confetti 3s ease-out forwards'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'pulse-heart': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' }
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotateZ(0deg)', opacity: 1 },
          '100%': { transform: 'translateY(-100px) rotateZ(720deg)', opacity: 0 }
        }
      }
    },
  },
  plugins: [],
}