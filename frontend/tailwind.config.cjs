/**
 * Tailwind v3-compatible configuration (CommonJS)
 * Use this file if your project is using Tailwind CSS v3.x
 */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cbelight: {
          primary: '#1e40af', // deep blue
          light: '#ffffff',
          gold: '#D4AF37'
        }
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(212,175,55,0.0)' },
          '50%': { boxShadow: '0 0 12px rgba(212,175,55,0.25)' }
        }
      },
      animation: {
        glow: 'glow 2.5s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
