/**
 * Brandy Integrated Types
 * Type definitions for Brand Strategist + Web Builder
 */

// ============================================================================
// BRAND BRIEF TYPES
// ============================================================================

export type BrandArchetype =
  | 'The Innocent'
  | 'The Explorer'
  | 'The Sage'
  | 'The Hero'
  | 'The Outlaw'
  | 'The Magician'
  | 'The Regular Person'
  | 'The Lover'
  | 'The Jester'
  | 'The Caregiver'
  | 'The Creator'
  | 'The Ruler';

export interface BrandBrief {
  // Core brand information
  brandName: string;
  industry: string;
  brandArchetype: BrandArchetype;
  coreValues: string[];

  // Target audience
  targetAudienceProfile: string;
  targetAudienceAge?: string;
  targetAudienceLocation?: string;
  targetAudienceInterests?: string;

  // Brand voice and personality
  brandPersonality: string[];
  emotionalTone?: string;

  // Design preferences
  logoVision: string;
  logoStyle?: string;
  preferredColors?: string[];
  avoidColors?: string[];

  // Competitive context
  competitors?: string[];
  differentiators?: string;

  // Additional context
  missionStatement?: string;
  taglineIdeas?: string[];
  keywords?: string[];
}

// ============================================================================
// LOGO GENERATION TYPES
// ============================================================================

export interface LogoVariation {
  id: string;
  name: string;
  imageUrl: string;
  description: string;
}

export interface LogoConcept {
  id: string;
  name: string;
  rationale: string;
  main: string; // Image URL or base64
  variations: LogoVariation[];
  archetype: BrandArchetype;
  feedback?: {
    liked: boolean;
    comment?: string;
  };
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: {
    hex: string;
    name: string;
    role: 'primary' | 'secondary' | 'accent' | 'background' | 'text';
  }[];
  description: string;
}

export interface InspirationImage {
  url: string;
  description?: string;
}

// ============================================================================
// BRAND IDENTITY TYPES
// ============================================================================

export interface BrandVoice {
  name: string;
  description: string;
}

export interface Typography {
  headlineFont: string;
  bodyFont: string;
  rationale?: string;
}

export interface MessagingPillar {
  title: string;
  description: string;
}

export interface BrandIdentity {
  voice: BrandVoice;
  typography: Typography;
  messagingPillars: MessagingPillar[];
  taglines: string[];
  logoUsageGuidelines?: string;
  colorPalettes?: ColorPalette[];
}

export interface GenerateBrandIdentityRequest {
  base64ImageData: string;
  mimeType: string;
  brandName: string;
  industry: string;
  brandArchetype: BrandArchetype;
  coreValues: string[];
  logoVision: string;
  targetAudienceProfile: string;
}

// ============================================================================
// LOGO ANIMATION TYPES
// ============================================================================

export interface LogoAnimation {
  id: string;
  videoUrl: string;
  aspectRatio: '16:9' | '9:16';
  prompt: string;
  createdAt: string;
}

// ============================================================================
// SAVED LOGO PROJECT TYPES
// ============================================================================

export interface SavedLogo {
  id: string;
  brief: BrandBrief;
  concepts: LogoConcept[];
  selectedConceptId?: string;
  identity?: BrandIdentity;
  colorPalettes?: ColorPalette[];
  animations?: LogoAnimation[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// WEBSITE GENERATION TYPES
// ============================================================================

export type TemplateType =
  | 'landing'
  | 'business'
  | 'portfolio'
  | 'ecommerce'
  | 'blog'
  | 'saas'
  | 'restaurant'
  | 'agency';

export interface WebsitePage {
  id: string;
  name: string;
  slug: string;
  content: string; // Full HTML content
  description?: string;
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    scale: number;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface AssetCollection {
  logo?: string; // Base64 or URL
  images: {
    id: string;
    url: string;
    alt: string;
  }[];
  icons: {
    id: string;
    name: string;
  }[];
}

export interface WebsiteProject {
  id: string;
  name: string;
  logoId?: string; // Reference to SavedLogo
  createdAt: string;
  updatedAt?: string;
  pages: WebsitePage[];
  theme: ThemeConfig;
  assets: AssetCollection;
  templateType?: TemplateType;
}

export interface WebGenerationInput {
  brief: BrandBrief;
  identity?: BrandIdentity;
  logoBase64: string;
  logoMimeType: string;
  description: string;
  templateType: TemplateType;
  pages: string[]; // Page names to generate
}

export interface WebGenerationOutput {
  pages: WebsitePage[];
  theme: ThemeConfig;
  assets: AssetCollection;
}

// ============================================================================
// APP STATE TYPES
// ============================================================================

export type AppMode = 'logo' | 'web' | 'guidelines';

export type AppView =
  | 'welcome'
  | 'brief'
  | 'logo-generation'
  | 'logo-refinement'
  | 'studio'
  | 'web-builder';

export interface StudioState {
  activeLogo: SavedLogo | null;
  selectedImage: string | null; // Base64 or URL
  selectedVariation: LogoVariation | null;
  contextualSuggestions: string[];
}

export interface StudioErrors {
  generation?: ApiError;
  edit?: ApiError;
  identity?: ApiError;
  animation?: ApiError;
  website?: ApiError;
}

export interface StudioLoading {
  generating: boolean;
  editing: boolean;
  generatingIdentity: boolean;
  generatingAnimation: boolean;
  generatingWebsite: boolean;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export type ErrorType =
  | 'RATE_LIMIT'
  | 'BLOCKED'
  | 'INVALID_KEY'
  | 'GENERIC'
  | 'FORM_VALIDATION'
  | 'NETWORK'
  | 'TIMEOUT';

export interface ApiError {
  message: string;
  type: ErrorType;
  details?: string;
  retryable?: boolean;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface GenerateLogosResponse {
  concepts: LogoConcept[];
}

export interface EditLogoResponse {
  imageData: string; // Base64
}

export interface GenerateVariationsResponse {
  variations: LogoVariation[];
}

export interface GeneratePalettesResponse {
  palettes: ColorPalette[];
}

export interface GenerateVideoResponse {
  videoUrl: string;
}

// ============================================================================
// UI COMPONENT PROPS
// ============================================================================

export interface BrandBriefFormProps {
  initialBrief?: Partial<BrandBrief>;
  onSubmit: (brief: BrandBrief) => void;
  onBack?: () => void;
}

export interface LogoStudioProps {
  logo: SavedLogo;
  onUpdate: (logo: SavedLogo) => void;
  onSwitchToWeb: () => void;
}

export interface WebBuilderProps {
  project: WebsiteProject | null;
  logo: SavedLogo | undefined;
  onSave: (project: WebsiteProject) => void;
  onBack: () => void;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface ProgressCallback {
  (progress: number, message?: string): void;
}

export interface GenerationOptions {
  maxRetries?: number;
  timeout?: number;
  onProgress?: ProgressCallback;
}

// ============================================================================
// CONSTANTS TYPES
// ============================================================================

export interface ArchetypeInfo {
  name: BrandArchetype;
  description: string;
  traits: string[];
  examples: string[];
}

export interface TemplateInfo {
  id: TemplateType;
  name: string;
  description: string;
  defaultPages: string[];
  icon: string;
}
