/**
 * loomOS Collapsible Component
 * 
 * Expandable/collapsible content area.
 * Simple wrapper around Radix UI Collapsible primitive.
 * 
 * @example
 * ```tsx
 * <Collapsible>
 *   <CollapsibleTrigger>Toggle</CollapsibleTrigger>
 *   <CollapsibleContent>
 *     Hidden content
 *   </CollapsibleContent>
 * </Collapsible>
 * ```
 */

'use client';

import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent;

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
