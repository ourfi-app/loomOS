/**
 * loomOS Sheet Component
 * 
 * Slide-out panel component (drawer) with Phase 1C design token integration.
 * Uses Radix UI Dialog primitive with custom styling for side panels.
 * 
 * Features:
 * - Four side variants (top, bottom, left, right)
 * - Overlay with backdrop
 * - Slide animations
 * - Close button with icon
 * - Header, footer, title, and description subcomponents
 * - Design token integration for theming
 * - Dark mode support
 * 
 * @example
 * ```tsx
 * <Sheet>
 *   <SheetTrigger>Open Sheet</SheetTrigger>
 *   <SheetContent side="right">
 *     <SheetHeader>
 *       <SheetTitle>Sheet Title</SheetTitle>
 *       <SheetDescription>Sheet description text</SheetDescription>
 *     </SheetHeader>
 *     <div>Sheet content</div>
 *     <SheetFooter>
 *       <Button>Save</Button>
 *     </SheetFooter>
 *   </SheetContent>
 * </Sheet>
 * ```
 */

'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const SheetClose = SheetPrimitive.Close;

const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, style, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    style={{
      backgroundColor: 'var(--modal-backdrop)',
      backdropFilter: 'blur(var(--blur-md))',
      WebkitBackdropFilter: 'blur(var(--blur-md))',
      ...style,
    }}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  'fixed z-50 gap-4 transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = 'right', className, children, style, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      style={{
        padding: 'var(--modal-padding)',
        backgroundColor: 'var(--modal-bg)',
        borderColor: 'var(--modal-border)',
        boxShadow: 'var(--modal-shadow)',
        color: 'var(--semantic-text-primary)',
        ...style,
      }}
      {...props}
    >
      {children}
      <SheetPrimitive.Close 
        className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
        style={{
          backgroundColor: 'transparent',
          color: 'var(--semantic-text-tertiary)',
          ringColor: 'var(--semantic-focus-ring)',
        }}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 text-center sm:text-left',
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
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({
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
      ...style,
    }}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, style, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    style={{
      color: 'var(--semantic-text-primary)',
      ...style,
    }}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, style, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm', className)}
    style={{
      color: 'var(--semantic-text-secondary)',
      ...style,
    }}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
