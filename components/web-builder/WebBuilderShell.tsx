'use client';

import React from 'react';
import { ThreePaneLayout } from '@/components/loomos/layouts/ThreePaneLayout';
import { NavigationPane } from './panes/NavigationPane';
import { ComponentLibraryPane } from './panes/ComponentLibraryPane';
import { CanvasPane } from './panes/CanvasPane';
import { AIDrawer } from './ai/AIDrawer';

export function WebBuilderShell() {
  return (
    <>
      <ThreePaneLayout
        left={<NavigationPane />}
        center={<ComponentLibraryPane />}
        right={<CanvasPane />}
        leftWidth={200}
        centerWidth={320}
        collapsible={['left', 'center']}
      />
      <AIDrawer />
    </>
  );
}
