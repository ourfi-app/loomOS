
export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    highlight: string;
    background: string;
  };
  gradient: string;
}

export const COLOR_PALETTES: Record<string, ColorPalette> = {
  default: {
    id: 'default',
    name: 'Ocean Breeze',
    description: 'Professional and modern with ocean-inspired blues',
    colors: {
      primary: '#FF6B35',
      secondary: '#F7C59F',
      accent: '#EFEFD0',
      highlight: '#004E89',
      background: '#1A659E',
    },
    gradient: 'from-blue-500 to-blue-600',
  },
  
  tropical: {
    id: 'tropical',
    name: 'Tropical Paradise',
    description: 'Warm and inviting with earthy tones',
    colors: {
      primary: '#264653',
      secondary: '#2A9D8F',
      accent: '#E9C46A',
      highlight: '#F4A261',
      background: '#E76F51',
    },
    gradient: 'from-teal-600 to-orange-500',
  },
  
  sunset: {
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Bold and energetic with warm sunset hues',
    colors: {
      primary: '#5F0F40',
      secondary: '#9A031E',
      accent: '#FB8B24',
      highlight: '#E36414',
      background: '#0F4C5C',
    },
    gradient: 'from-red-700 to-orange-500',
  },
  
  vibrant: {
    id: 'vibrant',
    name: 'Vibrant Energy',
    description: 'Fresh and dynamic with vibrant colors',
    colors: {
      primary: '#EF476F',
      secondary: '#FFD166',
      accent: '#06D6A0',
      highlight: '#118AB2',
      background: '#073B4C',
    },
    gradient: 'from-pink-500 to-cyan-500',
  },
  
  midnight: {
    id: 'midnight',
    name: 'Midnight Sky',
    description: 'Sophisticated and elegant with deep contrasts',
    colors: {
      primary: '#011627',
      secondary: '#FDFFFC',
      accent: '#2EC4B6',
      highlight: '#FF9F1C',
      background: '#E71D36',
    },
    gradient: 'from-slate-900 to-red-600',
  },
};

export function getPaletteById(id: string): ColorPalette {
  return (COLOR_PALETTES[id] ?? COLOR_PALETTES.default) as ColorPalette;
}

export function getAllPalettes(): ColorPalette[] {
  return Object.values(COLOR_PALETTES);
}

// Generate CSS variables for a palette
export function generatePaletteCSS(palette: ColorPalette): string {
  return `
    :root {
      --palette-primary: ${palette.colors.primary};
      --palette-secondary: ${palette.colors.secondary};
      --palette-accent: ${palette.colors.accent};
      --palette-highlight: ${palette.colors.highlight};
      --palette-background: ${palette.colors.background};
    }
  `;
}
