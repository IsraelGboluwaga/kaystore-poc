/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0D2B4E',
        'navy-light': '#173F6E',
        amber: '#C87D15',
        'amber-bg': '#FEF5E7',
        'amber-border': '#E8A020',
        green: '#157A58',
        'green-bg': '#E8F6F1',
        blue: '#1658A8',
        'blue-bg': '#EBF2FC',
        parchment: '#EBE6DC',
        surface: '#FFFFFF',
        'surface-2': '#F5F2EC',
        tx: '#0D2B4E',
        'tx-2': '#5B7A96',
        'tx-3': '#A0B5C6',
        border: 'rgba(13,43,78,0.09)',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        badge: '20px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(13,43,78,0.07), 0 4px 16px rgba(13,43,78,0.06)',
      },
    },
  },
  plugins: [],
};
