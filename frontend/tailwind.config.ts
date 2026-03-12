import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: '#0d0d16',
        'surface-raised': '#12121e',
      },
      animation: {
        'spin-slow': 'spin 1.2s linear infinite',
      },
      backgroundImage: {
        'amber-glow': 'radial-gradient(ellipse at top, rgba(245,158,11,0.08) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
}

export default config
