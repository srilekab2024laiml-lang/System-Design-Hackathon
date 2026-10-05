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
        // Precise design tokens per hackathon spec:
        bg: {
          DEFAULT: '#08090B',
          elevated: '#0F1115',
          card: '#13161B',
          subtle: '#181C22',
        },
        border: {
          DEFAULT: '#23272F',
          muted: '#1A1E26',
          bright: '#323846',
        },
        txt: {
          primary: '#F5F7FA',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        },
        // Semantic accents:
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
          arch: '#6366F1',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans, Inter)', 'Inter', 'Geist', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['var(--font-mono, "JetBrains Mono")', '"JetBrains Mono"', '"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        geist: ['Geist', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
        'badge': '6px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'particle': 'moveParticle 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        moveParticle: {
          '0%': { transform: 'translateX(0%)', opacity: '0' },
          '20%': { opacity: '1' },
          '80%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
