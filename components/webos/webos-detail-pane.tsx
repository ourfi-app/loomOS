'use client';

import React, { ReactNode } from 'react';

interface WebOSDetailPaneProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  emptyIcon?: ReactNode;
  emptyMessage?: string;
  emptySubMessage?: string;
  isEmpty?: boolean;
  className?: string;
  width?: string;
}

export function WebOSDetailPane({
  title,
  subtitle,
  actions,
  children,
  emptyIcon,
  emptyMessage = 'No item selected',
  emptySubMessage = 'Select an item from the list to view details',
  isEmpty = false,
  className = '',
  width = 'flex-1'
}: WebOSDetailPaneProps) {
  if (isEmpty) {
    return (
      <div className={`${width} bg-white flex items-center justify-center text-gray-400 ${className}`}>
        <div className="text-center">
          {emptyIcon && (
            <div className="mx-auto mb-4 opacity-50 text-gray-300">
              {emptyIcon}
            </div>
          )}
          <p className="text-lg font-medium text-gray-400">{emptyMessage}</p>
          <p className="text-sm mt-2 text-gray-500">
            {emptySubMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${width} bg-white flex flex-col ${className}`}>
      {/* Detail Header */}
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {title && (
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Detail Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
}
