
'use client';

/**
 * WebOS Share Dialog Component
 * Based on WebOS design patterns for sharing content
 * Provides preset sharing options (Contact, Email, SMS, etc.)
 */

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  Mail,
  MessageSquare,
  Smartphone,
  Share2,
  User,
  Facebook,
  Twitter,
  Link,
  Copy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ShareOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

interface ShareDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  url?: string;
  title?: string;
  text?: string;
  onShare?: (method: string) => void;
}

export function ShareDialog({
  open,
  onOpenChange,
  url,
  title,
  text,
  onShare,
}: ShareDialogProps) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Share';
  const shareText = text || '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
      onShare?.('copy_link');
      onOpenChange?.(false);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleEmailShare = () => {
    const mailtoLink = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
    window.open(mailtoLink, '_blank');
    onShare?.('email');
    onOpenChange?.(false);
  };

  const handleSMSShare = () => {
    const smsLink = `sms:?body=${encodeURIComponent(`${shareTitle}\n${shareUrl}`)}`;
    window.open(smsLink, '_blank');
    onShare?.('sms');
    onOpenChange?.(false);
  };

  const handleTwitterShare = () => {
    const twitterLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterLink, '_blank', 'width=600,height=400');
    onShare?.('twitter');
    onOpenChange?.(false);
  };

  const handleFacebookShare = () => {
    const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookLink, '_blank', 'width=600,height=400');
    onShare?.('facebook');
    onOpenChange?.(false);
  };

  const shareOptions: ShareOption[] = [
    {
      id: 'email',
      label: 'Email',
      icon: <Mail className="h-8 w-8" />,
      action: handleEmailShare,
    },
    {
      id: 'sms',
      label: 'Instant Message or SMS',
      icon: <MessageSquare className="h-8 w-8" />,
      action: handleSMSShare,
    },
    {
      id: 'copy',
      label: 'Copy Link',
      icon: <Link className="h-8 w-8" />,
      action: handleCopyLink,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: <Facebook className="h-8 w-8" />,
      action: handleFacebookShare,
    },
    {
      id: 'twitter',
      label: 'Twitter',
      icon: <Twitter className="h-8 w-8" />,
      action: handleTwitterShare,
    },
  ];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-[360px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-card shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-base font-medium">Share With...</h3>
          </div>

          {/* Share Options */}
          <div className="p-2">
            {shareOptions.map((option, index) => (
              <button
                key={option.id}
                onClick={option.action}
                className={cn(
                  'w-full flex items-center gap-4 px-4 py-4 rounded-md transition-colors',
                  'hover:bg-muted focus:bg-muted focus:outline-none',
                  index < shareOptions.length - 1 && 'border-b border-border'
                )}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-md text-muted-foreground">
                  {option.icon}
                </div>
                <span className="text-base font-medium">{option.label}</span>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 pb-4 pt-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// Share Button Component
interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  onShare?: (method: string) => void;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ShareButton({
  url,
  title,
  text,
  onShare,
  variant = 'outline',
  size = 'default',
}: ShareButtonProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>

      <ShareDialog
        open={open}
        onOpenChange={setOpen}
        url={url}
        title={title}
        text={text}
        onShare={onShare}
      />
    </>
  );
}
