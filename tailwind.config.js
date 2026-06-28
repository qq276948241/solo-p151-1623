/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: {
          50: '#f0f6f2',
          100: '#d9e8de',
          200: '#b5d1c0',
          300: '#86b499',
          400: '#569071',
          500: '#3a7254',
          600: '#2D5A3D',
          700: '#254a32',
          800: '#1f3c2a',
          900: '#1a3223',
        },
        cream: {
          50: '#FDFCFA',
          100: '#FAF8F5',
          200: '#F5F0E8',
          300: '#EFE8DA',
          400: '#E5DAC7',
          500: '#D9C9AE',
        },
        accent: {
          brown: '#8B7355',
          red: '#C0392B',
        }
      },
      fontFamily: {
        serif: ['"Source Han Serif"', '"Noto Serif SC"', 'serif'],
        sans: ['"Source Han Sans"', '"Noto Sans SC"', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(45, 90, 61, 0.08)',
        hover: '0 8px 24px rgba(45, 90, 61, 0.15)',
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(192, 57, 43, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(192, 57, 43, 0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        }
      }
    },
  },
  plugins: [],
};
