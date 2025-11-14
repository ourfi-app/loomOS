
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    unitNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

    if (!formData.unitNumber?.trim()) {
      setError('Unit number is required');
      return;
    }

    if (!formData.phone?.trim()) {
      setError('Phone number is required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          unitNumber: formData.unitNumber,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      // Auto sign in after successful registration
      const signInResult = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (signInResult?.ok) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen webos-gradient-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Logo and Title Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[var(--semantic-border-medium)] text-center">
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
          <h1 className="text-3xl font-bold text-[var(--semantic-text-primary)]">Create an account</h1>
          <p className="text-[var(--semantic-text-secondary)] mt-2">Join your community today</p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[var(--semantic-border-medium)]">
          {error && (
            <Alert className="bg-[var(--semantic-error-bg)] border-[var(--semantic-error-border)] rounded-lg mb-5">
              <AlertCircle className="h-4 w-4 text-[var(--semantic-error)]" />
              <AlertDescription className="text-[var(--semantic-error)] text-sm">{error}</AlertDescription>
            </Alert>
          )}

          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 rounded-lg border-[var(--semantic-border-medium)] bg-[var(--semantic-surface-hover)] hover:bg-white text-[var(--semantic-text-primary)] font-medium"
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
              <div className="w-full border-t border-[var(--semantic-border-medium)]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-[#A0A0A0]">OR</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-[var(--semantic-text-primary)]">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-11 rounded-lg bg-[var(--semantic-surface-hover)] border-[var(--semantic-border-medium)] focus:border-[#F18825] focus:ring-[#F18825] text-[var(--semantic-text-primary)]"
                disabled={isLoading || isGoogleLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[var(--semantic-text-primary)]">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-11 rounded-lg bg-[var(--semantic-surface-hover)] border-[var(--semantic-border-medium)] focus:border-[#F18825] focus:ring-[#F18825] text-[var(--semantic-text-primary)]"
                disabled={isLoading || isGoogleLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-[var(--semantic-text-primary)]">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-lg bg-[var(--semantic-surface-hover)] border-[var(--semantic-border-medium)] focus:border-[#F18825] focus:ring-[#F18825] text-[var(--semantic-text-primary)]"
                  disabled={isLoading || isGoogleLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitNumber" className="text-sm font-medium text-[var(--semantic-text-primary)]">
                  Unit Number
                </Label>
                <Input
                  id="unitNumber"
                  name="unitNumber"
                  type="text"
                  placeholder="101"
                  value={formData.unitNumber}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-lg bg-[var(--semantic-surface-hover)] border-[var(--semantic-border-medium)] focus:border-[#F18825] focus:ring-[#F18825] text-[var(--semantic-text-primary)]"
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[var(--semantic-text-primary)]">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-lg bg-[var(--semantic-surface-hover)] border-[var(--semantic-border-medium)] focus:border-[#F18825] focus:ring-[#F18825] text-[var(--semantic-text-primary)] pr-10"
                  disabled={isLoading || isGoogleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[var(--semantic-text-secondary)] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading || isGoogleLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-[var(--semantic-text-primary)]">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="h-11 rounded-lg bg-[var(--semantic-surface-hover)] border-[var(--semantic-border-medium)] focus:border-[#F18825] focus:ring-[#F18825] text-[var(--semantic-text-primary)] pr-10"
                  disabled={isLoading || isGoogleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0A0] hover:text-[var(--semantic-text-secondary)] transition-colors"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  disabled={isLoading || isGoogleLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#7CB342] hover:bg-[#689F38] text-white rounded-lg font-medium shadow-sm"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </div>

        {/* Login Link Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[var(--semantic-border-medium)] text-center">
          <p className="text-sm text-[var(--semantic-text-secondary)]">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="text-[#F18825] hover:text-[#1976D2] font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
