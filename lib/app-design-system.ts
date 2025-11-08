
/**
 * Unified App Design System
 * 
 * This file defines a harmonious, consistent design language for all apps in the system.
 * - All icons from Lucide React (unified family)
 * - Carefully curated color palette with semantic meaning
 * - Consistent sizing, spacing, and presentation
 */

import {
  Home,
  Sparkles,
  Bell,
  User,
  CreditCard,
  FileText,
  Users,
  Store,
  ShieldCheck,
  Mail,
  Building2,
  Settings,
  Calendar,
  MessageSquare,
  StickyNote,
  CheckSquare,
  DollarSign,
  UserCircle,
  Package,
  Briefcase,
  TrendingUp,
  Heart,
  Award,
  Target,
  Zap,
  Globe,
  Share2,
  Activity,
  BarChart3,
  PieChart,
  Database,
  Wifi,
  Camera,
  Lightbulb,
  ThermometerSun,
  Droplets,
  Wind,
  Lock,
  Key,
  Shield,
  Smartphone,
  Tv,
  MessageCircle,
  Phone,
  Video,
  Image as ImageIcon,
  Music,
  BookOpen,
  Newspaper,
  MapPin,
  Navigation,
  Cloud,
  Sun,
  Moon,
  Palette,
  Wrench,
  Box,
  Layers,
  Grid,
  List,
  Filter,
  Search,
  Plus,
  Minus,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Rocket,
  HelpCircle,
  Code,
  LucideIcon
} from 'lucide-react';

/**
 * App Icon Mapping
 * All icons from Lucide React for visual harmony
 */
export const APP_ICONS = {
  // Core/Essential Apps
  home: Home,
  assistant: Sparkles,
  notifications: Bell,
  help: HelpCircle,
  
  // Personal Apps
  profile: User,
  payments: CreditCard,
  household: Users,
  
  // Community Apps
  documents: FileText,
  directory: Users,
  community: Building2,
  announcements: Bell,
  myCommunity: Heart,
  
  // Communication Apps
  messages: Mail,
  chat: MessageCircle,
  forum: MessageSquare,
  email: Mail,
  
  // Productivity Apps
  calendar: Calendar,
  tasks: CheckSquare,
  notes: StickyNote,
  brandy: Palette,
  
  // Marketplace & Services
  marketplace: Store,
  buildingServices: Activity,
  
  // Admin Apps
  admin: ShieldCheck,
  superAdmin: Shield,
  userManagement: UserCircle,
  paymentManagement: DollarSign,
  analytics: BarChart3,
  reports: PieChart,
  accounting: DollarSign,
  budgeting: TrendingUp,
  
  // Settings & Configuration
  settings: Settings,
  systemConfig: Wrench,
  externalConnections: Globe,
  onboarding: Rocket,
  
  // Resident Portal
  residentPortal: Globe,
  
  // Developer & Platform Tools
  developer: Code,

  // Utility Icons (for UI elements)
  search: Search,
  filter: Filter,
  sort: List,
  grid: Grid,
  close: X,
  check: Check,
  info: BookOpen,
  star: Award,
  new: Sparkles,
} as const;

export type AppIconKey = keyof typeof APP_ICONS;

/**
 * Harmonious Color Palette
 * Each color is carefully chosen to be visually distinct yet harmonious
 * Colors follow accessibility guidelines (WCAG 2.2 AA)
 */
