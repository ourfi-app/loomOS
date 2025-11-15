

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Globe, Plus, CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';

interface Domain {
  organizationId: string;
  organizationName: string;
  subdomain: string | null;
  customDomain: string | null;
  verified: boolean;
  createdAt: string;
}

export default function DomainsManagement() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role !== 'SUPER_ADMIN') {
      toast.error('Access denied');
      router.push('/dashboard');
      return;
    }

    fetchDomains();
  }, [session, status, router]);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/super-admin/domains');
      if (!response.ok) throw new Error('Failed to fetch domains');
      const data = await response.json();
      setDomains(data);
    } catch (error) {
      console.error('Error fetching domains:', error);
      toast.error('Failed to load domains');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DesktopAppWrapper
      title="Domains Management"

// Back handled in toolbar
      // onBack={() => router.push('/dashboard/super-admin')}
    >
      <div className="space-y-4">
        {/* DNS Configuration Guide */}
        <Card className="border-[var(--semantic-primary)]/50 bg-[var(--semantic-primary-subtle)]/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center text-[var(--semantic-primary-dark)] dark:text-[var(--semantic-primary)]">
              <Globe className="w-5 h-5 mr-2" />
              Domain Configuration Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>For subdomains:</strong> Automatically configured as [subdomain].yoursaas.com</p>
            <p><strong>For custom domains:</strong> Organization must add these DNS records:</p>
            <div className="mt-2 p-3 bg-white dark:bg-[var(--semantic-text-primary)] rounded-md font-mono text-xs">
              <div>Type: A</div>
              <div>Name: @ (or your domain)</div>
              <div>Value: [Your Server IP]</div>
              <div className="mt-2">Type: CNAME</div>
              <div>Name: www</div>
              <div>Value: [Your Domain]</div>
            </div>
          </CardContent>
        </Card>

        {/* Domains Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Domains ({domains.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Organization</TableHead>
                    <TableHead>Subdomain</TableHead>
                    <TableHead>Custom Domain</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {domains.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Globe className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            No domains configured
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    domains.map((domain, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="font-medium">{domain.organizationName}</div>
                        </TableCell>
                        <TableCell>
                          {domain.subdomain ? (
                            <div className="text-sm">
                              {domain.subdomain}.yoursaas.com
                              <ExternalLink className="inline w-3 h-3 ml-1" />
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {domain.customDomain ? (
                            <div className="text-sm">
                              {domain.customDomain}
                              <ExternalLink className="inline w-3 h-3 ml-1" />
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {domain.verified ? (
                            <Badge variant="default" className="bg-[var(--semantic-success)]">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground">
                            {new Date(domain.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Verify
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DesktopAppWrapper>
  );
}
