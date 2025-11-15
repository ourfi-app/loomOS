
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Upload, FileSpreadsheet, ArrowRight, Loader2, AlertCircle, Download, CheckCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ResidentsStepProps {
  data: any;
  onNext: (data: any) => void;
  saving: boolean;
}

export default function ResidentsStep({
  data,
  onNext,
  saving,
}: ResidentsStepProps) {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    success: number;
    failed: number;
    total: number;
  } | null>(data?.residentImport || null);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadedFile(file);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/onboarding/import-residents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      const result = await response.json();

      setImportStatus({
        success: result.imported,
        failed: result.failed,
        total: result.total,
      });

      toast({
        title: 'Import Successful',
        description: `${result.imported} of ${result.total} residents imported successfully`,
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: 'Import Failed',
        description: 'Failed to import residents. Please check the file format.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'First Name,Last Name,Email,Phone,Unit Number,Is Owner,Move In Date\nJohn,Doe,john@example.com,(312) 555-0100,101,Yes,2024-01-15\nJane,Smith,jane@example.com,(312) 555-0200,102,No,2024-02-01';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resident_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleContinue = () => {
    onNext({
      residentImport: importStatus,
      residentFileUploaded: !!uploadedFile,
    });
  };

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 border-0 shadow-xl backdrop-blur-sm">
      {/* Enhanced Header */}
      <div className="mb-8 relative">
        <div className="absolute -top-2 -left-2 w-24 h-24 bg-[var(--semantic-success)]/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-2 -right-2 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 mb-4 group hover:scale-110 transition-transform duration-300">
            <Users className="h-8 w-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-green-900 to-emerald-900 bg-clip-text text-transparent">
                Add Residents
              </h2>
              <span className="text-sm px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                Optional
              </span>
            </div>
            <p className="text-[var(--semantic-text-secondary)] text-lg">
              Import your residents from a CSV file or add them individually later.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-6">
        {/* Download Template */}
        <div className="group border-2 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50/50 border-[var(--semantic-primary-light)] hover:border-[var(--semantic-primary-light)] hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[var(--semantic-primary)] text-white text-xs flex items-center justify-center font-bold">1</div>
                <h3 className="font-bold text-[var(--semantic-text-primary)] text-lg">
                  Download Template
                </h3>
              </div>
              <p className="text-sm text-[var(--semantic-text-secondary)] mb-4">
                Download our CSV template and fill it out with your resident information.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadTemplate}
                className="bg-white hover:bg-[var(--semantic-primary-subtle)] hover:border-[var(--semantic-primary)] hover:text-[var(--semantic-primary)] transition-all duration-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Download CSV Template
              </Button>
            </div>
          </div>
        </div>

        {/* Upload File */}
        <div className="group border-2 rounded-xl p-6 bg-white/80 backdrop-blur-sm border-[var(--semantic-border-light)] hover:border-[var(--semantic-success-border)] hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
              <Upload className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[var(--semantic-success)] text-white text-xs flex items-center justify-center font-bold">2</div>
                <h3 className="font-bold text-[var(--semantic-text-primary)] text-lg">
                  Upload CSV File
                </h3>
              </div>
              <p className="text-sm text-[var(--semantic-text-secondary)] mb-4">
                Upload your completed CSV file to import all residents at once.
              </p>

              <input
                type="file"
                id="resident-file"
                className="hidden"
                accept=".csv"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file);
                  }
                }}
                disabled={uploading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('resident-file')?.click()}
                disabled={uploading}
                className="bg-white hover:bg-[var(--semantic-success-bg)] hover:border-[var(--semantic-success)] hover:text-[var(--semantic-success)] transition-all duration-300"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV File
                  </>
                )}
              </Button>

              {uploadedFile && (
                <div className="mt-3 text-sm text-[var(--semantic-text-secondary)] flex items-center gap-2 p-3 bg-[var(--semantic-success-bg)] rounded-lg border border-[var(--semantic-success-bg)]">
                  <CheckCircle className="h-4 w-4 text-[var(--semantic-success)] flex-shrink-0" />
                  <span><span className="font-semibold">File uploaded:</span> {uploadedFile.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Import Status */}
        {importStatus && (
          <div className="border-2 border-[var(--semantic-success-border)] rounded-xl p-6 bg-gradient-to-br from-green-50 to-emerald-50/50 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--semantic-success)] flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-green-900 text-lg">Import Complete</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/80 rounded-lg">
                <div className="text-3xl font-bold text-[var(--semantic-text-primary)] mb-1">
                  {importStatus.total}
                </div>
                <div className="text-sm text-[var(--semantic-text-secondary)] font-medium">Total Records</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-lg">
                <div className="text-3xl font-bold text-[var(--semantic-success)] mb-1">
                  {importStatus.success}
                </div>
                <div className="text-sm text-[var(--semantic-text-secondary)] font-medium">Imported</div>
              </div>
              <div className="text-center p-4 bg-white/80 rounded-lg">
                <div className="text-3xl font-bold text-[var(--semantic-error)] mb-1">
                  {importStatus.failed}
                </div>
                <div className="text-sm text-[var(--semantic-text-secondary)] font-medium">Failed</div>
              </div>
            </div>
          </div>
        )}

        {/* Info Boxes */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border-2 border-amber-200 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900 mb-2">CSV Format Requirements</p>
              <ul className="space-y-1.5 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span><strong>Required columns:</strong> First Name, Last Name, Email, Unit Number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span><strong>Optional columns:</strong> Phone, Is Owner (Yes/No), Move In Date</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span><strong>Date format:</strong> YYYY-MM-DD (e.g., 2024-01-15)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>Each resident will receive an invitation email</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-2 border-[var(--semantic-primary-light)] rounded-xl p-5 backdrop-blur-sm">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-[var(--semantic-primary)] flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-[var(--semantic-primary-dark)] mb-1">Add Manually Later</p>
              <p className="text-sm text-[var(--semantic-primary-dark)]">
                You can skip this step and add residents one-by-one from the Resident Directory later. 
                However, importing now saves time if you have many residents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Action Button */}
      <div className="flex justify-end pt-6 border-t-2 border-[var(--semantic-border-light)]">
        <Button 
          size="lg" 
          onClick={handleContinue} 
          disabled={saving || uploading}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-105 px-8 h-12 text-base font-semibold"
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
