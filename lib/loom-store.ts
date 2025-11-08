import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Loom {
  id: string;
  cardIds: string[]; // IDs of cards in this loom
  context: string; // Scraped context from all cards
  title: string;
  createdAt: number;
  isPinned: boolean;
}

interface LoomStore {
  looms: Loom[];

  // Actions
  createLoom: (cardIds: string[], context: string, title: string) => string;
  unpinLoom: (loomId: string) => void;
  restoreLoom: (loomId: string) => void;
  getLoom: (loomId: string) => Loom | undefined;
  isCardPinned: (cardId: string) => boolean;
  getLoomByCardId: (cardId: string) => Loom | undefined;
}

export const useLoomStore = create<LoomStore>()(
  persist(
    (set, get) => ({
      looms: [],

      createLoom: (cardIds, context, title) => {
        const loomId = `loom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newLoom: Loom = {
          id: loomId,
          cardIds,
          context,
          title,
          createdAt: Date.now(),
          isPinned: true,
        };

        set((state) => ({
          looms: [...state.looms, newLoom],
        }));

        return loomId;
      },

      unpinLoom: (loomId) => {
        set((state) => ({
          looms: state.looms.filter((loom) => loom.id !== loomId),
        }));
      },

      restoreLoom: (loomId) => {
        set((state) => ({
          looms: state.looms.map((loom) =>
            loom.id === loomId ? { ...loom, isPinned: false } : loom
          ),
        }));
      },

      getLoom: (loomId) => {
        return get().looms.find((loom) => loom.id === loomId);
      },

      isCardPinned: (cardId) => {
        return get().looms.some(
          (loom) => loom.isPinned && loom.cardIds.includes(cardId)
        );
      },

      getLoomByCardId: (cardId) => {
        return get().looms.find(
          (loom) => loom.isPinned && loom.cardIds.includes(cardId)
        );
      },
    }),
    {
      name: 'loom-storage',
    }
  )
);
