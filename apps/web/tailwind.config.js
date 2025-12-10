module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      fontFamily: {
        sans: ['Satoshi', 'var(--font-outfit)', 'ui-sans-serif', 'system-ui'],
        heading: ['Satoshi', 'ui-sans-serif'],
      },
    }
  },
  plugins: [],
}
