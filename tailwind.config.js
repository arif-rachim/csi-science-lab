/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        detective: {
          navy: '#0f1e3d',
          slate: '#1f2c4a',
          ink: '#0a1226',
          amber: '#f5b945',
          paper: '#f2ead3',
          clue: '#e84545',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
}
