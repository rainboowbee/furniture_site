/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gf-gold': '#D4A14A',
        'gf-black': '#000000',
        'gf-deep': '#1A1A1A',
        'gf-white': '#FFFFFF',
        'gf-beige': '#E9E1D2',
        'gf-warm-gray': '#CFC7BA',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient-drift': 'gradientDrift 18s ease-in-out infinite alternate',
        'lines-float': 'linesFloat 20s linear infinite',
        'arc-appear': 'arc-appear 2s ease-out forwards',
        'pulse-gold': 'pulse-gold 2s infinite',
      },
      keyframes: {
        gradientDrift: {
          '0%': { backgroundPosition: '0% 0%, 100% 0%, 0% 100%, 0% 0%' },
          '100%': { backgroundPosition: '10% 5%, 95% 10%, 5% 95%, 0% 100%' },
        },
        linesFloat: {
          '0%': { transform: 'translateY(0px)', opacity: '0.6' },
          '50%': { transform: 'translateY(-10px)', opacity: '0.8' },
          '100%': { transform: 'translateY(0px)', opacity: '0.6' },
        },
        'arc-appear': {
          from: { strokeDashoffset: '1000', opacity: '0' },
          to: { strokeDashoffset: '0', opacity: '1' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 161, 74, 0.7)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212, 161, 74, 0)' },
        },
      },
    },
  },
  plugins: [],
}
