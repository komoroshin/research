/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1F24',
        surface: '#122C32',
        raised: '#17383F',
        edge: '#22505A',
        bone: '#EFE9DC',
        dim: '#93A8A8',
        faint: '#5D7278',
        marigold: '#E9A93C',
        celadon: '#74B49B',
        plum: '#C078A6',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'JetBrains Mono', 'Roboto Mono', 'Menlo', 'Consolas', 'monospace'],
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        doc: ['Iowan Old Style', 'Palatino Linotype', 'Palatino', 'Georgia', 'serif'],
      },
      keyframes: {
        rise: { '0%': { opacity: 0, transform: 'translateY(6px)' }, '100%': { opacity: 1, transform: 'none' } },
        sweep: { '0%': { transform: 'scaleX(0)' }, '100%': { transform: 'scaleX(1)' } },
        blip: { '0%,100%': { opacity: 0.35 }, '50%': { opacity: 1 } },
      },
      animation: {
        rise: 'rise 420ms cubic-bezier(0.2,0.7,0.3,1) both',
        sweep: 'sweep 700ms cubic-bezier(0.2,0.7,0.3,1) both',
        blip: 'blip 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
