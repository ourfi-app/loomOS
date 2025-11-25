/**
 * Tests for Dock Helper Utilities
 */

import { describe, it, expect } from '@jest/globals';
import {
  getAppIdFromPath,
  buildCardsByAppIdMap,
  getRunningAppIds,
  shouldShowDock,
  getDockPositionClasses,
  getDockInnerClasses,
  getDockItemSizeClasses,
  isValidSwipe,
  canCustomizeApp,
  getStatusLabel,
  reorderArray,
  findAppIndex,
  clamp,
} from '../utils/dockHelpers';
import type { DockItemStatus } from '../types';

describe('dockHelpers', () => {
  describe('getAppIdFromPath', () => {
    it('should extract app ID from path', () => {
      expect(getAppIdFromPath('/dashboard/messages')).toBe('messages');
      expect(getAppIdFromPath('/dashboard/calendar')).toBe('calendar');
      expect(getAppIdFromPath('/dashboard')).toBe('home');
      expect(getAppIdFromPath('/')).toBe('home');
    });
  });

  describe('shouldShowDock', () => {
    it('should always show on home', () => {
      expect(shouldShowDock('/', true, true, 0)).toBe(true);
      expect(shouldShowDock('/dashboard', true, true, 0)).toBe(true);
    });

    it('should always show when autoHide is disabled', () => {
      expect(shouldShowDock('/some-app', false, false, 1)).toBe(true);
    });

    it('should respect visibility state when autoHide is enabled', () => {
      expect(shouldShowDock('/some-app', true, true, 1)).toBe(true);
      expect(shouldShowDock('/some-app', false, true, 1)).toBe(false);
    });
  });

  describe('getDockPositionClasses', () => {
    it('should return correct classes for bottom position', () => {
      const classes = getDockPositionClasses('horizontal', 'bottom');
      expect(classes).toContain('bottom-0');
      expect(classes).toContain('fixed');
    });

    it('should return correct classes for left position', () => {
      const classes = getDockPositionClasses('vertical', 'left');
      expect(classes).toContain('left-0');
      expect(classes).toContain('fixed');
    });
  });

  describe('getDockInnerClasses', () => {
    it('should include flex-row for horizontal orientation', () => {
      const classes = getDockInnerClasses('horizontal', false);
      expect(classes).toContain('flex-row');
    });

    it('should include flex-col for vertical orientation', () => {
      const classes = getDockInnerClasses('vertical', false);
      expect(classes).toContain('flex-col');
    });

    it('should include drag-over class when dragging', () => {
      const classes = getDockInnerClasses('horizontal', true);
      expect(classes).toContain('drag-over');
    });
  });

  describe('getDockItemSizeClasses', () => {
    it('should return correct classes for small size', () => {
      const classes = getDockItemSizeClasses('small');
      expect(classes.container).toContain('h-12');
      expect(classes.icon).toContain('h-6');
    });

    it('should return correct classes for medium size', () => {
      const classes = getDockItemSizeClasses('medium');
      expect(classes.container).toContain('h-14');
      expect(classes.icon).toContain('h-7');
    });

    it('should return correct classes for large size', () => {
      const classes = getDockItemSizeClasses('large');
      expect(classes.container).toContain('h-16');
      expect(classes.icon).toContain('h-8');
    });
  });

  describe('isValidSwipe', () => {
    it('should validate upward swipe', () => {
      const result = isValidSwipe(100, 40, 0, 300, 50, 500);
      expect(result.isValid).toBe(true);
      expect(result.direction).toBe('up');
    });

    it('should validate downward swipe', () => {
      const result = isValidSwipe(40, 100, 0, 300, 50, 500);
      expect(result.isValid).toBe(true);
      expect(result.direction).toBe('down');
    });

    it('should reject swipe that is too short', () => {
      const result = isValidSwipe(100, 80, 0, 300, 50, 500);
      expect(result.isValid).toBe(false);
    });

    it('should reject swipe that takes too long', () => {
      const result = isValidSwipe(100, 40, 0, 600, 50, 500);
      expect(result.isValid).toBe(false);
    });
  });

  describe('canCustomizeApp', () => {
    it('should allow customization for pinned apps below max', () => {
      expect(canCustomizeApp(true, 0, 5)).toBe(true);
      expect(canCustomizeApp(true, 4, 5)).toBe(true);
    });

    it('should not allow customization for unpinned apps', () => {
      expect(canCustomizeApp(false, 0, 5)).toBe(false);
    });

    it('should not allow customization for apps at or above max position', () => {
      expect(canCustomizeApp(true, 5, 5)).toBe(false);
      expect(canCustomizeApp(true, 6, 5)).toBe(false);
    });

    it('should not allow customization when position is undefined', () => {
      expect(canCustomizeApp(true, undefined, 5)).toBe(false);
    });
  });

  describe('getStatusLabel', () => {
    it('should return "Minimized" for minimized apps', () => {
      const status: DockItemStatus = {
        isActive: false,
        isRunning: true,
        isMinimized: true,
        isPinned: true,
      };
      expect(getStatusLabel(status)).toBe('Minimized');
    });

    it('should return "Active" for active apps', () => {
      const status: DockItemStatus = {
        isActive: true,
        isRunning: true,
        isMinimized: false,
        isPinned: true,
      };
      expect(getStatusLabel(status)).toBe('Active');
    });

    it('should return "Running" for running apps', () => {
      const status: DockItemStatus = {
        isActive: false,
        isRunning: true,
        isMinimized: false,
        isPinned: true,
      };
      expect(getStatusLabel(status)).toBe('Running');
    });

    it('should return "Pinned" for pinned but not running apps', () => {
      const status: DockItemStatus = {
        isActive: false,
        isRunning: false,
        isMinimized: false,
        isPinned: true,
      };
      expect(getStatusLabel(status)).toBe('Pinned');
    });

    it('should return "Not running" for unpinned and not running apps', () => {
      const status: DockItemStatus = {
        isActive: false,
        isRunning: false,
        isMinimized: false,
        isPinned: false,
      };
      expect(getStatusLabel(status)).toBe('Not running');
    });
  });

  describe('reorderArray', () => {
    it('should reorder array items correctly', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const result = reorderArray(array, 1, 3);
      expect(result).toEqual(['a', 'c', 'd', 'b', 'e']);
    });

    it('should handle moving to beginning', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const result = reorderArray(array, 3, 0);
      expect(result).toEqual(['d', 'a', 'b', 'c', 'e']);
    });

    it('should handle moving to end', () => {
      const array = ['a', 'b', 'c', 'd', 'e'];
      const result = reorderArray(array, 1, 4);
      expect(result).toEqual(['a', 'c', 'd', 'e', 'b']);
    });
  });

  describe('findAppIndex', () => {
    const apps = [
      { id: 'app1', title: 'App 1' },
      { id: 'app2', title: 'App 2' },
      { id: 'app3', title: 'App 3' },
    ] as any[];

    it('should find app index by ID', () => {
      expect(findAppIndex(apps, 'app2')).toBe(1);
    });

    it('should return -1 for non-existent app', () => {
      expect(findAppIndex(apps, 'app99')).toBe(-1);
    });
  });

  describe('clamp', () => {
    it('should clamp value to min', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('should clamp value to max', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should return value when within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });
  });
});
