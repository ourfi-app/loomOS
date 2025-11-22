
'use client';

import { LayoutGrid, Lock, RefreshCw } from 'lucide-react';
import { useWidgetLayout } from '@/lib/widget-layout-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export function LayoutEditToggle() {
  const { isEditMode, toggleEditMode, resetToDefault } = useWidgetLayout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'relative h-8 w-8 p-0 transition-colors',
            isEditMode && 'bg-primary/10 text-primary'
          )}
        >
          {isEditMode ? (
            <Lock className="h-4 w-4" />
          ) : (
            <LayoutGrid className="h-4 w-4" />
          )}
          {isEditMode && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={toggleEditMode}>
          {isEditMode ? (
            <>
              <Lock className="mr-2 h-4 w-4" />
              <span>Lock Layout</span>
            </>
          ) : (
            <>
              <LayoutGrid className="mr-2 h-4 w-4" />
              <span>Edit Layout</span>
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => resetToDefault()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          <span>Reset to Default</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
