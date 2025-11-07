import { SerializedNodes } from '@craftjs/core';

export interface Project {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  componentTree?: SerializedNodes;
  theme: ThemeConfig;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    scale: number; // Multiplier for spacing (1 = normal, 1.5 = spacious, 0.75 = compact)
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface ImageAsset {
  id: string;
  filename: string;
  url: string;
  width: number;
  height: number;
  size: number;
}

export interface IconAsset {
  id: string;
  name: string;
  category: string;
}

export interface BuilderUI {
  selectedNode: string | null;
  viewport: 'desktop' | 'tablet' | 'mobile';
  aiDrawerOpen: boolean;
  isDragging: boolean;
  zoom: number;
}

export const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#F18825', // loomOS orange
    secondary: '#1F2937',
    accent: '#3B82F6',
    background: '#FFFFFF',
    foreground: '#111827',
  },
  fonts: {
    heading: 'Cambo, Georgia, serif',
    body: 'Titillium Web, system-ui, sans-serif',
  },
  spacing: {
    scale: 1,
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
};
