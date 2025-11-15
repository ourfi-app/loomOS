'use client';

import React from 'react';
import { useNode } from '@craftjs/core';
import { cn } from '@/lib/utils';

interface ButtonProps {
  text?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}

export const Button = ({
  text = 'Click me',
  variant = 'primary',
  size = 'md',
  href,
  className = '',
}: ButtonProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const variantStyles = {
    primary: 'bg-loomos-orange text-white hover:bg-loomos-orange-dark',
    secondary: 'bg-[var(--semantic-bg-muted)] dark:bg-[var(--semantic-text-secondary)] text-[var(--semantic-text-primary)] dark:text-[var(--semantic-text-inverse)] hover:bg-[var(--semantic-bg-muted)] dark:hover:bg-[var(--semantic-text-secondary)]',
    outline: 'border-2 border-loomos-orange text-loomos-orange hover:bg-loomos-orange hover:text-white',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component
      ref={(ref) => ref && connect(drag(ref as HTMLElement))}
      href={href}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {text}
    </Component>
  );
};

Button.craft = {
  displayName: 'Button',
  props: {
    text: 'Click me',
    variant: 'primary',
    size: 'md',
    href: '',
  },
  related: {
    settings: ButtonSettings,
  },
};

function ButtonSettings() {
  const {
    actions: { setProp },
    text,
    variant,
    size,
    href,
  } = useNode((node) => ({
    text: node.data.props.text,
    variant: node.data.props.variant,
    size: node.data.props.size,
    href: node.data.props.href,
  }));

  return (
    <div className="space-y-4">
      {/* Button Text */}
      <div>
        <label className="block text-xs font-medium text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] uppercase tracking-wider mb-2">
          Button Text
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setProp((props: ButtonProps) => (props.text = e.target.value))}
          className="w-full px-3 py-2 bg-[var(--semantic-bg-subtle)] dark:bg-[var(--semantic-text-primary)] border border-[var(--semantic-border-light)] dark:border-[var(--semantic-border-strong)] rounded-lg text-sm"
          placeholder="Button text..."
        />
      </div>

      {/* Variant */}
      <div>
        <label className="block text-xs font-medium text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] uppercase tracking-wider mb-2">
          Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['primary', 'secondary', 'outline'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setProp((props: ButtonProps) => (props.variant = v))}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium transition-colors capitalize',
                variant === v
                  ? 'bg-loomos-orange text-white'
                  : 'bg-[var(--semantic-surface-hover)] dark:bg-[var(--semantic-text-primary)] text-[var(--semantic-text-secondary)] dark:text-[var(--semantic-text-tertiary)] hover:bg-[var(--semantic-bg-muted)] dark:hover:bg-[var(--semantic-text-secondary)]'
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <label className="block text-xs font-medium text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] uppercase tracking-wider mb-2">
          Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setProp((props: ButtonProps) => (props.size = s))}
              className={cn(
                'px-3 py-2 rounded-lg text-xs font-medium transition-colors uppercase',
                size === s
                  ? 'bg-loomos-orange text-white'
                  : 'bg-[var(--semantic-surface-hover)] dark:bg-[var(--semantic-text-primary)] text-[var(--semantic-text-secondary)] dark:text-[var(--semantic-text-tertiary)] hover:bg-[var(--semantic-bg-muted)] dark:hover:bg-[var(--semantic-text-secondary)]'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Link URL */}
      <div>
        <label className="block text-xs font-medium text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)] uppercase tracking-wider mb-2">
          Link URL (optional)
        </label>
        <input
          type="text"
          value={href}
          onChange={(e) => setProp((props: ButtonProps) => (props.href = e.target.value))}
          className="w-full px-3 py-2 bg-[var(--semantic-bg-subtle)] dark:bg-[var(--semantic-text-primary)] border border-[var(--semantic-border-light)] dark:border-[var(--semantic-border-strong)] rounded-lg text-sm"
          placeholder="https://..."
        />
      </div>
    </div>
  );
}
