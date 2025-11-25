'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GlassPanel } from '@/components/core/panels/GlassPanel';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TODO: Implement password reset API call
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" 
      style={{ 
        background: 'linear-gradient(135deg, var(--semantic-bg-muted) 0%, var(--semantic-bg-subtle) 50%, var(--semantic-bg-muted) 100%)'
      }}
    >
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Back to Login */}
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm font-light transition-colors duration-200 hover:opacity-70"
          style={{ color: 'var(--semantic-text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>

        {/* Logo and Title Card */}
        <GlassPanel variant="medium" blur="medium" rounded="3xl" padding="xl" className="text-center">
          {/* loomOS Logo */}
          <div className="mb-6">
            <h1 className="text-4xl font-extralight tracking-tight" style={{ color: 'var(--semantic-text-primary)' }}>
              loomOS
            </h1>
            <p className="text-xs mt-2 font-light tracking-wider uppercase" style={{ color: 'var(--semantic-text-tertiary)' }}>
              PASSWORD RESET
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-light" style={{ color: 'var(--semantic-text-primary)' }}>Forgot Password?</h2>
            <p className="mt-2 text-sm font-light" style={{ color: 'var(--semantic-text-secondary)' }}>
              Enter your email to receive a reset link
            </p>
          </div>
        </GlassPanel>

        {/* Reset Form Card */}
        <GlassPanel variant="medium" blur="medium" rounded="3xl" padding="xl">
          {success ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="rounded-full p-4" style={{ backgroundColor: 'rgba(34, 197, 94, 0.6)' }}>
                  <CheckCircle className="h-12 w-12" style={{ color: '#22c55e' }} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-light mb-2" style={{ color: 'var(--semantic-text-primary)' }}>
                  Check Your Email
                </h3>
                <p className="text-sm font-light" style={{ color: 'var(--semantic-text-secondary)' }}>
                  We&apos;ve sent password reset instructions to <span className="font-medium">{email}</span>
                </p>
              </div>
              <Alert className="rounded-xl" style={{ backgroundColor: 'rgba(59, 130, 246, 0.6)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                <Mail className="h-4 w-4" style={{ color: '#3b82f6' }} />
                <AlertDescription className="text-sm font-light" style={{ color: '#1e40af' }}>
                  Didn&apos;t receive the email? Check your spam folder or try again in a few minutes.
                </AlertDescription>
              </Alert>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                onClick={() => {
                  setSuccess(false);
                  setEmail('');
                }}
                className="h-12"
              >
                SEND ANOTHER EMAIL
              </Button>
            </div>
          ) : (
            <>
              {error && (
                <Alert className="rounded-xl mb-5" style={{ backgroundColor: 'rgba(220, 38, 38, 0.6)', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
                  <AlertCircle className="h-4 w-4" style={{ color: '#dc2626' }} />
                  <AlertDescription className="text-sm font-light" style={{ color: '#991b1b' }}>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-xs font-light tracking-wider uppercase" style={{ color: 'var(--semantic-text-secondary)' }}>
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 pl-11 rounded-xl outline-none text-sm font-light transition-all duration-200"
                      style={{ 
                        backgroundColor: 'var(--glass-white-60)',
                        border: '1px solid #d0d0d0',
                        color: 'var(--semantic-text-primary)'
                      }}
                      disabled={isLoading}
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--semantic-text-tertiary)' }} />
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={isLoading}
                  loading={isLoading}
                  className="h-12"
                >
                  {isLoading ? 'SENDING...' : 'SEND RESET LINK'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs font-light" style={{ color: 'var(--semantic-text-tertiary)' }}>
                  Remember your password?{' '}
                  <Link
                    href="/auth/login"
                    className="font-light transition-colors duration-200 hover:opacity-70"
                    style={{ color: 'var(--semantic-text-primary)' }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </GlassPanel>

        {/* Security Notice */}
        <GlassPanel variant="medium" blur="medium" rounded="2xl" padding="md">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--semantic-text-secondary)' }} />
            <div>
              <p className="text-xs font-light" style={{ color: 'var(--semantic-text-secondary)' }}>
                <span className="font-medium">Security Notice:</span> If an account exists with this email, you will receive reset instructions. For security reasons, we don&apos;t disclose whether an account exists.
              </p>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
