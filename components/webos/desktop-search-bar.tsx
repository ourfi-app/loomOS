'use client';

import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUniversalSearch } from '@/hooks/webos/use-universal-search';

/**
 * Desktop Search Bar Component
 *
 * "Just Type" search bar with glass morphism effect
 * Positioned below top bar, centered on desktop
 */
export function DesktopSearchBar() {
  const { openSearch } = useUniversalSearch();

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
        className="flex items-center gap-3 px-5 py-2.5 cursor-text"
        onClick={openSearch}
        style={{
          width: '400px',
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
        <input
          type="text"
          placeholder="Just type..."
          className="flex-1 bg-transparent border-none outline-none text-base font-light"
          style={{ 
            color: 'var(--webos-text-primary)',
            fontWeight: '300'
          }}
          onFocus={openSearch}
          readOnly
        />
      </div>
    </motion.div>
  );
}
