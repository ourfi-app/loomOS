
import { create } from 'zustand';
import { LucideIcon } from 'lucide-react';

export interface WebOSCard {
  id: string;
  title: string;
  icon: LucideIcon;
  path: string;
  preview?: string;
  isActive: boolean;
}

interface CardManagerState {
  cards: WebOSCard[];
  activeCardId: string | null;
  isCardView: boolean;
  addCard: (card: Omit<WebOSCard, 'isActive'>) => void;
  removeCard: (id: string) => void;
  maximizeCard: (id: string) => void;
  closeCard: (id: string) => void;
  showCardView: () => void;
  hideCardView: () => void;
  updateCardPreview: (id: string, preview: string) => void;
}

export const useCardManager = create<CardManagerState>((set, get) => ({
  cards: [],
  activeCardId: null,
  isCardView: false,

  addCard: (card) => {
    const cards = get().cards;
    const existingCard = cards.find(c => c.id === card.id);
    
    if (existingCard) {
      // Card already exists, just maximize it
      set({ activeCardId: card.id, isCardView: false });
    } else {
      // Add new card
      set({
        cards: [...cards, { ...card, isActive: true }],
        activeCardId: card.id,
        isCardView: false,
      });
    }
  },

  removeCard: (id) => {
    const cards = get().cards.filter(c => c.id !== id);
    const activeCardId = get().activeCardId === id
      ? (cards.length > 0 ? (cards[cards.length - 1]?.id ?? null) : null)
      : get().activeCardId;
    
    set({ cards, activeCardId });
  },

  maximizeCard: (id) => {
    set({ activeCardId: id, isCardView: false });
  },

  closeCard: (id) => {
    get().removeCard(id);
  },

  showCardView: () => {
    set({ isCardView: true });
  },

  hideCardView: () => {
    const activeCardId = get().activeCardId;
    if (activeCardId) {
      set({ isCardView: false });
    }
  },

  updateCardPreview: (id, preview) => {
    set(state => ({
      cards: state.cards.map(card =>
        card.id === id ? { ...card, preview } : card
      ),
    }));
  },
}));
