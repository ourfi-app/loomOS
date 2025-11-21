// TODO: Review setTimeout calls for proper cleanup in useEffect return functions

'use client';

import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export type MobileMenuItem = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
};

export type MobileMenuSection = {
  title?: string;
  items: MobileMenuItem[];
};

interface MobileContextMenuProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  sections: MobileMenuSection[];
}

export function MobileContextMenu({
  open,
  onClose,
  title,
  sections,
}: MobileContextMenuProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-2xl p-0 max-h-[80vh]">
        {title && (
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
        )}

        <div className="overflow-y-auto max-h-[calc(80vh-80px)] px-2 pb-safe">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              {section.title && (
                <div className="px-4 py-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {section.title}
                  </p>
                </div>
              )}

              <div className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="ghost"
                    className={cn(
                      'w-full justify-start h-12 px-4 text-base',
                      item.variant === 'destructive' && 'text-destructive hover:text-destructive'
                    )}
                    onClick={() => {
                      item.onClick();
                      onClose();
                    }}
                    disabled={item.disabled}
                  >
                    {item.icon && (
                      <span className="mr-3 flex-shrink-0">{item.icon}</span>
                    )}
                    <span>{item.label}</span>
                  </Button>
                ))}
              </div>

              {sectionIndex < sections.length - 1 && (
                <Separator className="my-2" />
              )}
            </div>
          ))}
        </div>

        <div className="p-2 border-t bg-background sticky bottom-0">
          <Button
            variant="outline"
            className="w-full h-12 text-base font-medium"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Hook for mobile context menu
 */
export function useMobileContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuData, setMenuData] = useState<{
    title?: string;
    sections: MobileMenuSection[];
  } | null>(null);

  const openMenu = (data: { title?: string; sections: MobileMenuSection[] }) => {
    setMenuData(data);
    setIsOpen(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
    // Clear data after animation
    setTimeout(() => setMenuData(null), 300);
  };

  const Menu = () => {
    if (!menuData) return null;

    return (
      <MobileContextMenu
        open={isOpen}
        onClose={closeMenu}
        title={menuData.title}
        sections={menuData.sections}
      />
    );
  };

  return {
    openMenu,
    closeMenu,
    Menu,
  };
}
