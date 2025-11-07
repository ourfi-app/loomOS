
'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Plus, Layout, Settings, Camera, Maximize2, 
  Minimize2, X, FileText, MessageSquare, CheckSquare,
  Grid3X3, Layers, Monitor
} from 'lucide-react';
import { useDesktopWidgets } from '@/lib/desktop-widget-store';
import { useDesktopShortcuts } from '@/lib/desktop-shortcuts-store';

interface DesktopContextMenuProps {
  onOpenCustomization: () => void;
  onOpenQuickSettings: () => void;
}

export function DesktopContextMenu({ 
  onOpenCustomization,
  onOpenQuickSettings,
}: DesktopContextMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { addWidget } = useDesktopWidgets();
  const { executeShortcut } = useDesktopShortcuts();
  
  // Handle right-click on desktop
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Only handle if clicking on the desktop background (not on windows/widgets)
      const target = e.target as HTMLElement;
      const isDesktopClick = 
        target.classList.contains('desktop-background') ||
        target.classList.contains('desktop-area') ||
        target.id === 'desktop-main';
      
      if (isDesktopClick) {
        e.preventDefault();
        setPosition({ x: e.clientX, y: e.clientY });
        setIsOpen(true);
      }
    };
    
    const handleClick = () => setIsOpen(false);
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);
  
  const handleAction = useCallback((action: () => void) => {
    action();
    setIsOpen(false);
  }, []);
  
  const menuItems = [
    {
      label: 'Customize Desktop',
      icon: Palette,
      action: () => handleAction(onOpenCustomization),
      submenu: [
        { label: 'Change Wallpaper', icon: Monitor },
        { label: 'Edit Color Palette', icon: Palette },
        { label: 'Desktop Settings', icon: Settings },
      ],
    },
    { type: 'divider' },
    {
      label: 'New',
      icon: Plus,
      submenu: [
        { 
          label: 'Create Task', 
          icon: CheckSquare,
          action: () => handleAction(() => executeShortcut('new-task')),
          kbd: 'Ctrl+T',
        },
        { 
          label: 'Create Note', 
          icon: FileText,
          action: () => handleAction(() => executeShortcut('new-note')),
          kbd: 'Ctrl+N',
        },
        { 
          label: 'New Document', 
          icon: FileText,
        },
        { 
          label: 'Send Message', 
          icon: MessageSquare,
          action: () => handleAction(() => executeShortcut('new-message')),
          kbd: 'Ctrl+M',
        },
      ],
    },
    {
      label: 'Add Widget',
      icon: Grid3X3,
      submenu: [
        { 
          label: 'Tasks Widget', 
          action: () => handleAction(() => addWidget('tasks')),
        },
        { 
          label: 'Notes Widget', 
          action: () => handleAction(() => addWidget('notes')),
        },
        { 
          label: 'Notifications Widget', 
          action: () => handleAction(() => addWidget('notifications')),
        },
        { 
          label: 'Email Widget', 
          action: () => handleAction(() => addWidget('email')),
        },
      ],
    },
    { type: 'divider' },
    {
      label: 'Window Management',
      icon: Layout,
      submenu: [
        { 
          label: 'Tile All Windows', 
          icon: Layers,
        },
        { 
          label: 'Show All Windows', 
          icon: Maximize2,
          action: () => handleAction(() => executeShortcut('show-all-windows')),
          kbd: 'Ctrl+Shift+A',
        },
        { 
          label: 'Show Desktop', 
          icon: Minimize2,
          action: () => handleAction(() => executeShortcut('show-desktop')),
          kbd: 'Ctrl+Shift+D',
        },
        { 
          label: 'Close All Windows', 
          icon: X,
        },
      ],
    },
    { type: 'divider' },
    {
      label: 'Quick Actions',
      icon: Camera,
      submenu: [
        { 
          label: 'Take Screenshot', 
          icon: Camera,
          action: () => handleAction(() => executeShortcut('screenshot')),
          kbd: 'Ctrl+Shift+4',
        },
        { 
          label: 'Start Screen Recording', 
          icon: Camera,
        },
      ],
    },
    { type: 'divider' },
    {
      label: 'Desktop Settings',
      icon: Settings,
      action: () => handleAction(onOpenQuickSettings),
      kbd: 'Ctrl+,',
    },
  ];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed z-[999]"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          <div className="bg-background/95 backdrop-blur-xl border rounded-lg shadow-2xl min-w-[240px] py-2 overflow-hidden">
            {menuItems.map((item, index) => {
              if ('type' in item && item.type === 'divider') {
                return <div key={index} className="h-px bg-border mx-2 my-1" />;
              }
              
              const ItemIcon = item.icon;
              
              return (
                <div key={index}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.action) {
                        item.action();
                      }
                    }}
                    className="w-full px-3 py-2 text-sm flex items-center gap-3 hover:bg-accent/50 transition-colors text-left group"
                  >
                    {ItemIcon && <ItemIcon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />}
                    <span className="flex-1">{item.label}</span>
                    {item.kbd && (
                      <span className="text-xs text-muted-foreground">
                        {item.kbd}
                      </span>
                    )}
                    {item.submenu && (
                      <span className="text-muted-foreground">›</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
