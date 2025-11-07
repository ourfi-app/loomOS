
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      setIsGoogleLoading(false);
    }
  };

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
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8E8E8] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#2D2D2D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Logo and Title Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[#D0D0D0] text-center">
          <div className="mx-auto mb-6 w-80 h-auto">
            <Image
              src="/logo-community-manager.png"
              alt="Community Manager"
              width={320}
              height={320}
              className="w-full h-auto"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-[#2D2D2D]">Welcome back</h1>
          <p className="text-[#6B6B6B] mt-2">Sign in to your account</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[#D0D0D0]">
          {error && (
            <Alert className="bg-[#FEE2E2] border-[#FCA5A5] rounded-lg mb-5">
              <AlertCircle className="h-4 w-4 text-[#DC2626]" />
              <AlertDescription className="text-[#DC2626] text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 rounded-lg border-[#D0D0D0] bg-[#F8F8F8] hover:bg-white text-[#2D2D2D] font-medium"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D0D0D0]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-[#A0A0A0]">OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#2D2D2D]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 rounded-lg bg-[#F8F8F8] border-[#D0D0D0] focus:border-[#2196F3] focus:ring-[#2196F3] text-[#2D2D2D]"
                disabled={isLoading || isGoogleLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[#2D2D2D]">
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
                  className="h-11 rounded-lg bg-[#F8F8F8] border-[#D0D0D0] focus:border-[#2196F3] focus:ring-[#2196F3] text-[#2D2D2D] pr-10"
                  disabled={isLoading || isGoogleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[#6B6B6B] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading || isGoogleLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#7CB342] hover:bg-[#689F38] text-white rounded-lg font-medium shadow-sm"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>

        {/* Register Link Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#D0D0D0] text-center">
          <p className="text-sm text-[#6B6B6B]">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-[#2196F3] hover:text-[#1976D2] font-medium"
            >
              Create an account
            </Link>
          </p>
        </div>

        {/* Super Admin Link */}
        <div className="text-center">
          <Link
            href="/auth/super-admin-login"
            className="inline-flex items-center gap-2 text-xs text-[#A0A0A0] hover:text-[#6B6B6B] transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Super Admin Access
          </Link>
        </div>
      </div>
    </div>
  );
}
