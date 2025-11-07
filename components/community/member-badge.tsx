import { Badge } from '@/components/ui/badge';
import { Shield, Star, Users } from 'lucide-react';
import { MemberBadge as MemberBadgeType } from '@prisma/client';

interface MemberBadgeProps {
  badge: MemberBadgeType | null | undefined;
  role?: string;
  className?: string;
}

export function MemberBadge({ badge, role, className }: MemberBadgeProps) {
  // Admin role always shows admin badge (overrides member badge)
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    return (
      <Badge variant="default" className={`community-badge community-badge-admin ${className || ''}`}>
        <Shield className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    );
  }

  // Show member badge if assigned
  if (badge === 'VERIFIED') {
    return (
      <Badge variant="secondary" className={`community-badge community-badge-verified ${className || ''}`}>
        <Star className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    );
  }

  if (badge === 'MODERATOR') {
    return (
      <Badge variant="secondary" className={`community-badge community-badge-moderator ${className || ''}`}>
        <Shield className="h-3 w-3 mr-1" />
        Moderator
      </Badge>
    );
  }

  if (badge === 'NEW_MEMBER') {
    return (
      <Badge variant="outline" className={`community-badge community-badge-new ${className || ''}`}>
        <Users className="h-3 w-3 mr-1" />
        New
      </Badge>
    );
  }

  return null;
}
