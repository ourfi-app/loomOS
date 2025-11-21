
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // loomOS-inspired responsive breakpoints
    screens: {
      'sm': '640px',   // Mobile landscape / Small tablet
      'md': '768px',   // Tablet portrait
      'lg': '1024px',  // Desktop / Tablet landscape
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Extra large desktop
    },
    extend: {
      // ========================================
      // SPACING - From design-tokens/core.css
      // ========================================
      spacing: {
        // Design token spacing scale (4px grid)
        'xs': 'var(--space-xs)',      // 4px
        'sm': 'var(--space-sm)',      // 8px
        'md': 'var(--space-md)',      // 12px
        'lg': 'var(--space-lg)',      // 16px
        'xl': 'var(--space-xl)',      // 24px
        '2xl': 'var(--space-2xl)',    // 32px
        '3xl': 'var(--space-3xl)',    // 48px
        '4xl': 'var(--space-4xl)',    // 64px
        // Keep custom spacing
        '18': '4.5rem', // 72px - for better dock positioning
      },
      // ========================================
      // TYPOGRAPHY - From design-tokens/core.css
      // ========================================
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        mono: ['SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', 'Consolas', 'Courier New', 'monospace'],
        display: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        webos: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        loomos: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xs': ['var(--text-xs)', { lineHeight: 'var(--leading-tight)' }],      // 11px
        'sm': ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],     // 13px
        'base': ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }], // 14px
        'lg': ['var(--text-lg)', { lineHeight: 'var(--leading-normal)' }],     // 16px
        'xl': ['var(--text-xl)', { lineHeight: 'var(--leading-normal)' }],     // 18px
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-tight)' }],    // 24px
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],    // 30px
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],    // 36px
        '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-tight)' }],    // 48px
        '6xl': ['var(--text-6xl)', { lineHeight: 'var(--leading-none)' }],     // 60px
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'chrome-gradient': 'linear-gradient(to bottom, rgb(var(--chrome-dark)), rgb(var(--chrome-darker)))',
      },
      // ========================================
      // BORDER RADIUS - From design-tokens/core.css
      // ========================================
      borderRadius: {
        'none': 'var(--radius-none)',   // 0
        'sm': 'var(--radius-sm)',       // 4px
        'DEFAULT': 'var(--radius-base)', // 8px
        'md': 'var(--radius-md)',       // 8px
        'lg': 'var(--radius-lg)',       // 12px
        'xl': 'var(--radius-xl)',       // 16px
        '2xl': 'var(--radius-2xl)',     // 24px
        '3xl': 'var(--radius-3xl)',     // 32px
        'full': 'var(--radius-full)',   // 9999px
      },
      // ========================================
      // SHADOWS - From design-tokens/core.css
      // ========================================
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow-base)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'inner': 'var(--shadow-inner)',
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        'card-active': 'var(--shadow-card-active)',
        'dock': 'var(--shadow-dock)',
        'glass': 'var(--shadow-glass)',
        'glass-hover': 'var(--shadow-glass-hover)',
        'window': 'var(--shadow-window)',
        'overlay': 'var(--shadow-overlay)',
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
        // ========================================
        // NEW NEUTRAL PALETTE - Phase 1 Foundation
        // ========================================
        neutral: {
          lightest: 'var(--neutral-lightest)',  // #f5f5f5
          light: 'var(--neutral-light)',        // #e8e8e8
          medium: 'var(--neutral-medium)',      // #d8d8d8
          dark: 'var(--neutral-dark)',          // #d0d0d0
          border: 'var(--neutral-border)',      // #e0e0e0
          50: 'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
        },
        // webOS gray scale
        webos: {
          50: 'var(--webos-gray-50)',
          100: 'var(--webos-gray-100)',
          200: 'var(--webos-gray-200)',
          300: 'var(--webos-gray-300)',
          400: 'var(--webos-gray-400)',
          500: 'var(--webos-gray-500)',
          600: 'var(--webos-gray-600)',
          700: 'var(--webos-gray-700)',
          800: 'var(--webos-gray-800)',
          900: 'var(--webos-gray-900)',
        },
        // Text colors
        text: {
          primary: 'var(--text-primary)',       // #4a4a4a
          secondary: 'var(--text-secondary)',   // #6a6a6a
          tertiary: 'var(--text-tertiary)',     // #8a8a8a
          muted: 'var(--text-muted)',           // #9a9a9a
          inverse: 'var(--text-inverse)',       // #ffffff
        },
        // Chrome/Dark UI colors
        chrome: {
          dark: 'var(--chrome-dark)',           // #1a1a1a
          medium: 'var(--chrome-medium)',       // #4a4a4a
          light: 'var(--chrome-light)',         // #5a5a5a
          text: 'var(--chrome-text)',           // #e8e8e8
        },
        // Glass effects (for use with bg-opacity)
        glass: {
          'white-80': 'var(--glass-white-80)',
          'white-60': 'var(--glass-white-60)',
          'white-40': 'var(--glass-white-40)',
          'black-80': 'var(--glass-black-80)',
          'black-60': 'var(--glass-black-60)',
          'black-10': 'var(--glass-black-10)',
        },
        // loomOS Brand Colors (legacy - deprecated)
        loomos: {
          orange: '#F18825',
          'orange-light': '#FF9A3C',
          'orange-dark': '#D4751F',
        },
        // ========================================
        // DESIGN TOKEN COLORS
        // ========================================
        // loomOS Core Brand Colors
        'loomos-orange': 'var(--loomos-orange)',           // #F18825
        'loomos-orange-light': 'var(--loomos-orange-light)', // Lighter
        'loomos-orange-dark': 'var(--loomos-orange-dark)',  // Darker
        'loomos-orange-subtle': 'var(--loomos-orange-subtle)', // Very light bg

        'trust-blue': 'var(--trust-blue)',                 // #2196F3
        'trust-blue-light': 'var(--trust-blue-light)',
        'trust-blue-dark': 'var(--trust-blue-dark)',
        'trust-blue-subtle': 'var(--trust-blue-subtle)',

        'growth-green': 'var(--growth-green)',             // #4CAF50
        'growth-green-light': 'var(--growth-green-light)',
        'growth-green-dark': 'var(--growth-green-dark)',
        'growth-green-subtle': 'var(--growth-green-subtle)',

        // Semantic Colors (customizable by apps)
        'semantic-primary': 'var(--semantic-primary)',
        'semantic-primary-light': 'var(--semantic-primary-light)',
        'semantic-primary-dark': 'var(--semantic-primary-dark)',
        'semantic-primary-subtle': 'var(--semantic-primary-subtle)',

        'semantic-accent': 'var(--semantic-accent)',
        'semantic-accent-light': 'var(--semantic-accent-light)',
        'semantic-accent-dark': 'var(--semantic-accent-dark)',
        'semantic-accent-subtle': 'var(--semantic-accent-subtle)',

        // Backgrounds & Surfaces
        'semantic-bg': 'var(--semantic-bg-base)',
        'semantic-bg-subtle': 'var(--semantic-bg-subtle)',
        'semantic-bg-muted': 'var(--semantic-bg-muted)',

        'semantic-surface': 'var(--semantic-surface-base)',
        'semantic-surface-elevated': 'var(--semantic-surface-elevated)',
        'semantic-surface-overlay': 'var(--semantic-surface-overlay)',
        'semantic-surface-hover': 'var(--semantic-surface-hover)',
        'semantic-surface-active': 'var(--semantic-surface-active)',

        // Text Colors
        'semantic-text': 'var(--semantic-text-primary)',
        'semantic-text-secondary': 'var(--semantic-text-secondary)',
        'semantic-text-tertiary': 'var(--semantic-text-tertiary)',
        'semantic-text-disabled': 'var(--semantic-text-disabled)',
        'semantic-text-inverse': 'var(--semantic-text-inverse)',
        'semantic-text-link': 'var(--semantic-text-link)',

        // Borders
        'semantic-border': 'var(--semantic-border-light)',
        'semantic-border-medium': 'var(--semantic-border-medium)',
        'semantic-border-strong': 'var(--semantic-border-strong)',
        'semantic-border-focus': 'var(--semantic-border-focus)',

        // Status Colors
        'semantic-success': 'var(--semantic-success)',
        'semantic-error': 'var(--semantic-error)',
        'semantic-warning': 'var(--semantic-warning)',
        'semantic-info': 'var(--semantic-info)',
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
      // ========================================
      // TRANSITIONS - From design-tokens/motion.css
      // ========================================
      transitionTimingFunction: {
        'standard': 'var(--ease-standard)',
        'decelerate': 'var(--ease-decelerate)',
        'accelerate': 'var(--ease-accelerate)',
        'sharp': 'var(--ease-sharp)',
        'spring': 'var(--ease-spring)',
        'bounce': 'var(--ease-bounce)',
        // Legacy
        'webos': 'cubic-bezier(0.42, 0, 0.58, 1)',
        'loomos': 'cubic-bezier(0.42, 0, 0.58, 1)',
        'webos-in': 'cubic-bezier(0, 0, 0.58, 1)',
        'webos-out': 'cubic-bezier(0.42, 0, 1, 1)',
      },
      transitionDuration: {
        'instant': 'var(--duration-instant)',   // 100ms
        'fast': 'var(--duration-fast)',         // 150ms
        'normal': 'var(--duration-normal)',     // 200ms
        'slow': 'var(--duration-slow)',         // 300ms
        'slower': 'var(--duration-slower)',     // 500ms
        'slowest': 'var(--duration-slowest)',   // 700ms
        // Legacy
        'webos-micro': '100ms',
        'webos-fast': '200ms',
        'webos-normal': '300ms',
        'webos-slow': '400ms',
      },
      // ========================================
      // BACKDROP BLUR - For glassmorphism
      // ========================================
      backdropBlur: {
        'sm': 'var(--blur-sm)',      // 8px
        'md': 'var(--blur-md)',      // 10px
        'lg': 'var(--blur-lg)',      // 16px
        'xl': 'var(--blur-xl)',      // 24px
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar-hide')],
};
export default config;
