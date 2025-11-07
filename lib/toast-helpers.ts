
'use client';

import { toast as sonnerToast } from 'sonner';

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Success toast
export function toastSuccess(message: string, options?: ToastOptions) {
  return sonnerToast.success(options?.title || 'Success', {
    description: message,
    duration: options?.duration || 4000,
    action: options?.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
  });
}

// Error toast
export function toastError(message: string, options?: ToastOptions) {
  return sonnerToast.error(options?.title || 'Error', {
    description: message,
    duration: options?.duration || 5000,
    action: options?.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
  });
}

// Warning toast
export function toastWarning(message: string, options?: ToastOptions) {
  return sonnerToast.warning(options?.title || 'Warning', {
    description: message,
    duration: options?.duration || 4000,
    action: options?.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
  });
}

// Info toast
export function toastInfo(message: string, options?: ToastOptions) {
  return sonnerToast.info(options?.title || 'Info', {
    description: message,
    duration: options?.duration || 4000,
    action: options?.action ? {
      label: options.action.label,
      onClick: options.action.onClick,
    } : undefined,
  });
}

// Loading toast
export function toastLoading(message: string, options?: Omit<ToastOptions, 'action'>) {
  return sonnerToast.loading(options?.title || 'Loading', {
    description: message,
    duration: Infinity,
  });
}

// Promise toast - automatically handles loading/success/error states
export async function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
): Promise<T> {
  sonnerToast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
  return promise;
}

// CRUD operation toasts
export const toastCRUD = {
  created: (entity: string) => 
    toastSuccess(`${entity} created successfully`),
  
  updated: (entity: string) => 
    toastSuccess(`${entity} updated successfully`),
  
  deleted: (entity: string, onUndo?: () => void) => 
    toastSuccess(`${entity} deleted`, {
      action: onUndo ? {
        label: 'Undo',
        onClick: onUndo,
      } : undefined,
    }),
  
  restored: (entity: string) => 
    toastSuccess(`${entity} restored`),
  
  saved: () => 
    toastSuccess('Changes saved'),
  
  copied: (item: string = 'Item') => 
    toastInfo(`${item} copied to clipboard`),
};

// Network error toast
export function toastNetworkError(retryFn?: () => void) {
  return toastError('Unable to connect. Please check your internet connection.', {
    action: retryFn ? {
      label: 'Retry',
      onClick: retryFn,
    } : undefined,
    duration: 6000,
  });
}

// Validation error toast
export function toastValidationError(message: string = 'Please check your input and try again.') {
  return toastError(message, {
    title: 'Validation Error',
  });
}

// Permission error toast
export function toastPermissionError() {
  return toastError('You don\'t have permission to perform this action.', {
    title: 'Permission Denied',
  });
}
