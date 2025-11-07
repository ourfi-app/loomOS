/**
 * loomOS Core Library
 *
 * Core functionality for the loomOS operating system framework.
 * Export all loomOS libraries for easy importing.
 */

// Design System
export { default as loomOSTheme } from '../loomos-design-system';
export * from '../loomos-design-system';

// Activity Manager
export {
  LoomOSActivityManager,
  getActivityManager,
  useActivityManager,
} from '../loomos-activity-manager';
export type {
  UserIntent,
  Activity,
  ActivityCard,
  ActivityContext,
  Contact,
  File,
  Event,
  Task,
} from '../loomos-activity-manager';

// Liberation Features
export {
  LoomOSMarketplace,
  LoomOSSynergy,
  getMarketplace,
  getSynergy,
} from '../loomos-liberation';
export type {
  LoomOSApp,
  Permission,
  PWAManifest,
  CloudService,
  CloudCredentials,
  UnifiedContact,
  UnifiedEvent,
  UnifiedFile,
} from '../loomos-liberation';
