'use client';

import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { useBuilderStore } from '@/lib/web-builder/store/builderStore';
import { Toolbar } from '../toolbar/Toolbar';
import { PropertiesPanel } from '../properties/PropertiesPanel';
import { RenderNode } from '../canvas/RenderNode';
import { cn } from '@/lib/utils';

// Import component resolvers (will be created later)
import { Container } from '../registry/components/Container';
import { Text } from '../registry/components/Text';
import { Button } from '../registry/components/Button';

const componentResolver = {
  Container,
  Text,
  Button,
};

export function CanvasPane() {
  const { ui, setComponentTree } = useBuilderStore();
  const { viewport, zoom, selectedNode } = ui;

  // Viewport dimensions
  const viewportDimensions = {
    desktop: { width: '100%', maxWidth: '1440px' },
    tablet: { width: '768px', maxWidth: '768px' },
    mobile: { width: '375px', maxWidth: '375px' },
  };

  const dimensions = viewportDimensions[viewport];

  return (
    <div className="flex flex-col h-full bg-[#EAEAEA] dark:bg-gray-950">
      {/* Toolbar */}
      <Toolbar />

      {/* Canvas Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Canvas */}
        <div className="flex-1 overflow-auto p-8">
          <div className="flex items-start justify-center min-h-full">
            <Editor
              resolver={componentResolver}
              onRender={RenderNode}
              onNodesChange={(query) => {
                const tree = query.serialize();
                setComponentTree(tree);
              }}
            >
              <div
                className="bg-white shadow-2xl transition-all duration-300"
                style={{
                  width: dimensions.width,
                  maxWidth: dimensions.maxWidth,
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center',
                  minHeight: '100vh',
                }}
              >
                <Frame>
                  <Element
                    is={Container}
                    canvas
                    className="min-h-screen"
                  >
                    {/* Initial empty canvas */}
                    <Element
                      is={Container}
                      canvas
                      className="p-8"
                    >
                      <Text text="Drag components here to start building" />
                    </Element>
                  </Element>
                </Frame>
              </div>
            </Editor>
          </div>
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <div className="w-80 border-l border-[var(--semantic-border-light)] dark:border-gray-700 bg-white dark:bg-gray-800">
            <PropertiesPanel />
          </div>
        )}
      </div>
    </div>
  );
}
