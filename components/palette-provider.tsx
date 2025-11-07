
'use client';

import { useEffect, useState } from 'react';
import { getPaletteById, generatePaletteCSS } from '@/lib/color-palettes';

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [paletteId, setPaletteId] = useState('default');

  useEffect(() => {
    // Fetch the current palette
    const fetchPalette = async () => {
      try {
        const response = await fetch('/api/admin/palette');
        if (response.ok) {
          const data = await response.json();
          setPaletteId(data.paletteId || 'default');
        }
      } catch (error) {
        console.error('Failed to fetch palette:', error);
      }
    };

    fetchPalette();
  }, []);

  useEffect(() => {
    // Apply the palette to the document
    const palette = getPaletteById(paletteId);
    const css = generatePaletteCSS(palette);
    
    // Remove existing palette style tag
    const existingStyle = document.getElementById('palette-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Add new palette style tag
    const style = document.createElement('style');
    style.id = 'palette-styles';
    style.textContent = css;
    document.head.appendChild(style);

    // Store palette ID in sessionStorage for other components to use
    sessionStorage.setItem('currentPalette', paletteId);
  }, [paletteId]);

  return <>{children}</>;
}
