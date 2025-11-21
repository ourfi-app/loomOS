'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Maximize2,
  Unplug,
  Sparkles,
  ListTodo,
  Mail,
  FileText,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Loom } from '@/lib/loom-store';
import { toast } from 'sonner';

/**
 * LoomContextMenu Component
 *
 * Right-click context menu for loom icons with AI-powered actions
 */

interface LoomContextMenuProps {
  loom: Loom | null;
  position: { x: number; y: number };
  isOpen: boolean;
  onClose: () => void;
  onRestore: () => void;
  onUnpin: () => void;
  onAnalyze: () => void;
  onCreateTaskList: () => void;
  onDraftEmail: () => void;
}

export function LoomContextMenu({
  loom,
  position,
  isOpen,
  onClose,
  onRestore,
  onUnpin,
  onAnalyze,
  onCreateTaskList,
  onDraftEmail,
}: LoomContextMenuProps) {
  const [menuPosition, setMenuPosition] = useState(position);

  useEffect(() => {
    // Adjust menu position to stay within viewport
    if (isOpen) {
      const menuWidth = 220;
      const menuHeight = 280;
      const adjustedX = Math.min(position.x, window.innerWidth - menuWidth - 20);
      const adjustedY = Math.min(position.y, window.innerHeight - menuHeight - 20);
      setMenuPosition({ x: adjustedX, y: adjustedY });
    }
  }, [isOpen, position]);

  useEffect(() => {
    // Close menu on click outside
    const handleClick = () => onClose();
    if (isOpen) {
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [isOpen, onClose]);

  if (!loom) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[10000]"
          style={{
            left: `${menuPosition.x}px`,
            top: `${menuPosition.y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={cn(
              'w-56 rounded-lg shadow-2xl p-2',
              'bg-background/95 backdrop-blur-xl',
              'border border-border/50'
            )}
          >
            {/* Restore Loom */}
            <button
              onClick={() => {
                onRestore();
                onClose();
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-md',
                'text-sm font-normal text-foreground',
                'hover:bg-muted transition-colors',
                'text-left'
              )}
            >
              <Maximize2 className="w-4 h-4 flex-shrink-0" />
              <span>Restore Loom</span>
            </button>

            {/* Unpin Loom */}
            <button
              onClick={() => {
                onUnpin();
                onClose();
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-md',
                'text-sm font-normal text-foreground',
                'hover:bg-muted transition-colors',
                'text-left'
              )}
            >
              <Unplug className="w-4 h-4 flex-shrink-0" />
              <span>Unpin Loom</span>
            </button>

            {/* Divider */}
            <div className="h-px bg-border/50 my-2" />

            {/* AI Actions */}
            <button
              onClick={() => {
                onAnalyze();
                onClose();
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-md',
                'text-sm font-normal text-foreground',
                'hover:bg-muted transition-colors',
                'text-left'
              )}
            >
              <Sparkles className="w-4 h-4 flex-shrink-0 text-[var(--semantic-accent)]" />
              <span>Analyze Loom</span>
            </button>

            <button
              onClick={() => {
                onCreateTaskList();
                onClose();
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-md',
                'text-sm font-normal text-foreground',
                'hover:bg-muted transition-colors',
                'text-left'
              )}
            >
              <ListTodo className="w-4 h-4 flex-shrink-0 text-[var(--semantic-primary)]" />
              <span>Create Task List</span>
            </button>

            <button
              onClick={() => {
                onDraftEmail();
                onClose();
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-md',
                'text-sm font-normal text-foreground',
                'hover:bg-muted transition-colors',
                'text-left'
              )}
            >
              <Mail className="w-4 h-4 flex-shrink-0 text-[var(--semantic-success)]" />
              <span>Draft Summary Email</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * LoomAIModal Component
 *
 * Modal for displaying AI-generated content from loom actions
 */

interface LoomAIModalProps {
  title: string;
  content: string;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
}

export function LoomAIModal({ title, content, isOpen, isLoading, onClose }: LoomAIModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10001] flex items-center justify-center"
          style={{
            background: 'var(--color-neutral-900/30)',
            backdropFilter: 'blur(10px)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={cn(
              'w-full max-w-2xl max-h-[80vh] rounded-xl shadow-2xl',
              'bg-background flex flex-col'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="card-spinner" />
                </div>
              ) : (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap font-light text-foreground leading-relaxed">
                    {content}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border flex justify-end">
              <button
                onClick={onClose}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  'bg-muted hover:bg-muted/80'
                )}
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
