/**
 * loomOS AspectRatio Component
 * 
 * Maintains aspect ratio for content (images, videos, etc.).
 * Simple wrapper around Radix UI AspectRatio primitive.
 * 
 * @example
 * ```tsx
 * <AspectRatio ratio={16/9}>
 *   <img src="..." alt="..." />
 * </AspectRatio>
 * ```
 */

'use client';

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';

const AspectRatio = AspectRatioPrimitive.Root;

export { AspectRatio };
