'use client';

import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUniversalSearch } from '@/hooks/webos/use-universal-search';

/**
 * Desktop Search Bar Component
 *
 * "Just Type" search bar with glass morphism effect
 * Positioned below top bar, centered on desktop
 * Features keyboard shortcut display (Cmd+K / Ctrl+K)
 */
export function DesktopSearchBar() {
  const { openSearch } = useUniversalSearch();

  // Detect OS for keyboard shortcut display
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutKey = isMac ? '⌘K' : 'Ctrl+K';

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.1 }}
      className="fixed left-1/2 z-40"
      style={{
        top: '80px',
        transform: 'translateX(-50%)',
      }}
    >
      <div
        className="flex items-center gap-3 px-5 py-3 cursor-text hover:shadow-lg transition-all duration-200"
        onClick={openSearch}
        style={{
          width: '420px',
          background: 'var(--webos-bg-glass)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid var(--webos-border-glass)',
          boxShadow: 'var(--webos-shadow-md)',
          fontFamily: 'Helvetica Neue, Arial, sans-serif'
        }}
      >
        <Search className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--webos-text-secondary)' }} />
        <div className="flex-1">
          <input
            type="text"
            placeholder="Just type..."
            className="w-full bg-transparent border-none outline-none text-base font-light"
            style={{ 
              color: 'var(--webos-text-primary)',
              fontWeight: '300',
              pointerEvents: 'none'
            }}
            readOnly
            tabIndex={-1}
          />
        </div>
        <div 
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-light"
          style={{
            background: 'rgba(0, 0, 0, 0.05)',
            border: '1px solid var(--webos-border-secondary)',
            color: 'var(--webos-text-tertiary)',
            fontFamily: 'Helvetica Neue, monospace',
          }}
        >
          {shortcutKey}
        </div>
      </div>
    </motion.div>
  );
}
