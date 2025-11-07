
'use client';

import { useEffect, useState } from 'react';
import { getPaletteById, ColorPalette } from '@/lib/color-palettes';

export function usePalette(): ColorPalette {
  const [palette, setPalette] = useState(() => getPaletteById('default'));

  useEffect(() => {
    const updatePalette = () => {
      const paletteId = sessionStorage.getItem('currentPalette') || 'default';
      setPalette(getPaletteById(paletteId));
    };

    // Initial update
    updatePalette();

    // Listen for palette changes
    window.addEventListener('storage', updatePalette);
    
    return () => {
      window.removeEventListener('storage', updatePalette);
    };
  }, []);

  return palette;
}
