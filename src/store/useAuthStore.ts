import { create } from 'zustand';
import { UserProfile } from '@/types';

interface AuthStoreState {
  user: UserProfile | null;
  authModalOpen: boolean;
  setUser: (user: UserProfile | null) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  toggleSaveDestinationId: (destId: string) => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  authModalOpen: false,
  setUser: (user) => set({ user }),
  openAuthModal: () => set({ authModalOpen: true }),
  closeAuthModal: () => set({ authModalOpen: false }),
  toggleSaveDestinationId: (destId) =>
    set((state) => {
      if (!state.user) return state;
      const currentSaved = state.user.savedDestinationIds || [];
      const isSaved = currentSaved.includes(destId);
      const newSaved = isSaved
        ? currentSaved.filter((id) => id !== destId)
        : [...currentSaved, destId];

      return {
        user: {
          ...state.user,
          savedDestinationIds: newSaved,
        },
      };
    }),
}));
