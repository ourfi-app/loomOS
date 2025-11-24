
// ==================== Unified Components (Recommended) ====================
// Use these unified components for consistent UI across the app
export * from './unified-loading-state';
export * from './unified-empty-state';
export * from './unified-error-state';
export * from './unified-section-header';

// ==================== Other Common Components ====================
export * from './action-button';
export * from './data-table';
export * from './deprecation-notice';
export * from './deprecated-route-handler';
export * from './error-boundary';
export * from './page-header';
export * from './skeleton-screens';
export * from './skip-to-content';
export * from './stat-card';

// Desktop-specific components
export * from './desktop-context-menu';
export * from './keyboard-shortcuts-dialog';

// Performance components
export { VirtualList, VirtualGrid } from './virtual-list';

// ==================== Legacy Components (Deprecated) ====================
// These are kept for backward compatibility but should be replaced with unified versions
// @deprecated Use UnifiedLoadingState instead
export { LoadingState, LoadingSpinner } from './loading-state';
export { EnhancedLoadingState, InlineLoader } from './enhanced-loading-state';

// @deprecated Use UnifiedEmptyState instead
export { EmptyState } from './empty-state';

// @deprecated Use UnifiedErrorState instead
export { ErrorState } from './error-state';
export { EnhancedErrorState, InlineErrorState } from './enhanced-error-state';

// @deprecated Use UnifiedSectionHeader instead
export { SectionHeader } from './section-header';

