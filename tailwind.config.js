/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0B192C',
          dark: '#1E293B',
          blue: '#0F4C81',
          accent: '#1D4ED8',
          lightBlue: '#EBF3FA',
          surface: '#FFFFFF',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          borderDark: '#CBD5E1',
          muted: '#64748B',
          subtle: '#94A3B8'
        },
        status: {
          safe: '#16A34A',
          safeBg: '#DCFCE7',
          safeText: '#15803D',
          warning: '#D97706',
          warningBg: '#FEF3C7',
          warningText: '#B45309',
          emergency: '#DC2626',
          emergencyBg: '#FEE2E2',
          emergencyText: '#991B1B',
          offline: '#64748B',
          offlineBg: '#F1F5F9',
          offlineText: '#475569'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Public Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace']
      },
      boxShadow: {
        'gov': '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'gov-md': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        'gov-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)'
      }
    },
  },
  plugins: [],
}
