
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UploadDialog } from '@/components/upload-dialog';
import { GoogleDriveBrowser } from '@/components/google-drive-browser';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Upload, 
  Search, 
  FolderOpen, 
  Download, 
  Eye,
  Filter,
  Calendar,
  User,
  Lock,
  Globe,
  Trash2,
  Cloud
} from 'lucide-react';

interface DocumentFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  folder: string;
  permission: string;
  description?: string;
  uploadedBy: {
    name: string;
  };
  createdAt: string;
}

interface FolderInfo {
  name: string;
  permission: string;
  allowedRoles: string[];
  count: number;
}

export function DocumentsTab() {
  const { data: session } = useSession() || {};
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [folders, setFolders] = useState<Record<string, FolderInfo>>({});
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [googleDriveDialogOpen, setGoogleDriveDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();
  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    fetchDocuments();
  }, []);

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'PUBLIC':
        return <Globe className="h-4 w-4 text-[var(--semantic-success)]" />;
      case 'RESIDENTS_ONLY':
        return <User className="h-4 w-4 text-[var(--semantic-primary)]" />;
      case 'BOARD_ONLY':
        return <Lock className="h-4 w-4 text-[var(--semantic-primary)]" />;
      case 'ADMIN_ONLY':
        return <Lock className="h-4 w-4 text-[var(--semantic-error)]" />;
      default:
        return <FileText className="h-4 w-4 text-[var(--semantic-text-tertiary)]" />;
    }
  };

  const getPermissionBadge = (permission: string) => {
    switch (permission) {
      case 'PUBLIC':
        return <Badge className="bg-[var(--semantic-success)] hover:bg-[var(--semantic-success)]">Public</Badge>;
      case 'RESIDENTS_ONLY':
        return <Badge className="bg-[var(--semantic-primary)] hover:bg-[var(--semantic-primary)]">Residents</Badge>;
      case 'BOARD_ONLY':
        return <Badge className="bg-[var(--semantic-primary)] hover:bg-[var(--semantic-primary-dark)]">Board</Badge>;
      case 'ADMIN_ONLY':
        return <Badge variant="destructive">Admin Only</Badge>;
      default:
        return <Badge variant="outline">{permission}</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesFolder = selectedFolder === 'all' || doc.folder === selectedFolder;
    const matchesSearch = doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         false;
    
    // Date filter
    const docDate = new Date(doc.createdAt);
    const now = new Date();
    let matchesDate = true;
    
    if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = docDate >= weekAgo;
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = docDate >= monthAgo;
    } else if (dateFilter === 'year') {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      matchesDate = docDate >= yearAgo;
    }
    
    // Type filter
    let matchesType = true;
    if (typeFilter !== 'all') {
      matchesType = doc.mimeType.toLowerCase().includes(typeFilter.toLowerCase());
    }
    
    return matchesFolder && matchesSearch && matchesDate && matchesType;
  });

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
        setFolders(data.folders || {});
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    setUploadDialogOpen(true);
  };

  const handleGoogleDriveImport = () => {
    setGoogleDriveDialogOpen(true);
  };

  const handleUploadSuccess = () => {
    fetchDocuments();
  };

  const handleImportSuccess = () => {
    fetchDocuments();
  };

  const handleDownload = async (doc: DocumentFile) => {
    try {
      const response = await fetch(`/api/documents/${doc.id}/download`);
      if (!response.ok) {
        throw new Error('Failed to get download URL');
      }

      const data = await response.json();
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.href = data.url;
      a.download = doc.originalName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: 'Download Started',
        description: `Downloading ${doc.originalName}`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Download Failed',
        description: 'Failed to download file',
        variant: 'destructive',
      });
    }
  };

  const handlePreview = async (doc: DocumentFile) => {
    try {
      const response = await fetch(`/api/documents/${doc.id}/download`);
      if (!response.ok) {
        throw new Error('Failed to get preview URL');
      }

      const data = await response.json();
      
      // Open in new tab for preview
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Preview error:', error);
      toast({
        title: 'Preview Failed',
        description: 'Failed to preview file',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (doc: DocumentFile) => {
    if (!confirm(`Are you sure you want to delete "${doc.originalName}"?`)) {
      return;
    }

    try {
      setDeletingId(doc.id);
      const response = await fetch(`/api/documents/${doc.id}/delete`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete file');
      }

      toast({
        title: 'File Deleted',
        description: `${doc.originalName} has been deleted`,
      });

      fetchDocuments();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete file',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const clearAllFilters = () => {
    setSelectedFolder('all');
    setSearchTerm('');
    setDateFilter('all');
    setTypeFilter('all');
    setShowAdvancedFilters(false);
  };

  return (
    <div className="space-y-4">
      {/* Upload Buttons */}
      {(userRole === 'ADMIN' || userRole === 'BOARD_MEMBER') && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGoogleDriveImport}>
            <Cloud className="h-4 w-4 mr-2" />
            Import from Drive
          </Button>
          <Button onClick={handleUpload}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="all">All Folders</option>
            {Object.entries(folders).map(([key, folder]) => (
              <option key={key} value={key}>
                {folder.name} ({folder.count})
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm" onClick={toggleAdvancedFilters}>
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <Card className="p-4">
          <div className="space-y-4">
            <h3 className="font-medium">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                  <option value="year">Past Year</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">File Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="pdf">PDF</option>
                  <option value="doc">Documents</option>
                  <option value="image">Images</option>
                  <option value="excel">Spreadsheets</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={clearAllFilters} className="w-full">
                  Clear All Filters
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Folder Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(folders).slice(0, 6).map(([key, folder]) => (
          <Card 
            key={key} 
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              selectedFolder === key ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedFolder(key)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5 text-[var(--semantic-primary)]" />
                  <CardTitle className="text-base">{folder.name}</CardTitle>
                </div>
                {getPermissionIcon(folder.permission)}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {folder.count} documents
                </span>
                {getPermissionBadge(folder.permission)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Documents
            {selectedFolder !== 'all' && folders[selectedFolder] && (
              <span className="text-sm font-normal text-muted-foreground">
                in {folders[selectedFolder]?.name}
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--semantic-primary)] mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-[var(--semantic-primary)]" />
                    <div>
                      <p className="font-medium">{doc.originalName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(doc.createdAt).toLocaleDateString()}
                        <span>•</span>
                        <User className="h-3 w-3" />
                        {doc.uploadedBy.name}
                        <span>•</span>
                        {formatFileSize(doc.size)}
                      </div>
                      {doc.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPermissionBadge(doc.permission)}
                    <Button variant="outline" size="sm" onClick={() => handlePreview(doc)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                      <Download className="h-4 w-4" />
                    </Button>
                    {(userRole === 'ADMIN' || doc.uploadedBy.name === session?.user?.name) && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(doc)}
                        disabled={deletingId === doc.id}
                      >
                        {deletingId === doc.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--semantic-border-strong)]"></div>
                        ) : (
                          <Trash2 className="h-4 w-4 text-[var(--semantic-error)]" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No documents found matching your search' : 'No documents found'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Documents will appear here once they are uploaded
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Instructions */}
      {userRole === 'RESIDENT' && (
        <Card className="border-[var(--semantic-primary-light)] bg-[var(--semantic-primary-subtle)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[var(--semantic-primary-dark)]">
              <Upload className="h-5 w-5" />
              Need to Share a Document?
            </CardTitle>
            <CardDescription className="text-[var(--semantic-primary-dark)]">
              Contact the board or property manager to upload documents to the shared library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--semantic-primary-dark)]">
              Residents can access most documents but cannot upload directly. 
              Please email important documents to the board for inclusion in the library.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadSuccess={handleUploadSuccess}
        userRole={userRole}
      />

      {/* Google Drive Browser Dialog */}
      <GoogleDriveBrowser
        open={googleDriveDialogOpen}
        onOpenChange={setGoogleDriveDialogOpen}
        onImportSuccess={handleImportSuccess}
        userRole={userRole}
      />
    </div>
  );
}
