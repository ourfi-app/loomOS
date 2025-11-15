
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileText,
  FolderOpen,
  Upload,
  Download,
  Search,
  Filter,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ErrorBoundary } from '@/components/common';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const result = await response.json();
      
      if (result.success && result.data?.documents) {
        setDocuments(result.data.documents);
      } else {
        console.error('Failed to fetch documents:', result.error || 'Unknown error');
        setDocuments([]);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <ErrorBoundary>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col h-full">
        <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">Documents</h1>
                <p className="text-muted-foreground">Manage your community documents</p>
              </div>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Folders */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Folders</h2>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <FolderOpen className="h-8 w-8 text-[var(--semantic-primary)]" />
                  <div>
                    <p className="font-medium">Bylaws</p>
                    <p className="text-sm text-muted-foreground">12 files</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <FolderOpen className="h-8 w-8 text-[var(--semantic-success)]" />
                  <div>
                    <p className="font-medium">Policies</p>
                    <p className="text-sm text-muted-foreground">8 files</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <FolderOpen className="h-8 w-8 text-[var(--semantic-accent)]" />
                  <div>
                    <p className="font-medium">Minutes</p>
                    <p className="text-sm text-muted-foreground">24 files</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:bg-accent/50 cursor-pointer transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <FolderOpen className="h-8 w-8 text-[var(--semantic-primary)]" />
                  <div>
                    <p className="font-medium">Forms</p>
                    <p className="text-sm text-muted-foreground">15 files</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Recent Documents</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredDocuments.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      {searchQuery ? 'No documents found' : 'No documents available'}
                    </div>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <FileText className="h-8 w-8 text-[var(--semantic-primary)]" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View</DropdownMenuItem>
                              <DropdownMenuItem>Share</DropdownMenuItem>
                              <DropdownMenuItem>Rename</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
