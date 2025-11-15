
'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ContextMenuItem } from '@/lib/desktop-interactions';

interface DesktopContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export function DesktopContextMenu({ x, y, items, onClose }: DesktopContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Adjust position to keep menu in viewport
  useEffect(() => {
    if (!menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    // Adjust horizontal position
    if (rect.right > viewportWidth) {
      adjustedX = viewportWidth - rect.width - 10;
    }

    // Adjust vertical position
    if (rect.bottom > viewportHeight) {
      adjustedY = viewportHeight - rect.height - 10;
    }

    menu.style.left = `${adjustedX}px`;
    menu.style.top = `${adjustedY}px`;
  }, [x, y]);

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[9999] min-w-[200px] rounded-lg border border-[var(--semantic-border-light)] bg-white shadow-xl"
        style={{ left: x, top: y }}
      >
        <div className="py-1">
          {items.map((item, index) => {
            if (item.separator) {
              return <div key={`sep-${index}`} className="my-1 border-t border-[var(--semantic-border-light)]" />;
            }

            return (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!item.disabled) {
                    item.onClick();
                    onClose();
                  }
                }}
                disabled={item.disabled}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors',
                  'hover:bg-[var(--semantic-surface-hover)] active:bg-[var(--semantic-bg-muted)]',
                  'focus:outline-none focus:bg-[var(--semantic-surface-hover)]',
                  item.disabled && 'cursor-not-allowed opacity-50',
                  item.danger && 'text-[var(--semantic-error)] hover:bg-[var(--semantic-error-bg)] active:bg-[var(--semantic-error-bg)]'
                )}
              >
                {item.icon && (
                  <span className="flex-shrink-0 text-[var(--semantic-text-tertiary)]">
                    {item.icon}
                  </span>
                )}
                <span className="flex-1 text-left">{item.label}</span>
                {item.shortcut && (
                  <span className="text-xs text-[var(--semantic-text-tertiary)]">{item.shortcut}</span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Portal component for rendering context menu at body level
 */
export function ContextMenuPortal({ 
  contextMenu, 
  onClose 
}: { 
  contextMenu: { x: number; y: number; items: ContextMenuItem[] } | null;
  onClose: () => void;
}) {
  if (!contextMenu) return null;

  return (
    <>
      {/* Backdrop to catch clicks */}
      <div 
        className="fixed inset-0 z-[9998]" 
        onClick={onClose}
        onContextMenu={(e) => e.preventDefault()}
      />
      <DesktopContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        items={contextMenu.items}
        onClose={onClose}
      />
    </>
  );
}

