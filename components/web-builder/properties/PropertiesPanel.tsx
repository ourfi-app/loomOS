'use client';

import React from 'react';
import { useEditor } from '@craftjs/core';
import { X, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBuilderStore } from '@/lib/web-builder/store/builderStore';

export function PropertiesPanel() {
  const { setSelectedNode } = useBuilderStore();
  const { actions, selected, isEnabled } = useEditor((state, query) => {
    const currentNodeId = query.getEvent('selected').last();
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.custom?.displayName || state.nodes[currentNodeId].data.displayName,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return {
      selected,
      isEnabled: state.options.enabled,
    };
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--semantic-border-light)] dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-[var(--semantic-text-secondary)] dark:text-[var(--semantic-text-tertiary)]" />
          <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)] dark:text-gray-100">
            Properties
          </h3>
        </div>
        <button
          onClick={() => {
            actions.selectNode(undefined);
            setSelectedNode(null);
          }}
          className="p-1.5 rounded-lg hover:bg-[var(--semantic-surface-hover)] dark:hover:bg-gray-700 transition-colors"
          aria-label="Close properties panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {selected ? (
          <div>
            {/* Component Name */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] uppercase tracking-wider mb-2">
                Component
              </label>
              <div className="px-3 py-2 bg-[var(--semantic-bg-subtle)] dark:bg-gray-900 rounded-lg text-sm font-medium text-[var(--semantic-text-primary)] dark:text-gray-100">
                {selected.name}
              </div>
            </div>

            {/* Component-specific settings */}
            {selected.settings && React.createElement(selected.settings)}

            {/* Delete Button */}
            {selected.isDeletable && (
              <div className="mt-6 pt-6 border-t border-[var(--semantic-border-light)] dark:border-gray-700">
                <button
                  onClick={() => {
                    actions.delete(selected.id);
                    setSelectedNode(null);
                  }}
                  className={cn(
                    'w-full px-4 py-2 rounded-lg transition-colors min-h-[44px]',
                    'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
                    'hover:bg-red-100 dark:hover:bg-red-900/40 font-medium text-sm'
                  )}
                >
                  Delete Component
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)]">
            <Settings2 className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-sm">No component selected</p>
            <p className="text-xs mt-1">Click on a component to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
}
