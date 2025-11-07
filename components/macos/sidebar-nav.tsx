
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface SidebarNavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
  title?: string;
}

export function SidebarNav({ items, title }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-1">
      {title && (
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      <nav className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'sidebar-item',
                isActive && 'active'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1">{item.title}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
