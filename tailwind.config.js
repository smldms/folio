/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      aspectRatio: {
        'w-16': 16,
        'h-9': 9,
      },
      fontFamily: {
        'syncopate': ['Syncopate', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontFamily: 'Space Grotesk, sans-serif',
            a: {
              color: '#fff',
              '&:hover': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
            },
            h1: {
              color: '#fff',
              fontFamily: 'Syncopate, sans-serif',
            },
            h2: {
              color: '#fff',
              fontFamily: 'Syncopate, sans-serif',
            },
            h3: {
              color: '#fff',
              fontFamily: 'Syncopate, sans-serif',
            },
            h4: {
              color: '#fff',
              fontFamily: 'Syncopate, sans-serif',
            },
            strong: {
              color: '#fff',
            },
            code: {
              color: '#fff',
            },
            figcaption: {
              color: 'rgba(255, 255, 255, 0.7)',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};