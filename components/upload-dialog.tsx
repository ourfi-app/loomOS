
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FOLDER_PERMISSIONS } from '@/lib/types';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess: () => void;
  userRole?: string;
}

export function UploadDialog({
  open,
  onOpenChange,
  onUploadSuccess,
  userRole,
}: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState<string>('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const allowedFolders = Object.entries(FOLDER_PERMISSIONS).filter(
    ([key, folderInfo]) => {
      if (!userRole) return false;
      return folderInfo.allowedRoles.some(role => role === userRole);
    }
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !folder) {
      toast({
        title: 'Missing Information',
        description: 'Please select a file and folder',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('description', description);

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      toast({
        title: 'Upload Successful',
        description: `${file.name} has been uploaded successfully`,
      });

      // Reset form
      setFile(null);
      setFolder('');
      setDescription('');
      onUploadSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Document
          </DialogTitle>
          <DialogDescription>
            Upload a document to the association library
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="file">Select File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>
            {file && (
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <FileText className="h-4 w-4 text-[var(--semantic-primary)]" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Folder Selection */}
          <div className="space-y-2">
            <Label htmlFor="folder">Destination Folder</Label>
            <Select value={folder} onValueChange={setFolder} disabled={uploading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent>
                {allowedFolders.map(([key, folderInfo]) => (
                  <SelectItem key={key} value={key}>
                    {folderInfo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of the document..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={uploading}
              rows={3}
            />
          </div>

          {/* Info Message */}
          <div className="flex gap-2 p-3 bg-[var(--semantic-primary-subtle)] border border-[var(--semantic-primary-light)] rounded-md">
            <AlertCircle className="h-4 w-4 text-[var(--semantic-primary)] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[var(--semantic-primary-dark)]">
              Uploaded documents will be visible to users based on the folder's
              permission settings. Make sure you're uploading to the correct folder.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={uploading || !file || !folder}>
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
