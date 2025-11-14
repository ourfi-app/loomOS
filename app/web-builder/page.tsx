'use client';

import React from 'react';
import { Code } from 'lucide-react';
import { WindowFrame } from '@/components/loomos/ui/WindowFrame';
import { WebBuilderShell } from '@/components/web-builder/WebBuilderShell';

export default function WebBuilderPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--semantic-surface-hover)] dark:bg-gray-950 p-4">
      <WindowFrame
        title="Web Builder"
        icon={Code}
        minWidth={1024}
        minHeight={768}
        defaultWidth={1400}
        defaultHeight={900}
        className="max-w-[95vw] max-h-[95vh]"
      >
        <WebBuilderShell />
      </WindowFrame>
    </div>
  );
}
