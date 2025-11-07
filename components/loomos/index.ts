/**
 * loomOS Components
 *
 * Liberation-focused UI components inspired by webOS principles.
 * Export all loomOS components for easy importing.
 */

// Card System
export { LoomOSCard, LoomOSCardGrid, LoomOSCardStack } from './Card';
export type { LoomOSCardProps, LoomOSCardGridProps, LoomOSCardStackProps } from './Card';

// Dock
export { LoomOSDock, LoomOSDockSeparator, defaultDockApps } from './Dock';
export type { LoomOSDockProps, DockApp } from './Dock';

// Just Type Universal Search
export { JustType } from './JustType';
export type { JustTypeProps, SearchResult } from './JustType';

// App Template (Three-pane layout)
export {
  LoomOSAppTemplate,
  LoomOSNavigationItem,
  LoomOSContentList,
  LoomOSContentListItem,
  LoomOSDetailPane,
  LoomOSSection,
} from './AppTemplate';
export type {
  LoomOSAppTemplateProps,
  NavigationItemProps,
  ContentListProps,
  ContentListItemProps,
  DetailPaneProps,
  SectionProps,
} from './AppTemplate';
