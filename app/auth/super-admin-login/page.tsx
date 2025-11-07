'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, AlertCircle, Eye, EyeOff, Shield, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setIsLoading(false);
      } else if (result?.ok) {
        // Verify the user is actually a super admin
        const response = await fetch('/api/auth/session');
        const session = await response.json();

        if (session?.user?.role === 'SUPER_ADMIN') {
          router.push('/dashboard/super-admin');
        } else {
          setError('Access denied. Super admin privileges required.');
          setIsLoading(false);
          // Sign out non-super admin users
          await fetch('/api/auth/signout', { method: 'POST' });
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-950 flex items-center justify-center p-6">
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.1) 10px,
            rgba(255,255,255,0.1) 20px
          )`
        }} />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-red-100 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Logo and Title Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-red-200 text-center">
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-red-950">Super Admin Access</h1>
          <p className="text-red-700 mt-2 font-medium">Platform Management Console</p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full">
            <Lock className="w-3 h-3 text-red-600" />
            <span className="text-xs font-medium text-red-700">Restricted Access</span>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-red-200">
          {error && (
            <Alert className="bg-red-50 border-red-300 rounded-lg mb-5">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 text-sm font-medium">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-red-950">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="superadmin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-lg bg-white border-red-300 focus:border-red-500 focus:ring-red-500 text-red-950"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-red-950">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 rounded-lg bg-white border-red-300 focus:border-red-500 focus:ring-red-500 text-red-950 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold shadow-lg transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Access Super Admin
                </span>
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex gap-3">
              <Lock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-red-700 space-y-1">
                <p className="font-semibold">Security Notice:</p>
                <ul className="list-disc list-inside space-y-1 text-red-600">
                  <li>This is a restricted access area</li>
                  <li>All login attempts are logged</li>
                  <li>Unauthorized access is prohibited</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Regular Login Link Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-red-200 text-center">
          <p className="text-sm text-red-700">
            Not a super admin?{' '}
            <Link
              href="/auth/login"
              className="text-red-600 hover:text-red-800 font-semibold underline"
            >
              Regular Login
            </Link>
          </p>
        </div>

        {/* Default Credentials Notice (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-yellow-400">
            <p className="text-xs text-yellow-100 text-center font-medium">
              <strong>Dev Mode:</strong> Default credentials - Email: superadmin@trellis.com | Password: SuperAdmin123!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
