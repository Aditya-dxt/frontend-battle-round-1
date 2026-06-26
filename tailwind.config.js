/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#050a0e',
        'bg-secondary': '#0a1628',
        'bg-card': '#0f1f35',
        'accent-cyan': '#00d4ff',
        'accent-purple': '#7c3aed',
        'accent-gold': '#f59e0b',
        'text-primary': '#f0f4f8',
        'text-secondary': '#8892a4',
        'border-color': 'rgba(0,212,255,0.15)',
      },
      fontFamily: {
        'display': ['JetBrains Mono', 'monospace'],
        'body': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0,212,255,0.25)',
        'glow-purple': '0 0 20px rgba(124,58,237,0.25)',
        'glow-gold': '0 0 20px rgba(245,158,11,0.25)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}