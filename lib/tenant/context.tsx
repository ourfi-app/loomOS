'use client';

/**
 * Tenant Context Provider
 * Provides organization context throughout the application
 */

import React, { createContext, useContext, ReactNode } from 'react';

export interface OrganizationContext {
  id: string;
  name: string;
  slug: string;
  subdomain: string | null;
  customDomain: string | null;
  logo: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  features: Record<string, any> | null;
  planType: string | null;
  isActive: boolean;
  isSuspended: boolean;
}

interface TenantContextValue {
  organization: OrganizationContext | null;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

interface TenantProviderProps {
  organization: OrganizationContext | null;
  children: ReactNode;
}

export function TenantProvider({ organization, children }: TenantProviderProps) {
  const value: TenantContextValue = {
    organization,
    isLoading: false,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

/**
 * Hook to access current tenant/organization context
 */
export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);

  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }

  return context;
}

/**
 * Hook to get organization ID (throws if not in tenant context)
 */
export function useOrganizationId(): string {
  const { organization } = useTenant();

  if (!organization) {
    throw new Error('No organization in context. This component must be used within an organization.');
  }

  return organization.id;
}

/**
 * Hook to check if a feature is enabled for the current organization
 */
export function useHasFeature(featureKey: string): boolean {
  const { organization } = useTenant();

  if (!organization || !organization.features) {
    return false;
  }

  return organization.features[featureKey] === true;
}

/**
 * Hook to get organization branding
 */
export function useOrganizationBranding() {
  const { organization } = useTenant();

  return {
    logo: organization?.logo || null,
    primaryColor: organization?.primaryColor || '#3b82f6',
    secondaryColor: organization?.secondaryColor || '#8b5cf6',
    name: organization?.name || 'LoomOS',
  };
}
