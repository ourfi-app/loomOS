
import type { Config } from 'tailwindcss';

/**
 * Tailwind Configuration for loomOS
 * 
 * This configuration extends Tailwind with CSS variables from the webOS Design System.
 * All design tokens are defined in /styles/webos-design-system.css
 * 
 * Design Philosophy:
 * - Use CSS variables for runtime theming
 * - Map semantic tokens to Tailwind utilities
 * - Keep Tailwind as a utility generator, not a design system
 * 
 * See: /docs/DESIGN_SYSTEM.md for full documentation
 */

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Responsive breakpoints from design tokens
    screens: {
      'sm': '640px',   // Mobile landscape / Small tablet
      'md': '768px',   // Tablet portrait
      'lg': '1024px',  // Desktop / Tablet landscape
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Extra large desktop
    },
    extend: {
      // ========================================
      // SPACING - From webOS Design System
      // ========================================
      spacing: {
        // Map design tokens to Tailwind spacing utilities
        'xs': 'var(--space-xs)',      // 4px
        'sm': 'var(--space-sm)',      // 8px
        'md': 'var(--space-md)',      // 12px
        'base': 'var(--space-base)',  // 16px
        'lg': 'var(--space-lg)',      // 24px
        'xl': 'var(--space-xl)',      // 32px
        '2xl': 'var(--space-2xl)',    // 48px
        '3xl': 'var(--space-3xl)',    // 64px
        '4xl': 'var(--space-4xl)',    // 96px
      },
      // ========================================
      // TYPOGRAPHY - From webOS Design System
      // ========================================
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono: ['var(--font-mono)'],
        display: ['var(--font-display)'],
      },
      fontSize: {
        '2xs': ['var(--text-2xs)', { lineHeight: 'var(--leading-tight)' }],    // 10px
        'xs': ['var(--text-xs)', { lineHeight: 'var(--leading-tight)' }],      // 11px
        'sm': ['var(--text-sm)', { lineHeight: 'var(--leading-normal)' }],     // 13px
        'base': ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }], // 14px
        'md': ['var(--text-md)', { lineHeight: 'var(--leading-normal)' }],     // 16px
        'lg': ['var(--text-lg)', { lineHeight: 'var(--leading-normal)' }],     // 18px
        'xl': ['var(--text-xl)', { lineHeight: 'var(--leading-tight)' }],      // 20px
        '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-tight)' }],    // 24px
        '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],    // 30px
        '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],    // 36px
        '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-tight)' }],    // 48px
        '6xl': ['var(--text-6xl)', { lineHeight: 'var(--leading-none)' }],     // 60px
      },
      fontWeight: {
        thin: 'var(--font-thin)',
        extralight: 'var(--font-extralight)',
        light: 'var(--font-light)',
        normal: 'var(--font-normal)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
      },
      letterSpacing: {
        tighter: 'var(--tracking-tighter)',
        tight: 'var(--tracking-tight)',
        normal: 'var(--tracking-normal)',
        wide: 'var(--tracking-wide)',
        wider: 'var(--tracking-wider)',
        widest: 'var(--tracking-widest)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // ========================================
      // BORDER RADIUS - From webOS Design System
      // ========================================
      borderRadius: {
        'none': 'var(--radius-none)',   // 0
        'xs': 'var(--radius-xs)',       // 2px
        'sm': 'var(--radius-sm)',       // 4px
        'DEFAULT': 'var(--radius-base)', // 6px
        'md': 'var(--radius-md)',       // 8px
        'lg': 'var(--radius-lg)',       // 12px
        'xl': 'var(--radius-xl)',       // 16px
        '2xl': 'var(--radius-2xl)',     // 20px
        '3xl': 'var(--radius-3xl)',     // 24px
        '4xl': 'var(--radius-4xl)',     // 32px
        'full': 'var(--radius-full)',   // 9999px
      },
      // ========================================
      // SHADOWS - From webOS Design System
      // ========================================
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow-base)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        '3xl': 'var(--shadow-3xl)',
        'inner': 'var(--shadow-inner)',
        'inner-sm': 'var(--shadow-inner-sm)',
        // Component Shadows
        'card': 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        'card-active': 'var(--shadow-card-active)',
        'navbar': 'var(--shadow-navbar)',
        'dropdown': 'var(--shadow-dropdown)',
        'modal': 'var(--shadow-modal)',
        'dock': 'var(--shadow-dock)',
        'focus': 'var(--shadow-focus)',
        'none': 'none',
      },
      // ========================================
      // BACKDROP BLUR - For glassmorphism
      // ========================================
      backdropBlur: {
        'xs': 'var(--blur-xs)',    // 4px
        'sm': 'var(--blur-sm)',    // 8px
        'DEFAULT': 'var(--blur-md)', // 12px
        'md': 'var(--blur-md)',    // 12px
        'lg': 'var(--blur-lg)',    // 20px
        'xl': 'var(--blur-xl)',    // 32px
      },
      colors: {
        // ========================================
        // WEBOS DESIGN SYSTEM COLORS
        // ========================================
        
        // Neutral Palette (Pure grays - no blue tints)
        neutral: {
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
          950: 'var(--neutral-950)',
        },
        
        // Text Colors
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          disabled: 'var(--text-disabled)',
          inverse: 'var(--text-inverse)',
          'on-accent': 'var(--text-on-accent)',
        },
        
        // Background Colors
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
          hover: 'var(--bg-hover)',
          active: 'var(--bg-active)',
          subtle: 'var(--bg-subtle)',
        },
        
        // Border Colors
        border: {
          DEFAULT: 'var(--border-light)',
          lightest: 'var(--border-lightest)',
          light: 'var(--border-light)',
          medium: 'var(--border-medium)',
          dark: 'var(--border-dark)',
          focus: 'var(--border-focus)',
        },
        
        // Accent Colors
        accent: {
          blue: 'var(--accent-blue)',
          'blue-light': 'var(--accent-blue-light)',
          'blue-dark': 'var(--accent-blue-dark)',
          'blue-subtle': 'var(--accent-blue-subtle)',
        },
        
        // Status Colors
        success: {
          DEFAULT: 'var(--status-success)',
          light: 'var(--status-success-light)',
          dark: 'var(--status-success-dark)',
          subtle: 'var(--status-success-subtle)',
        },
        error: {
          DEFAULT: 'var(--status-error)',
          light: 'var(--status-error-light)',
          dark: 'var(--status-error-dark)',
          subtle: 'var(--status-error-subtle)',
        },
        warning: {
          DEFAULT: 'var(--status-warning)',
          light: 'var(--status-warning-light)',
          dark: 'var(--status-warning-dark)',
          subtle: 'var(--status-warning-subtle)',
        },
        info: {
          DEFAULT: 'var(--status-info)',
          light: 'var(--status-info-light)',
          dark: 'var(--status-info-dark)',
          subtle: 'var(--status-info-subtle)',
        },
        
        // Chrome/Dark UI Colors
        chrome: {
          darkest: 'var(--chrome-darkest)',
          darker: 'var(--chrome-darker)',
          dark: 'var(--chrome-dark)',
          medium: 'var(--chrome-medium)',
          light: 'var(--chrome-light)',
          text: 'var(--chrome-text)',
          'text-secondary': 'var(--chrome-text-secondary)',
        },
        
        // Glass Effects
        glass: {
          'white-95': 'var(--glass-white-95)',
          'white-90': 'var(--glass-white-90)',
          'white-80': 'var(--glass-white-80)',
          'white-70': 'var(--glass-white-70)',
          'white-60': 'var(--glass-white-60)',
          'black-95': 'var(--glass-black-95)',
          'black-80': 'var(--glass-black-80)',
          'black-60': 'var(--glass-black-60)',
          'black-40': 'var(--glass-black-40)',
          'black-20': 'var(--glass-black-20)',
          'black-10': 'var(--glass-black-10)',
        },
        
        // Semantic Aliases (backwards compatibility with shadcn)
        background: 'var(--bg-primary)',
        foreground: 'var(--text-primary)',
        card: {
          DEFAULT: 'var(--bg-surface)',
          foreground: 'var(--text-primary)',
        },
        popover: {
          DEFAULT: 'var(--bg-surface)',
          foreground: 'var(--text-primary)',
        },
        primary: {
          DEFAULT: 'rgb(var(--accent-blue-rgb) / <alpha-value>)',
          foreground: 'var(--text-on-accent)',
        },
        secondary: {
          DEFAULT: 'var(--bg-secondary)',
          foreground: 'var(--text-primary)',
        },
        muted: {
          DEFAULT: 'var(--bg-hover)',
          foreground: 'var(--text-secondary)',
        },
        destructive: {
          DEFAULT: 'var(--status-error)',
          foreground: 'var(--text-on-accent)',
        },
        input: 'var(--border-light)',
        ring: 'var(--border-focus)',
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
      // TRANSITIONS - From webOS Design System
      // ========================================
      transitionTimingFunction: {
        'linear': 'var(--ease-linear)',
        'in': 'var(--ease-in)',
        'out': 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
        'sharp': 'var(--ease-sharp)',
        'smooth': 'var(--ease-smooth)',
        'spring': 'var(--ease-spring)',
      },
      transitionDuration: {
        'instant': 'var(--duration-instant)',   // 0ms
        'fast': 'var(--duration-fast)',         // 100ms
        'normal': 'var(--duration-normal)',     // 150ms
        'moderate': 'var(--duration-moderate)', // 200ms
        'slow': 'var(--duration-slow)',         // 300ms
        'slower': 'var(--duration-slower)',     // 400ms
        'slowest': 'var(--duration-slowest)',   // 500ms
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwind-scrollbar-hide')],
};
export default config;
