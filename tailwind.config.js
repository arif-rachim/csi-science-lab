/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        crt: {
          bg: '#0a0500',
          panel: '#140a02',
          fg: '#f5b945',
          dim: '#8a6628',
          bright: '#ffd97a',
          danger: '#e84545',
          ok: '#5ec56e',
          rule: '#5a4528',
        },
        detective: {
          navy: '#140a02',
          slate: '#5a4528',
          ink: '#0a0500',
          amber: '#f5b945',
          paper: '#ffd97a',
          clue: '#e84545',
        },
      },
      fontFamily: {
        mono: [
          'VT323',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
}
