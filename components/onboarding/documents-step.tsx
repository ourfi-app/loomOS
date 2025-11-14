
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  Upload,
  X,
  Check,
  ArrowRight,
  Loader2,
  AlertCircle,
  Cloud,
  HardDrive,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentsStepProps {
  data: any;
  onNext: (data: any) => void;
  saving: boolean;
}

const DOCUMENT_TYPES = [
  {
    id: 'bylaws',
    title: 'Bylaws',
    description: 'Association governing bylaws',
    required: true,
  },
  {
    id: 'rules',
    title: 'Rules & Regulations',
    description: 'Community rules and regulations',
    required: false,
  },
  {
    id: 'salesPacket',
    title: 'Sales Packet',
    description: 'Information for prospective buyers',
    required: false,
  },
  {
    id: 'leasingPacket',
    title: 'Leasing Packet',
    description: 'Information for leasing units',
    required: false,
  },
];

export default function DocumentsStep({
  data,
  onNext,
  saving,
}: DocumentsStepProps) {
  const { toast } = useToast();
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, any>>(
    data?.documents || {}
  );
  const [uploading, setUploading] = useState<string | null>(null);
  const [storageType, setStorageType] = useState(data?.storageType || 'builtin');

  const handleFileUpload = async (docType: string, file: File) => {
    setUploading(docType);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', docType);
      formData.append('permission', 'RESIDENTS_ONLY');

      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      setUploadedDocs((prev) => ({
        ...prev,
        [docType]: {
          fileId: result.file.id,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
        },
      }));

      toast({
        title: 'Success',
        description: `${file.name} uploaded successfully`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveDoc = (docType: string) => {
    setUploadedDocs((prev) => {
      const newDocs = { ...prev };
      delete newDocs[docType];
      return newDocs;
    });
  };

  const handleContinue = () => {
    // Check if required documents (only bylaws) are uploaded
    const missingRequired = DOCUMENT_TYPES.filter(
      (doc) => doc.required && !uploadedDocs[doc.id]
    );

    if (missingRequired.length > 0) {
      toast({
        title: 'Required Document Missing',
        description: 'Please upload your Association Bylaws to continue.',
        variant: 'destructive',
      });
      return;
    }

    onNext({ documents: uploadedDocs, storageType });
  };

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 border-0 shadow-xl backdrop-blur-sm">
      {/* Enhanced Header */}
      <div className="mb-8 relative">
        <div className="absolute -top-2 -left-2 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-2 -right-2 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30 mb-4 group hover:scale-110 transition-transform duration-300">
            <FileText className="h-8 w-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Documents & Storage
            </h2>
            <p className="text-[var(--semantic-text-secondary)] text-lg">
              Upload your key documents and choose your storage preference.
            </p>
          </div>
        </div>
      </div>

      {/* Storage Selection with Enhanced Design */}
      <div className="mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-[var(--semantic-border-light)] shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Cloud className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Document Storage</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => setStorageType('builtin')}
            className={`group p-5 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
              storageType === 'builtin'
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg shadow-blue-500/20'
                : 'border-[var(--semantic-border-light)] bg-white hover:border-blue-300 hover:shadow-md'
            }`}
          >
            {storageType === 'builtin' && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
            )}
            
            <div className="relative flex items-start gap-4">
              <div className={`p-3 rounded-xl transition-all ${
                storageType === 'builtin' 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'bg-[var(--semantic-surface-hover)] text-[var(--semantic-text-secondary)] group-hover:bg-blue-100 group-hover:text-blue-600'
              }`}>
                <Cloud className="h-6 w-6" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-base">Built-in Cloud</p>
                  {storageType === 'builtin' && (
                    <Check className="h-5 w-5 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-[var(--semantic-text-secondary)]">Secure, automatic backups included</p>
              </div>
            </div>
          </button>

          <button
            disabled
            className="p-5 rounded-xl border-2 border-[var(--semantic-border-light)] text-left opacity-50 cursor-not-allowed bg-[var(--semantic-bg-subtle)]"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[var(--semantic-surface-hover)] text-[var(--semantic-text-tertiary)]">
                <HardDrive className="h-6 w-6" />
              </div>
              
              <div className="flex-1">
                <p className="font-semibold text-base text-[var(--semantic-text-secondary)]">Google Drive</p>
                <p className="text-sm text-[var(--semantic-text-tertiary)]">Coming soon</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Document Upload Section */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-[var(--semantic-text-primary)]">
              Upload Documents
            </h3>
            <p className="text-sm text-[var(--semantic-text-secondary)]">
              Only Bylaws required • Add more documents anytime
            </p>
          </div>
        </div>

        {DOCUMENT_TYPES.map((docType) => {
          const uploaded = uploadedDocs[docType.id];
          const isUploading = uploading === docType.id;

          return (
            <div
              key={docType.id}
              className={`group border-2 rounded-xl p-5 transition-all duration-300 backdrop-blur-sm ${
                uploaded 
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50/50 border-green-300 shadow-md shadow-green-500/10' 
                  : 'bg-white/80 border-[var(--semantic-border-light)] hover:border-blue-300 hover:shadow-md hover:bg-blue-50/30'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      uploaded 
                        ? 'bg-green-500 text-white' 
                        : 'bg-[var(--semantic-surface-hover)] text-[var(--semantic-text-secondary)] group-hover:bg-blue-100 group-hover:text-blue-600'
                    }`}>
                      {uploaded ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-[var(--semantic-text-primary)]">
                          {docType.title}
                        </h4>
                        {docType.required && (
                          <span className="text-xs px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--semantic-text-secondary)] mt-0.5">{docType.description}</p>
                    </div>
                  </div>

                  {uploaded && (
                    <div className="flex items-center gap-2 text-sm text-[var(--semantic-text-secondary)] mt-3 pl-12 truncate">
                      <FileText className="h-4 w-4 flex-shrink-0 text-green-600" />
                      <span className="font-medium truncate">{uploaded.fileName}</span>
                      <span className="text-xs text-[var(--semantic-text-tertiary)]">
                        ({(uploaded.fileSize / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {uploaded ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDoc(docType.id)}
                      disabled={isUploading}
                      className="hover:bg-red-100 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      <input
                        type="file"
                        id={`file-${docType.id}`}
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(docType.id, file);
                          }
                        }}
                        disabled={isUploading}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById(`file-${docType.id}`)?.click()
                        }
                        disabled={isUploading}
                        className="bg-white hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600"
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            <span>Upload</span>
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enhanced Info Box */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-2 border-blue-200 rounded-xl p-5 mb-8 backdrop-blur-sm">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-blue-900 mb-2">Quick Tips</p>
            <ul className="space-y-1.5 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>PDF format recommended for best compatibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>You can add more documents anytime from the Documents app</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>All files are encrypted and backed up automatically</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Enhanced Action Button */}
      <div className="flex justify-end pt-6 border-t-2 border-[var(--semantic-border-light)]">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={saving || uploading !== null}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105 px-8 h-12 text-base font-semibold"
        >
          {saving ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
