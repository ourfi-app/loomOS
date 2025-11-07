
'use client';

import { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ToolbarProps {
  title?: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  actions?: ReactNode;
  showSearch?: boolean;
}

export function Toolbar({ 
  title, 
  searchPlaceholder = 'Search...', 
  onSearch,
  actions,
  showSearch = true 
}: ToolbarProps) {
  return (
    <div className="macos-toolbar h-14 flex items-center justify-between px-6 gap-4">
      <div className="flex-1 flex items-center gap-4">
        {title && (
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        )}
        {showSearch && (
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              className="pl-9 h-9 bg-muted/50 border-none rounded-lg"
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </div>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
