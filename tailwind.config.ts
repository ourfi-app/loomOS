
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // WebOS-inspired responsive breakpoints
    screens: {
      'sm': '640px',   // Mobile landscape / Small tablet
      'md': '768px',   // Tablet portrait
      'lg': '1024px',  // Desktop / Tablet landscape
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Extra large desktop
    },
    extend: {
      spacing: {
        '18': '4.5rem', // 72px - for better dock positioning
      },
      fontFamily: {
        sans: ['Titillium Web', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        serif: ['Cambo', 'Georgia', 'serif'],
        display: ['Cambo', 'Georgia', 'serif'],
        webos: ['Titillium Web', '-apple-system', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'chrome-gradient': 'linear-gradient(to bottom, rgb(var(--chrome-dark)), rgb(var(--chrome-darker)))',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow-md)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'none': 'none',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          dark: 'hsl(var(--primary-dark))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          warm: 'hsl(var(--accent-warm))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // Feature/Section Colors
        finance: 'hsl(var(--finance))',
        admin: 'hsl(var(--admin))',
        documents: 'hsl(var(--documents))',
        community: 'hsl(var(--community))',
        messaging: 'hsl(var(--messaging))',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'card-zoom-in': {
          from: { transform: 'scale(0.25) translateY(50%)', opacity: '0.8' },
          to: { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        'card-zoom-out': {
          from: { transform: 'scale(1)', opacity: '1' },
          to: { transform: 'scale(0.25)', opacity: '0.8' },
        },
        'card-dismiss': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '80%': { opacity: '0.3' },
          '100%': { transform: 'translateY(-100vh) translateX(5%) scale(0.9)', opacity: '0' },
        },
        'slide-up-notification': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down-notification': {
          from: { transform: 'translateY(0)', opacity: '1' },
          to: { transform: 'translateY(100%)', opacity: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        ripple: {
          from: { transform: 'scale(0)', opacity: '0.3' },
          to: { transform: 'scale(4)', opacity: '0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'card-zoom-in': 'card-zoom-in 350ms cubic-bezier(0.42, 0, 0.58, 1)',
        'card-zoom-out': 'card-zoom-out 350ms cubic-bezier(0.42, 0, 0.58, 1)',
        'card-dismiss': 'card-dismiss 400ms cubic-bezier(0.42, 0, 1, 1) forwards',
        'slide-up-notification': 'slide-up-notification 300ms cubic-bezier(0, 0, 0.58, 1)',
        'slide-down-notification': 'slide-down-notification 250ms cubic-bezier(0.42, 0, 1, 1)',
        'fade-in': 'fade-in 200ms ease-out',
        ripple: 'ripple 400ms cubic-bezier(0, 0, 0.58, 1)',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        spin: 'spin 1s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      transitionTimingFunction: {
        'webos': 'cubic-bezier(0.42, 0, 0.58, 1)',
        'webos-in': 'cubic-bezier(0, 0, 0.58, 1)',
        'webos-out': 'cubic-bezier(0.42, 0, 1, 1)',
      },
      transitionDuration: {
        'webos-micro': '100ms',
        'webos-fast': '200ms',
        'webos-normal': '300ms',
        'webos-slow': '400ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar-hide')],
};
export default config;
