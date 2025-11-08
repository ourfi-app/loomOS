'use client';

/**
 * Client-side Tenant Provider Wrapper
 * Fetches tenant context and provides it to the app
 */

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { TenantProvider, OrganizationContext } from '@/lib/tenant/context';

interface TenantProviderWrapperProps {
  children: React.ReactNode;
}

export function TenantProviderWrapper({ children }: TenantProviderWrapperProps) {
  const { data: session } = useSession();
  const [organization, setOrganization] = useState<OrganizationContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTenantContext() {
      try {
        // If user has an organization in session, use it
        if (session?.user?.organizationId) {
          const response = await fetch(`/api/organizations/${session.user.organizationId}`);

          if (response.ok) {
            const org = await response.json();
            setOrganization({
              id: org.id,
              name: org.name,
              slug: org.slug,
              subdomain: org.subdomain,
              customDomain: org.customDomain,
              logo: org.logo,
              primaryColor: org.primaryColor,
              secondaryColor: org.secondaryColor,
              features: org.features,
              planType: org.planType,
              isActive: org.isActive,
              isSuspended: org.isSuspended,
            });
          }
        }
      } catch (error) {
        console.error('[TenantProvider] Failed to load tenant context:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      loadTenantContext();
    } else {
      setLoading(false);
    }
  }, [session]);

  return (
    <TenantProvider organization={organization}>
      {children}
    </TenantProvider>
  );
}
