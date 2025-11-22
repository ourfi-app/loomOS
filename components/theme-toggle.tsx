
'use client';

import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * Enhanced WebOS Theme Toggle Component
 * 
 * Features:
 * - Smooth theme transitions with fade effect
 * - WebOS-styled glass morphism dropdown
 * - Active state indicators
 * - Keyboard accessible
 * - System theme preference support
 */
export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Default to system theme on first mount if no preference is set
    if (!theme || theme === 'undefined') {
      setTheme('system');
    }
  }, []);

  // Add smooth transition when changing themes
  const handleThemeChange = (newTheme: string) => {
    setIsChanging(true);
    // Add brief delay for visual feedback
    setTimeout(() => {
      setTheme(newTheme);
      setTimeout(() => setIsChanging(false), 300);
    }, 150);
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <div className="w-5 h-5" />
      </Button>
    );
  }

  const getIcon = () => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    const iconClass = `w-5 h-5 transition-all duration-300 ${
      isChanging ? 'scale-90 opacity-50' : 'scale-100 opacity-100'
    }`;
    
    if (currentTheme === 'dark') return <Moon className={iconClass} />;
    if (currentTheme === 'light') return <Sun className={iconClass} />;
    return <Monitor className={iconClass} />;
  };

  const isActive = (themeOption: string) => theme === themeOption;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 hover:scale-105 active:scale-95"
          title="Change theme"
          aria-label="Toggle theme"
        >
          {getIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end"
        className="w-48 rounded-2xl p-2"
        style={{
          background: 'var(--glass-white-95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-dropdown)',
        }}
      >
        <DropdownMenuItem 
          onClick={() => handleThemeChange('light')}
          className="rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Sun className="w-4 h-4 mr-3 text-amber-500" />
          <span className="flex-1 font-light">Light</span>
          {isActive('light') && <Check className="w-4 h-4 text-accent-blue" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('dark')}
          className="rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Moon className="w-4 h-4 mr-3 text-blue-500" />
          <span className="flex-1 font-light">Dark</span>
          {isActive('dark') && <Check className="w-4 h-4 text-accent-blue" />}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange('system')}
          className="rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Monitor className="w-4 h-4 mr-3 text-neutral-600 dark:text-neutral-400" />
          <span className="flex-1 font-light">System</span>
          {isActive('system') && <Check className="w-4 h-4 text-accent-blue" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
