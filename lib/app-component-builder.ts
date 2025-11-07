
/**
 * App Component Builder
 * Drag-and-drop component system for visual app building
 */

import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

export type ComponentCategory = 
  | 'layout'
  | 'navigation'
  | 'data-display'
  | 'input'
  | 'feedback'
  | 'media'
  | 'advanced';

export interface ComponentDefinition {
  id: string;
  name: string;
  category: ComponentCategory;
  icon: LucideIcon;
  description: string;
  props: ComponentProp[];
  defaultProps: Record<string, any>;
  code: (props: Record<string, any>) => string;
  preview: string;
}

export interface ComponentProp {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'icon';
  label: string;
  description?: string;
  options?: Array<{ label: string; value: any }>;
  default: any;
}

export interface DroppedComponent {
  id: string;
  componentId: string;
  props: Record<string, any>;
  x: number;
  y: number;
  width: number;
  height: number;
  parentId?: string;
  children?: string[];
}

export interface CanvasState {
  components: DroppedComponent[];
  selectedId: string | null;
  zoom: number;
  gridSnap: boolean;
}

/**
 * Component Library
 */
export const COMPONENT_LIBRARY: Record<string, ComponentDefinition> = {
  // Layout Components
  container: {
    id: 'container',
    name: 'Container',
    category: 'layout',
    icon: Icons.Box,
    description: 'Basic container with padding and spacing',
    props: [
      {
        name: 'padding',
        type: 'select',
        label: 'Padding',
        options: [
          { label: 'None', value: '0' },
          { label: 'Small', value: '2' },
          { label: 'Medium', value: '4' },
          { label: 'Large', value: '6' },
        ],
        default: '4',
      },
      {
        name: 'maxWidth',
        type: 'select',
        label: 'Max Width',
        options: [
          { label: 'None', value: 'full' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
          { label: 'XL', value: 'xl' },
        ],
        default: 'full',
      },
    ],
    defaultProps: {
      padding: '4',
      maxWidth: 'full',
    },
    code: (props) => `<div className="p-${props.padding} max-w-${props.maxWidth} mx-auto">
  {/* Content */}
</div>`,
    preview: 'A flexible container with customizable padding and max-width',
  },
  
  card: {
    id: 'card',
    name: 'Card',
    category: 'layout',
    icon: Icons.Square,
    description: 'Card container with shadow and border',
    props: [
      {
        name: 'shadow',
        type: 'select',
        label: 'Shadow',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
        default: 'md',
      },
      {
        name: 'padding',
        type: 'select',
        label: 'Padding',
        options: [
          { label: 'Small', value: '3' },
          { label: 'Medium', value: '4' },
          { label: 'Large', value: '6' },
        ],
        default: '4',
      },
    ],
    defaultProps: {
      shadow: 'md',
      padding: '4',
    },
    code: (props) => `<Card className="shadow-${props.shadow} p-${props.padding}">
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>`,
    preview: 'A card component with customizable shadow and padding',
  },

  // Navigation Components
  searchBar: {
    id: 'searchBar',
    name: 'Search Bar',
    category: 'navigation',
    icon: Icons.Search,
    description: 'Search input with icon',
    props: [
      {
        name: 'placeholder',
        type: 'string',
        label: 'Placeholder',
        default: 'Search...',
      },
      {
        name: 'size',
        type: 'select',
        label: 'Size',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'md' },
          { label: 'Large', value: 'lg' },
        ],
        default: 'md',
      },
    ],
    defaultProps: {
      placeholder: 'Search...',
      size: 'md',
    },
    code: (props) => `<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
  <Input
    className="pl-10"
    placeholder="${props.placeholder}"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
</div>`,
    preview: 'Search input with icon and placeholder',
  },

  // Data Display Components
  listItem: {
    id: 'listItem',
    name: 'List Item',
    category: 'data-display',
    icon: Icons.List,
    description: 'List item with title and description',
    props: [
      {
        name: 'hasAvatar',
        type: 'boolean',
        label: 'Show Avatar',
        default: true,
      },
      {
        name: 'hasActions',
        type: 'boolean',
        label: 'Show Actions',
        default: true,
      },
    ],
    defaultProps: {
      hasAvatar: true,
      hasActions: true,
    },
    code: (props) => `<div className="flex items-center gap-3 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
  ${props.hasAvatar ? '<Avatar className="w-10 h-10"><AvatarFallback>AB</AvatarFallback></Avatar>' : ''}
  <div className="flex-1">
    <h3 className="font-semibold text-gray-900">Item Title</h3>
    <p className="text-sm text-gray-500">Item description</p>
  </div>
  ${props.hasActions ? '<Button variant="ghost" size="sm"><MoreVertical size={16} /></Button>' : ''}
</div>`,
    preview: 'List item with optional avatar and actions',
  },

  table: {
    id: 'table',
    name: 'Data Table',
    category: 'data-display',
    icon: Icons.Table,
    description: 'Sortable data table',
    props: [
      {
        name: 'striped',
        type: 'boolean',
        label: 'Striped Rows',
        default: true,
      },
      {
        name: 'hoverable',
        type: 'boolean',
        label: 'Hover Effect',
        default: true,
      },
    ],
    defaultProps: {
      striped: true,
      hoverable: true,
    },
    code: (props) => `<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column 1</TableHead>
      <TableHead>Column 2</TableHead>
      <TableHead>Column 3</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item, idx) => (
      <TableRow key={idx} className={\`${props.hoverable ? 'hover:bg-gray-50' : ''} \${props.striped && idx % 2 === 0 ? 'bg-gray-50/50' : ''}\`}>
        <TableCell>{item.col1}</TableCell>
        <TableCell>{item.col2}</TableCell>
        <TableCell>{item.col3}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,
    preview: 'Sortable table with striped rows',
  },

  // Input Components
  textInput: {
    id: 'textInput',
    name: 'Text Input',
    category: 'input',
    icon: Icons.Type,
    description: 'Text input field',
    props: [
      {
        name: 'label',
        type: 'string',
        label: 'Label',
        default: 'Field Label',
      },
      {
        name: 'placeholder',
        type: 'string',
        label: 'Placeholder',
        default: 'Enter text...',
      },
      {
        name: 'required',
        type: 'boolean',
        label: 'Required',
        default: false,
      },
    ],
    defaultProps: {
      label: 'Field Label',
      placeholder: 'Enter text...',
      required: false,
    },
    code: (props) => `<div className="space-y-2">
  <Label htmlFor="field">
    ${props.label}${props.required ? ' *' : ''}
  </Label>
  <Input
    id="field"
    placeholder="${props.placeholder}"
    ${props.required ? 'required' : ''}
  />
</div>`,
    preview: 'Labeled text input field',
  },

  button: {
    id: 'button',
    name: 'Button',
    category: 'input',
    icon: Icons.MousePointer2,
    description: 'Action button',
    props: [
      {
        name: 'text',
        type: 'string',
        label: 'Button Text',
        default: 'Click me',
      },
      {
        name: 'variant',
        type: 'select',
        label: 'Variant',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost', value: 'ghost' },
          { label: 'Destructive', value: 'destructive' },
        ],
        default: 'default',
      },
      {
        name: 'size',
        type: 'select',
        label: 'Size',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Medium', value: 'default' },
          { label: 'Large', value: 'lg' },
        ],
        default: 'default',
      },
    ],
    defaultProps: {
      text: 'Click me',
      variant: 'default',
      size: 'default',
    },
    code: (props) => `<Button variant="${props.variant}" size="${props.size}">
  ${props.text}
</Button>`,
    preview: 'Customizable action button',
  },

  // Feedback Components
  alert: {
    id: 'alert',
    name: 'Alert',
    category: 'feedback',
    icon: Icons.AlertCircle,
    description: 'Alert message box',
    props: [
      {
        name: 'title',
        type: 'string',
        label: 'Title',
        default: 'Alert Title',
      },
      {
        name: 'variant',
        type: 'select',
        label: 'Variant',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Destructive', value: 'destructive' },
        ],
        default: 'default',
      },
    ],
    defaultProps: {
      title: 'Alert Title',
      variant: 'default',
    },
    code: (props) => `<Alert variant="${props.variant}">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>${props.title}</AlertTitle>
  <AlertDescription>
    Alert message content goes here
  </AlertDescription>
</Alert>`,
    preview: 'Alert message with icon',
  },

  badge: {
    id: 'badge',
    name: 'Badge',
    category: 'feedback',
    icon: Icons.Tag,
    description: 'Status badge',
    props: [
      {
        name: 'text',
        type: 'string',
        label: 'Text',
        default: 'Badge',
      },
      {
        name: 'variant',
        type: 'select',
        label: 'Variant',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Outline', value: 'outline' },
          { label: 'Destructive', value: 'destructive' },
        ],
        default: 'default',
      },
    ],
    defaultProps: {
      text: 'Badge',
      variant: 'default',
    },
    code: (props) => `<Badge variant="${props.variant}">${props.text}</Badge>`,
    preview: 'Small status badge',
  },

  // Additional shadcn/ui components
  shadcnButton: {
    id: 'shadcnButton',
    name: 'shadcn Button',
    category: 'input',
    icon: Icons.MousePointer2,
    description: 'Full shadcn/ui button with all variants',
    props: [
      {
        name: 'children',
        type: 'string',
        label: 'Text',
        default: 'Click me',
      },
      {
        name: 'variant',
        type: 'select',
        label: 'Variant',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Destructive', value: 'destructive' },
          { label: 'Outline', value: 'outline' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Ghost', value: 'ghost' },
          { label: 'Link', value: 'link' },
        ],
        default: 'default',
      },
      {
        name: 'size',
        type: 'select',
        label: 'Size',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Small', value: 'sm' },
          { label: 'Large', value: 'lg' },
          { label: 'Icon', value: 'icon' },
        ],
        default: 'default',
      },
    ],
    defaultProps: {
      children: 'Click me',
      variant: 'default',
      size: 'default',
    },
    code: (props) => `<Button variant="${props.variant}" size="${props.size}">${props.children}</Button>`,
    preview: 'shadcn/ui button with all variants',
  },

  dialog: {
    id: 'dialog',
    name: 'Dialog',
    category: 'feedback',
    icon: Icons.Square,
    description: 'Modal dialog box',
    props: [
      {
        name: 'title',
        type: 'string',
        label: 'Title',
        default: 'Dialog Title',
      },
      {
        name: 'description',
        type: 'string',
        label: 'Description',
        default: 'This is a dialog description',
      },
    ],
    defaultProps: {
      title: 'Dialog Title',
      description: 'This is a dialog description',
    },
    code: (props) => `<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>${props.title}</DialogTitle>
      <DialogDescription>${props.description}</DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>`,
    preview: 'Modal dialog with trigger button',
  },

  tabs: {
    id: 'tabs',
    name: 'Tabs',
    category: 'navigation',
    icon: Icons.Layers,
    description: 'Tabbed interface',
    props: [
      {
        name: 'defaultTab',
        type: 'string',
        label: 'Default Tab',
        default: 'tab1',
      },
    ],
    defaultProps: {
      defaultTab: 'tab1',
    },
    code: (props) => `<Tabs defaultValue="${props.defaultTab}">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
    <TabsTrigger value="tab3">Tab 3</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content for Tab 1</TabsContent>
  <TabsContent value="tab2">Content for Tab 2</TabsContent>
  <TabsContent value="tab3">Content for Tab 3</TabsContent>
</Tabs>`,
    preview: 'Tabbed interface with multiple tabs',
  },

  select: {
    id: 'select',
    name: 'Select',
    category: 'input',
    icon: Icons.ChevronDown,
    description: 'Dropdown select input',
    props: [
      {
        name: 'placeholder',
        type: 'string',
        label: 'Placeholder',
        default: 'Select an option',
      },
    ],
    defaultProps: {
      placeholder: 'Select an option',
    },
    code: (props) => `<Select>
  <SelectTrigger>
    <SelectValue placeholder="${props.placeholder}" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>`,
    preview: 'Dropdown select with options',
  },

  switch: {
    id: 'switch',
    name: 'Switch',
    category: 'input',
    icon: Icons.ToggleLeft,
    description: 'Toggle switch',
    props: [
      {
        name: 'label',
        type: 'string',
        label: 'Label',
        default: 'Enable feature',
      },
    ],
    defaultProps: {
      label: 'Enable feature',
    },
    code: (props) => `<div className="flex items-center space-x-2">
  <Switch id="switch" />
  <Label htmlFor="switch">${props.label}</Label>
</div>`,
    preview: 'Toggle switch with label',
  },

  separator: {
    id: 'separator',
    name: 'Separator',
    category: 'layout',
    icon: Icons.Minus,
    description: 'Visual divider line',
    props: [
      {
        name: 'orientation',
        type: 'select',
        label: 'Orientation',
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
        ],
        default: 'horizontal',
      },
    ],
    defaultProps: {
      orientation: 'horizontal',
    },
    code: (props) => `<Separator orientation="${props.orientation}" />`,
    preview: 'Horizontal or vertical divider',
  },

  avatar: {
    id: 'avatar',
    name: 'Avatar',
    category: 'data-display',
    icon: Icons.User,
    description: 'User avatar image',
    props: [
      {
        name: 'fallback',
        type: 'string',
        label: 'Fallback',
        default: 'AB',
      },
    ],
    defaultProps: {
      fallback: 'AB',
    },
    code: (props) => `<Avatar>
  <AvatarImage src="/avatar.jpg" alt="Avatar" />
  <AvatarFallback>${props.fallback}</AvatarFallback>
</Avatar>`,
    preview: 'User avatar with fallback',
  },

  toast: {
    id: 'toast',
    name: 'Toast',
    category: 'feedback',
    icon: Icons.Bell,
    description: 'Toast notification',
    props: [
      {
        name: 'title',
        type: 'string',
        label: 'Title',
        default: 'Notification',
      },
      {
        name: 'description',
        type: 'string',
        label: 'Description',
        default: 'This is a toast notification',
      },
    ],
    defaultProps: {
      title: 'Notification',
      description: 'This is a toast notification',
    },
    code: (props) => `// Trigger toast
toast({
  title: "${props.title}",
  description: "${props.description}",
})`,
    preview: 'Toast notification trigger',
  },

  accordion: {
    id: 'accordion',
    name: 'Accordion',
    category: 'data-display',
    icon: Icons.ChevronDown,
    description: 'Collapsible accordion',
    props: [
      {
        name: 'type',
        type: 'select',
        label: 'Type',
        options: [
          { label: 'Single', value: 'single' },
          { label: 'Multiple', value: 'multiple' },
        ],
        default: 'single',
      },
    ],
    defaultProps: {
      type: 'single',
    },
    code: (props) => `<Accordion type="${props.type}" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>
      Content for section 1
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>
      Content for section 2
    </AccordionContent>
  </AccordionItem>
</Accordion>`,
    preview: 'Collapsible accordion sections',
  },

  progress: {
    id: 'progress',
    name: 'Progress',
    category: 'feedback',
    icon: Icons.Loader,
    description: 'Progress indicator',
    props: [
      {
        name: 'value',
        type: 'number',
        label: 'Value (0-100)',
        default: 50,
      },
    ],
    defaultProps: {
      value: 50,
    },
    code: (props) => `<Progress value={${props.value}} />`,
    preview: 'Progress bar indicator',
  },

  // DaisyUI Components
  'daisyui-hero': {
    id: 'daisyui-hero',
    name: 'Hero Section',
    category: 'layout',
    icon: Icons.Layout,
    description: 'DaisyUI hero section with title and CTA',
    props: [
      {
        name: 'title',
        type: 'string',
        label: 'Title',
        default: 'Hello there',
      },
      {
        name: 'subtitle',
        type: 'string',
        label: 'Subtitle',
        default: 'Provident cupiditate voluptatem',
      },
    ],
    defaultProps: {
      title: 'Hello there',
      subtitle: 'Provident cupiditate voluptatem',
    },
    code: (props) => `<div className="hero min-h-screen bg-base-200">
  <div className="hero-content text-center">
    <div className="max-w-md">
      <h1 className="text-5xl font-bold">${props.title}</h1>
      <p className="py-6">${props.subtitle}</p>
      <button className="btn btn-primary">Get Started</button>
    </div>
  </div>
</div>`,
    preview: 'Hero section with centered content',
  },

  'daisyui-card': {
    id: 'daisyui-card',
    name: 'Card',
    category: 'layout',
    icon: Icons.Square,
    description: 'DaisyUI styled card component',
    props: [
      {
        name: 'title',
        type: 'string',
        label: 'Title',
        default: 'Card Title',
      },
      {
        name: 'compact',
        type: 'boolean',
        label: 'Compact',
        default: false,
      },
    ],
    defaultProps: {
      title: 'Card Title',
      compact: false,
    },
    code: (props) => `<div className="card bg-base-100 shadow-xl${props.compact ? ' card-compact' : ''}">
  <div className="card-body">
    <h2 className="card-title">${props.title}</h2>
    <p>Card content goes here</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Action</button>
    </div>
  </div>
</div>`,
    preview: 'DaisyUI card with actions',
  },

  'daisyui-navbar': {
    id: 'daisyui-navbar',
    name: 'Navbar',
    category: 'navigation',
    icon: Icons.Menu,
    description: 'DaisyUI navigation bar',
    props: [
      {
        name: 'title',
        type: 'string',
        label: 'Title',
        default: 'MyApp',
      },
    ],
    defaultProps: {
      title: 'MyApp',
    },
    code: (props) => `<div className="navbar bg-base-100">
  <div className="flex-1">
    <a className="btn btn-ghost text-xl">${props.title}</a>
  </div>
  <div className="flex-none">
    <button className="btn btn-square btn-ghost">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>
  </div>
</div>`,
    preview: 'Navigation bar with menu',
  },

  'daisyui-button': {
    id: 'daisyui-button',
    name: 'Button',
    category: 'input',
    icon: Icons.MousePointer2,
    description: 'DaisyUI button component',
    props: [
      {
        name: 'text',
        type: 'string',
        label: 'Text',
        default: 'Button',
      },
      {
        name: 'color',
        type: 'select',
        label: 'Color',
        options: [
          { label: 'Primary', value: 'btn-primary' },
          { label: 'Secondary', value: 'btn-secondary' },
          { label: 'Accent', value: 'btn-accent' },
          { label: 'Info', value: 'btn-info' },
          { label: 'Success', value: 'btn-success' },
          { label: 'Warning', value: 'btn-warning' },
          { label: 'Error', value: 'btn-error' },
        ],
        default: 'btn-primary',
      },
    ],
    defaultProps: {
      text: 'Button',
      color: 'btn-primary',
    },
    code: (props) => `<button className="btn ${props.color}">${props.text}</button>`,
    preview: 'DaisyUI button with colors',
  },

  'daisyui-modal': {
    id: 'daisyui-modal',
    name: 'Modal',
    category: 'feedback',
    icon: Icons.Square,
    description: 'DaisyUI modal dialog',
    props: [
      {
        name: 'title',
        type: 'string',
        label: 'Title',
        default: 'Modal Title',
      },
    ],
    defaultProps: {
      title: 'Modal Title',
    },
    code: (props) => `<dialog id="my_modal" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">${props.title}</h3>
    <p className="py-4">Press ESC key or click outside to close</p>
    <div className="modal-action">
      <form method="dialog">
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>`,
    preview: 'Modal dialog with close action',
  },

  'daisyui-drawer': {
    id: 'daisyui-drawer',
    name: 'Drawer',
    category: 'navigation',
    icon: Icons.PanelLeft,
    description: 'DaisyUI side drawer',
    props: [
      {
        name: 'side',
        type: 'select',
        label: 'Side',
        options: [
          { label: 'Left', value: 'drawer-start' },
          { label: 'Right', value: 'drawer-end' },
        ],
        default: 'drawer-start',
      },
    ],
    defaultProps: {
      side: 'drawer-start',
    },
    code: (props) => `<div className="drawer ${props.side}">
  <input id="my-drawer" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content">
    <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Open drawer</label>
  </div>
  <div className="drawer-side">
    <label htmlFor="my-drawer" className="drawer-overlay"></label>
    <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
      <li><a>Sidebar Item 1</a></li>
      <li><a>Sidebar Item 2</a></li>
    </ul>
  </div>
</div>`,
    preview: 'Side drawer navigation',
  },

  'daisyui-stats': {
    id: 'daisyui-stats',
    name: 'Stats',
    category: 'data-display',
    icon: Icons.BarChart,
    description: 'DaisyUI stats display',
    props: [
      {
        name: 'horizontal',
        type: 'boolean',
        label: 'Horizontal',
        default: false,
      },
    ],
    defaultProps: {
      horizontal: false,
    },
    code: (props) => `<div className="stats shadow${props.horizontal ? '' : ' stats-vertical'}">
  <div className="stat">
    <div className="stat-title">Total Views</div>
    <div className="stat-value">89,400</div>
    <div className="stat-desc">21% more than last month</div>
  </div>
  <div className="stat">
    <div className="stat-title">Total Users</div>
    <div className="stat-value">4,200</div>
    <div className="stat-desc">↗︎ 400 (22%)</div>
  </div>
</div>`,
    preview: 'Statistics display cards',
  },

  'daisyui-badge': {
    id: 'daisyui-badge',
    name: 'Badge',
    category: 'feedback',
    icon: Icons.Tag,
    description: 'DaisyUI badge component',
    props: [
      {
        name: 'text',
        type: 'string',
        label: 'Text',
        default: 'Badge',
      },
      {
        name: 'color',
        type: 'select',
        label: 'Color',
        options: [
          { label: 'Primary', value: 'badge-primary' },
          { label: 'Secondary', value: 'badge-secondary' },
          { label: 'Accent', value: 'badge-accent' },
          { label: 'Success', value: 'badge-success' },
          { label: 'Warning', value: 'badge-warning' },
          { label: 'Error', value: 'badge-error' },
        ],
        default: 'badge-primary',
      },
    ],
    defaultProps: {
      text: 'Badge',
      color: 'badge-primary',
    },
    code: (props) => `<span className="badge ${props.color}">${props.text}</span>`,
    preview: 'Status badge',
  },

  // Flowbite Components
  'flowbite-navbar': {
    id: 'flowbite-navbar',
    name: 'Navbar',
    category: 'navigation',
    icon: Icons.Menu,
    description: 'Flowbite navigation bar',
    props: [
      {
        name: 'brand',
        type: 'string',
        label: 'Brand Name',
        default: 'Flowbite',
      },
    ],
    defaultProps: {
      brand: 'Flowbite',
    },
    code: (props) => `<nav className="bg-white border-gray-200 dark:bg-gray-900">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">${props.brand}</span>
    <button type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
      <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
      </svg>
    </button>
  </div>
</nav>`,
    preview: 'Responsive navigation bar',
  },

  'flowbite-card': {
    id: 'flowbite-card',
    name: 'Card',
    category: 'layout',
    icon: Icons.Square,
    description: 'Flowbite card component',
    props: [
      {
        name: 'title',
        type: 'string',
        label: 'Title',
        default: 'Noteworthy technology',
      },
    ],
    defaultProps: {
      title: 'Noteworthy technology',
    },
    code: (props) => `<div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${props.title}</h5>
  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions.</p>
  <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
    Read more
  </button>
</div>`,
    preview: 'Content card with action',
  },

  'flowbite-button': {
    id: 'flowbite-button',
    name: 'Button',
    category: 'input',
    icon: Icons.MousePointer2,
    description: 'Flowbite button component',
    props: [
      {
        name: 'text',
        type: 'string',
        label: 'Text',
        default: 'Button',
      },
      {
        name: 'color',
        type: 'select',
        label: 'Color',
        options: [
          { label: 'Blue', value: 'blue' },
          { label: 'Green', value: 'green' },
          { label: 'Red', value: 'red' },
          { label: 'Yellow', value: 'yellow' },
          { label: 'Purple', value: 'purple' },
        ],
        default: 'blue',
      },
    ],
    defaultProps: {
      text: 'Button',
      color: 'blue',
    },
    code: (props) => `<button type="button" className="text-white bg-${props.color}-700 hover:bg-${props.color}-800 focus:ring-4 focus:ring-${props.color}-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-${props.color}-600 dark:hover:bg-${props.color}-700 focus:outline-none dark:focus:ring-${props.color}-800">${props.text}</button>`,
    preview: 'Styled button with colors',
  },

  'flowbite-alert': {
    id: 'flowbite-alert',
    name: 'Alert',
    category: 'feedback',
    icon: Icons.AlertCircle,
    description: 'Flowbite alert component',
    props: [
      {
        name: 'message',
        type: 'string',
        label: 'Message',
        default: 'Info alert! Change a few things up.',
      },
      {
        name: 'type',
        type: 'select',
        label: 'Type',
        options: [
          { label: 'Info', value: 'blue' },
          { label: 'Success', value: 'green' },
          { label: 'Warning', value: 'yellow' },
          { label: 'Error', value: 'red' },
        ],
        default: 'blue',
      },
    ],
    defaultProps: {
      message: 'Info alert! Change a few things up.',
      type: 'blue',
    },
    code: (props) => `<div className="p-4 mb-4 text-sm text-${props.type}-800 rounded-lg bg-${props.type}-50 dark:bg-gray-800 dark:text-${props.type}-400" role="alert">
  ${props.message}
</div>`,
    preview: 'Alert notification',
  },

  'flowbite-breadcrumb': {
    id: 'flowbite-breadcrumb',
    name: 'Breadcrumb',
    category: 'navigation',
    icon: Icons.ChevronRight,
    description: 'Flowbite breadcrumb navigation',
    props: [],
    defaultProps: {},
    code: () => `<nav className="flex" aria-label="Breadcrumb">
  <ol className="inline-flex items-center space-x-1 md:space-x-3">
    <li className="inline-flex items-center">
      <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
        Home
      </a>
    </li>
    <li>
      <div className="flex items-center">
        <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" viewBox="0 0 6 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
        </svg>
        <a href="#" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">Projects</a>
      </div>
    </li>
  </ol>
</nav>`,
    preview: 'Breadcrumb navigation trail',
  },
};

/**
 * Component Library Organization
 */
export interface ComponentLibraryInfo {
  id: string;
  name: string;
  description: string;
  website: string;
  logo?: string;
  components: string[]; // component IDs
}

export const COMPONENT_LIBRARIES: Record<string, ComponentLibraryInfo> = {
  'shadcn': {
    id: 'shadcn',
    name: 'shadcn/ui',
    description: 'Re-usable components built with Radix UI and Tailwind CSS',
    website: 'https://ui.shadcn.com',
    components: [
      'shadcnButton',
      'dialog',
      'tabs',
      'select',
      'switch',
      'separator',
      'avatar',
      'toast',
      'accordion',
      'progress'
    ]
  },
  'daisyui': {
    id: 'daisyui',
    name: 'DaisyUI',
    description: 'The most popular component library for Tailwind CSS',
    website: 'https://daisyui.com',
    components: [
      'daisyui-hero',
      'daisyui-card',
      'daisyui-navbar',
      'daisyui-button',
      'daisyui-modal',
      'daisyui-drawer',
      'daisyui-stats',
      'daisyui-badge'
    ]
  },
  'flowbite': {
    id: 'flowbite',
    name: 'Flowbite',
    description: 'Build websites even faster with components on top of Tailwind CSS',
    website: 'https://flowbite.com',
    components: [
      'flowbite-navbar',
      'flowbite-card',
      'flowbite-button',
      'flowbite-alert',
      'flowbite-breadcrumb'
    ]
  },
  'basic': {
    id: 'basic',
    name: 'Basic Components',
    description: 'Essential building blocks for any application',
    website: '',
    components: [
      'container',
      'card',
      'searchBar',
      'listItem',
      'table',
      'textInput',
      'button',
      'alert',
      'badge'
    ]
  }
};

/**
 * Component Builder Utils
 */
export class ComponentBuilder {
  /**
   * Generate component code from canvas state
   */
  static generateComponentCode(canvas: CanvasState): string {
    const sortedComponents = this.sortComponentsByHierarchy(canvas.components);
    
    let code = '';
    for (const component of sortedComponents) {
      const definition = COMPONENT_LIBRARY[component.componentId];
      if (definition) {
        code += definition.code(component.props) + '\n\n';
      }
    }
    
    return code;
  }

  /**
   * Sort components by parent-child hierarchy
   */
  private static sortComponentsByHierarchy(components: DroppedComponent[]): DroppedComponent[] {
    const sorted: DroppedComponent[] = [];
    const processed = new Set<string>();
    
    const processComponent = (comp: DroppedComponent) => {
      if (processed.has(comp.id)) return;
      
      // Process parent first
      if (comp.parentId) {
        const parent = components.find(c => c.id === comp.parentId);
        if (parent && !processed.has(parent.id)) {
          processComponent(parent);
        }
      }
      
      sorted.push(comp);
      processed.add(comp.id);
    };
    
    for (const component of components) {
      processComponent(component);
    }
    
    return sorted;
  }

  /**
   * Validate component placement
   */
  static validatePlacement(
    component: DroppedComponent,
    canvas: CanvasState
  ): { valid: boolean; error?: string } {
    // Check bounds
    if (component.x < 0 || component.y < 0) {
      return { valid: false, error: 'Component outside canvas bounds' };
    }

    // Check for overlaps (if needed)
    const overlapping = canvas.components.find(c => 
      c.id !== component.id &&
      this.checkOverlap(component, c)
    );

    if (overlapping) {
      return { valid: false, error: 'Component overlaps with another' };
    }

    return { valid: true };
  }

  /**
   * Check if two components overlap
   */
  private static checkOverlap(a: DroppedComponent, b: DroppedComponent): boolean {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  }

  /**
   * Snap component to grid
   */
  static snapToGrid(x: number, y: number, gridSize: number = 8): { x: number; y: number } {
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize,
    };
  }

  /**
   * Get component categories
   */
  static getCategories(): ComponentCategory[] {
    return ['layout', 'navigation', 'data-display', 'input', 'feedback', 'media', 'advanced'];
  }

  /**
   * Get components by category
   */
  static getComponentsByCategory(category: ComponentCategory): ComponentDefinition[] {
    return Object.values(COMPONENT_LIBRARY).filter(c => c.category === category);
  }

  /**
   * Export canvas as JSON
   */
  static exportCanvas(canvas: CanvasState): string {
    return JSON.stringify(canvas, null, 2);
  }

  /**
   * Import canvas from JSON
   */
  static importCanvas(json: string): CanvasState | null {
    try {
      return JSON.parse(json);
    } catch (e) {
      console.error('Failed to import canvas:', e);
      return null;
    }
  }
}

export default ComponentBuilder;
