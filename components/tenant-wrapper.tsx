/**
 * Server Component: Tenant Wrapper
 * Resolves tenant from request and provides context to client components
 */

import { headers } from 'next/headers';
import { TenantProvider, OrganizationContext } from '@/lib/tenant/context';
import { resolveTenant } from '@/lib/tenant/resolver';

interface TenantWrapperProps {
  children: React.ReactNode;
}

export async function TenantWrapper({ children }: TenantWrapperProps) {
  // Resolve tenant from current request
  let organization: OrganizationContext | null = null;

  try {
    const tenant = await resolveTenant();

    if (tenant) {
      organization = {
        id: tenant.organization.id,
        name: tenant.organization.name,
        slug: tenant.organization.slug,
        subdomain: tenant.organization.subdomain,
        customDomain: tenant.organization.customDomain,
        logo: tenant.organization.logo,
        primaryColor: tenant.organization.primaryColor,
        secondaryColor: tenant.organization.secondaryColor,
        features: tenant.organization.features,
        planType: tenant.organization.planType,
        isActive: tenant.organization.isActive,
        isSuspended: tenant.organization.isSuspended,
      };
    }
  } catch (error) {
    // Tenant resolution failed - user might not have an organization
    // or might be on a public page
  }

  return (
    <TenantProvider organization={organization}>
      {children}
    </TenantProvider>
  );
}
