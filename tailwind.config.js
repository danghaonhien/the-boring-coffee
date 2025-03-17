/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-playfair)', 'ui-serif', 'Georgia', 'serif'],
        display: ['var(--font-fraunces)', 'serif'],
        mono: ['var(--font-roboto-mono)', 'monospace'],
      },
      colors: {
        coffee: {
          100: '#f5f0e5',
          200: '#e6d7b8',
          300: '#d7be8b',
          400: '#c8a55e',
          500: '#b98c31',
          600: '#8c6a24',
          700: '#5f4817',
          800: '#32260a',
          900: '#050300',
        },
        espresso: {
          100: '#ede0d5',
          200: '#dbc2ab',
          300: '#c8a382',
          400: '#b68458',
          500: '#a3652e',
          600: '#7c4d23',
          700: '#543617',
          800: '#2d1e0c',
          900: '#060500',
        },
      },
      fontSize: {
        '4xl': ['2.5rem', { lineHeight: '3rem' }],
        '5xl': ['3rem', { lineHeight: '3.5rem' }],
        '6xl': ['3.75rem', { lineHeight: '4.25rem' }],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
    },
  },
  plugins: [],
}; 