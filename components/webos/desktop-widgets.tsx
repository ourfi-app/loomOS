

'use client';

import { AnimatePresence } from 'framer-motion';
import { useDesktopWidgets } from '@/lib/desktop-widget-store';
import { DesktopWidgetCard } from './desktop-widget-card';
import { DesktopWidgetManager } from './desktop-widget-manager';
import { DesktopTasksWidget } from './widgets/desktop-tasks-widget';
import { DesktopNotesWidget } from './widgets/desktop-notes-widget';
import { DesktopNotificationsWidget } from './widgets/desktop-notifications-widget';
import { DesktopEmailWidget } from './widgets/desktop-email-widget';
import { DesktopStatsWidget } from './widgets/desktop-stats-widget';
import { DesktopActivityWidget } from './widgets/desktop-activity-widget';

export function DesktopWidgets() {
  const { widgets } = useDesktopWidgets();
  
  const renderWidgetContent = (widgetType: string, widget: any) => {
    switch (widgetType) {
      case 'tasks':
        return <DesktopTasksWidget widget={widget} />;
      case 'notes':
        return <DesktopNotesWidget widget={widget} />;
      case 'notifications':
        return <DesktopNotificationsWidget widget={widget} />;
      case 'email':
        return <DesktopEmailWidget widget={widget} />;
      case 'stats':
        return <DesktopStatsWidget widget={widget} />;
      case 'activity':
        return <DesktopActivityWidget widget={widget} />;
      default:
        return (
          <div className="h-full flex items-center justify-center p-8 text-center">
            <div style={{ color: 'var(--text-secondary)' }}>
              <p className="text-sm">Unknown widget type</p>
            </div>
          </div>
        );
    }
  };
  
  return (
    <>
      {/* Desktop Widget Cards */}
      <AnimatePresence>
        {widgets.map(widget => (
          <DesktopWidgetCard
            key={widget.id}
            widget={widget}
          >
            {renderWidgetContent(widget.widgetType, widget)}
          </DesktopWidgetCard>
        ))}
      </AnimatePresence>
      
      {/* Widget Manager Button */}
      <DesktopWidgetManager />
    </>
  );
}
