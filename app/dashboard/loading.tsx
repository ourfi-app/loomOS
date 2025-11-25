
'use client';

import React from 'react';

/**
 * loomOS Dashboard Loading Screen
 * Animated loading screen with glassmorphism and pulsing logo
 */
export default function DashboardLoading() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ 
        background: 'linear-gradient(135deg, var(--semantic-bg-muted) 0%, var(--semantic-bg-subtle) 50%, var(--semantic-bg-muted) 100%)'
      }}
    >
      <div 
        className="flex flex-col items-center space-y-8 p-12 rounded-3xl"
        style={{
          backgroundColor: 'var(--glass-white-80)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.95)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9)'
        }}
      >
        {/* Animated loomOS logo */}
        <div 
          className="animate-pulse"
          style={{
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        >
          <svg 
            width="120" 
            height="120" 
            viewBox="0 0 120 120"
            style={{
              filter: 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.9))'
            }}
          >
            {/* loomOS logo - stylized "L" */}
            <rect 
              x="30" 
              y="30" 
              width="20" 
              height="60" 
              rx="4"
              fill="#7a9eb5"
            />
            <rect 
              x="30" 
              y="70" 
              width="40" 
              height="20" 
              rx="4"
              fill="#7a9eb5"
            />
            <circle 
              cx="80" 
              cy="60" 
              r="15"
              fill="none"
              stroke="#7a9eb5"
              strokeWidth="8"
            />
          </svg>
        </div>

        {/* Loading text */}
        <div 
          className="text-xs font-light tracking-[0.3em] uppercase"
          style={{ 
            color: 'var(--semantic-text-tertiary)',
            animation: 'fade 1.5s ease-in-out infinite'
          }}
        >
          Loading loomOS...
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
        @keyframes fade {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
