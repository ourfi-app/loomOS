/**
 * loomOS Dialog Component
 * 
 * Modal dialog component with Phase 1C design token integration.
 * Uses Radix UI Dialog primitive with custom styling.
 * 
 * Features:
 * - Modal overlay with backdrop blur
 * - Centered content with animations
 * - Close button with icon
 * - Header, footer, title, and description subcomponents
 * - Design token integration for theming
 * - Dark mode support
 * 
 * @example
 * ```tsx
 * <Dialog>
 *   <DialogTrigger>Open Dialog</DialogTrigger>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Dialog Title</DialogTitle>
 *       <DialogDescription>Dialog description text</DialogDescription>
 *     </DialogHeader>
 *     <div>Dialog content</div>
 *     <DialogFooter>
 *       <Button>Save</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */

'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, style, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    style={{
      backgroundColor: 'var(--modal-backdrop)',
      backdropFilter: 'blur(var(--blur-lg))',
      WebkitBackdropFilter: 'blur(var(--blur-lg))',
      ...style,
    }}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, style, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        className
      )}
      style={{
        maxWidth: 'var(--modal-width-lg)',
        padding: 'var(--modal-padding)',
        backgroundColor: 'var(--modal-bg)',
        border: '1px solid var(--modal-border)',
        borderRadius: 'var(--radius-3xl)',
        boxShadow: 'var(--modal-shadow)',
        color: 'var(--semantic-text-primary)',
        ...style,
      }}
      {...props}
    >
      {children}
      <DialogPrimitive.Close 
        className="absolute right-4 top-4 rounded-full opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 disabled:pointer-events-none p-2"
        style={{
          backgroundColor: 'transparent',
          color: 'var(--semantic-text-tertiary)',
        }}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-1.5 text-center sm:text-left',
      className
    )}
    style={{
      paddingBottom: 'var(--modal-header-padding)',
      borderBottom: '1px solid var(--modal-header-border)',
      ...style,
    }}
    {...props}
  />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    style={{
      paddingTop: 'var(--modal-footer-padding)',
      borderTop: '1px solid var(--modal-footer-border)',
      backgroundColor: 'var(--modal-footer-bg)',
      marginLeft: 'calc(-1 * var(--modal-padding))',
      marginRight: 'calc(-1 * var(--modal-padding))',
      marginBottom: 'calc(-1 * var(--modal-padding))',
      paddingLeft: 'var(--modal-padding)',
      paddingRight: 'var(--modal-padding)',
      paddingBottom: 'var(--modal-padding)',
      borderBottomLeftRadius: 'var(--radius-3xl)',
      borderBottomRightRadius: 'var(--radius-3xl)',
      ...style,
    }}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, style, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-light leading-none tracking-tight',
      className
    )}
    style={{ 
      color: 'var(--semantic-text-primary)',
      ...style,
    }}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, style, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm font-light', className)}
    style={{ 
      color: 'var(--semantic-text-secondary)',
      ...style,
    }}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
