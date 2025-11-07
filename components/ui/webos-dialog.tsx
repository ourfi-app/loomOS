
'use client';

/**
 * WebOS Dialog Components
 * Based on WebOS design patterns for:
 * - Confirmation dialogs with stacked action buttons
 * - Text entry dialogs
 * - Form popups with dropdowns and textareas
 * - Message dialogs with proper text hierarchy
 */

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const WebOSDialog = DialogPrimitive.Root;
const WebOSDialogTrigger = DialogPrimitive.Trigger;
const WebOSDialogPortal = DialogPrimitive.Portal;
const WebOSDialogClose = DialogPrimitive.Close;

const WebOSDialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
WebOSDialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Base WebOS Dialog Content with proper width constraints
const WebOSDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    width?: 'sm' | 'md' | 'lg';
  }
>(({ className, children, width = 'md', ...props }, ref) => {
  const widthClasses = {
    sm: 'w-[300px]',
    md: 'w-[320px]',
    lg: 'w-[400px]',
  };

  return (
    <WebOSDialogPortal>
      <WebOSDialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
          'rounded-lg bg-card shadow-2xl',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          widthClasses[width],
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </WebOSDialogPortal>
  );
});
WebOSDialogContent.displayName = DialogPrimitive.Content.displayName;

// WebOS Dialog Header with proper styling
const WebOSDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'px-4 py-3 border-b border-border bg-muted/30',
      className
    )}
    {...props}
  />
);
WebOSDialogHeader.displayName = 'WebOSDialogHeader';

// WebOS Dialog Title - Big text for main message
const WebOSDialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-base font-medium leading-tight', className)}
    {...props}
  />
));
WebOSDialogTitle.displayName = DialogPrimitive.Title.displayName;

// WebOS Dialog Body with proper padding
const WebOSDialogBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('px-4 py-4', className)} {...props} />
);
WebOSDialogBody.displayName = 'WebOSDialogBody';

// WebOS Dialog Description - Small text for secondary message
const WebOSDialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground mt-1', className)}
    {...props}
  />
));
WebOSDialogDescription.displayName = DialogPrimitive.Description.displayName;

// WebOS Dialog Footer with STACKED action buttons (primary on top, secondary below)
const WebOSDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col gap-2 px-4 pb-4',
      className
    )}
    {...props}
  />
);
WebOSDialogFooter.displayName = 'WebOSDialogFooter';

// Primary action button (dark, prominent) - Goes FIRST in stacked layout
const WebOSDialogPrimaryAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    className={cn(
      'w-full h-11 bg-primary/90 hover:bg-primary text-primary-foreground font-medium rounded-md',
      className
    )}
    {...props}
  />
));
WebOSDialogPrimaryAction.displayName = 'WebOSDialogPrimaryAction';

// Secondary action button (light, subtle) - Goes SECOND in stacked layout
const WebOSDialogSecondaryAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <Button
    ref={ref}
    variant="outline"
    className={cn(
      'w-full h-11 bg-background hover:bg-muted font-medium rounded-md',
      className
    )}
    {...props}
  />
));
WebOSDialogSecondaryAction.displayName = 'WebOSDialogSecondaryAction';

// ========================
// SPECIALIZED DIALOG TYPES
// ========================

// Confirmation Dialog (e.g., "Are you sure you want to delete...")
interface ConfirmationDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  destructive?: boolean;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  primaryActionLabel = 'Confirm',
  secondaryActionLabel = 'Cancel',
  onPrimaryAction,
  onSecondaryAction,
  destructive = false,
}: ConfirmationDialogProps) {
  return (
    <WebOSDialog open={open} onOpenChange={onOpenChange}>
      <WebOSDialogContent width="md">
        <WebOSDialogHeader>
          <WebOSDialogTitle>{title}</WebOSDialogTitle>
          {description && (
            <WebOSDialogDescription>{description}</WebOSDialogDescription>
          )}
        </WebOSDialogHeader>
        <WebOSDialogFooter>
          <WebOSDialogPrimaryAction
            onClick={onPrimaryAction}
            className={destructive ? 'bg-destructive hover:bg-destructive/90' : ''}
          >
            {primaryActionLabel}
          </WebOSDialogPrimaryAction>
          <WebOSDialogSecondaryAction onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </WebOSDialogSecondaryAction>
        </WebOSDialogFooter>
      </WebOSDialogContent>
    </WebOSDialog>
  );
}

// Text Entry Dialog (e.g., "Enter Wi-Fi password")
interface TextEntryDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  type?: 'text' | 'password' | 'email';
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  onPrimaryAction?: (value: string) => void;
  onSecondaryAction?: () => void;
}

export function TextEntryDialog({
  open,
  onOpenChange,
  title,
  placeholder,
  value: controlledValue,
  onValueChange,
  type = 'text',
  primaryActionLabel = 'OK',
  secondaryActionLabel = 'Cancel',
  onPrimaryAction,
  onSecondaryAction,
}: TextEntryDialogProps) {
  const [value, setValue] = React.useState(controlledValue || '');

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <WebOSDialog open={open} onOpenChange={onOpenChange}>
      <WebOSDialogContent width="md">
        <WebOSDialogHeader>
          <WebOSDialogTitle>{title}</WebOSDialogTitle>
        </WebOSDialogHeader>
        <WebOSDialogBody>
          <Input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleValueChange(e.target.value)}
            className="w-full"
            autoFocus
          />
        </WebOSDialogBody>
        <WebOSDialogFooter>
          <WebOSDialogSecondaryAction onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </WebOSDialogSecondaryAction>
          <WebOSDialogPrimaryAction onClick={() => onPrimaryAction?.(value)}>
            {primaryActionLabel}
          </WebOSDialogPrimaryAction>
        </WebOSDialogFooter>
      </WebOSDialogContent>
    </WebOSDialog>
  );
}

// Form Popup Dialog (with dropdowns, textareas, etc.)
interface FormPopupDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
}

export function FormPopupDialog({
  open,
  onOpenChange,
  title,
  children,
  primaryActionLabel = 'Done',
  onPrimaryAction,
}: FormPopupDialogProps) {
  return (
    <WebOSDialog open={open} onOpenChange={onOpenChange}>
      <WebOSDialogContent width="lg">
        {title && (
          <WebOSDialogHeader>
            <WebOSDialogTitle>{title}</WebOSDialogTitle>
          </WebOSDialogHeader>
        )}
        <WebOSDialogBody className="space-y-4">
          {children}
        </WebOSDialogBody>
        <WebOSDialogFooter>
          <WebOSDialogPrimaryAction onClick={onPrimaryAction}>
            {primaryActionLabel}
          </WebOSDialogPrimaryAction>
        </WebOSDialogFooter>
      </WebOSDialogContent>
    </WebOSDialog>
  );
}

// Form Field for use in FormPopupDialog
interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}

export {
  WebOSDialog,
  WebOSDialogTrigger,
  WebOSDialogContent,
  WebOSDialogHeader,
  WebOSDialogTitle,
  WebOSDialogDescription,
  WebOSDialogBody,
  WebOSDialogFooter,
  WebOSDialogPrimaryAction,
  WebOSDialogSecondaryAction,
  WebOSDialogClose,
};
