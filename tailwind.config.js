/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0d0d0f',
          panel: '#13131a',
          border: '#1e1e2e',
          neonRed: '#ff2d55',
          neonBlue: '#00d4ff',
          neonGreen: '#00ff88',
          neonPurple: '#bf5af2',
          neonYellow: '#ffd60a',
          dimText: '#4a4a6a',
          text: '#c0c0e0',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
