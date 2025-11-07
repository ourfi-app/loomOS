
'use client';

import { useState } from 'react';
import { X, Search, Command } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useKeyboardShortcuts, getShortcutDisplay, type Shortcut } from '@/lib/keyboard-shortcuts';

export function KeyboardShortcutsPanel({ 
  open, 
  onClose 
}: { 
  open: boolean; 
  onClose: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const { getAllShortcuts } = useKeyboardShortcuts();
  const shortcuts = getAllShortcuts();

  const filteredShortcuts = shortcuts.filter(shortcut =>
    shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shortcut.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedShortcuts = filteredShortcuts.reduce((acc, shortcut) => {
    const category = shortcut.action.split(':')[0] || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category]!.push(shortcut);
    return acc;
  }, {} as Record<string, Shortcut[]>);

  const categoryNames: Record<string, string> = {
    navigate: 'Navigation',
    open: 'Actions',
    create: 'Create',
    toggle: 'Toggle',
    save: 'File Operations',
    cancel: 'Cancel/Close',
    delete: 'Delete',
    refresh: 'Refresh',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <Command className="w-5 h-5 text-primary" />
            <DialogTitle className="text-xl font-semibold">Keyboard Shortcuts</DialogTitle>
          </div>
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shortcuts..."
                className="pl-10"
              />
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[60vh] px-6 py-4">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {categoryNames[category] || category}
              </h3>
              <div className="space-y-2">
                {(categoryShortcuts as Shortcut[]).map((shortcut, index) => (
                  <div
                    key={`${shortcut.action}-${index}`}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {getShortcutDisplay(shortcut)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredShortcuts.length === 0 && (
            <div className="text-center py-12">
              <Command className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No shortcuts found</p>
            </div>
          )}
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Press <Badge variant="outline" className="mx-1 font-mono text-xs">Ctrl+/</Badge> 
            to open this panel anytime
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
