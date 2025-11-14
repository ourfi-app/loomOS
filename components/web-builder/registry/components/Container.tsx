'use client';

import React from 'react';
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children?: React.ReactNode;
  className?: string;
  padding?: number;
  background?: string;
  flexDirection?: 'row' | 'column';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around';
}

export const Container = ({
  children,
  className = '',
  padding = 4,
  background = 'transparent',
  flexDirection = 'column',
  alignItems = 'start',
  justifyContent = 'start',
}: ContainerProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const alignMap = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      className={cn(
        'flex',
        flexDirection === 'row' ? 'flex-row' : 'flex-col',
        alignMap[alignItems],
        justifyMap[justifyContent],
        `p-${padding}`,
        className
      )}
      style={{ background }}
    >
      {children}
    </div>
  );
};

Container.craft = {
  displayName: 'Container',
  props: {
    padding: 4,
    background: 'transparent',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'start',
  },
  related: {
    settings: ContainerSettings,
  },
};

function ContainerSettings() {
  const {
    actions: { setProp },
    padding,
    background,
    flexDirection,
    alignItems,
    justifyContent,
  } = useNode((node) => ({
    padding: node.data.props.padding,
    background: node.data.props.background,
    flexDirection: node.data.props.flexDirection,
    alignItems: node.data.props.alignItems,
    justifyContent: node.data.props.justifyContent,
  }));

  return (
    <div className="space-y-4">
      {/* Padding */}
      <div>
        <label className="block text-xs font-medium text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] uppercase tracking-wider mb-2">
          Padding
        </label>
        <input
          type="range"
          min="0"
          max="12"
          value={padding}
          onChange={(e) => setProp((props: ContainerProps) => (props.padding = parseInt(e.target.value)))}
          className="w-full"
        />
        <div className="text-xs text-[var(--semantic-text-tertiary)] mt-1">
          {padding * 4}px
        </div>
      </div>

      {/* Background */}
      <div>
        <label className="block text-xs font-medium text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] uppercase tracking-wider mb-2">
          Background
        </label>
        <input
          type="color"
          value={background === 'transparent' ? '#ffffff' : background}
          onChange={(e) => setProp((props: ContainerProps) => (props.background = e.target.value))}
          className="w-full h-10 rounded-lg cursor-pointer"
        />
      </div>

      {/* Flex Direction */}
      <div>
        <label className="block text-xs font-medium text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] uppercase tracking-wider mb-2">
          Direction
        </label>
        <select
          value={flexDirection}
          onChange={(e) => setProp((props: ContainerProps) => (props.flexDirection = e.target.value as 'row' | 'column'))}
          className="w-full px-3 py-2 bg-[var(--semantic-bg-subtle)] dark:bg-gray-900 border border-[var(--semantic-border-light)] dark:border-gray-700 rounded-lg text-sm"
        >
          <option value="column">Column</option>
          <option value="row">Row</option>
        </select>
      </div>
    </div>
  );
}
