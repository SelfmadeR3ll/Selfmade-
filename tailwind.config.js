/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sfx: {
          black:  '#07070B',
          dark:   '#0D0D14',
          card:   '#12121A',
          border: '#1E1E2C',
          lime:   '#C8FF00',
          pink:   '#FF1F71',
          cyan:   '#00E5FF',
          purple: '#9B5CFF',
          orange: '#FF6416',
          text:   '#EAE8F5',
          muted:  'rgba(234,232,245,0.45)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-body)',    'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'radial-lime':   'radial-gradient(circle, rgba(200,255,0,0.18) 0%, transparent 70%)',
        'radial-pink':   'radial-gradient(circle, rgba(255,31,113,0.18) 0%, transparent 70%)',
        'radial-cyan':   'radial-gradient(circle, rgba(0,229,255,0.18) 0%, transparent 70%)',
        'radial-purple': 'radial-gradient(circle, rgba(155,92,255,0.18) 0%, transparent 70%)',
        'gradient-card': 'linear-gradient(135deg, #12121A 0%, #0D0D14 100%)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':     { transform: 'translateY(-18px) rotate(2deg)' },
        },
        floatAlt: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':     { transform: 'translateY(14px) rotate(-2deg)' },
        },
        glowPulse: {
          '0%,100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%':     { opacity: '0.85', transform: 'scale(1.08)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        spinSlow: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        gradientShift: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
        ticker: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        popIn: {
          '0%':   { opacity: '0', transform: 'scale(0.8) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        float:          'float 5s ease-in-out infinite',
        'float-alt':    'floatAlt 6s ease-in-out infinite',
        'glow-pulse':   'glowPulse 3.5s ease-in-out infinite',
        marquee:        'marquee 22s linear infinite',
        'fade-up':      'fadeUp 0.6s ease both',
        'slide-in':     'slideIn 0.5s ease both',
        'spin-slow':    'spinSlow 18s linear infinite',
        'gradient-shift':'gradientShift 6s ease infinite',
        ticker:         'ticker 28s linear infinite',
        'pop-in':       'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
      },
      boxShadow: {
        'lime-glow':   '0 0 40px rgba(200,255,0,0.25)',
        'pink-glow':   '0 0 40px rgba(255,31,113,0.25)',
        'cyan-glow':   '0 0 40px rgba(0,229,255,0.25)',
        'purple-glow': '0 0 40px rgba(155,92,255,0.25)',
        'card-hover':  '0 24px 64px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