export const APP_COLORS = {
  // Core/Essential - Blues (trustworthy, primary)
  home: {
    light: 'from-sky-400 via-blue-500 to-indigo-500',
    main: '#3B82F6',
    contrast: '#ffffff',
    category: 'primary'
  },
  assistant: {
    light: 'from-amber-400 via-orange-500 to-rose-500',
    main: '#F97316',
    contrast: '#ffffff',
    category: 'accent'
  },
  notifications: {
    light: 'from-rose-400 via-pink-500 to-fuchsia-500',
    main: '#EC4899',
    contrast: '#ffffff',
    category: 'alert'
  },
  help: {
    light: 'from-violet-400 via-purple-500 to-fuchsia-500',
    main: '#A855F7',
    contrast: '#ffffff',
    category: 'support'
  },
  
  // Personal - Purples & Indigos (personal, identity)
  profile: {
    light: 'from-violet-400 via-purple-500 to-indigo-500',
    main: '#8B5CF6',
    contrast: '#ffffff',
    category: 'personal'
  },
  payments: {
    light: 'from-emerald-400 via-green-500 to-teal-500',
    main: '#10B981',
    contrast: '#ffffff',
    category: 'financial'
  },
  household: {
    light: 'from-purple-400 via-violet-500 to-purple-600',
    main: '#A855F7',
    contrast: '#ffffff',
    category: 'personal'
  },
  
  // Community - Teals & Cyans (connection, social)
  documents: {
    light: 'from-blue-400 via-indigo-500 to-violet-500',
    main: '#6366F1',
    contrast: '#ffffff',
    category: 'resource'
  },
  directory: {
    light: 'from-cyan-400 via-sky-500 to-blue-500',
    main: '#06B6D4',
    contrast: '#ffffff',
    category: 'social'
  },
  community: {
    light: 'from-teal-400 via-cyan-500 to-sky-500',
    main: '#14B8A6',
    contrast: '#ffffff',
    category: 'social'
  },
  myCommunity: {
    light: 'from-pink-400 via-rose-500 to-red-500',
    main: '#F43F5E',
    contrast: '#ffffff',
    category: 'social'
  },
  
  // Communication - Oranges & Ambers (warmth, connection)
  messages: {
    light: 'from-amber-400 via-yellow-500 to-orange-500',
    main: '#F59E0B',
    contrast: '#ffffff',
    category: 'communication'
  },
  chat: {
    light: 'from-orange-400 via-amber-500 to-yellow-500',
    main: '#FB923C',
    contrast: '#ffffff',
    category: 'communication'
  },
  forum: {
    light: 'from-yellow-400 via-orange-500 to-red-500',
    main: '#FBBF24',
    contrast: '#000000',
    category: 'communication'
  },
  
  // Productivity - Greens (growth, productivity)
  calendar: {
    light: 'from-lime-400 via-green-500 to-emerald-500',
    main: '#84CC16',
    contrast: '#000000',
    category: 'productivity'
  },
  tasks: {
    light: 'from-green-400 via-emerald-500 to-teal-500',
    main: '#22C55E',
    contrast: '#ffffff',
    category: 'productivity'
  },
  notes: {
    light: 'from-yellow-300 via-amber-400 to-orange-400',
    main: '#FCD34D',
    contrast: '#000000',
    category: 'productivity'
  },
  brandy: {
    light: 'from-teal-600 via-teal-700 to-orange-600',
    gradient: 'linear-gradient(135deg, #2A4A4D 0%, #C87137 100%)',
    main: '#2A4A4D',
    contrast: '#ffffff',
    category: 'productivity'
  },
  
  // Marketplace & Services - Magentas & Purples (premium, special)
  marketplace: {
    light: 'from-fuchsia-400 via-pink-500 to-purple-500',
    main: '#D946EF',
    contrast: '#ffffff',
    category: 'premium'
  },
  buildingServices: {
    light: 'from-sky-400 via-blue-500 to-cyan-500',
    main: '#0EA5E9',
    contrast: '#ffffff',
    category: 'service'
  },
  
  // Admin - Reds & Roses (authority, power)
  admin: {
    light: 'from-red-400 via-rose-500 to-pink-500',
    main: '#EF4444',
    contrast: '#ffffff',
    category: 'admin'
  },
  superAdmin: {
    light: 'from-red-600 via-rose-700 to-pink-700',
    main: '#DC2626',
    contrast: '#ffffff',
    category: 'admin'
  },
  userManagement: {
    light: 'from-rose-400 via-red-500 to-orange-500',
    main: '#F87171',
    contrast: '#ffffff',
    category: 'admin'
  },
  paymentManagement: {
    light: 'from-emerald-500 via-teal-600 to-cyan-600',
    main: '#059669',
    contrast: '#ffffff',
    category: 'admin'
  },
  accounting: {
    light: 'from-blue-500 via-indigo-600 to-violet-600',
    main: '#3B82F6',
    contrast: '#ffffff',
    category: 'admin'
  },
  budgeting: {
    light: 'from-purple-500 via-violet-600 to-indigo-600',
    main: '#8B5CF6',
    contrast: '#ffffff',
    category: 'admin'
  },
  
  // Settings - Grays & Slates (neutral, utility)
  settings: {
    light: 'from-slate-400 via-gray-500 to-zinc-500',
    main: '#64748B',
    contrast: '#ffffff',
    category: 'utility'
  },
  systemConfig: {
    light: 'from-zinc-400 via-slate-500 to-gray-500',
    main: '#71717A',
    contrast: '#ffffff',
    category: 'utility'
  },
  externalConnections: {
    light: 'from-lime-400 via-green-500 to-emerald-500',
    main: '#84CC16',
    contrast: '#000000',
    category: 'utility'
  },
  onboarding: {
    light: 'from-violet-400 via-purple-500 to-fuchsia-500',
    main: '#A855F7',
    contrast: '#ffffff',
    category: 'admin'
  },
  residentPortal: {
    light: 'from-cyan-400 via-blue-500 to-indigo-500',
    main: '#06B6D4',
    contrast: '#ffffff',
    category: 'community'
  },
  developer: {
    light: 'from-violet-500 via-purple-500 to-fuchsia-500',
    main: '#8B5CF6',
    contrast: '#ffffff',
    category: 'developer'
  },
} as const;

