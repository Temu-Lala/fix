import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SavedFixersState {
  savedFixerIds: string[];
  addSavedFixer: (fixerId: string) => void;
  removeSavedFixer: (fixerId: string) => void;
  isSaved: (fixerId: string) => boolean;
}

export const useSavedFixersStore = create<SavedFixersState>()(
  persist(
    (set, get) => ({
      savedFixerIds: [],
      addSavedFixer: (fixerId) =>
        set((state) => ({
          savedFixerIds: [...state.savedFixerIds, fixerId],
        })),
      removeSavedFixer: (fixerId) =>
        set((state) => ({
          savedFixerIds: state.savedFixerIds.filter((id) => id !== fixerId),
        })),
      isSaved: (fixerId) => get().savedFixerIds.includes(fixerId),
    }),
    {
      name: 'saved-fixers-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);