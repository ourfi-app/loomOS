
'use client';

import { FileQuestion, Home, ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'var(--webos-bg-gradient)',
        fontFamily: 'Helvetica Neue, Arial, sans-serif'
      }}
    >
      <div 
        className="w-full max-w-2xl rounded-3xl overflow-hidden"
        style={{
          background: 'var(--webos-bg-glass)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--webos-border-glass)',
          boxShadow: 'var(--webos-shadow-xl)'
        }}
      >
        {/* Header */}
        <div className="text-center p-8 pb-4">
          <div 
            className="mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-4"
            style={{
              background: 'linear-gradient(135deg, var(--webos-app-gray), var(--webos-text-secondary))',
              boxShadow: 'var(--webos-shadow-md)'
            }}
          >
            <FileQuestion className="w-12 h-12" style={{ color: 'var(--webos-text-white)' }} />
          </div>
          <h1 
            className="text-4xl font-light tracking-tight mb-2"
            style={{ color: 'var(--webos-text-primary)' }}
          >
            404 - Page Not Found
          </h1>
          <p 
            className="text-base font-light"
            style={{ color: 'var(--webos-text-secondary)' }}
          >
            Sorry, we couldn't find the page you're looking for
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 px-8 pb-6">
          {/* Helpful Message */}
          <div 
            className="rounded-2xl p-6 text-center"
            style={{
              background: 'var(--webos-bg-secondary)',
              border: '1px solid var(--webos-border-primary)'
            }}
          >
            <p className="font-light mb-4" style={{ color: 'var(--webos-text-primary)' }}>
              The page you requested might have been moved, deleted, or never existed.
            </p>
            <p className="text-sm font-light" style={{ color: 'var(--webos-text-secondary)' }}>
              Here are some helpful links instead:
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href="/dashboard">
              <div 
                className="p-4 rounded-2xl cursor-pointer group transition-all hover:scale-105"
                style={{
                  border: '1px solid var(--webos-border-primary)',
                  background: 'var(--webos-bg-white)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, var(--webos-app-blue), var(--webos-app-teal))',
                      boxShadow: 'var(--webos-shadow-sm)'
                    }}
                  >
                    <Home className="w-5 h-5" style={{ color: 'var(--webos-text-white)' }} />
                  </div>
                  <div>
                    <div className="font-light" style={{ color: 'var(--webos-text-primary)' }}>Home</div>
                    <div className="text-xs font-light" style={{ color: 'var(--webos-text-secondary)' }}>Go to dashboard</div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/documents">
              <div 
                className="p-4 rounded-2xl cursor-pointer group transition-all hover:scale-105"
                style={{
                  border: '1px solid var(--webos-border-primary)',
                  background: 'var(--webos-bg-white)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, var(--webos-app-tan), var(--webos-app-brown))',
                      boxShadow: 'var(--webos-shadow-sm)'
                    }}
                  >
                    <Search className="w-5 h-5" style={{ color: 'var(--webos-text-white)' }} />
                  </div>
                  <div>
                    <div className="font-light" style={{ color: 'var(--webos-text-primary)' }}>Documents</div>
                    <div className="text-xs font-light" style={{ color: 'var(--webos-text-secondary)' }}>Browse files</div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/directory">
              <div 
                className="p-4 rounded-2xl cursor-pointer group transition-all hover:scale-105"
                style={{
                  border: '1px solid var(--webos-border-primary)',
                  background: 'var(--webos-bg-white)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, var(--webos-app-teal), var(--webos-app-green))',
                      boxShadow: 'var(--webos-shadow-sm)'
                    }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--webos-text-white)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-light" style={{ color: 'var(--webos-text-primary)' }}>Directory</div>
                    <div className="text-xs font-light" style={{ color: 'var(--webos-text-secondary)' }}>Find residents</div>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/dashboard/chat">
              <div 
                className="p-4 rounded-2xl cursor-pointer group transition-all hover:scale-105"
                style={{
                  border: '1px solid var(--webos-border-primary)',
                  background: 'var(--webos-bg-white)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, var(--webos-app-purple), var(--webos-app-rose))',
                      boxShadow: 'var(--webos-shadow-sm)'
                    }}
                  >
                    <svg className="w-5 h-5" style={{ color: 'var(--webos-text-white)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-light" style={{ color: 'var(--webos-text-primary)' }}>AI Assistant</div>
                    <div className="text-xs font-light" style={{ color: 'var(--webos-text-secondary)' }}>Get help</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 p-8 pt-4">
          <button
            onClick={() => router.back()}
            className="flex-1 rounded-xl py-3 px-6 flex items-center justify-center text-sm font-light tracking-wide uppercase transition-all hover:opacity-90"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              border: '1px solid var(--webos-border-secondary)',
              color: 'var(--webos-text-primary)',
              boxShadow: 'var(--webos-shadow-sm)'
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
          <Link href="/dashboard" className="flex-1">
            <button
              className="w-full rounded-xl py-3 px-6 flex items-center justify-center text-sm font-light tracking-wide uppercase transition-all hover:opacity-90"
              style={{
                background: 'var(--webos-ui-dark)',
                color: 'var(--webos-text-white)',
                boxShadow: 'var(--webos-shadow-md)'
              }}
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

