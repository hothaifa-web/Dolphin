module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'deep-navy': '#001f3f',
        'ocean-blue': '#0077be',
        'pearl': '#f8fafb'
      },
      fontFamily: {
        tajawal: ['Tajawal', 'system-ui', 'sans-serif']
      },
      keyframes: {
        pulseAmber: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245,158,11,0.08)' },
          '50%': { boxShadow: '0 0 30px 8px rgba(245,158,11,0.08)' }
        },
        pulseBlue: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(0,119,190,0.08)' },
          '50%': { boxShadow: '0 0 30px 8px rgba(0,119,190,0.08)' }
        },
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
          '100%': { transform: 'translateY(0px)' }
        }
      },
      animation: {
        pulseAmber: 'pulseAmber 2.4s ease-in-out infinite',
        pulseBlue: 'pulseBlue 2.4s ease-in-out infinite',
        shine: 'shine 1.6s linear infinite',
        float: 'float 6s ease-in-out infinite'
      },
      boxShadow: {
        'lux': '0 20px 40px rgba(0,31,63,0.12), 0 6px 18px rgba(0,119,190,0.06)'
      }
    },
  },
  plugins: [],
}
