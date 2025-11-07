
'use client';

import { useAdminMode, ViewMode } from '@/lib/admin-mode-store';
import { Shield, User, ChevronDown, Check, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

const VIEW_MODE_CONFIG = {
  admin: {
    icon: Shield,
    label: 'Admin Mode',
    description: 'Full administrative access',
  },
  board: {
    icon: Users,
    label: 'Board Member View',
    description: 'Board member features',
  },
  resident: {
    icon: User,
    label: 'Resident View',
    description: 'Standard resident access',
  },
} as const;

export function AdminModeToggle() {
  const { data: session } = useSession() || {};
  const { viewMode, setViewMode } = useAdminMode();

  const userRole = (session?.user as any)?.role;
  
  // Don't show for super admins (they always have full access) or non-admin users
  if (!session?.user || userRole !== 'ADMIN') {
    return null;
  }

  const handleModeChange = (mode: ViewMode) => {
    if (mode !== viewMode) {
      setViewMode(mode);
      
      const config = VIEW_MODE_CONFIG[mode];
      const Icon = config.icon;
      
      toast.success(`Switched to ${config.label}`, {
        icon: <Icon className="h-4 w-4" />,
        duration: 2000,
      });
    }
  };

  const CurrentIcon = VIEW_MODE_CONFIG[viewMode].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-center w-8 h-8 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/10 transition-all"
          title="Switch view mode"
        >
          <CurrentIcon className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
          View Mode
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {(Object.keys(VIEW_MODE_CONFIG) as ViewMode[]).map((mode) => {
          const config = VIEW_MODE_CONFIG[mode];
          const Icon = config.icon;
          
          return (
            <DropdownMenuItem
              key={mode}
              onClick={() => handleModeChange(mode)}
              className="cursor-pointer"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{config.label}</span>
                    <span className="text-xs text-muted-foreground">{config.description}</span>
                  </div>
                </div>
                {viewMode === mode && <Check className="h-4 w-4 ml-2" />}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
