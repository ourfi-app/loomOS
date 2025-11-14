'use client';

import React from 'react';
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';

interface TextProps {
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  className?: string;
}

export const Text = ({
  text = 'Edit this text',
  fontSize = 16,
  fontWeight = 'normal',
  color = '#000000',
  textAlign = 'left',
  className = '',
}: TextProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const weightMap = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };

  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <p
      ref={(ref) => ref && connect(drag(ref))}
      className={cn(weightMap[fontWeight], alignMap[textAlign], className)}
      style={{ fontSize: `${fontSize}px`, color }}
    >
      {text}
    </p>
  );
};

Text.craft = {
  displayName: 'Text',
  props: {
    text: 'Edit this text',
    fontSize: 16,
    fontWeight: 'normal',
    color: '#000000',
    textAlign: 'left',
  },
  related: {
    settings: TextSettings,
  },
};

function TextSettings() {
  const {
    actions: { setProp },
    text,
    fontSize,
    fontWeight,
    color,
    textAlign,
  } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    fontWeight: node.data.props.fontWeight,
    color: node.data.props.color,
    textAlign: node.data.props.textAlign,
  }));

  return (
    <div className="space-y-4">
      {/* Text Content */}
      <div>
        <label className="block text-xs font-medium text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] uppercase tracking-wider mb-2">
          Content
        </label>
        <textarea
          value={text}
          onChange={(e) => setProp((props: TextProps) => (props.text = e.target.value))}
          className="w-full px-3 py-2 bg-[var(--semantic-bg-subtle)] dark:bg-gray-900 border border-[var(--semantic-border-light)] dark:border-gray-700 rounded-lg text-sm min-h-[100px]"
          placeholder="Enter text..."
        />
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-xs font-medium text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] uppercase tracking-wider mb-2">
          Font Size
        </label>
        <input
          type="range"
          min="12"
          max="72"
          value={fontSize}
          onChange={(e) => setProp((props: TextProps) => (props.fontSize = parseInt(e.target.value)))}
          className="w-full"
        />
        <div className="text-xs text-[var(--semantic-text-tertiary)] mt-1">
          {fontSize}px
        </div>
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-xs font-medium text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] uppercase tracking-wider mb-2">
          Font Weight
        </label>
        <select
          value={fontWeight}
          onChange={(e) => setProp((props: TextProps) => (props.fontWeight = e.target.value as TextProps['fontWeight']))}
          className="w-full px-3 py-2 bg-[var(--semantic-bg-subtle)] dark:bg-gray-900 border border-[var(--semantic-border-light)] dark:border-gray-700 rounded-lg text-sm"
        >
          <option value="normal">Normal</option>
          <option value="medium">Medium</option>
          <option value="semibold">Semibold</option>
          <option value="bold">Bold</option>
        </select>
      </div>

      {/* Color */}
      <div>
        <label className="block text-xs font-medium text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] uppercase tracking-wider mb-2">
          Color
        </label>
        <input
          type="color"
          value={color}
          onChange={(e) => setProp((props: TextProps) => (props.color = e.target.value))}
          className="w-full h-10 rounded-lg cursor-pointer"
        />
      </div>

      {/* Text Align */}
      <div>
        <label className="block text-xs font-medium text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] uppercase tracking-wider mb-2">
          Alignment
        </label>
        <div className="flex gap-2">
          {(['left', 'center', 'right'] as const).map((align) => (
            <button
              key={align}
              onClick={() => setProp((props: TextProps) => (props.textAlign = align))}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                textAlign === align
                  ? 'bg-loomos-orange text-white'
                  : 'bg-[var(--semantic-surface-hover)] dark:bg-gray-800 text-[var(--semantic-text-secondary)] dark:text-gray-300 hover:bg-[var(--semantic-bg-muted)] dark:hover:bg-gray-700'
              )}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
