
'use client';

import { useState } from 'react';
import { DesktopAppWindow, MenuBarItem } from './desktop-app-window';
import { 
  FileText, 
  Save, 
  FolderOpen, 
  Printer,
  Copy,
  Scissors,
  Clipboard,
  Undo,
  Redo,
  Search,
  ZoomIn,
  ZoomOut,
  Settings,
  HelpCircle,
  Info,
  Plus,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

/**
 * Example Desktop Application Window
 * 
 * This demonstrates the standard desktop app window shell with:
 * - Title bar with icon
 * - Menu bar (File, Edit, View, Tools, Help)
 * - Optional toolbar
 * - Main content area
 * - Optional status bar
 * - Window controls (minimize, maximize, close)
 */

export function DesktopAppWindowExample() {
  const [isOpen, setIsOpen] = useState(true);

  // Define the menu bar structure
  const menuBar: MenuBarItem[] = [
    {
      label: 'File',
      items: [
        {
          label: 'New',
          icon: <Plus className="w-4 h-4" />,
          shortcut: 'Ctrl+N',
          onClick: () => toast.success('New file created'),
        },
        {
          label: 'Open',
          icon: <FolderOpen className="w-4 h-4" />,
          shortcut: 'Ctrl+O',
          onClick: () => toast.info('Open file dialog'),
        },
        {
          label: 'Recent Files',
          icon: <FileText className="w-4 h-4" />,
          submenu: [
            {
              label: 'Document 1.txt',
              onClick: () => toast.info('Opening Document 1.txt'),
            },
            {
              label: 'Document 2.txt',
              onClick: () => toast.info('Opening Document 2.txt'),
            },
            {
              label: 'Document 3.txt',
              onClick: () => toast.info('Opening Document 3.txt'),
            },
          ],
        },
        { separator: true },
        {
          label: 'Save',
          icon: <Save className="w-4 h-4" />,
          shortcut: 'Ctrl+S',
          onClick: () => toast.success('File saved'),
        },
        {
          label: 'Save As...',
          icon: <Download className="w-4 h-4" />,
          shortcut: 'Ctrl+Shift+S',
          onClick: () => toast.info('Save as dialog'),
        },
        { separator: true },
        {
          label: 'Print',
          icon: <Printer className="w-4 h-4" />,
          shortcut: 'Ctrl+P',
          onClick: () => toast.info('Print dialog'),
        },
        { separator: true },
        {
          label: 'Exit',
          icon: <Trash2 className="w-4 h-4" />,
          shortcut: 'Alt+F4',
          onClick: () => {
            toast.info('Closing application');
            setIsOpen(false);
          },
        },
      ],
    },
    {
      label: 'Edit',
      items: [
        {
          label: 'Undo',
          icon: <Undo className="w-4 h-4" />,
          shortcut: 'Ctrl+Z',
          onClick: () => toast.info('Undo'),
        },
        {
          label: 'Redo',
          icon: <Redo className="w-4 h-4" />,
          shortcut: 'Ctrl+Y',
          onClick: () => toast.info('Redo'),
        },
        { separator: true },
        {
          label: 'Cut',
          icon: <Scissors className="w-4 h-4" />,
          shortcut: 'Ctrl+X',
          onClick: () => toast.info('Cut'),
        },
        {
          label: 'Copy',
          icon: <Copy className="w-4 h-4" />,
          shortcut: 'Ctrl+C',
          onClick: () => toast.info('Copy'),
        },
        {
          label: 'Paste',
          icon: <Clipboard className="w-4 h-4" />,
          shortcut: 'Ctrl+V',
          onClick: () => toast.info('Paste'),
        },
        { separator: true },
        {
          label: 'Find',
          icon: <Search className="w-4 h-4" />,
          shortcut: 'Ctrl+F',
          onClick: () => toast.info('Find dialog'),
        },
      ],
    },
    {
      label: 'View',
      items: [
        {
          label: 'Zoom In',
          icon: <ZoomIn className="w-4 h-4" />,
          shortcut: 'Ctrl++',
          onClick: () => toast.info('Zoom in'),
        },
        {
          label: 'Zoom Out',
          icon: <ZoomOut className="w-4 h-4" />,
          shortcut: 'Ctrl+-',
          onClick: () => toast.info('Zoom out'),
        },
        { separator: true },
        {
          label: 'Refresh',
          icon: <RefreshCw className="w-4 h-4" />,
          shortcut: 'F5',
          onClick: () => toast.info('Refreshing view'),
        },
        { separator: true },
        {
          label: 'Preview Mode',
          icon: <Eye className="w-4 h-4" />,
          onClick: () => toast.info('Preview mode activated'),
        },
      ],
    },
    {
      label: 'Tools',
      items: [
        {
          label: 'Settings',
          icon: <Settings className="w-4 h-4" />,
          shortcut: 'Ctrl+,',
          onClick: () => toast.info('Settings dialog'),
        },
        {
          label: 'Import',
          icon: <Upload className="w-4 h-4" />,
          onClick: () => toast.info('Import dialog'),
        },
        {
          label: 'Export',
          icon: <Download className="w-4 h-4" />,
          onClick: () => toast.info('Export dialog'),
        },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'Documentation',
          icon: <FileText className="w-4 h-4" />,
          shortcut: 'F1',
          onClick: () => toast.info('Opening documentation'),
        },
        {
          label: 'Keyboard Shortcuts',
          icon: <HelpCircle className="w-4 h-4" />,
          onClick: () => toast.info('Keyboard shortcuts reference'),
        },
        { separator: true },
        {
          label: 'About',
          icon: <Info className="w-4 h-4" />,
          onClick: () => toast.info('About this application'),
        },
      ],
    },
  ];

  // Optional toolbar with common actions
  const toolbar = (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => toast.success('New document')}
        title="New"
      >
        <Plus className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => toast.info('Open file')}
        title="Open"
      >
        <FolderOpen className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => toast.success('Saved')}
        title="Save"
      >
        <Save className="w-4 h-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-1" />
      <Button
        size="sm"
        variant="ghost"
        onClick={() => toast.info('Undo')}
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => toast.info('Redo')}
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </Button>
      <div className="w-px h-6 bg-border mx-1" />
      <Button
        size="sm"
        variant="ghost"
        onClick={() => toast.info('Search')}
        title="Search"
      >
        <Search className="w-4 h-4" />
      </Button>
    </div>
  );

  // Optional status bar
  const statusBar = (
    <div className="flex items-center justify-between text-xs text-muted-foreground">
      <span>Ready</span>
      <div className="flex items-center gap-4">
        <span>Line 1, Column 1</span>
        <span>100%</span>
        <span>UTF-8</span>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <DesktopAppWindow
      id="example-app"
      title="Example Application"
      icon={<FileText className="w-4 h-4 text-primary" />}
      menuBar={menuBar}
      toolbar={toolbar}
      statusBar={statusBar}
      showMenuBar={true}
      onClose={() => {
        toast.info('Application closed');
        setIsOpen(false);
      }}
    >
      <div className="p-6 space-y-4">
        <div className="prose dark:prose-invert max-w-none">
          <h2>Desktop Application Window</h2>
          <p>
            This is a standard desktop application window shell featuring:
          </p>
          <ul>
            <li><strong>Title Bar:</strong> With app icon, title, and window controls (minimize, maximize, close)</li>
            <li><strong>Menu Bar:</strong> Full menu system with File, Edit, View, Tools, and Help menus</li>
            <li><strong>Toolbar:</strong> Quick access buttons for common actions</li>
            <li><strong>Content Area:</strong> Main application workspace (this area)</li>
            <li><strong>Status Bar:</strong> Application status and information display</li>
          </ul>
          
          <h3>Features</h3>
          <ul>
            <li>Drag the title bar to move the window</li>
            <li>Double-click the title bar to maximize/restore</li>
            <li>Use window controls to minimize, maximize, or close</li>
            <li>Click menu items to see toast notifications</li>
            <li>Menu items support keyboard shortcuts, icons, and submenus</li>
            <li>Drag from bottom-right corner to resize</li>
            <li>Drag near screen edges to snap window to half/quarter screen</li>
          </ul>

          <h3>Usage Example</h3>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
{`import { DesktopAppWindow } from '@/components/webos';

<DesktopAppWindow
  id="my-app"
  title="My Application"
  icon={<FileText className="w-4 h-4" />}
  menuBar={menuBarItems}
  toolbar={<MyToolbar />}
  statusBar={<MyStatusBar />}
  onClose={() => handleClose()}
>
  <div>Your app content here</div>
</DesktopAppWindow>`}
          </pre>
        </div>
      </div>
    </DesktopAppWindow>
  );
}
