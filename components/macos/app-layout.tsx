
'use client';

import { ReactNode } from 'react';
import { WindowChrome } from './window-chrome';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface AppLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  windowTitle?: string;
}

export function AppLayout({ children, sidebar, windowTitle = 'Condo Manager' }: AppLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--chrome-dark)] p-6 flex items-center justify-center">
      <div className="macos-window w-full max-w-[1800px] h-[90vh] flex flex-col">
        <WindowChrome 
          title={windowTitle}
          showTitle={true}
          onClose={() => {
            if (confirm('Are you sure you want to close this window?')) {
              signOut({ callbackUrl: '/' });
            }
          }}
        />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="macos-sidebar w-64 flex flex-col macos-scrollbar overflow-y-auto">
            {sidebar}
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto macos-scrollbar">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
