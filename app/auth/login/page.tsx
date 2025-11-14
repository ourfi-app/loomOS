
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { loomOSTheme, animations } from '@/lib/loomos-design-system';

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
    <div className="min-h-screen webos-gradient-bg flex items-center justify-center p-6 relative overflow-hidden" style={{ background: 'var(--semantic-bg-base)' }}>
      {/* Subtle animated background gradient */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-loomos-orange rounded-full blur-3xl opacity-20"
          style={{
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-loomos-primary rounded-full blur-3xl opacity-20"
          style={{
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: loomOSTheme.physics.spring.stiffness,
          damping: loomOSTheme.physics.spring.damping,
        }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm hover:text-loomos-orange transition-colors"
            style={{ color: 'var(--semantic-text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </motion.div>

        {/* Logo and Title Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
          className="webos-glass rounded-2xl p-8 shadow-lg text-center"
          style={{ background: 'var(--semantic-surface-base)', borderColor: 'var(--semantic-border-light)' }}
        >
          {/* loomOS Logo */}
          <div className="mb-6">
            <motion.h1
              className="text-5xl font-light tracking-tight"
              style={{ color: 'var(--semantic-text-primary)' }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              loom<span className="font-normal text-loomos-orange">OS</span>
            </motion.h1>
            <motion.p
              className="text-sm mt-2 font-medium tracking-wide"
              style={{ color: 'var(--semantic-text-secondary)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your Platform, Your Freedom
            </motion.p>
          </div>

          {/* Liberation Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-loomos-orange/10 border border-loomos-orange/20 rounded-full"
          >
            <Lock className="w-4 h-4 text-loomos-orange" />
            <span className="text-xs font-semibold text-loomos-orange tracking-wide">
              BREAK FREE FROM TECH GIANTS
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-semibold" style={{ color: 'var(--semantic-text-primary)' }}>Welcome Back</h2>
            <p className="mt-2" style={{ color: 'var(--semantic-text-secondary)' }}>Sign in to your liberation platform</p>
          </motion.div>
        </motion.div>

        {/* Login Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="webos-glass rounded-2xl p-8 shadow-lg"
          style={{ background: 'var(--semantic-surface-base)', borderColor: 'var(--semantic-border-light)' }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Alert className="rounded-lg mb-5" style={{ backgroundColor: 'var(--semantic-error-bg)', borderColor: 'var(--semantic-error-border)' }}>
                <AlertCircle className="h-4 w-4" style={{ color: 'var(--semantic-error)' }} />
                <AlertDescription className="text-sm" style={{ color: 'var(--semantic-error-text)' }}>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Google Sign In Button */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          >
            <Button
              type="button"
              variant="outline"
              className="webos-button w-full h-12 rounded-xl font-medium shadow-sm"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
          </motion.div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'var(--semantic-border-light)' }}></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 font-medium" style={{ background: 'var(--semantic-surface-base)', color: 'var(--semantic-text-tertiary)' }}>OR CONTINUE WITH EMAIL</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--semantic-text-secondary)' }}>
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl transition-all duration-200"
                style={{ 
                  background: 'var(--semantic-surface-hover)', 
                  borderColor: 'var(--semantic-border-light)',
                  color: 'var(--semantic-text-primary)'
                }}
                disabled={isLoading || isGoogleLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--semantic-text-secondary)' }}>
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-medium text-loomos-orange hover:text-loomos-orange-dark transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl pr-12 transition-all duration-200"
                  style={{ 
                    background: 'var(--semantic-surface-hover)', 
                    borderColor: 'var(--semantic-border-light)',
                    color: 'var(--semantic-text-primary)'
                  }}
                  disabled={isLoading || isGoogleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-loomos-orange transition-colors"
                  style={{ color: 'var(--semantic-text-tertiary)' }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading || isGoogleLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-loomos-orange to-loomos-orange-light hover:from-loomos-orange-dark hover:to-loomos-orange text-white rounded-xl font-semibold shadow-lg shadow-loomos-orange/30 transition-all duration-200"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In to loomOS'
                )}
              </Button>
            </motion.div>
          </form>
        </motion.div>

        {/* Register Link Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="webos-glass rounded-2xl p-6 shadow-md text-center"
          style={{ background: 'var(--semantic-surface-base)', borderColor: 'var(--semantic-border-light)' }}
        >
          <p className="text-sm" style={{ color: 'var(--semantic-text-secondary)' }}>
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/register"
              className="text-loomos-orange hover:text-loomos-orange-dark font-semibold transition-colors"
            >
              Join the Liberation
            </Link>
          </p>
          <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--semantic-text-tertiary)' }}>
            By signing in, you&apos;re joining the movement to<br />
            <strong className="text-loomos-orange">liberate technology from corporate control</strong>
          </p>
        </motion.div>

        {/* Super Admin Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Link
            href="/auth/super-admin-login"
            className="inline-flex items-center gap-2 text-xs hover:text-loomos-orange transition-colors"
            style={{ color: 'var(--semantic-text-tertiary)' }}
          >
            <Lock className="w-3 h-3" />
            Super Admin Access
          </Link>
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}
