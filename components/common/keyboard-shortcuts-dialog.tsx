
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Command } from 'lucide-react';
import type { KeyboardShortcut } from '@/lib/desktop-interactions';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shortcuts: KeyboardShortcut[];
  appName?: string;
}

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
  shortcuts,
  appName = 'App',
}: KeyboardShortcutsDialogProps) {
  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category]!.push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  const formatShortcut = (shortcut: KeyboardShortcut) => {
    const keys: string[] = [];
    
    if (shortcut.ctrl) keys.push('Ctrl');
    if (shortcut.meta) keys.push('⌘');
    if (shortcut.shift) keys.push('Shift');
    if (shortcut.alt) keys.push('Alt');
    keys.push(shortcut.key.toUpperCase());
    
    return keys;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command size={20} />
            {appName} Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate faster and be more productive
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                {category}
              </h3>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {formatShortcut(shortcut).map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <Badge
                            variant="outline"
                            className="font-mono text-xs px-2 py-1 bg-white"
                          >
                            {key}
                          </Badge>
                          {keyIndex < formatShortcut(shortcut).length - 1 && (
                            <span className="text-gray-400 text-xs">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Press <Badge variant="outline" className="mx-1">Esc</Badge> to close this dialog
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

