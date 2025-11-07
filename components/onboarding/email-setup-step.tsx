
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Check, X, AlertCircle, ArrowRight, Loader2, ExternalLink, Sparkles, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailSetupStepProps {
  data: any;
  onNext: (data: any) => void;
  saving: boolean;
}

export default function EmailSetupStep({
  data,
  onNext,
  saving,
}: EmailSetupStepProps) {
  const { toast } = useToast();
  const [provider, setProvider] = useState(data?.emailProvider || 'sendgrid');
  const [apiKey, setApiKey] = useState(data?.emailApiKey || '');
  const [fromEmail, setFromEmail] = useState(data?.emailFrom || '');
  const [fromName, setFromName] = useState(data?.emailFromName || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleTestConnection = async () => {
    if (!apiKey || !fromEmail) {
      toast({
        title: 'Missing Information',
        description: 'Please enter API key and from email address',
        variant: 'destructive',
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/onboarding/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey,
          fromEmail,
          fromName,
        }),
      });

      if (response.ok) {
        setTestResult('success');
        toast({
          title: 'Connection Successful',
          description: 'Email service configured correctly',
        });
      } else {
        setTestResult('error');
        toast({
          title: 'Connection Failed',
          description: 'Please check your credentials and try again',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setTestResult('error');
      toast({
        title: 'Test Failed',
        description: 'An error occurred while testing the connection',
        variant: 'destructive',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleContinue = () => {
    onNext({
      emailProvider: provider,
      emailApiKey: apiKey,
      emailFrom: fromEmail,
      emailFromName: fromName,
      emailConfigured: testResult === 'success',
    });
  };

  return (
    <Card className="p-6 md:p-8 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/20 border-0 shadow-xl backdrop-blur-sm">
      {/* Enhanced Header */}
      <div className="mb-8 relative">
        <div className="absolute -top-2 -left-2 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-2 -right-2 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 mb-4 group hover:scale-110 transition-transform duration-300">
            <Mail className="h-8 w-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                Email Configuration
              </h2>
              <span className="text-sm px-3 py-1 bg-amber-100 text-amber-700 rounded-full font-medium">
                Optional
              </span>
            </div>
            <p className="text-gray-600 text-lg">
              Connect your email service to send announcements and notifications.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* SendGrid Instructions */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-2 border-blue-200 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-blue-900 mb-3">SendGrid Setup Instructions</p>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mt-0.5">1</span>
                  <span>Create a free SendGrid account at sendgrid.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mt-0.5">2</span>
                  <span>Verify your sender email address</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mt-0.5">3</span>
                  <span>Generate an API key from Settings → API Keys</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center mt-0.5">4</span>
                  <span>Copy and paste the API key below</span>
                </li>
              </ol>
              <a
                href="https://app.sendgrid.com/settings/api_keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mt-4 font-semibold text-sm hover:gap-3 transition-all"
              >
                Open SendGrid Dashboard
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 shadow-md space-y-5">
          <div>
            <Label htmlFor="apiKey" className="text-sm font-semibold text-gray-900 mb-2 block">
              SendGrid API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setTestResult(null);
              }}
              placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxxx"
              className="font-mono h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          <div>
            <Label htmlFor="fromEmail" className="text-sm font-semibold text-gray-900 mb-2 block">
              From Email Address
            </Label>
            <Input
              id="fromEmail"
              type="email"
              value={fromEmail}
              onChange={(e) => {
                setFromEmail(e.target.value);
                setTestResult(null);
              }}
              placeholder="noreply@montrecott.com"
              className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              This email must be verified in your SendGrid account
            </p>
          </div>

          <div>
            <Label htmlFor="fromName" className="text-sm font-semibold text-gray-900 mb-2 block">
              From Name
            </Label>
            <Input
              id="fromName"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
              placeholder="Montrecott Association"
              className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>

          {/* Test Connection */}
          <div className="pt-4 flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleTestConnection}
              disabled={testing || !apiKey || !fromEmail}
              className="bg-white hover:bg-purple-50 hover:border-purple-500 hover:text-purple-600 h-11"
            >
              {testing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>

            {testResult === 'success' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
                <Check className="h-5 w-5" />
                <span className="text-sm font-semibold">Connected Successfully</span>
              </div>
            )}

            {testResult === 'error' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200">
                <X className="h-5 w-5" />
                <span className="text-sm font-semibold">Connection Failed</span>
              </div>
            )}
          </div>
        </div>

        {/* Skip Notice */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border-2 border-amber-200 rounded-xl p-5 backdrop-blur-sm">
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900 mb-1">Optional Setup</p>
              <p className="text-sm text-amber-800">
                You can skip this step and configure email later in System Settings. 
                However, email notifications won't work until this is set up.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Action Button */}
      <div className="flex justify-end pt-6 border-t-2 border-gray-100 mt-8">
        <Button 
          size="lg" 
          onClick={handleContinue} 
          disabled={saving}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 px-8 h-12 text-base font-semibold"
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
