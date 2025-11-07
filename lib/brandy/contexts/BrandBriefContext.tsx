/**
 * Brand Brief Context
 * Manages shared brand brief state across the Brandy application
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrandBrief, BrandArchetype } from '../types';

interface BrandBriefContextType {
  brief: BrandBrief | null;
  setBrief: (brief: BrandBrief) => void;
  updateBrief: (updates: Partial<BrandBrief>) => void;
  clearBrief: () => void;
  isComplete: boolean;
}

const BrandBriefContext = createContext<BrandBriefContextType | undefined>(undefined);

const STORAGE_KEY = 'brandy_brand_brief';

const DEFAULT_BRIEF: BrandBrief = {
  brandName: '',
  industry: '',
  brandArchetype: 'The Creator',
  coreValues: [],
  targetAudienceProfile: '',
  brandPersonality: [],
  logoVision: '',
};

export function BrandBriefProvider({ children }: { children: ReactNode }) {
  const [brief, setBriefState] = useState<BrandBrief | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBriefState(parsed);
      } catch (error) {
        console.error('Failed to parse stored brief:', error);
      }
    }
  }, []);

  // Save to localStorage whenever brief changes
  useEffect(() => {
    if (brief) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(brief));
    }
  }, [brief]);

  const setBrief = (newBrief: BrandBrief) => {
    setBriefState(newBrief);
  };

  const updateBrief = (updates: Partial<BrandBrief>) => {
    setBriefState((prev) => {
      if (!prev) return { ...DEFAULT_BRIEF, ...updates };
      return { ...prev, ...updates };
    });
  };

  const clearBrief = () => {
    setBriefState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Check if brief is complete (has minimum required fields)
  const isComplete = Boolean(
    brief &&
    brief.brandName &&
    brief.industry &&
    brief.brandArchetype &&
    brief.coreValues.length > 0 &&
    brief.targetAudienceProfile &&
    brief.logoVision
  );

  return (
    <BrandBriefContext.Provider
      value={{
        brief,
        setBrief,
        updateBrief,
        clearBrief,
        isComplete,
      }}
    >
      {children}
    </BrandBriefContext.Provider>
  );
}

export function useBrandBrief() {
  const context = useContext(BrandBriefContext);
  if (context === undefined) {
    throw new Error('useBrandBrief must be used within a BrandBriefProvider');
  }
  return context;
}
