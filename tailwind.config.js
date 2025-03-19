/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: '#ff2957',
        secondary: '#08f7fe',
        accent: '#fe53bb',
        background: '#000000',
        surface: '#111111',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        dark: '#0a0a0a',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
      animation: {
        'text-slide': 'text-slide 10s linear infinite',
        'glow': 'glow 1.5s ease-in-out infinite alternate',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite alternate',
        'pulse-intense': 'pulse-intense 4s ease-in-out infinite alternate',
        'scan': 'scan 2s ease-in-out infinite',
        'flicker': 'flicker 5s linear infinite',
        'appear': 'appear 0.6s ease-out',
        'mobile-pulse': 'mobile-pulse 4s ease-in-out infinite alternate',
        'gradient': 'gradient 5s linear infinite',
      },
      keyframes: {
        'text-slide': {
          '0%, 16%': { transform: 'translateY(0)' },
          '20%, 36%': { transform: 'translateY(-25%)' },
          '40%, 56%': { transform: 'translateY(-50%)' },
          '60%, 76%': { transform: 'translateY(-75%)' },
          '80%, 96%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'glow': {
          '0%': {
            textShadow: '0 0 5px #ff2957, 0 0 10px #ff2957'
          },
          '100%': {
            textShadow: '0 0 10px #ff2957, 0 0 20px #ff2957'
          },
        },
        'neon-pulse': {
          '0%, 100%': { textShadow: '0 0 7px #fff, 0 0 10px #fff, 0 0 21px #fff, 0 0 42px #ff2957, 0 0 82px #ff2957, 0 0 92px #ff2957, 0 0 102px #ff2957, 0 0 151px #ff2957' },
          '50%': { textShadow: '0 0 4px #fff, 0 0 7px #fff, 0 0 13px #fff, 0 0 26px #ff2957, 0 0 52px #ff2957, 0 0 62px #ff2957, 0 0 72px #ff2957, 0 0 101px #ff2957' },
        },
        'float': {
          '0%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-20px)'
          },
          '100%': {
            transform: 'translateY(0px)'
          },
        },
        'pulse-soft': {
          '0%, 100%': {
            opacity: 0.8,
          },
          '50%': {
            opacity: 1,
          },
        },
        'pulse-intense': {
          '0%, 100%': {
            opacity: 0.7,
            boxShadow: '0 0 5px #ff2957',
          },
          '50%': {
            opacity: 1,
            boxShadow: '0 0 10px #ff2957, 0 0 15px #ff2957',
          },
        },
        'mobile-pulse': {
          '0%, 100%': {
            opacity: 0.7,
          },
          '50%': {
            opacity: 0.9,
          },
        },
        'scan': {
          '0%': {
            transform: 'translateY(-30%)'
          },
          '100%': {
            transform: 'translateY(30%)'
          },
        },
        'flicker': {
          '0%, 19.999%, 22%, 62.999%, 64%, 100%': {
            opacity: 0.99,
            filter: 'drop-shadow(0 0 1px rgba(255, 41, 87, 0.9))',
          },
          '20%, 21.999%, 63%, 63.999%': {
            opacity: 0.4,
            filter: 'none',
          },
        },
        'appear': {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        'gradient': {
          '0%': {
            'background-position': '200% 0',
          },
          '100%': {
            'background-position': '-200% 0',
          },
        },
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      willChange: {
        'auto': 'auto',
        'scroll': 'scroll-position',
        'contents': 'contents',
        'transform': 'transform',
        'opacity': 'opacity',
        'shadow': 'box-shadow',
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true, // Better touch experience
  },
  plugins: [],
}; 