'use client';

import React from 'react';

interface LoomOSSectionHeaderProps {
  title: string;
  className?: string;
}

export function LoomOSSectionHeader({ title, className = '' }: LoomOSSectionHeaderProps) {
  return (
    <div className={`bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-2 text-[11px] font-bold tracking-wider ${className}`}>
      {title.toUpperCase()}
    </div>
  );
}
