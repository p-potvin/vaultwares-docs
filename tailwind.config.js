/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        surface: 'var(--surface)',
        'surface-alt': 'var(--surface-alt)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        'text-inverse': 'var(--text-inverse)',
        accent: 'var(--accent)',
        'accent-muted': 'var(--accent-muted)',
        border: 'var(--border)',
        error: 'var(--error)',
        success: 'var(--success)'
      }
    },
  },
  plugins: [],
}
