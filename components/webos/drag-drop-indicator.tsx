
'use client';

import { useDragState } from '@/lib/drag-drop-manager';
import { cn } from '@/lib/utils';
import { FileText, CheckSquare, Calendar, Users, FolderOpen, Mail } from 'lucide-react';

const DRAG_TYPE_ICONS = {
  task: CheckSquare,
  note: FileText,
  event: Calendar,
  contact: Users,
  document: FolderOpen,
  message: Mail,
};

export function DragDropIndicator() {
  const { isDragging, dragData } = useDragState();

  if (!isDragging || !dragData) return null;

  const Icon = DRAG_TYPE_ICONS[dragData.type] || FileText;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div
        className={cn(
          'fixed top-4 right-4',
          'bg-primary text-primary-foreground',
          'rounded-lg shadow-lg p-4 min-w-[200px]',
          'flex items-center gap-3',
          'transform transition-all duration-200',
          'animate-pulse'
        )}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{dragData.title}</p>
          <p className="text-xs opacity-80">Drop to move</p>
        </div>
      </div>
    </div>
  );
}
