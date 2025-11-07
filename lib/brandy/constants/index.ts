/**
 * Brandy Constants
 * Brand archetypes, templates, and other static data
 */

import { ArchetypeInfo, BrandArchetype, TemplateInfo, TemplateType } from '../types';

// ============================================================================
// BRAND ARCHETYPES
// ============================================================================

export const BRAND_ARCHETYPES: ArchetypeInfo[] = [
  {
    name: 'The Innocent',
    description: 'Optimistic, pure, and trustworthy. Seeks happiness and simplicity.',
    traits: ['Optimistic', 'Honest', 'Simple', 'Traditional'],
    examples: ['Coca-Cola', 'Dove', 'Aveeno'],
  },
  {
    name: 'The Explorer',
    description: 'Adventurous, ambitious, and independent. Values freedom and discovery.',
    traits: ['Adventurous', 'Independent', 'Authentic', 'Bold'],
    examples: ['The North Face', 'Jeep', 'Patagonia'],
  },
  {
    name: 'The Sage',
    description: 'Wise, knowledgeable, and thoughtful. Seeks truth and understanding.',
    traits: ['Knowledgeable', 'Thoughtful', 'Analytical', 'Wise'],
    examples: ['Google', 'BBC', 'MIT'],
  },
  {
    name: 'The Hero',
    description: 'Courageous, bold, and determined. Inspires others through action.',
    traits: ['Courageous', 'Strong', 'Inspiring', 'Confident'],
    examples: ['Nike', 'FedEx', 'Duracell'],
  },
  {
    name: 'The Outlaw',
    description: 'Rebellious, disruptive, and revolutionary. Breaks the rules.',
    traits: ['Rebellious', 'Disruptive', 'Edgy', 'Revolutionary'],
    examples: ['Harley-Davidson', 'Virgin', 'Diesel'],
  },
  {
    name: 'The Magician',
    description: 'Visionary, charismatic, and transformative. Makes dreams come true.',
    traits: ['Visionary', 'Imaginative', 'Transformative', 'Inspiring'],
    examples: ['Apple', 'Disney', 'Tesla'],
  },
  {
    name: 'The Regular Person',
    description: 'Relatable, authentic, and down-to-earth. Values belonging.',
    traits: ['Relatable', 'Authentic', 'Friendly', 'Accessible'],
    examples: ['IKEA', 'Target', 'GAP'],
  },
  {
    name: 'The Lover',
    description: 'Passionate, intimate, and sensual. Creates emotional connections.',
    traits: ['Passionate', 'Intimate', 'Warm', 'Sensual'],
    examples: ['Chanel', 'Victoria\'s Secret', 'Godiva'],
  },
  {
    name: 'The Jester',
    description: 'Playful, humorous, and fun. Brings joy and entertainment.',
    traits: ['Playful', 'Humorous', 'Fun', 'Light-hearted'],
    examples: ['Old Spice', 'M&M\'s', 'Ben & Jerry\'s'],
  },
  {
    name: 'The Caregiver',
    description: 'Compassionate, nurturing, and generous. Protects and cares for others.',
    traits: ['Compassionate', 'Nurturing', 'Generous', 'Protective'],
    examples: ['Johnson & Johnson', 'UNICEF', 'Campbell\'s'],
  },
  {
    name: 'The Creator',
    description: 'Innovative, artistic, and imaginative. Values creativity and expression.',
    traits: ['Innovative', 'Artistic', 'Imaginative', 'Original'],
    examples: ['LEGO', 'Adobe', 'Crayola'],
  },
  {
    name: 'The Ruler',
    description: 'Powerful, responsible, and organized. Values control and stability.',
    traits: ['Powerful', 'Responsible', 'Organized', 'Confident'],
    examples: ['Mercedes-Benz', 'Rolex', 'Microsoft'],
  },
];

export const ARCHETYPE_MAP: Record<BrandArchetype, ArchetypeInfo> = BRAND_ARCHETYPES.reduce(
  (acc, archetype) => {
    acc[archetype.name] = archetype;
    return acc;
  },
  {} as Record<BrandArchetype, ArchetypeInfo>
);

// ============================================================================
// WEBSITE TEMPLATES
// ============================================================================

