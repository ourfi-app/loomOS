
'use client';

import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { AccessibilityPanel } from './accessibility-panel';

export function FloatingAccessibilityButton() {
  const [showPanel, setShowPanel] = useState(false);
  
  return (
    <>
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-20 right-4 w-12 h-12 rounded-full bg-[var(--semantic-primary)] hover:bg-[var(--semantic-primary)] text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
        aria-label="Open accessibility settings"
        title="Accessibility Settings"
      >
        <Eye className="w-6 h-6" />
      </button>
      
      {showPanel && <AccessibilityPanel onClose={() => setShowPanel(false)} />}
    </>
  );
}
