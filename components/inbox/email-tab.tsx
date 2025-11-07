'use client';

import { Send, Mail, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function EmailTab() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="p-6 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
            <Send className="h-16 w-16 text-blue-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Email Integration</h2>
          <p className="text-muted-foreground">
            Connect your email account to manage messages directly from the Inbox
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-3 text-left">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Email Access Coming Soon</h3>
                <p className="text-sm text-muted-foreground">
                  We're working on integrating email functionality. Soon you'll be able to:
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                  <li>Connect your email account (Gmail, Outlook, etc.)</li>
                  <li>Send and receive emails within the app</li>
                  <li>Organize messages with labels and folders</li>
                  <li>Search across all your communications</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pt-4">
          <Button variant="outline" disabled>
            <Mail className="h-4 w-4 mr-2" />
            Connect Email Account
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            This feature is not yet available
          </p>
        </div>
      </div>
    </div>
  );
}
