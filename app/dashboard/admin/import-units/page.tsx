// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Users,
  Home,
  DollarSign,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { APP_COLORS } from '@/lib/app-design-system';

interface CSVRow {
  Unit: string;
  FirstName?: string;
  LastName?: string;
  'Mailing Street'?: string;
  'City, State Zip'?: string;
  Email?: string;
  Mobile?: string;
  'Home Phone'?: string;
  [key: string]: string | undefined;
}

interface ValidationResult {
  row: number;
  data: CSVRow;
  status: 'valid' | 'warning' | 'error';
  message?: string;
  existingUser?: boolean;
}

export default function ImportUnitsPage() {
  const session = useSession();
  const status = session?.status || 'loading';
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [importComplete, setImportComplete] = useState(false);

  const userRole = (session?.data?.user as any)?.role;

  useEffect(() => {
    if (status === 'authenticated' && userRole !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, userRole, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setValidationResults([]);
      setImportComplete(false);
    }
  };

  const handleParseCSV = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setParsing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/import-units/parse', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setValidationResults(data.results || []);
        toast.success(`Parsed ${data.results?.length || 0} rows successfully`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to parse CSV');
      }
    } catch (error) {
      console.error('Error parsing CSV:', error);
      toast.error('Failed to parse CSV file');
    } finally {
      setParsing(false);
    }
  };

  const handleImport = async () => {
    if (validationResults.length === 0) {
      toast.error('Please parse the CSV file first');
      return;
    }

    const hasErrors = validationResults.some(r => r.status === 'error');
    if (hasErrors) {
      toast.error('Please fix all errors before importing');
      return;
    }

    setImporting(true);
    try {
      const response = await fetch('/api/admin/import-units/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ results: validationResults }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Successfully imported ${data.imported} units`);
        setImportComplete(true);
        setFile(null);
        setValidationResults([]);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to import data');
      }
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Failed to import data');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'Unit,FirstName,LastName,Mailing Street,"City, State Zip",Email,Mobile,Home Phone\n1901-G,John,Doe,123 Main Street,"Chicago, IL 60601",john@example.com,(555) 123-4567,(555) 123-4568\n1905-1,Jane,Smith,456 Oak Avenue,"Chicago, IL 60602",jane@example.com,(555) 987-6543,';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'montrecott_residents_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (status === 'loading') {
    return (
      <div 
        className="flex items-center justify-center h-full"
        style={{
          background: 'var(--webos-bg-gradient)',
          fontFamily: "'Helvetica Neue', Arial, sans-serif"
        }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: 'var(--webos-app-blue)' }}
          ></div>
          <p className="font-light" style={{ color: 'var(--webos-text-secondary)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'ADMIN') {
    return null;
  }

  const validCount = validationResults.filter(r => r.status === 'valid').length;
  const warningCount = validationResults.filter(r => r.status === 'warning').length;
  const errorCount = validationResults.filter(r => r.status === 'error').length;

  return (
    <DesktopAppWrapper
      title="Import Units"
      icon={<Upload className="w-5 h-5" />}
      gradient={APP_COLORS.admin.light}
    >
      <div 
        className="space-y-6 max-w-7xl"
        style={{
          background: 'var(--webos-bg-gradient)',
          fontFamily: "'Helvetica Neue', Arial, sans-serif",
          padding: '24px'
        }}
      >
      {/* Header */}
      <div>
        <h1 
          className="text-3xl font-light tracking-tight flex items-center gap-2"
          style={{ color: 'var(--webos-text-primary)' }}
        >
          <FileSpreadsheet className="h-8 w-8" style={{ color: 'var(--webos-app-blue)' }} />
          Import Units & Accounts
        </h1>
        <p className="font-light mt-1" style={{ color: 'var(--webos-text-secondary)' }}>
          Bulk import units, accounts, and dues from a CSV file
        </p>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            How to Import
          </CardTitle>
          <CardDescription>
            Follow these steps to import your unit and account data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-nordic-night mb-1">Download Template</h4>
                <p className="text-sm text-muted-foreground">
                  Download the CSV template with required columns
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-nordic-night mb-1">Fill Data</h4>
                <p className="text-sm text-muted-foreground">
                  Add your unit and resident information to the CSV
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-nordic-night mb-1">Upload & Import</h4>
                <p className="text-sm text-muted-foreground">
                  Upload the file, preview, and confirm import
                </p>
              </div>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>CSV Format Requirements</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                <li><strong>Unit</strong> (required): Unit identifier (e.g., 1901-G, 1905-1)</li>
                <li><strong>FirstName</strong> (required): Owner's first name</li>
                <li><strong>LastName</strong> (required): Owner's last name</li>
                <li><strong>Mailing Street</strong> (optional): Street address</li>
                <li><strong>City, State Zip</strong> (optional): City, state, and ZIP code</li>
                <li><strong>Email</strong> (recommended): Email address for account matching</li>
                <li><strong>Mobile</strong> (optional): Mobile phone number</li>
                <li><strong>Home Phone</strong> (optional): Home phone number</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Button onClick={downloadTemplate} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download CSV Template
          </Button>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload CSV File
          </CardTitle>
          <CardDescription>
            Select and parse your CSV file before importing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csvFile">Select CSV File</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={parsing || importing}
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleParseCSV} 
              disabled={!file || parsing || importing}
            >
              {parsing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Parsing...
                </>
              ) : (
                <>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Parse & Validate
                </>
              )}
            </Button>

            {validationResults.length > 0 && (
              <Button 
                onClick={handleImport} 
                disabled={errorCount > 0 || importing}
                variant="default"
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Import {validCount} Valid Records
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Validation Results
              <div className="ml-auto flex gap-2">
                {validCount > 0 && (
                  <Badge variant="default" className="bg-[var(--semantic-success)]">
                    {validCount} Valid
                  </Badge>
                )}
                {warningCount > 0 && (
                  <Badge variant="secondary" className="bg-yellow-600 text-white">
                    {warningCount} Warnings
                  </Badge>
                )}
                {errorCount > 0 && (
                  <Badge variant="destructive">
                    {errorCount} Errors
                  </Badge>
                )}
              </div>
            </CardTitle>
            <CardDescription>
              Review the validation results before importing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <div className="overflow-x-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Row</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationResults.map((result, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{result.row}</TableCell>
                        <TableCell>
                          {result.status === 'valid' && (
                            <Badge variant="default" className="bg-[var(--semantic-success)]">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Valid
                            </Badge>
                          )}
                          {result.status === 'warning' && (
                            <Badge variant="secondary" className="bg-yellow-600 text-white">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Warning
                            </Badge>
                          )}
                          {result.status === 'error' && (
                            <Badge variant="destructive">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Error
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{result.data.Unit}</TableCell>
                        <TableCell>
                          {result.data.FirstName && result.data.LastName 
                            ? `${result.data.FirstName} ${result.data.LastName}` 
                            : (result.data.FirstName || result.data.LastName || '-')}
                        </TableCell>
                        <TableCell>{result.data.Email || '-'}</TableCell>
                        <TableCell>
                          {result.data.Mobile || result.data['Home Phone'] || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {result.message}
                          {result.existingUser && (
                            <span className="text-[var(--semantic-primary)] ml-1">(Existing user)</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {importComplete && (
        <Alert className="border-[var(--semantic-success-bg)] bg-[var(--semantic-success-bg)]">
          <CheckCircle2 className="h-4 w-4 text-[var(--semantic-success)]" />
          <AlertTitle className="text-green-900">Import Successful!</AlertTitle>
          <AlertDescription className="text-[var(--semantic-success-dark)]">
            Your unit and account data has been successfully imported. Users can now claim their households using their email addresses.
          </AlertDescription>
        </Alert>
      )}
    </div>

    </DesktopAppWrapper>  );
}
