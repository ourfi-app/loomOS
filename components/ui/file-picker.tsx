
'use client';

/**
 * WebOS File Picker Component
 * Based on WebOS design patterns for file selection
 * Supports single and multi-select modes
 */

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Paperclip, X, FileText, Image, Music, Video, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

// File type categories
export type FileCategory = 'photos' | 'music' | 'videos' | 'documents' | 'all';

interface FileType {
  id: FileCategory;
  label: string;
  icon: React.ReactNode;
  accept?: string;
}

const FILE_TYPES: FileType[] = [
  {
    id: 'photos',
    label: 'Photos',
    icon: <Image className="h-8 w-8 text-muted-foreground" />,
    accept: 'image/*',
  },
  {
    id: 'music',
    label: 'Music',
    icon: <Music className="h-8 w-8 text-muted-foreground" />,
    accept: 'audio/*',
  },
  {
    id: 'videos',
    label: 'Videos',
    icon: <Video className="h-8 w-8 text-muted-foreground" />,
    accept: 'video/*',
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: <FileText className="h-8 w-8 text-muted-foreground" />,
    accept: '.pdf,.doc,.docx,.txt,.xls,.xlsx',
  },
];

interface FilePickerProps {
  mode?: 'single' | 'multi';
  onSelect?: (files: File[]) => void;
  onCancel?: () => void;
  maxFiles?: number;
  accept?: string;
}

export function FilePicker({
  mode = 'single',
  onSelect,
  onCancel,
  maxFiles,
  accept,
}: FilePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<FileCategory | null>(null);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCategoryClick = (category: FileCategory) => {
    setSelectedCategory(category);
    const fileType = FILE_TYPES.find((t) => t.id === category);
    
    // Trigger file input with appropriate accept type
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept || fileType?.accept || '*';
      fileInputRef.current.multiple = mode === 'multi';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (mode === 'single' && files.length > 0 && files[0]) {
      onSelect?.([files[0]]);
      setOpen(false);
      setSelectedCategory(null);
    } else if (mode === 'multi') {
      const newFiles = maxFiles
        ? files.slice(0, maxFiles - selectedFiles.length)
        : files;
      onSelect?.(newFiles);
      setSelectedFiles([...selectedFiles, ...newFiles]);
    }
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedCategory(null);
    setSelectedFiles([]);
    onCancel?.();
  };

  return (
    <>
      {/* Attachment Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-2"
        disabled={selectedFiles.length > 0 && !mode}
      >
        <Paperclip className="h-4 w-4" />
        <span>{selectedFiles.length > 0 ? `${selectedFiles.length} attached` : 'Attach files...'}</span>
      </Button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* File Type Selection Dialog */}
      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-[400px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-card shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-base font-medium">
                {mode === 'single' ? 'Select File' : 'Select Files'}
              </h3>
              <div className="text-sm text-muted-foreground">
                {mode === 'multi' && selectedFiles.length > 0
                  ? `${selectedFiles.length} selected`
                  : 'No files selected'}
              </div>
            </div>

            {/* File Type Categories */}
            <div className="p-2">
              {FILE_TYPES.map((fileType) => (
                <button
                  key={fileType.id}
                  onClick={() => handleCategoryClick(fileType.id)}
                  className={cn(
                    'w-full flex items-center gap-4 px-4 py-4 rounded-md transition-colors',
                    'hover:bg-muted focus:bg-muted focus:outline-none',
                    'border-b border-border last:border-b-0'
                  )}
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-md">
                    {fileType.icon}
                  </div>
                  <span className="text-base font-medium">{fileType.label}</span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 pb-4 pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}

// Compact Attachment Button (for use in forms)
interface AttachmentButtonProps {
  onFilesSelect?: (files: File[]) => void;
  mode?: 'single' | 'multi';
  disabled?: boolean;
}

export function AttachmentButton({
  onFilesSelect,
  mode = 'multi',
  disabled,
}: AttachmentButtonProps) {
  return (
    <div className="inline-flex items-center">
      <FilePicker mode={mode} onSelect={onFilesSelect} />
    </div>
  );
}
