'use client';

import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const loomOSSpring = {
  stiffness: 300,
  damping: 25,
  mass: 1,
};

interface WindowFrameProps {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  minWidth?: number;
  minHeight?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  className?: string;
  toolbar?: ReactNode;
}

export function WindowFrame({
  title,
  icon: Icon,
  children,
  minWidth = 800,
  minHeight = 600,
  defaultWidth = 1200,
  defaultHeight = 800,
  className,
  toolbar,
}: WindowFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', ...loomOSSpring }}
      className={cn(
        'flex flex-col bg-white dark:bg-gray-900 rounded-lg shadow-2xl overflow-hidden',
        className
      )}
      style={{
        minWidth,
        minHeight,
        width: defaultWidth,
        height: defaultHeight,
      }}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 h-12 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />}
          <h1 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {title}
          </h1>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-2">
          <button
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            aria-label="Minimize"
          />
          <button
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            aria-label="Maximize"
          />
          <button
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            aria-label="Close"
          />
        </div>
      </div>

      {/* Toolbar (Optional) */}
      {toolbar && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          {toolbar}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}
