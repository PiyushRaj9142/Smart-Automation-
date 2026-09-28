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
          navy: '#0F172A',
          dark: '#1E293B',
          blue: '#0F4C81',
          accent: '#1D4ED8',
          lightBlue: '#EFF6FF',
          surface: '#FFFFFF',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          borderDark: '#CBD5E1',
          muted: '#64748B',
          subtle: '#94A3B8'
        },
        status: {
          safe: '#15803D',
          safeBg: '#F0FDF4',
          safeText: '#166534',
          warning: '#B45309',
          warningBg: '#FFFBEB',
          warningText: '#92400E',
          emergency: '#B91C1C',
          emergencyBg: '#FEF2F2',
          emergencyText: '#991B1B',
          offline: '#475569',
          offlineBg: '#F8FAFC',
          offlineText: '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(15, 23, 42, 0.03)',
        'xs': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'gov': '0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'gov-md': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.04)',
        'gov-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)'
      }
    },
  },
  plugins: [],
}

