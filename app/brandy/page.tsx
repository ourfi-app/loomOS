// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types
/**
 * Brandy: Integrated Brand Strategist + Web Builder
 * Main application page
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Globe, FileText, ArrowLeft, Download, Plus } from 'lucide-react';
import { WindowFrame } from '@/components/loomos/ui/WindowFrame';
import { BrandBriefProvider, useBrandBrief } from '@/lib/brandy/contexts/BrandBriefContext';
import { LOOM_OS_SPRING } from '@/lib/brandy/constants';
import type {
  SavedLogo,
  WebsiteProject,
  AppMode,
  LogoConcept,
  ApiError,
} from '@/lib/brandy/types';
import {
  generateLogoConcepts,
  generateBrandIdentity,
  editLogo,
} from '@/lib/brandy/services/geminiService';
import {
  generateWebsite,
  exportToStaticSite,
} from '@/lib/brandy/services/geminiWebService';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

function BrandyApp() {
  const { brief, isComplete } = useBrandBrief();

  // App state
  const [appMode, setAppMode] = useState<AppMode>('logo');
  const [savedLogos, setSavedLogos] = useState<SavedLogo[]>([]);
  const [websiteProjects, setWebsiteProjects] = useState<WebsiteProject[]>([]);
  const [activeLogoId, setActiveLogoId] = useState<string | null>(null);
  const [activeWebsiteId, setActiveWebsiteId] = useState<string | null>(null);

  // Generation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationMessage, setGenerationMessage] = useState('');
  const [error, setError] = useState<ApiError | null>(null);

  // Load saved data from localStorage
  useEffect(() => {
    const storedLogos = localStorage.getItem('brandy_saved_logos');
    if (storedLogos) {
      try {
        setSavedLogos(JSON.parse(storedLogos));
      } catch (e) {
        console.error('Failed to load saved logos:', e);
      }
    }

    const storedWebsites = localStorage.getItem('brandy_website_projects');
    if (storedWebsites) {
      try {
        setWebsiteProjects(JSON.parse(storedWebsites));
      } catch (e) {
        console.error('Failed to load saved websites:', e);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('brandy_saved_logos', JSON.stringify(savedLogos));
  }, [savedLogos]);

  useEffect(() => {
    localStorage.setItem('brandy_website_projects', JSON.stringify(websiteProjects));
  }, [websiteProjects]);

  const activeLogo = savedLogos.find(logo => logo.id === activeLogoId);
  const activeWebsite = websiteProjects.find(project => project.id === activeWebsiteId);

  // ============================================================================
  // LOGO GENERATION HANDLERS
  // ============================================================================

  const handleGenerateLogos = useCallback(async () => {
    if (!brief || !isComplete) return;

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);
    setGenerationMessage('Starting generation...');

    try {
      const concepts = await generateLogoConcepts(brief, {
        onProgress: (progress, message) => {
          setGenerationProgress(progress);
          setGenerationMessage(message || '');
        },
      });

      // Create new logo project
      const newLogo: SavedLogo = {
        id: `logo-${Date.now()}`,
        brief,
        concepts,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSavedLogos(prev => [...prev, newLogo]);
      setActiveLogoId(newLogo.id);

    } catch (e) {
      setError(e as ApiError);
    } finally {
      setIsGenerating(false);
    }
  }, [brief, isComplete]);

  const handleGenerateBrandIdentity = useCallback(async (logoId: string, conceptId: string) => {
    const logo = savedLogos.find(l => l.id === logoId);
    if (!logo) return;

    const concept = logo.concepts.find(c => c.id === conceptId);
    if (!concept) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Extract base64 data
      const base64Data = concept.main.split(',')[1] || concept.main;
      const mimeType = concept.main.match(/:(.*?);/)?.[1] || 'image/png';

      const identity = await generateBrandIdentity({
        base64ImageData: base64Data,
        mimeType,
        brandName: logo.brief.brandName,
        industry: logo.brief.industry,
        brandArchetype: logo.brief.brandArchetype,
        coreValues: logo.brief.coreValues,
        logoVision: logo.brief.logoVision,
        targetAudienceProfile: logo.brief.targetAudienceProfile,
      });

      // Update logo with identity
      setSavedLogos(prev =>
        prev.map(l =>
          l.id === logoId
            ? {
                ...l,
                identity,
                selectedConceptId: conceptId,
                updatedAt: new Date().toISOString(),
              }
            : l
        )
      );

    } catch (e) {
      setError(e as ApiError);
    } finally {
      setIsGenerating(false);
    }
  }, [savedLogos]);

  // ============================================================================
  // WEBSITE GENERATION HANDLERS
  // ============================================================================

  const handleGenerateWebsite = useCallback(async (
    logoId: string,
    templateType: string,
    description: string,
    pages: string[]
  ) => {
    const logo = savedLogos.find(l => l.id === logoId);
    if (!logo || !logo.selectedConceptId) return;

    const selectedConcept = logo.concepts.find(c => c.id === logo.selectedConceptId);
    if (!selectedConcept) return;

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);
    setGenerationMessage('Preparing website generation...');

    try {
      // Extract logo data
      const base64Data = selectedConcept.main.split(',')[1] || selectedConcept.main;
      const mimeType = selectedConcept.main.match(/:(.*?);/)?.[1] || 'image/png';

      const websiteData = await generateWebsite(
        {
          brief: logo.brief,
          identity: logo.identity,
          logoBase64: base64Data,
          logoMimeType: mimeType,
          description,
          templateType: templateType as any,
          pages,
        },
        {
          onProgress: (message, progress) => {
            setGenerationMessage(message);
            setGenerationProgress(progress);
          },
        }
      );

      // Create new website project
      const newWebsite: WebsiteProject = {
        id: `website-${Date.now()}`,
        name: `${logo.brief.brandName} Website`,
        logoId,
        createdAt: new Date().toISOString(),
        pages: websiteData.pages,
        theme: websiteData.theme,
        assets: websiteData.assets,
        templateType: templateType as any,
      };

      setWebsiteProjects(prev => [...prev, newWebsite]);
      setActiveWebsiteId(newWebsite.id);
      setAppMode('web');

    } catch (e) {
      setError(e as ApiError);
    } finally {
      setIsGenerating(false);
    }
  }, [savedLogos]);

  const handleExportWebsite = useCallback(async (websiteId: string) => {
    const website = websiteProjects.find(p => p.id === websiteId);
    if (!website) return;

    try {
      const blob = await exportToStaticSite(website);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${website.name.replace(/\s+/g, '-').toLowerCase()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e as ApiError);
    }
  }, [websiteProjects]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div 
      className="flex items-center justify-center min-h-screen p-4"
      style={{
        background: 'var(--webos-bg-gradient)',
        fontFamily: 'Helvetica Neue, Arial, sans-serif'
      }}
    >
      <WindowFrame
        title="Brandy - Brand Strategist + Web Builder"
        icon={Sparkles}
        minWidth={1200}
        minHeight={800}
        defaultWidth={1400}
        defaultHeight={900}
        className="max-w-[95vw] max-h-[95vh]"
      >
        <div 
          className="flex flex-col h-full"
          style={{
            background: 'var(--webos-bg-white)'
          }}
        >
          {/* Mode Tabs */}
          <div 
            className="flex"
            style={{
              borderBottom: '1px solid var(--webos-border-primary)',
              background: 'var(--webos-bg-secondary)'
            }}
          >
            <ModeTab
              icon={Sparkles}
              label="Logo Studio"
              active={appMode === 'logo'}
              onClick={() => setAppMode('logo')}
            />
            <ModeTab
              icon={Globe}
              label="Web Builder"
              active={appMode === 'web'}
              onClick={() => setAppMode('web')}
            />
            <ModeTab
              icon={FileText}
              label="Guidelines"
              active={appMode === 'guidelines'}
              onClick={() => setAppMode('guidelines')}
              disabled
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {appMode === 'logo' && (
                <LogoMode
                  key="logo"
                  brief={brief}
                  isComplete={isComplete}
                  savedLogos={savedLogos}
                  activeLogo={activeLogo}
                  isGenerating={isGenerating}
                  progress={generationProgress}
                  message={generationMessage}
                  error={error}
                  onGenerateLogos={handleGenerateLogos}
                  onGenerateBrandIdentity={handleGenerateBrandIdentity}
                  onGenerateWebsite={handleGenerateWebsite}
                  onSelectLogo={setActiveLogoId}
                />
              )}

              {appMode === 'web' && (
                <WebMode
                  key="web"
                  projects={websiteProjects}
                  activeProject={activeWebsite}
                  onSelectProject={setActiveWebsiteId}
                  onExport={handleExportWebsite}
                  onBack={() => setAppMode('logo')}
                />
              )}

              {appMode === 'guidelines' && (
                <GuidelinesMode
                  key="guidelines"
                  activeLogo={activeLogo}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Loading Overlay */}
          {isGenerating && (
            <LoadingOverlay
              message={generationMessage}
              progress={generationProgress}
            />
          )}

          {/* Error Display */}
          {error && !isGenerating && (
            <ErrorDisplay
              error={error}
              onDismiss={() => setError(null)}
            />
          )}
        </div>
      </WindowFrame>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface ModeTabProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function ModeTab({ icon: Icon, label, active, onClick, disabled }: ModeTabProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex items-center gap-2 px-6 py-3 font-semibold transition-colors min-h-[44px]
        ${active ? 'text-[#F18825]' : 'text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <Icon className="w-5 h-5" />
      {label}
      {active && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F18825]"
          layoutId="activeTab"
          transition={{ type: 'spring', ...LOOM_OS_SPRING }}
        />
      )}
    </button>
  );
}

