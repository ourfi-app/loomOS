import { Badge } from '@/components/ui/badge';
import { PostCategory } from '@prisma/client';
import { Megaphone, HelpCircle, MessageSquare, PartyPopper, Users } from 'lucide-react';

interface PostCategoryBadgeProps {
  category: PostCategory | string;
  className?: string;
}

const categoryConfig = {
  GENERAL: {
    label: 'General',
    icon: Users,
    className: 'category-general bg-blue-50 text-blue-700 border-blue-200',
  },
  ANNOUNCEMENTS: {
    label: 'Announcements',
    icon: Megaphone,
    className: 'category-announcements bg-orange-50 text-orange-700 border-orange-200',
  },
  HELP: {
    label: 'Help',
    icon: HelpCircle,
    className: 'category-help bg-green-50 text-green-700 border-green-200',
  },
  FEEDBACK: {
    label: 'Feedback',
    icon: MessageSquare,
    className: 'category-feedback bg-purple-50 text-purple-700 border-purple-200',
  },
  EVENTS: {
    label: 'Events',
    icon: PartyPopper,
    className: 'category-events bg-pink-50 text-pink-700 border-pink-200',
  },
};

export function PostCategoryBadge({ category, className }: PostCategoryBadgeProps) {
  const config = categoryConfig[category as PostCategory] || categoryConfig.GENERAL;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`category-label ${config.className} ${className || ''}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}

export const POST_CATEGORIES = Object.entries(categoryConfig).map(([value, config]) => ({
  value,
  label: config.label,
  icon: config.icon,
}));
