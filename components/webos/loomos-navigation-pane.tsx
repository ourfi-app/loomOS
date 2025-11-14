'use client';

import React, { ReactNode } from 'react';

export interface NavigationItem {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

interface LoomOSNavigationPaneProps {
  title: string;
  items: NavigationItem[];
  className?: string;
}

export function LoomOSNavigationPane({ title, items, className = '' }: LoomOSNavigationPaneProps) {
  return (
    <div className={`w-60 bg-gradient-to-b from-gray-300 to-gray-400 border-r border-gray-500 flex flex-col flex-shrink-0 ${className}`}>
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 py-2 text-[11px] font-bold tracking-wider">
        {title.toUpperCase()}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <div 
            key={item.id}
            className={`flex items-center justify-between px-3 py-2.5 border-b border-[var(--semantic-border-strong)] cursor-pointer transition-colors ${
              item.active ? 'bg-gray-800 text-white' : 'text-[var(--semantic-text-primary)] hover:bg-gray-300'
            }`}
            onClick={item.onClick}
          >
            <div className="flex items-center gap-2.5">
              {item.icon && (
                <div className={`flex items-center justify-center ${item.active ? 'text-white' : 'text-[var(--semantic-text-primary)]'}`}>
                  {item.icon}
                </div>
              )}
              <span className="text-base">{item.label}</span>
            </div>
            {item.count !== undefined && item.count > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                item.active ? 'bg-white text-[var(--semantic-text-primary)]' : 'bg-gray-500 text-white'
              }`}>
                {item.count}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
