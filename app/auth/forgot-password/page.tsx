'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, AlertCircle, CheckCircle, Mail } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
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
    <div className="heddle-login-container">
      {/* Animated background */}
      <div className="heddle-bg-animated">
        <div className="heddle-gradient-orb heddle-orb-1"></div>
        <div className="heddle-gradient-orb heddle-orb-2"></div>
        <div className="heddle-gradient-orb heddle-orb-3"></div>
      </div>

      <div className={`heddle-login-content ${mounted ? 'heddle-mounted' : ''}`}>
        {/* Back to Login */}
        <Link href="/auth/login" className="heddle-back-link">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to login</span>
        </Link>

        {/* Main Card */}
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
            <span className="heddle-divider-text">Reset Password</span>
            <div className="heddle-divider-line"></div>
          </div>

          {success ? (
            /* Success Message */
            <div className="heddle-success-container">
              <div className="heddle-success-icon">
                <CheckCircle className="w-16 h-16" />
              </div>
              <h2 className="heddle-success-title">Check Your Email</h2>
              <p className="heddle-success-text">
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="heddle-success-subtext">
                Please check your email and click the link to reset your password. 
                The link will expire in 24 hours.
              </p>
              <Link href="/auth/login" className="heddle-success-btn">
                Return to Login
              </Link>
            </div>
          ) : (
            /* Reset Form */
            <>
              <div className="heddle-reset-intro">
                <Mail className="heddle-reset-icon" />
                <p className="heddle-reset-text">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert className="heddle-alert-error">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="heddle-form">
                <div className="heddle-input-group">
                  <label htmlFor="email" className="heddle-label">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="heddle-input"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="heddle-submit-btn"
                >
                  {isLoading ? (
                    <>
                      <div className="heddle-spinner"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="heddle-footer">
                <p className="heddle-footer-text">
                  Remember your password?{' '}
                  <Link href="/auth/login" className="heddle-footer-link">
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          )}
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
          max-width: 440px;
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
          padding: 3rem;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.3),
            0 0 1px rgba(139, 111, 71, 0.2) inset,
            0 1px 2px rgba(139, 111, 71, 0.1) inset;
          border: 1px solid rgba(139, 111, 71, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .heddle-login-card:hover {
          box-shadow: 
            0 25px 70px rgba(0, 0, 0, 0.35),
            0 0 1px rgba(139, 111, 71, 0.3) inset,
            0 1px 2px rgba(139, 111, 71, 0.2) inset;
        }

        .heddle-header {
          text-align: center;
          margin-bottom: 2rem;
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
          font-size: 2.5rem;
          font-weight: 300;
          color: #2c3e50;
          margin: 0;
          letter-spacing: -0.02em;
          animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s backwards;
        }

        .heddle-tagline {
          font-size: 0.875rem;
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
          margin: 2rem 0;
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

        .heddle-reset-intro {
          text-align: center;
          margin-bottom: 2rem;
        }

        .heddle-reset-icon {
          width: 48px;
          height: 48px;
          color: #8B6F47;
          margin: 0 auto 1rem;
        }

        .heddle-reset-text {
          font-size: 0.9375rem;
          color: #64748b;
          line-height: 1.6;
          margin: 0;
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

        .heddle-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .heddle-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
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
          margin-top: 2rem;
          padding-top: 2rem;
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

        .heddle-success-container {
          text-align: center;
          padding: 2rem 0;
        }

        .heddle-success-icon {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: #22c55e;
        }

        .heddle-success-title {
          font-size: 1.5rem;
          font-weight: 500;
          color: #2c3e50;
          margin: 0 0 1rem 0;
        }

        .heddle-success-text {
          font-size: 0.9375rem;
          color: #64748b;
          margin: 0 0 1rem 0;
          line-height: 1.6;
        }

        .heddle-success-subtext {
          font-size: 0.875rem;
          color: #94a3b8;
          margin: 0 0 2rem 0;
          line-height: 1.5;
        }

        .heddle-success-btn {
          display: inline-block;
          padding: 0.875rem 2rem;
          background: linear-gradient(135deg, #8B6F47 0%, #6B5532 100%);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-size: 0.9375rem;
          font-weight: 600;
          transition: all 0.3s ease;
          letter-spacing: 0.025em;
        }

        .heddle-success-btn:hover {
          background: linear-gradient(135deg, #9A7D4F 0%, #7A5E3A 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(139, 111, 71, 0.3);
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
        }
      `}</style>
    </div>
  );
}
