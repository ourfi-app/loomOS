
'use client';

import { useState, useEffect } from 'react';
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
import { 
  Cloud, 
  FileText, 
  Folder, 
  Download, 
  Search, 
  ArrowLeft,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FOLDER_PERMISSIONS } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
}

interface GoogleDriveBrowserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: () => void;
  userRole?: string;
}

export function GoogleDriveBrowser({
  open,
  onOpenChange,
  onImportSuccess,
  userRole,
}: GoogleDriveBrowserProps) {
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<GoogleDriveFile | null>(null);
  const [folder, setFolder] = useState<string>('');
  const [description, setDescription] = useState('');
  const [importing, setImporting] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [folderHistory, setFolderHistory] = useState<Array<{ id?: string; name: string }>>([
    { id: undefined, name: 'My Drive' },
  ]);
  const { toast } = useToast();

  const allowedFolders = Object.entries(FOLDER_PERMISSIONS).filter(
    ([key, folderInfo]) => {
      if (!userRole) return false;
      return folderInfo.allowedRoles.some(role => role === userRole);
    }
  );

  useEffect(() => {
    if (open) {
      loadFiles();
    }
  }, [open, currentFolderId]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (currentFolderId) {
        params.append('folderId', currentFolderId);
      }

      const response = await fetch(`/api/google-drive/list?${params.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to load files');
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (error: any) {
      console.error('Error loading files:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load Google Drive files',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (file: GoogleDriveFile) => {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      setCurrentFolderId(file.id);
      setFolderHistory([...folderHistory, { id: file.id, name: file.name }]);
    }
  };

  const handleBackClick = () => {
    if (folderHistory.length > 1) {
      const newHistory = folderHistory.slice(0, -1);
      setFolderHistory(newHistory);
      const lastFolder = newHistory[newHistory.length - 1];
      if (lastFolder) {
        setCurrentFolderId(lastFolder.id);
      }
    }
  };

  const handleFileSelect = (file: GoogleDriveFile) => {
    // Don't select folders
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      handleFolderClick(file);
      return;
    }
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile || !folder) {
      toast({
        title: 'Missing Information',
        description: 'Please select a file and destination folder',
        variant: 'destructive',
      });
      return;
    }

    setImporting(true);

    try {
      const response = await fetch('/api/google-drive/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: selectedFile.id,
          fileName: selectedFile.name,
          mimeType: selectedFile.mimeType,
          folder,
          description,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Import failed');
      }

      toast({
        title: 'Import Successful',
        description: `${selectedFile.name} has been imported successfully`,
      });

      // Reset form
      setSelectedFile(null);
      setFolder('');
      setDescription('');
      onImportSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: 'Import Failed',
        description: error.message || 'Failed to import file',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return 'Unknown size';
    const size = parseInt(bytes);
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isGoogleDocsType = (mimeType: string) => {
    return mimeType.startsWith('application/vnd.google-apps');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-[var(--semantic-primary)]" />
            Import from Google Drive
          </DialogTitle>
          <DialogDescription>
            Browse your Google Drive and import files to the document library
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 pb-2 border-b">
            {folderHistory.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackClick}
                disabled={loading}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {folderHistory.map((folder, index) => (
                <span key={index}>
                  {index > 0 && <span className="mx-1">/</span>}
                  {folder.name}
                </span>
              ))}
            </div>
          </div>

          {/* File Browser */}
          <ScrollArea className="h-[300px] border rounded-md p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--semantic-primary)]" />
              </div>
            ) : files.length > 0 ? (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => handleFileSelect(file)}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ${
                      selectedFile?.id === file.id
                        ? 'bg-[var(--semantic-primary-subtle)] border-2 border-[var(--semantic-primary)]'
                        : 'hover:bg-muted border border-transparent'
                    }`}
                  >
                    {file.mimeType === 'application/vnd.google-apps.folder' ? (
                      <Folder className="h-5 w-5 text-[var(--semantic-warning)] flex-shrink-0" />
                    ) : (
                      <FileText className="h-5 w-5 text-[var(--semantic-primary)] flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.mimeType === 'application/vnd.google-apps.folder'
                          ? 'Folder'
                          : formatFileSize(file.size)}
                      </p>
                    </div>
                    {isGoogleDocsType(file.mimeType) && file.mimeType !== 'application/vnd.google-apps.folder' && (
                      <span className="text-xs bg-[var(--semantic-primary-subtle)] text-[var(--semantic-primary-dark)] px-2 py-1 rounded">
                        Google Doc
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Folder className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No files found</p>
              </div>
            )}
          </ScrollArea>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="p-3 bg-[var(--semantic-primary-subtle)] border border-[var(--semantic-primary-light)] rounded-md">
              <p className="text-sm font-medium text-[var(--semantic-primary-dark)]">Selected File:</p>
              <p className="text-sm text-[var(--semantic-primary-dark)]">{selectedFile.name}</p>
            </div>
          )}

          {/* Destination Folder */}
          <div className="space-y-2">
            <Label htmlFor="folder">Destination Folder</Label>
            <Select value={folder} onValueChange={setFolder} disabled={importing || !selectedFile}>
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
              disabled={importing || !selectedFile}
              rows={2}
            />
          </div>

          {/* Info Message */}
          <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              Google Docs, Sheets, and Slides will be downloaded in their native format.
              Regular files will be imported as-is.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={importing}
          >
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={importing || !selectedFile || !folder}>
            {importing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Import File
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
