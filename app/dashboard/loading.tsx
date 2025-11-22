'use client';

import React from 'react';

/**
 * Dashboard Loading State
 * 
 * WebOS-styled loading skeleton with authentic aesthetic
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ 
      background: 'linear-gradient(135deg, #d8d8d8 0%, #e8e8e8 50%, #d8d8d8 100%)'
    }}>
      <div className="flex flex-col items-center space-y-6">
        {/* Loading Card Skeleton */}
        <div 
          className="animate-pulse"
          style={{
            width: '480px',
            height: '400px',
            backgroundColor: '#f5f5f5',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '32px'
          }}
        >
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-6">
            <div className="h-3 w-24 bg-gray-300 rounded"></div>
            <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>

          {/* Bottom skeleton */}
          <div className="mt-8 space-y-3">
            <div className="h-12 bg-gray-300 rounded-xl"></div>
            <div className="h-12 bg-gray-300 rounded-xl"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-xs font-light tracking-wider" style={{ color: '#8a8a8a' }}>
          LOADING...
        </div>
      </div>
    </div>
  );
}
