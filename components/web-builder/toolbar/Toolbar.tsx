'use client';

import React from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Eye,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBuilderStore } from '@/lib/web-builder/store/builderStore';

export function Toolbar() {
  const { ui, setViewport, setZoom, undo, redo, canUndo, canRedo } = useBuilderStore();
  const { viewport, zoom } = ui;

  const viewports = [
    { id: 'desktop' as const, icon: Monitor, label: 'Desktop' },
    { id: 'tablet' as const, icon: Tablet, label: 'Tablet' },
    { id: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
  ];

  const handleZoomIn = () => setZoom(zoom + 0.1);
  const handleZoomOut = () => setZoom(zoom - 0.1);
  const handleZoomReset = () => setZoom(1);

  return (
    <div className="flex items-center justify-between px-4 h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Left: Undo/Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={undo}
          disabled={!canUndo()}
          className={cn(
            'p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center',
            canUndo()
              ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          )}
          aria-label="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo()}
          className={cn(
            'p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center',
            canRedo()
              ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          )}
          aria-label="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />

        {/* Zoom Controls */}
        <button
          onClick={handleZoomOut}
          disabled={zoom <= 0.25}
          className={cn(
            'p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center',
            zoom > 0.25
              ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          )}
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomReset}
          className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={handleZoomIn}
          disabled={zoom >= 2}
          className={cn(
            'p-2 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center',
            zoom < 2
              ? 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
          )}
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Viewport Switcher */}
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
        {viewports.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setViewport(id)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors min-h-[44px]',
              viewport === id
                ? 'bg-white dark:bg-gray-800 shadow-sm text-loomos-orange'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            )}
            aria-label={label}
            aria-current={viewport === id ? 'true' : undefined}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Right: Preview & Export */}
      <div className="flex items-center gap-2">
        <button
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors min-h-[44px]',
            'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          )}
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium">Preview</span>
        </button>
        <button
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors min-h-[44px]',
            'bg-loomos-orange text-white hover:bg-loomos-orange-dark'
          )}
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Export</span>
        </button>
      </div>
    </div>
  );
}
