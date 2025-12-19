export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
  };
  gradient: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'default',
    name: 'loomOS Orange',
    description: 'Default loomOS theme with warm orange tones',
    colors: {
      primary: '#F18825',
      secondary: '#2B8ED9',
      accent: '#4CAF50',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
    },
    gradient: 'from-orange-400 via-orange-500 to-orange-600',
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    description: 'Cool and calming ocean-inspired palette',
    colors: {
      primary: '#0077BE',
      secondary: '#00A8E8',
      accent: '#00D9FF',
      success: '#00C49A',
      warning: '#FFA62B',
      error: '#FF5A5F',
    },
    gradient: 'from-blue-400 via-cyan-500 to-teal-600',
  },
  {
    id: 'forest',
    name: 'Forest Green',
    description: 'Natural earthy tones inspired by forests',
    colors: {
      primary: '#2D5016',
      secondary: '#4A7C59',
      accent: '#7CB342',
      success: '#66BB6A',
      warning: '#FFB300',
      error: '#E53935',
    },
    gradient: 'from-green-600 via-green-500 to-lime-500',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm sunset colors with purple and pink hues',
    colors: {
      primary: '#FF6B6B',
      secondary: '#C44569',
      accent: '#8B5CF6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    gradient: 'from-red-400 via-pink-500 to-purple-600',
  },
  {
    id: 'corporate',
    name: 'Corporate Blue',
    description: 'Professional corporate blue palette',
    colors: {
      primary: '#1E3A8A',
      secondary: '#3B82F6',
      accent: '#60A5FA',
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
    },
    gradient: 'from-blue-700 via-blue-600 to-blue-500',
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Elegant grayscale palette',
    colors: {
      primary: '#374151',
      secondary: '#6B7280',
      accent: '#9CA3AF',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    gradient: 'from-gray-700 via-gray-600 to-gray-500',
  },
];

export function getPaletteById(id: string): ColorPalette {
  return COLOR_PALETTES.find(p => p.id === id) || COLOR_PALETTES[0];
}

export function generatePaletteCSS(palette: ColorPalette): string {
  return `
    :root {
      --loomos-orange: ${palette.colors.primary};
      --trust-blue: ${palette.colors.secondary};
      --growth-green: ${palette.colors.accent};
      --semantic-primary: ${palette.colors.primary};
      --semantic-accent: ${palette.colors.secondary};
      --semantic-tertiary: ${palette.colors.accent};
      --success-green: ${palette.colors.success};
      --warning-orange: ${palette.colors.warning};
      --error-red: ${palette.colors.error};
    }
  `;
}
