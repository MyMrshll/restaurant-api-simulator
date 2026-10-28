/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        darkbg: '#0B1020',
        darkpanel: '#111827',
        darkpanel2: '#1F2937',
        darkborder: '#334155',
        brand: {
          blue: '#60A5FA',
          green: '#34D399',
          yellow: '#FBBF24',
          red: '#F87171',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace', 'ui-monospace'],
      }
    },
  },
  plugins: [],
}