export type AppColorKey = keyof typeof APP_COLORS;

/**
 * Consistent Sizing Standards
 */
export const APP_SIZES = {
  // Icon sizes
  icon: {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
    xlarge: 'w-7 h-7',
    xxlarge: 'w-8 h-8',
  },
  
  // App card sizes (in grid launcher)
  card: {
    compact: 'w-full h-16',
    comfortable: 'w-full h-20',
    spacious: 'w-full h-24',
  },
  
  // Dock item sizes
  dock: {
    small: 'w-12 h-12',
    medium: 'w-14 h-14',
    large: 'w-16 h-16',
  },
  
  // Widget sizes
  widget: {
    small: 'w-full h-32',
    medium: 'w-full h-48',
    large: 'w-full h-64',
  },
} as const;

/**
 * Spacing Standards
 */
export const APP_SPACING = {
  // Padding
  padding: {
    tight: 'p-2',
    normal: 'p-3',
    relaxed: 'p-4',
    loose: 'p-6',
  },
  
  // Gap (for flex/grid layouts)
  gap: {
    tight: 'gap-2',
    normal: 'gap-3',
    relaxed: 'gap-4',
    loose: 'gap-6',
  },
  
  // Margin
  margin: {
    tight: 'm-2',
    normal: 'm-3',
    relaxed: 'm-4',
    loose: 'm-6',
  },
} as const;

/**
 * Border Radius Standards
 */
export const APP_RADIUS = {
  small: 'rounded-lg',
  medium: 'rounded-xl',
  large: 'rounded-2xl',
  xlarge: 'rounded-3xl',
  full: 'rounded-full',
} as const;

/**
 * Shadow Standards
 */
export const APP_SHADOWS = {
  small: 'shadow-sm',
  medium: 'shadow-md',
  large: 'shadow-lg',
  xlarge: 'shadow-xl',
  xxlarge: 'shadow-2xl',
} as const;

/**
 * Animation Standards
 */
export const APP_ANIMATIONS = {
  transition: {
    fast: 'transition-all duration-150 ease-out',
    normal: 'transition-all duration-300 ease-out',
    slow: 'transition-all duration-500 ease-out',
  },
  
  hover: {
    scale: 'hover:scale-105',
    scaleSmall: 'hover:scale-102',
    lift: 'hover:-translate-y-1',
    glow: 'hover:shadow-2xl',
  },
  
  active: {
    scale: 'active:scale-95',
    press: 'active:translate-y-0.5',
  },
} as const;

/**
 * Typography Standards
 */
export const APP_TYPOGRAPHY = {
  title: {
    small: 'text-sm font-semibold',
    medium: 'text-base font-semibold',
    large: 'text-lg font-semibold',
    xlarge: 'text-xl font-bold',
  },
  
  body: {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  },
  
  label: {
    small: 'text-xs font-medium',
    medium: 'text-sm font-medium',
    large: 'text-base font-medium',
  },
} as const;

/**
 * Helper function to get app icon component
 */
export function getAppIcon(iconKey: AppIconKey): LucideIcon {
  return APP_ICONS[iconKey] || Home;
}

/**
 * Helper function to get app color
 */
export function getAppColor(colorKey: AppColorKey) {
  return APP_COLORS[colorKey] || APP_COLORS.home;
}

/**
 * Helper function to create consistent app card classes
 */
export function getAppCardClasses(variant: 'compact' | 'comfortable' | 'spacious' = 'comfortable') {
  return {
    container: `${APP_SIZES.card[variant]} ${APP_RADIUS.large} ${APP_SHADOWS.medium} ${APP_ANIMATIONS.transition.normal} ${APP_ANIMATIONS.hover.scale} ${APP_ANIMATIONS.active.scale}`,
    icon: APP_SIZES.icon.large,
    title: APP_TYPOGRAPHY.title.medium,
    description: APP_TYPOGRAPHY.body.small,
  };
}

/**
 * Helper function to create consistent dock item classes
 */
export function getDockItemClasses(size: 'small' | 'medium' | 'large' = 'medium') {
  return {
    container: `${APP_SIZES.dock[size]} ${APP_RADIUS.large} ${APP_ANIMATIONS.transition.normal} ${APP_ANIMATIONS.hover.scale} ${APP_ANIMATIONS.active.scale}`,
    icon: APP_SIZES.icon.xlarge,
  };
}

export default {
  APP_ICONS,
  APP_COLORS,
  APP_SIZES,
  APP_SPACING,
  APP_RADIUS,
  APP_SHADOWS,
  APP_ANIMATIONS,
  APP_TYPOGRAPHY,
  getAppIcon,
  getAppColor,
  getAppCardClasses,
  getDockItemClasses,
};
