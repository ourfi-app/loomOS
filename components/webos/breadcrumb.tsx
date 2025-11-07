
'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Breadcrumb } from '@/hooks/webos/use-breadcrumbs';

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
  className?: string;
  textColor?: string;
}

export function Breadcrumbs({ breadcrumbs, className, textColor = 'text-white' }: BreadcrumbsProps) {
  if (breadcrumbs.length === 0) return null;

  return (
    <nav className={cn("flex items-center gap-1.5 text-sm", className)}>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const Icon = crumb.icon;

        return (
          <div key={`${crumb.path}-${index}`} className="flex items-center gap-1.5">
            {crumb.path ? (
              <Link
                href={crumb.path}
                className={cn(
                  "flex items-center gap-1.5 hover:underline transition-opacity hover:opacity-80",
                  textColor,
                  isLast ? "opacity-100 font-medium" : "opacity-70"
                )}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{crumb.label}</span>
              </Link>
            ) : (
              <span
                className={cn(
                  "flex items-center gap-1.5",
                  textColor,
                  isLast ? "opacity-100 font-medium" : "opacity-70"
                )}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{crumb.label}</span>
              </span>
            )}

            {!isLast && (
              <ChevronRight className={cn("w-3.5 h-3.5 opacity-50", textColor)} />
            )}
          </div>
        );
      })}
    </nav>
  );
}