export const WEBSITE_TEMPLATES: TemplateInfo[] = [
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Single-page conversion-focused site perfect for product launches',
    defaultPages: ['Home'],
    icon: 'target',
  },
  {
    id: 'business',
    name: 'Business Site',
    description: 'Professional multi-page website for established companies',
    defaultPages: ['Home', 'About', 'Services', 'Contact'],
    icon: 'briefcase',
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase your creative work and projects beautifully',
    defaultPages: ['Home', 'Projects', 'About', 'Contact'],
    icon: 'image',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    description: 'Online store with product listings and shopping cart',
    defaultPages: ['Home', 'Shop', 'Product', 'Cart', 'Checkout'],
    icon: 'shopping-cart',
  },
  {
    id: 'blog',
    name: 'Blog',
    description: 'Content-focused site with articles and categories',
    defaultPages: ['Home', 'Blog', 'Post', 'About', 'Contact'],
    icon: 'book',
  },
  {
    id: 'saas',
    name: 'SaaS Product',
    description: 'Features, pricing, and signup flow for software products',
    defaultPages: ['Home', 'Features', 'Pricing', 'About', 'Contact'],
    icon: 'rocket',
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Menu, reservations, and location for food businesses',
    defaultPages: ['Home', 'Menu', 'Reservations', 'Location', 'Contact'],
    icon: 'utensils',
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'Services, case studies, and team showcase',
    defaultPages: ['Home', 'Services', 'Work', 'Team', 'Contact'],
    icon: 'users',
  },
];

export const TEMPLATE_MAP: Record<TemplateType, TemplateInfo> = WEBSITE_TEMPLATES.reduce(
  (acc, template) => {
    acc[template.id] = template;
    return acc;
  },
  {} as Record<TemplateType, TemplateInfo>
);

// ============================================================================
// INDUSTRY OPTIONS
// ============================================================================

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Food & Beverage',
  'Fashion',
  'Real Estate',
  'Automotive',
  'Entertainment',
  'Travel & Hospitality',
  'Sports & Fitness',
  'Beauty & Cosmetics',
  'Home & Garden',
  'Professional Services',
  'Non-Profit',
  'Other',
];

// ============================================================================
// BRAND PERSONALITY TRAITS
// ============================================================================

export const PERSONALITY_TRAITS = [
  'Professional',
  'Friendly',
  'Innovative',
  'Trustworthy',
  'Bold',
  'Playful',
  'Sophisticated',
  'Authentic',
  'Energetic',
  'Calm',
  'Luxurious',
  'Approachable',
  'Adventurous',
  'Reliable',
  'Creative',
];

// ============================================================================
// LOGO STYLES
// ============================================================================

export const LOGO_STYLES = [
  'Modern & Minimalist',
  'Classic & Timeless',
  'Bold & Geometric',
  'Organic & Natural',
  'Playful & Fun',
  'Elegant & Sophisticated',
  'Tech & Futuristic',
  'Vintage & Retro',
  'Abstract & Artistic',
  'Illustrative',
];

// ============================================================================
// COLOR PREFERENCES
// ============================================================================

export const COLOR_OPTIONS = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Yellow', hex: '#F59E0B' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Gray', hex: '#6B7280' },
  { name: 'Brown', hex: '#92400E' },
  { name: 'Teal', hex: '#14B8A6' },
];

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const DEFAULT_THEME: ThemeConfig = {
  colors: {
    primary: '#F18825', // loomOS orange
    secondary: '#2B8ED9',
    accent: '#F18825',
    background: '#FFFFFF',
    foreground: '#1F2937',
    muted: '#F3F4F6',
  },
  fonts: {
    heading: 'Cambo, Georgia, serif',
    body: 'Titillium Web, system-ui, sans-serif',
  },
  spacing: {
    scale: 1,
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
};

// ============================================================================
// ANIMATION SETTINGS
// ============================================================================

export const LOOM_OS_SPRING = {
  stiffness: 300,
  damping: 25,
  mass: 1,
};

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// ============================================================================
// API SETTINGS
// ============================================================================

export const API_TIMEOUTS = {
  logoGeneration: 60000, // 60 seconds
  editing: 30000, // 30 seconds
  brandIdentity: 45000, // 45 seconds
  webGeneration: 90000, // 90 seconds
  animation: 120000, // 120 seconds
};

export const MAX_RETRIES = 2;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION = {
  brandName: {
    minLength: 2,
    maxLength: 50,
  },
  logoVision: {
    minLength: 10,
    maxLength: 500,
  },
  targetAudience: {
    minLength: 10,
    maxLength: 300,
  },
  coreValues: {
    min: 1,
    max: 5,
  },
};

// Re-export ThemeConfig type
import type { ThemeConfig } from '../types';
