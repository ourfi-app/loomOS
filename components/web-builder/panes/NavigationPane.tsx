'use client';

import React, { useState } from 'react';
import { FileCode, Layers, Image, Settings, Sparkles, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBuilderStore } from '@/lib/web-builder/store/builderStore';

interface NavSection {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sections: NavSection[] = [
  { id: 'projects', label: 'Projects', icon: FileCode },
  { id: 'components', label: 'Components', icon: Layers },
  { id: 'assets', label: 'Assets', icon: Image },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'export', label: 'Export', icon: Download },
];

interface NavButtonProps {
  section: NavSection;
  active: boolean;
  onClick: () => void;
}

function NavButton({ section, active, onClick }: NavButtonProps) {
  const Icon = section.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors min-h-[44px]',
        'hover:bg-[var(--semantic-surface-hover)] dark:hover:bg-gray-800',
        active && 'bg-loomos-orange/10 text-loomos-orange border-r-2 border-loomos-orange',
        !active && 'text-[var(--semantic-text-secondary)] dark:text-gray-300'
      )}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="font-medium">{section.label}</span>
    </button>
  );
}

export function NavigationPane() {
  const [activeSection, setActiveSection] = useState('projects');
  const { project, toggleAIDrawer } = useBuilderStore();

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);

    // Special handling for AI section
    if (sectionId === 'ai') {
      toggleAIDrawer();
    }
  };

  return (
    <nav className="flex flex-col h-full bg-[var(--semantic-bg-subtle)] dark:bg-gray-900">
      {/* Logo/Brand */}
      <div className="p-4 border-b border-[var(--semantic-border-light)] dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-loomos-orange flex items-center justify-center">
            <FileCode className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--semantic-text-primary)] dark:text-gray-100">
              Web Builder
            </h2>
            <p className="text-xs text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)]">
              loomOS
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 py-2 overflow-y-auto">
        {sections.map((section) => (
          <NavButton
            key={section.id}
            section={section}
            active={activeSection === section.id}
            onClick={() => handleSectionClick(section.id)}
          />
        ))}
      </div>

      {/* Project Info at Bottom */}
      {project && (
        <div className="p-4 border-t border-[var(--semantic-border-light)] dark:border-gray-700">
          <div className="text-sm">
            <div className="font-medium text-[var(--semantic-text-primary)] dark:text-gray-100 truncate">
              {project.name}
            </div>
            <div className="text-xs text-[var(--semantic-text-tertiary)] dark:text-[var(--semantic-text-tertiary)]">
              Last saved: {new Date(project.updatedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
