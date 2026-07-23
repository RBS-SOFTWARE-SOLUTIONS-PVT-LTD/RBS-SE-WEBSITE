/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#030206',
          900: '#07050E',
          850: '#0D0A1A',
          800: '#130F25',
          700: '#1C1736',
        },
        purple: {
          neon: '#A855F7',
          bright: '#C084FC',
          glow: '#9333EA',
          deep: '#581C87',
          dark: '#3B0764'
        },
        cyber: {
          cyan: '#06B6D4',
          blue: '#3B82F6',
          green: '#10B981',
          accent: '#E879F9'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'purple-glow': '0 0 25px -5px rgba(168, 85, 247, 0.4), 0 0 10px -2px rgba(168, 85, 247, 0.2)',
        'purple-heavy': '0 0 50px -10px rgba(147, 51, 234, 0.6)',
        'cyber-card': '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(168, 85, 247, 0.2)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'border-spin': 'borderSpin 6s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        borderSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
