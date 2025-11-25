'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Mail,
  Lock,
  ArrowRight,
  Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

// WebOS-inspired animation constants
const webOSTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 30,
  mass: 0.8
};

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      errors.password = 'Password must be at least 8 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
    setFormErrors({});

    if (!validateForm()) {
      return;
    }

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
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'var(--webos-bg-gradient)'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-20"
          style={{
            background: 'linear-gradient(135deg, #9ca3a0, #b8bfbc)',
            filter: 'blur(80px)'
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'linear-gradient(135deg, #b8bfbc, #9ca3a0)',
            filter: 'blur(80px)'
          }}
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={webOSTransition}
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{
              background: 'linear-gradient(135deg, #9ca3a0, #b8bfbc)',
              boxShadow: '0 4px 16px var(--glass-black-10)'
            }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={webOSTransition}
          >
            <span className="text-white font-light text-3xl">L</span>
          </motion.div>
          <h1 
            className="font-sans text-4xl font-light tracking-tight mb-2"
            style={{ color: 'var(--webos-text-primary)' }}
          >
            Welcome to loomOS
          </h1>
          <p 
            className="text-sm font-light"
            style={{ color: 'var(--webos-text-secondary)' }}
          >
            Sign in to continue to your workspace
          </p>
        </div>

        {/* Glassmorphism Card */}
        <motion.div
          className="rounded-3xl p-8"
          style={{
            backgroundColor: 'var(--webos-bg-glass)',
            backdropFilter: 'blur(20px)',
            boxShadow: 'var(--webos-shadow-xl)',
            border: '1px solid var(--webos-border-glass)'
          }}
          whileHover={{
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9)'
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={webOSTransition}
            >
              <Alert 
                className="mb-6 rounded-xl"
                style={{
                  backgroundColor: 'rgba(220, 53, 69, 0.6)',
                  border: '1px solid rgba(220, 53, 69, 0.3)'
                }}
              >
                <AlertCircle className="h-4 w-4" style={{ color: '#DC3545' }} />
                <AlertDescription style={{ color: '#DC3545' }}>
                  {error}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <Label 
                className="block text-sm font-light mb-2"
                style={{ color: 'var(--webos-text-primary)' }}
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: 'var(--webos-text-tertiary)' }}
                />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) {
                      setFormErrors({ ...formErrors, email: undefined });
                    }
                  }}
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-sm font-light transition-all"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    border: formErrors.email 
                      ? '2px solid #DC3545' 
                      : '1px solid var(--webos-border-primary)',
                    color: 'var(--webos-text-primary)'
                  }}
                  placeholder="you@example.com"
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
              {formErrors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs mt-1"
                  style={{ color: '#DC3545' }}
                >
                  {formErrors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <Label 
                className="block text-sm font-light mb-2"
                style={{ color: 'var(--webos-text-primary)' }}
              >
                Password
              </Label>
              <div className="relative">
                <Lock 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: 'var(--webos-text-tertiary)' }}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formErrors.password) {
                      setFormErrors({ ...formErrors, password: undefined });
                    }
                  }}
                  className="w-full pl-12 pr-12 py-3 rounded-xl text-sm font-light transition-all"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    border: formErrors.password 
                      ? '2px solid #DC3545' 
                      : '1px solid var(--webos-border-primary)',
                    color: 'var(--webos-text-primary)'
                  }}
                  placeholder="••••••••"
                  disabled={isLoading || isGoogleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--webos-text-tertiary)' }}
                  disabled={isLoading || isGoogleLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formErrors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs mt-1"
                  style={{ color: '#DC3545' }}
                >
                  {formErrors.password}
                </motion.p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded transition-colors"
                  style={{
                    accentColor: 'var(--webos-ui-dark)'
                  }}
                  disabled={isLoading || isGoogleLoading}
                />
                <span 
                  className="font-light"
                  style={{ color: 'var(--webos-text-secondary)' }}
                >
                  Remember me
                </span>
              </label>
              <Link 
                href="/auth/forgot-password" 
                className="font-light transition-colors hover:underline"
                style={{ color: 'var(--webos-text-primary)' }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={webOSTransition}
            >
              <Button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-light tracking-wide transition-all flex items-center justify-center space-x-2"
                style={{
                  backgroundColor: 'var(--webos-ui-dark)',
                  color: 'var(--webos-text-white)',
                  boxShadow: 'var(--webos-shadow-md)'
                }}
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <span>SIGNING IN...</span>
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div 
              className="absolute inset-0 flex items-center"
            >
              <div 
                className="w-full border-t"
                style={{ borderColor: 'var(--webos-border-primary)' }}
              />
            </div>
            <div className="relative flex justify-center text-xs">
              <span 
                className="px-4 font-light"
                style={{ 
                  backgroundColor: 'var(--webos-bg-glass)',
                  color: 'var(--webos-text-secondary)' 
                }}
              >
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid var(--webos-border-primary)'
              }}
              whileHover={{ 
                scale: 1.02,
                backgroundColor: 'rgba(255, 255, 255, 0.7)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={webOSTransition}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span 
                className="text-sm font-light"
                style={{ color: 'var(--webos-text-primary)' }}
              >
                Google
              </span>
            </motion.button>

            <motion.button
              disabled={isLoading || isGoogleLoading}
              className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid var(--webos-border-primary)'
              }}
              whileHover={{ 
                scale: 1.02,
                backgroundColor: 'rgba(255, 255, 255, 0.7)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={webOSTransition}
            >
              <Github className="w-5 h-5" style={{ color: 'var(--webos-text-primary)' }} />
              <span 
                className="text-sm font-light"
                style={{ color: 'var(--webos-text-primary)' }}
              >
                GitHub
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Sign Up Link */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p 
            className="text-sm font-light"
            style={{ color: 'var(--webos-text-secondary)' }}
          >
            Don't have an account?{' '}
            <Link 
              href="/auth/register" 
              className="font-normal transition-colors hover:underline"
              style={{ color: 'var(--webos-text-primary)' }}
            >
              Sign up for free
            </Link>
          </p>
        </motion.div>

        {/* Footer Links */}
        <motion.div
          className="flex items-center justify-center space-x-6 mt-8 text-xs font-light"
          style={{ color: 'var(--webos-text-tertiary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <a href="https://github.com/ourfi-app/loomOS" target="_blank" rel="noopener noreferrer" className="hover:underline">
            About
          </a>
          <span>•</span>
          <a href="https://github.com/ourfi-app/loomOS" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Privacy
          </a>
          <span>•</span>
          <a href="https://github.com/ourfi-app/loomOS" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Terms
          </a>
          <span>•</span>
          <a href="https://github.com/ourfi-app/loomOS" target="_blank" rel="noopener noreferrer" className="hover:underline">
            Help
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}