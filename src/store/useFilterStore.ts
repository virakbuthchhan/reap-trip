import { create } from 'zustand';
import { DestinationCategory, DifficultyLevel, TransportType } from '@/types';

interface FilterStoreState {
  searchQuery: string;
  selectedCategory: DestinationCategory | 'all';
  selectedDifficulty: DifficultyLevel | 'all';
  selectedProvince: string;
  selectedTransport: TransportType | 'all';
  viewMode: 'grid' | 'map';
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: DestinationCategory | 'all') => void;
  setSelectedDifficulty: (difficulty: DifficultyLevel | 'all') => void;
  setSelectedProvince: (province: string) => void;
  setSelectedTransport: (transport: TransportType | 'all') => void;
  setViewMode: (mode: 'grid' | 'map') => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterStoreState>((set) => ({
  searchQuery: '',
  selectedCategory: 'all',
  selectedDifficulty: 'all',
  selectedProvince: 'all',
  selectedTransport: 'all',
  viewMode: 'grid',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedDifficulty: (selectedDifficulty) => set({ selectedDifficulty }),
  setSelectedProvince: (selectedProvince) => set({ selectedProvince }),
  setSelectedTransport: (selectedTransport) => set({ selectedTransport }),
  setViewMode: (viewMode) => set({ viewMode }),
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedCategory: 'all',
      selectedDifficulty: 'all',
      selectedProvince: 'all',
      selectedTransport: 'all',
    }),
}));
