
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { ColorPalette } from '@/lib/color-palettes';
import { cn } from '@/lib/utils';

interface PaletteSelectorProps {
  palettes: ColorPalette[];
  selectedPaletteId: string;
  onSelect: (paletteId: string) => void;
}

export function PaletteSelector({ palettes, selectedPaletteId, onSelect }: PaletteSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {palettes.map((palette) => (
        <Card
          key={palette.id}
          className={cn(
            'cursor-pointer transition-all hover:shadow-lg',
            selectedPaletteId === palette.id && 'ring-2 ring-blue-600'
          )}
          onClick={() => onSelect(palette.id)}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Palette Name */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{palette.name}</h3>
                {selectedPaletteId === palette.id && (
                  <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              
              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2">
                {palette.description}
              </p>
              
              {/* Color Swatches */}
              <div className="flex gap-1.5">
                {Object.entries(palette.colors).map(([key, color]) => (
                  <div
                    key={key}
                    className="flex-1 h-8 rounded transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                    title={key}
                  />
                ))}
              </div>
              
              {/* Gradient Preview */}
              <div 
                className={cn(
                  'h-2 rounded-full bg-gradient-to-r',
                  palette.gradient
                )}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
