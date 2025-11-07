
'use client';

import { FileQuestion, Home, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-2">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center mb-4 shadow-lg">
            <FileQuestion className="w-12 h-12 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold mb-2">
            404 - Page Not Found
          </CardTitle>
          <CardDescription className="text-lg">
            Sorry, we couldn't find the page you're looking for
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Helpful Message */}
          <div className="bg-muted rounded-lg p-6 border text-center">
            <p className="text-foreground mb-4">
              The page you requested might have been moved, deleted, or never existed.
            </p>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">Here are some helpful links instead:</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/dashboard">
              <div className="p-4 rounded-lg border hover:border-primary hover:bg-muted/50 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Home</div>
                    <div className="text-xs text-muted-foreground">Go to dashboard</div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/documents">
              <div className="p-4 rounded-lg border hover:border-documents hover:bg-muted/50 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-documents to-info flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Documents</div>
                    <div className="text-xs text-muted-foreground">Browse files</div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/directory">
              <div className="p-4 rounded-lg border hover:border-community hover:bg-muted/50 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-community to-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">Directory</div>
                    <div className="text-xs text-muted-foreground">Find residents</div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/chat">
              <div className="p-4 rounded-lg border hover:border-messaging hover:bg-muted/50 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent-warm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">AI Assistant</div>
                    <div className="text-xs text-muted-foreground">Get help</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white shadow-lg">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