function LoadingOverlay({ message, progress }: { message: string; progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[var(--semantic-border-light)] border-t-[#F18825] mb-4" />
          <p className="font-semibold text-lg mb-2">{message}</p>
          <div className="w-full bg-[var(--semantic-bg-muted)] rounded-full h-2 mb-2">
            <motion.div
              className="bg-[#F18825] h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-[var(--semantic-text-tertiary)]">{Math.round(progress)}%</p>
        </div>
      </div>
    </motion.div>
  );
}

function ErrorDisplay({ error, onDismiss }: { error: ApiError; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute bottom-4 right-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-w-md shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
            Error
          </h4>
          <p className="text-sm text-red-700 dark:text-red-200">{error.message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-red-400 hover:text-red-600"
        >
          ×
        </button>
      </div>
    </motion.div>
  );
}

// Placeholder modes - to be implemented fully
function LogoMode(props: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="text-center max-w-2xl">
        <Sparkles className="w-16 h-16 mx-auto mb-4 text-[#F18825]" />
        <h2 className="text-2xl font-bold mb-4">Logo Studio</h2>
        <p className="text-[var(--semantic-text-secondary)] mb-8">
          Generate professional logos with AI, create brand identities, and prepare for web design.
        </p>
        {props.isComplete && !props.isGenerating && props.savedLogos.length === 0 && (
          <button
            onClick={props.onGenerateLogos}
            className="px-6 py-3 bg-[#F18825] text-white rounded-lg hover:bg-[#E07515] min-h-[44px]"
          >
            Generate Logo Concepts
          </button>
        )}
        {props.savedLogos.length > 0 && (
          <div className="text-left">
            <h3 className="font-semibold mb-4">Your Logos:</h3>
            {props.savedLogos.map((logo: SavedLogo) => (
              <div key={logo.id} className="mb-2 p-4 border rounded-lg">
                <p className="font-medium">{logo.brief.brandName}</p>
                <p className="text-sm text-[var(--semantic-text-tertiary)]">{logo.concepts.length} concepts</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function WebMode(props: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="text-center max-w-2xl">
        <Globe className="w-16 h-16 mx-auto mb-4 text-[#2B8ED9]" />
        <h2 className="text-2xl font-bold mb-4">Web Builder</h2>
        <p className="text-[var(--semantic-text-secondary)] mb-8">
          Generate complete websites that match your brand identity.
        </p>
        {props.projects.length > 0 && (
          <div className="text-left">
            <h3 className="font-semibold mb-4">Your Websites:</h3>
            {props.projects.map((project: WebsiteProject) => (
              <div key={project.id} className="mb-2 p-4 border rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-sm text-[var(--semantic-text-tertiary)]">{project.pages.length} pages</p>
                </div>
                <button
                  onClick={() => props.onExport(project.id)}
                  className="px-4 py-2 bg-[#2B8ED9] text-white rounded-lg hover:bg-[#1474B8] flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function GuidelinesMode({ activeLogo }: { activeLogo?: SavedLogo }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center h-full p-8"
    >
      <div className="text-center max-w-2xl">
        <FileText className="w-16 h-16 mx-auto mb-4 text-[var(--semantic-text-tertiary)]" />
        <h2 className="text-2xl font-bold mb-4">Brand Guidelines</h2>
        <p className="text-[var(--semantic-text-secondary)]">
          Coming soon: Generate complete brand guideline documents with logo usage, colors, typography, and more.
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================================
// EXPORT WITH PROVIDER
// ============================================================================

export default function BrandyPage() {
  return (
    <BrandBriefProvider>
      <BrandyApp />
    </BrandBriefProvider>
  );
}
