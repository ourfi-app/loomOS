'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="heddle-login-container">
      {/* Animated background */}
      <div className="heddle-bg-animated">
        <div className="heddle-gradient-orb heddle-orb-1"></div>
        <div className="heddle-gradient-orb heddle-orb-2"></div>
        <div className="heddle-gradient-orb heddle-orb-3"></div>
      </div>

      <div className={`heddle-login-content ${mounted ? 'heddle-mounted' : ''}`}>
        {/* Back to Home */}
        <Link href="/" className="heddle-back-link">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>

        {/* Main Register Card */}
        <div className="heddle-login-card">
          {/* Logo and Header Section */}
          <div className="heddle-header">
            <div className="heddle-logo-container">
              <Image 
                src="/branding/h-lettermark.svg" 
                alt="heddleOS" 
                width={64} 
                height={64}
                className="heddle-logo"
                priority
              />
            </div>
            <h1 className="heddle-brand-name">heddleOS</h1>
            <p className="heddle-tagline">Weaving Digital Experiences</p>
          </div>

          {/* Divider */}
          <div className="heddle-divider">
            <div className="heddle-divider-line"></div>
            <span className="heddle-divider-text">Create Account</span>
            <div className="heddle-divider-line"></div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="heddle-alert-error">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
            className="heddle-google-btn"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>{isGoogleLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          {/* OR Divider */}
          <div className="heddle-or-divider">
            <div className="heddle-or-line"></div>
            <span className="heddle-or-text">or</span>
            <div className="heddle-or-line"></div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="heddle-form">
            <div className="heddle-input-group">
              <label htmlFor="name" className="heddle-label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="heddle-input"
                disabled={isLoading || isGoogleLoading}
              />
            </div>

            <div className="heddle-input-group">
              <label htmlFor="email" className="heddle-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="heddle-input"
                disabled={isLoading || isGoogleLoading}
              />
            </div>

            <div className="heddle-input-row">
              <div className="heddle-input-group">
                <label htmlFor="phone" className="heddle-label">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="heddle-input"
                  disabled={isLoading || isGoogleLoading}
                />
              </div>

              <div className="heddle-input-group">
                <label htmlFor="unitNumber" className="heddle-label">
                  Unit Number
                </label>
                <input
                  id="unitNumber"
                  name="unitNumber"
                  type="text"
                  placeholder="101"
                  value={formData.unitNumber}
                  onChange={handleChange}
                  required
                  className="heddle-input"
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
            </div>

            <div className="heddle-input-group">
              <label htmlFor="password" className="heddle-label">
                Password
              </label>
              <div className="heddle-password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="heddle-input"
                  disabled={isLoading || isGoogleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="heddle-password-toggle"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  disabled={isLoading || isGoogleLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="heddle-input-group">
              <label htmlFor="confirmPassword" className="heddle-label">
                Confirm Password
              </label>
              <div className="heddle-password-wrapper">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="heddle-input"
                  disabled={isLoading || isGoogleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="heddle-password-toggle"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  disabled={isLoading || isGoogleLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="heddle-submit-btn"
            >
              {isLoading ? (
                <>
                  <div className="heddle-spinner"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="heddle-footer">
            <p className="heddle-footer-text">
              Already have an account?{' '}
              <Link href="/auth/login" className="heddle-footer-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .heddle-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, #1a1d23 0%, #2c3e50 50%, #1a1d23 100%);
          position: relative;
          overflow: hidden;
        }

        .heddle-bg-animated {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .heddle-gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          animation: float 20s ease-in-out infinite;
        }

        .heddle-orb-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #8B6F47 0%, #D4A574 100%);
          top: -200px;
          left: -200px;
          animation-delay: 0s;
        }

        .heddle-orb-2 {
          width: 500px;
          height: 500px;
          background: linear-gradient(135deg, #C9955A 0%, #B88746 100%);
          bottom: -250px;
          right: -250px;
          animation-delay: 7s;
        }

        .heddle-orb-3 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #6B5532 0%, #8B6F47 100%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 14s;
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .heddle-login-content {
          width: 100%;
          max-width: 520px;
          position: relative;
          z-index: 10;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .heddle-login-content.heddle-mounted {
          opacity: 1;
          transform: translateY(0);
        }

        .heddle-back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          color: #D4A574;
          text-decoration: none;
          transition: all 0.3s ease;
          font-weight: 300;
        }

        .heddle-back-link:hover {
          color: #C9955A;
          transform: translateX(-4px);
        }

        .heddle-login-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.3),
            0 0 1px rgba(139, 111, 71, 0.2) inset,
            0 1px 2px rgba(139, 111, 71, 0.1) inset;
          border: 1px solid rgba(139, 111, 71, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 90vh;
          overflow-y: auto;
        }

        .heddle-login-card:hover {
          box-shadow: 
            0 25px 70px rgba(0, 0, 0, 0.35),
            0 0 1px rgba(139, 111, 71, 0.3) inset,
            0 1px 2px rgba(139, 111, 71, 0.2) inset;
        }

        .heddle-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .heddle-logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
          animation: slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s backwards;
        }

        .heddle-logo {
          filter: drop-shadow(0 4px 8px rgba(139, 111, 71, 0.2));
          transition: transform 0.3s ease;
        }

        .heddle-logo:hover {
          transform: scale(1.05);
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .heddle-brand-name {
          font-size: 2.25rem;
          font-weight: 300;
          color: #2c3e50;
          margin: 0;
          letter-spacing: -0.02em;
          animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s backwards;
        }

        .heddle-tagline {
          font-size: 0.8125rem;
          color: #6B5532;
          margin: 0.5rem 0 0 0;
          font-weight: 300;
          letter-spacing: 0.05em;
          animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s backwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .heddle-divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
          gap: 1rem;
        }

        .heddle-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #D4A574, transparent);
        }

        .heddle-divider-text {
          font-size: 0.75rem;
          color: #8B6F47;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .heddle-alert-error {
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          color: #991b1b;
          display: flex;
          gap: 0.75rem;
          animation: shake 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .heddle-google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.875rem 1.5rem;
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          font-size: 0.9375rem;
          font-weight: 500;
          color: #2c3e50;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .heddle-google-btn:hover:not(:disabled) {
          background: #f8f9fa;
          border-color: #D4A574;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 111, 71, 0.15);
        }

        .heddle-google-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .heddle-or-divider {
          display: flex;
          align-items: center;
          margin: 1.25rem 0;
          gap: 1rem;
        }

        .heddle-or-line {
          flex: 1;
          height: 1px;
          background: #e0e0e0;
        }

        .heddle-or-text {
          font-size: 0.75rem;
          color: #94a3b8;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .heddle-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .heddle-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .heddle-input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .heddle-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #2c3e50;
          letter-spacing: 0.01em;
        }

        .heddle-input {
          width: 100%;
          padding: 0.875rem 1rem;
          background: #f8f9fa;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          font-size: 0.9375rem;
          color: #2c3e50;
          outline: none;
          transition: all 0.3s ease;
        }

        .heddle-input:focus {
          background: white;
          border-color: #D4A574;
          box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
        }

        .heddle-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .heddle-input::placeholder {
          color: #94a3b8;
        }

        .heddle-password-wrapper {
          position: relative;
        }

        .heddle-password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0;
          transition: color 0.3s ease;
        }

        .heddle-password-toggle:hover:not(:disabled) {
          color: #6B5532;
        }

        .heddle-password-toggle:disabled {
          cursor: not-allowed;
        }

        .heddle-submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #8B6F47 0%, #6B5532 100%);
          border: none;
          border-radius: 12px;
          font-size: 0.9375rem;
          font-weight: 600;
          color: white;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.3s ease;
          letter-spacing: 0.025em;
        }

        .heddle-submit-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #9A7D4F 0%, #7A5E3A 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 111, 71, 0.3);
        }

        .heddle-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .heddle-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .heddle-footer {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e0e0e0;
          text-align: center;
        }

        .heddle-footer-text {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .heddle-footer-link {
          color: #8B6F47;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .heddle-footer-link:hover {
          color: #6B5532;
        }

        @media (max-width: 640px) {
          .heddle-login-card {
            padding: 2rem 1.5rem;
          }

          .heddle-brand-name {
            font-size: 2rem;
          }

          .heddle-login-container {
            padding: 1rem;
          }

          .heddle-input-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
