
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/**
 * Hook to handle deep linking within apps
 * Supports query parameters like ?itemId=123&action=view
 */
export function useDeepLink(config: {
  onItemId?: (itemId: string) => void;
  onAction?: (action: string, itemId?: string) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const itemId = searchParams?.get("itemId");
    const action = searchParams?.get("action");

    if (itemId && config.onItemId) {
      config.onItemId(itemId);
      // Clean up URL after handling
      router.replace(window.location.pathname, { scroll: false });
    }

    if (action && config.onAction) {
      config.onAction(action, itemId || undefined);
      // Clean up URL after handling
      router.replace(window.location.pathname, { scroll: false });
    }
  }, [searchParams, config, router]);
}

/**
 * Hook to auto-select an item from a list when navigating via deep link
 * Used by Calendar, Tasks, Messages, Notes, etc.
 */
export function useDeepLinkSelection<T extends { id: string }>(config: {
  items: T[];
  onSelect: (item: T | null) => void;
  enabled?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!config.enabled || config.items.length === 0) return;

    const itemId = searchParams?.get("itemId");
    if (itemId) {
      const item = config.items.find((i) => i.id === itemId);
      if (item) {
        config.onSelect(item);
        // Clean up URL after handling
        router.replace(window.location.pathname, { scroll: false });
      } else {
        toast.error("Item not found", {
          description: "The requested item could not be found.",
        });
      }
    }
  }, [searchParams, config.items, config.onSelect, config.enabled, router]);
}

/**
 * Helper to create deep link URLs
 */
export function createDeepLink(
  basePath: string,
  params: { itemId?: string; action?: string }
): string {
  const url = new URL(basePath, window.location.origin);
  if (params.itemId) url.searchParams.set("itemId", params.itemId);
  if (params.action) url.searchParams.set("action", params.action);
  return url.pathname + url.search;
}

/**
 * Helper to navigate with deep link
 */
export function navigateToDeepLink(
  router: ReturnType<typeof useRouter>,
  basePath: string,
  params: { itemId?: string; action?: string }
) {
  const link = createDeepLink(basePath, params);
  router.push(link);
}
