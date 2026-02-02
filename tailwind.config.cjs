module.exports = {
  darkMode: 'class',
  content: ['./src/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', '"Heiti SC"', '"Noto Sans SC"', 'sans-serif'],
        serif: ['"Songti SC"', '"Noto Serif SC"', '"SimSun"', 'serif'],
        mono: ['"Menlo"', '"Monaco"', '"Consolas"', '"Courier New"', 'monospace']
      },
      colors: {
        sakura: {
          50: '#fff0f5',
          100: '#ffe4e9',
          200: '#fecdd7',
          300: '#fda4b8',
          400: '#fc7096',
          500: '#f43f72',
          600: '#e11d59',
          700: '#be1245',
          800: '#9f123f',
          900: '#88133b'
        },
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
          950: 'var(--primary-950)'
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
