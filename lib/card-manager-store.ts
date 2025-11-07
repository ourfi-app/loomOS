
import { create } from 'zustand';

export interface AppCard {
  id: string;
  title: string;
  path: string;
  color: string;
  icon: string;
  minimized: boolean;
  maximized: boolean;
  timestamp: number;
  zIndex: number;
  order: number;
}

interface CardManagerState {
  cards: AppCard[];
  activeCardId: string | null;
  isMultitaskingView: boolean;
  nextZIndex: number;
  
  // Actions
  launchApp: (app: Omit<AppCard, 'minimized' | 'maximized' | 'timestamp' | 'zIndex' | 'order'>) => void;
  closeCard: (cardId: string) => void;
  setActiveCard: (cardId: string) => void;
  minimizeCard: (cardId: string) => void;
  maximizeCard: (cardId: string) => void;
  restoreCard: (cardId: string) => void;
  bringToFront: (cardId: string) => void;
  toggleMultitaskingView: () => void;
  closeAllCards: () => void;
  getRunningApps: () => AppCard[];
  getMinimizedApps: () => AppCard[];
  getVisibleApps: () => AppCard[];
}

export const useCardManager = create<CardManagerState>((set, get) => ({
  cards: [],
  activeCardId: null,
  isMultitaskingView: false,
  nextZIndex: 1000,

  launchApp: (app) => {
    const { cards, nextZIndex } = get();
    
    // Check if app is already running
    const existingCard = cards.find(c => c.path === app.path);
    
    if (existingCard) {
      // Bring to front and show
      set({
        activeCardId: existingCard.id,
        isMultitaskingView: false,
        nextZIndex: nextZIndex + 1,
        cards: cards.map(c => 
          c.id === existingCard.id 
            ? { ...c, minimized: false, zIndex: nextZIndex }
            : c
        ),
      });
    } else {
      // Create new card
      const newCard: AppCard = {
        ...app,
        minimized: false,
        maximized: false,
        timestamp: Date.now(),
        zIndex: nextZIndex,
        order: cards.length,
      };
      
      set({
        cards: [...cards, newCard],
        activeCardId: newCard.id,
        isMultitaskingView: false,
        nextZIndex: nextZIndex + 1,
      });
    }
  },

  closeCard: (cardId) => {
    const { cards, activeCardId } = get();
    const newCards = cards.filter(c => c.id !== cardId);
    
    let newActiveCardId = activeCardId;
    
    if (activeCardId === cardId) {
      // Set the most recent non-minimized card as active
      const nonMinimizedCards = newCards.filter(c => !c.minimized);
      newActiveCardId = nonMinimizedCards.length > 0 
        ? (nonMinimizedCards[nonMinimizedCards.length - 1]?.id ?? null)
        : null;
    }
    
    set({
      cards: newCards,
      activeCardId: newActiveCardId,
    });
  },

  setActiveCard: (cardId) => {
    const { cards } = get();
    set({
      activeCardId: cardId,
      isMultitaskingView: false,
      cards: cards.map(c => 
        c.id === cardId 
          ? { ...c, minimized: false }
          : c
      ),
    });
  },

  minimizeCard: (cardId) => {
    const { cards, activeCardId } = get();
    const newCards = cards.map(c => 
      c.id === cardId 
        ? { ...c, minimized: true }
        : c
    );
    
    // If minimizing the active card, find the next non-minimized card
    let newActiveCardId = activeCardId;
    if (activeCardId === cardId) {
      const nonMinimizedCards = newCards.filter(c => !c.minimized);
      newActiveCardId = nonMinimizedCards.length > 0 
        ? (nonMinimizedCards[nonMinimizedCards.length - 1]?.id ?? null)
        : null;
    }
    
    set({
      cards: newCards,
      activeCardId: newActiveCardId,
    });
  },

  restoreCard: (cardId) => {
    const { cards } = get();
    set({
      cards: cards.map(c => 
        c.id === cardId 
          ? { ...c, minimized: false }
          : c
      ),
      activeCardId: cardId,
      isMultitaskingView: false,
    });
  },

  maximizeCard: (cardId) => {
    const { cards } = get();
    set({
      cards: cards.map(c => 
        c.id === cardId 
          ? { ...c, maximized: !c.maximized }
          : c
      ),
    });
  },

  toggleMultitaskingView: () => {
    set((state) => ({
      isMultitaskingView: !state.isMultitaskingView,
    }));
  },

  closeAllCards: () => {
    set({
      cards: [],
      activeCardId: null,
      isMultitaskingView: false,
    });
  },

  bringToFront: (cardId) => {
    const { nextZIndex } = get();
    set({
      nextZIndex: nextZIndex + 1,
      cards: get().cards.map(c => 
        c.id === cardId 
          ? { ...c, zIndex: nextZIndex }
          : c
      ),
      activeCardId: cardId,
    });
  },

  getRunningApps: () => {
    return get().cards;
  },

  getMinimizedApps: () => {
    return get().cards.filter(c => c.minimized);
  },

  getVisibleApps: () => {
    return get().cards.filter(c => !c.minimized);
  },
}));
