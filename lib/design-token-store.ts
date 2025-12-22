'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface DesignTokens {
  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    textPrimary: string;
    textSecondary: string;
    bgBase: string;
    bgSurface: string;
  };
  // Spacing
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  // Typography
  typography: {
    baseFontSize: string;
    fontWeightNormal: string;
    fontWeightMedium: string;
    fontWeightBold: string;
    lineHeightNormal: string;
    lineHeightRelaxed: string;
  };
  // Elevation
  elevation: {
    shadowSm: string;
    shadowMd: string;
    shadowLg: string;
    shadowXl: string;
  };
  // Glassmorphism
  glassmorphism: {
    blurSm: string;
    blurMd: string;
    blurLg: string;
    blurXl: string;
    backdropSaturate: string;
    glassOpacity: string;
  };
  // Motion
  motion: {
    durationFast: string;
    durationNormal: string;
    durationSlow: string;
    easeStandard: string;
    easeSpring: string;
  };
  // Border Radius
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
}

export const DEFAULT_TOKENS: DesignTokens = {
  colors: {
    primary: '#F18825',
    secondary: '#2B8ED9',
    accent: '#4CAF50',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    textPrimary: '#4a4a4a',
    textSecondary: '#6a6a6a',
    bgBase: '#fafaf9',
    bgSurface: '#ffffff',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
  },
  typography: {
    baseFontSize: '14px',
    fontWeightNormal: '400',
    fontWeightMedium: '500',
    fontWeightBold: '700',
    lineHeightNormal: '1.5',
    lineHeightRelaxed: '1.625',
  },
  elevation: {
    shadowSm: '0 2px 4px rgba(0, 0, 0, 0.08)',
    shadowMd: '0 4px 12px rgba(0, 0, 0, 0.12)',
    shadowLg: '0 8px 24px rgba(0, 0, 0, 0.15)',
    shadowXl: '0 16px 48px rgba(0, 0, 0, 0.18)',
  },
  glassmorphism: {
    blurSm: '8px',
    blurMd: '10px',
    blurLg: '16px',
    blurXl: '24px',
    backdropSaturate: 'saturate(180%)',
    glassOpacity: '0.8',
  },
  motion: {
    durationFast: '150ms',
    durationNormal: '200ms',
    durationSlow: '300ms',
    easeStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeSpring: 'cubic-bezier(0.42, 0, 0.58, 1)',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
};

interface DesignTokenStore {
  tokens: DesignTokens;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  setTokens: (tokens: Partial<DesignTokens>) => void;
  updateTokenCategory: <K extends keyof DesignTokens>(
    category: K,
    updates: Partial<DesignTokens[K]>
  ) => void;
  resetToDefaults: () => void;
  exportTokens: () => string;
}

export const useDesignTokenStore = create<DesignTokenStore>()(persist(
  (set, get) => ({
    tokens: DEFAULT_TOKENS,
    hasHydrated: false,
    setHasHydrated: (state) => set({ hasHydrated: state }),
    setTokens: (tokens) => {
      set((state) => ({
        tokens: {
          ...state.tokens,
          ...tokens,
        },
      }));
    },
    updateTokenCategory: (category, updates) => {
      set((state) => ({
        tokens: {
          ...state.tokens,
          [category]: {
            ...state.tokens[category],
            ...updates,
          },
        },
      }));
    },
    resetToDefaults: () => {
      set({ tokens: DEFAULT_TOKENS });
    },
    exportTokens: () => {
      const { tokens } = get();
      return generateCSSFromTokens(tokens);
    },
  }),
  {
    name: 'design-token-storage',
    onRehydrateStorage: () => (state) => {
      state?.setHasHydrated(true);
    },
  }
));

// Generate CSS from tokens
export function generateCSSFromTokens(tokens: DesignTokens): string {
  return `
/* Custom Design Tokens - Generated */
:root {
  /* Colors */
  --loomos-orange: ${tokens.colors.primary};
  --trust-blue: ${tokens.colors.secondary};
  --growth-green: ${tokens.colors.accent};
  --semantic-primary: ${tokens.colors.primary};
  --semantic-accent: ${tokens.colors.secondary};
  --semantic-tertiary: ${tokens.colors.accent};
  --success-green: ${tokens.colors.success};
  --warning-orange: ${tokens.colors.warning};
  --error-red: ${tokens.colors.error};
  --text-primary: ${tokens.colors.textPrimary};
  --text-secondary: ${tokens.colors.textSecondary};
  --semantic-bg-base: ${tokens.colors.bgBase};
  --semantic-surface-base: ${tokens.colors.bgSurface};
  
  /* Spacing */
  --space-xs: ${tokens.spacing.xs};
  --space-sm: ${tokens.spacing.sm};
  --space-md: ${tokens.spacing.md};
  --space-lg: ${tokens.spacing.lg};
  --space-xl: ${tokens.spacing.xl};
  --space-2xl: ${tokens.spacing['2xl']};
  
  /* Typography */
  --text-base: ${tokens.typography.baseFontSize};
  --font-normal: ${tokens.typography.fontWeightNormal};
  --font-medium: ${tokens.typography.fontWeightMedium};
  --font-bold: ${tokens.typography.fontWeightBold};
  --leading-normal: ${tokens.typography.lineHeightNormal};
  --leading-relaxed: ${tokens.typography.lineHeightRelaxed};
  
  /* Elevation */
  --shadow-sm: ${tokens.elevation.shadowSm};
  --shadow-md: ${tokens.elevation.shadowMd};
  --shadow-lg: ${tokens.elevation.shadowLg};
  --shadow-xl: ${tokens.elevation.shadowXl};
  
  /* Glassmorphism */
  --blur-sm: ${tokens.glassmorphism.blurSm};
  --blur-md: ${tokens.glassmorphism.blurMd};
  --blur-lg: ${tokens.glassmorphism.blurLg};
  --blur-xl: ${tokens.glassmorphism.blurXl};
  --backdrop-saturate: ${tokens.glassmorphism.backdropSaturate};
  --glass-opacity: ${tokens.glassmorphism.glassOpacity};
  
  /* Motion */
  --duration-fast: ${tokens.motion.durationFast};
  --duration-normal: ${tokens.motion.durationNormal};
  --duration-slow: ${tokens.motion.durationSlow};
  --ease-standard: ${tokens.motion.easeStandard};
  --ease-spring: ${tokens.motion.easeSpring};
  
  /* Border Radius */
  --radius-sm: ${tokens.radius.sm};
  --radius-md: ${tokens.radius.md};
  --radius-lg: ${tokens.radius.lg};
  --radius-xl: ${tokens.radius.xl};
  --radius-full: ${tokens.radius.full};
}
`;
}

// Apply tokens to the document
export function applyTokensToDocument(tokens: DesignTokens) {
  const root = document.documentElement;
  
  // Colors
  root.style.setProperty('--loomos-orange', tokens.colors.primary);
  root.style.setProperty('--trust-blue', tokens.colors.secondary);
  root.style.setProperty('--growth-green', tokens.colors.accent);
  root.style.setProperty('--semantic-primary', tokens.colors.primary);
  root.style.setProperty('--semantic-accent', tokens.colors.secondary);
  root.style.setProperty('--semantic-tertiary', tokens.colors.accent);
  root.style.setProperty('--success-green', tokens.colors.success);
  root.style.setProperty('--warning-orange', tokens.colors.warning);
  root.style.setProperty('--error-red', tokens.colors.error);
  root.style.setProperty('--text-primary', tokens.colors.textPrimary);
  root.style.setProperty('--text-secondary', tokens.colors.textSecondary);
  root.style.setProperty('--semantic-bg-base', tokens.colors.bgBase);
  root.style.setProperty('--semantic-surface-base', tokens.colors.bgSurface);
  
  // Spacing
  root.style.setProperty('--space-xs', tokens.spacing.xs);
  root.style.setProperty('--space-sm', tokens.spacing.sm);
  root.style.setProperty('--space-md', tokens.spacing.md);
  root.style.setProperty('--space-lg', tokens.spacing.lg);
  root.style.setProperty('--space-xl', tokens.spacing.xl);
  root.style.setProperty('--space-2xl', tokens.spacing['2xl']);
  
  // Typography
  root.style.setProperty('--text-base', tokens.typography.baseFontSize);
  root.style.setProperty('--font-normal', tokens.typography.fontWeightNormal);
  root.style.setProperty('--font-medium', tokens.typography.fontWeightMedium);
  root.style.setProperty('--font-bold', tokens.typography.fontWeightBold);
  root.style.setProperty('--leading-normal', tokens.typography.lineHeightNormal);
  root.style.setProperty('--leading-relaxed', tokens.typography.lineHeightRelaxed);
  
  // Elevation
  root.style.setProperty('--shadow-sm', tokens.elevation.shadowSm);
  root.style.setProperty('--shadow-md', tokens.elevation.shadowMd);
  root.style.setProperty('--shadow-lg', tokens.elevation.shadowLg);
  root.style.setProperty('--shadow-xl', tokens.elevation.shadowXl);
  
  // Glassmorphism
  root.style.setProperty('--blur-sm', tokens.glassmorphism.blurSm);
  root.style.setProperty('--blur-md', tokens.glassmorphism.blurMd);
  root.style.setProperty('--blur-lg', tokens.glassmorphism.blurLg);
  root.style.setProperty('--blur-xl', tokens.glassmorphism.blurXl);
  root.style.setProperty('--backdrop-saturate', tokens.glassmorphism.backdropSaturate);
  
  // Motion
  root.style.setProperty('--duration-fast', tokens.motion.durationFast);
  root.style.setProperty('--duration-normal', tokens.motion.durationNormal);
  root.style.setProperty('--duration-slow', tokens.motion.durationSlow);
  root.style.setProperty('--ease-standard', tokens.motion.easeStandard);
  root.style.setProperty('--ease-spring', tokens.motion.easeSpring);
  
  // Border Radius
  root.style.setProperty('--radius-sm', tokens.radius.sm);
  root.style.setProperty('--radius-md', tokens.radius.md);
  root.style.setProperty('--radius-lg', tokens.radius.lg);
  root.style.setProperty('--radius-xl', tokens.radius.xl);
  root.style.setProperty('--radius-full', tokens.radius.full);
}
