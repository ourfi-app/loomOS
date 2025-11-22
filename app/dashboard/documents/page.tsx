
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
        <div 
          className="flex items-center justify-center h-full"
          style={{
            background: 'var(--webos-bg-gradient)',
            fontFamily: 'Helvetica Neue, Arial, sans-serif'
          }}
        >
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-12 w-12 mx-auto mb-4"
              style={{ 
                border: '2px solid transparent',
                borderTopColor: 'var(--webos-app-brown)'
              }}
            />
            <p 
              className="font-light"
              style={{ color: 'var(--webos-text-secondary)' }}
            >
              Loading documents...
            </p>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div 
        className="flex flex-col h-full"
        style={{
          background: 'var(--webos-bg-gradient)',
          fontFamily: 'Helvetica Neue, Arial, sans-serif'
        }}
      >
        <div 
          className="flex-none"
          style={{
            borderBottom: '1px solid var(--webos-border-primary)',
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 
                  className="text-2xl font-light tracking-tight"
                  style={{ color: 'var(--webos-text-primary)' }}
                >
                  Documents
                </h1>
                <p 
                  className="font-light"
                  style={{ color: 'var(--webos-text-secondary)' }}
                >
                  Manage your community documents
                </p>
              </div>
              <button
                className="rounded-xl py-2 px-4 text-sm font-light tracking-wide uppercase transition-all hover:opacity-90 flex items-center gap-2"
                style={{
                  background: 'var(--webos-ui-dark)',
                  color: 'var(--webos-text-white)',
                  boxShadow: 'var(--webos-shadow-md)'
                }}
              >
                <Upload className="h-4 w-4" />
                Upload
              </button>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: 'var(--webos-text-tertiary)' }}
                />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 rounded-xl font-light"
                  style={{
                    border: '1px solid var(--webos-border-secondary)',
                    background: 'var(--webos-bg-white)',
                    color: 'var(--webos-text-primary)'
                  }}
                />
              </div>
              <button
                className="rounded-xl p-2 transition-opacity hover:opacity-80"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  border: '1px solid var(--webos-border-secondary)',
                  boxShadow: 'var(--webos-shadow-sm)'
                }}
              >
                <Filter 
                  className="h-4 w-4"
                  style={{ color: 'var(--webos-text-secondary)' }}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {/* Folders */}
          <div className="mb-6">
            <h2 
              className="text-xs font-light tracking-wider uppercase mb-4"
              style={{ color: 'var(--webos-text-tertiary)' }}
            >
              Folders
            </h2>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              <div 
                className="rounded-2xl cursor-pointer transition-opacity hover:opacity-90 p-6 flex items-center gap-4"
                style={{
                  background: 'var(--webos-bg-glass)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--webos-border-glass)',
                  boxShadow: 'var(--webos-shadow-md)'
                }}
              >
                <FolderOpen 
                  className="h-8 w-8"
                  style={{ color: 'var(--webos-app-brown)' }}
                />
                <div>
                  <p 
                    className="font-light"
                    style={{ color: 'var(--webos-text-primary)' }}
                  >
                    Bylaws
                  </p>
                  <p 
                    className="text-sm font-light"
                    style={{ color: 'var(--webos-text-tertiary)' }}
                  >
                    12 files
                  </p>
                </div>
              </div>
              <div 
                className="rounded-2xl cursor-pointer transition-opacity hover:opacity-90 p-6 flex items-center gap-4"
                style={{
                  background: 'var(--webos-bg-glass)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--webos-border-glass)',
                  boxShadow: 'var(--webos-shadow-md)'
                }}
              >
                <FolderOpen 
                  className="h-8 w-8"
                  style={{ color: 'var(--webos-app-green)' }}
                />
                <div>
                  <p 
                    className="font-light"
                    style={{ color: 'var(--webos-text-primary)' }}
                  >
                    Policies
                  </p>
                  <p 
                    className="text-sm font-light"
                    style={{ color: 'var(--webos-text-tertiary)' }}
                  >
                    8 files
                  </p>
                </div>
              </div>
              <div 
                className="rounded-2xl cursor-pointer transition-opacity hover:opacity-90 p-6 flex items-center gap-4"
                style={{
                  background: 'var(--webos-bg-glass)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--webos-border-glass)',
                  boxShadow: 'var(--webos-shadow-md)'
                }}
              >
                <FolderOpen 
                  className="h-8 w-8"
                  style={{ color: 'var(--webos-app-teal)' }}
                />
                <div>
                  <p 
                    className="font-light"
                    style={{ color: 'var(--webos-text-primary)' }}
                  >
                    Minutes
                  </p>
                  <p 
                    className="text-sm font-light"
                    style={{ color: 'var(--webos-text-tertiary)' }}
                  >
                    24 files
                  </p>
                </div>
              </div>
              <div 
                className="rounded-2xl cursor-pointer transition-opacity hover:opacity-90 p-6 flex items-center gap-4"
                style={{
                  background: 'var(--webos-bg-glass)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid var(--webos-border-glass)',
                  boxShadow: 'var(--webos-shadow-md)'
                }}
              >
                <FolderOpen 
                  className="h-8 w-8"
                  style={{ color: 'var(--webos-app-tan)' }}
                />
                <div>
                  <p 
                    className="font-light"
                    style={{ color: 'var(--webos-text-primary)' }}
                  >
                    Forms
                  </p>
                  <p 
                    className="text-sm font-light"
                    style={{ color: 'var(--webos-text-tertiary)' }}
                  >
                    15 files
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h2 
              className="text-xs font-light tracking-wider uppercase mb-4"
              style={{ color: 'var(--webos-text-tertiary)' }}
            >
              Recent Documents
            </h2>
            <div 
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'var(--webos-bg-glass)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--webos-border-glass)',
                boxShadow: 'var(--webos-shadow-xl)'
              }}
            >
              <div style={{ borderTop: '1px solid var(--webos-border-primary)' }}>
                {filteredDocuments.length === 0 ? (
                  <div 
                    className="text-center py-12 font-light"
                    style={{ color: 'var(--webos-text-secondary)' }}
                  >
                    {searchQuery ? 'No documents found' : 'No documents available'}
                  </div>
                ) : (
                  filteredDocuments.map((doc, index) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 transition-colors hover:bg-white/30"
                      style={index > 0 ? { borderTop: '1px solid var(--webos-border-primary)' } : {}}
                    >
                      <div className="flex items-center gap-4">
                        <FileText 
                          className="h-8 w-8"
                          style={{ color: 'var(--webos-app-brown)' }}
                        />
                        <div>
                          <p 
                            className="font-light"
                            style={{ color: 'var(--webos-text-primary)' }}
                          >
                            {doc.name}
                          </p>
                          <p 
                            className="text-sm font-light"
                            style={{ color: 'var(--webos-text-secondary)' }}
                          >
                            {doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          className="p-2 rounded-lg transition-opacity hover:opacity-80"
                          style={{
                            background: 'rgba(255, 255, 255, 0.5)'
                          }}
                        >
                          <Download 
                            className="h-4 w-4"
                            style={{ color: 'var(--webos-text-secondary)' }}
                          />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button 
                              className="p-2 rounded-lg transition-opacity hover:opacity-80"
                              style={{
                                background: 'rgba(255, 255, 255, 0.5)'
                              }}
                            >
                              <MoreVertical 
                                className="h-4 w-4"
                                style={{ color: 'var(--webos-text-secondary)' }}
                              />
                            </button>
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
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
