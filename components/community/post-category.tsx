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
    className: 'category-general bg-[var(--semantic-primary-subtle)] text-[var(--semantic-primary-dark)] border-[var(--semantic-primary-light)]',
  },
  ANNOUNCEMENTS: {
    label: 'Announcements',
    icon: Megaphone,
    className: 'category-announcements bg-[var(--semantic-primary-subtle)] text-[var(--semantic-primary-dark)] border-[var(--semantic-primary-light)]',
  },
  HELP: {
    label: 'Help',
    icon: HelpCircle,
    className: 'category-help bg-[var(--semantic-success-bg)] text-[var(--semantic-success-dark)] border-[var(--semantic-success-bg)]',
  },
  FEEDBACK: {
    label: 'Feedback',
    icon: MessageSquare,
    className: 'category-feedback bg-[var(--semantic-accent-subtle)] text-[var(--semantic-accent-dark)] border-[var(--semantic-accent-light)]',
  },
  EVENTS: {
    label: 'Events',
    icon: PartyPopper,
    className: 'category-events bg-[var(--semantic-accent-subtle)] text-[var(--semantic-accent-dark)] border-[var(--semantic-accent-light)]',
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
