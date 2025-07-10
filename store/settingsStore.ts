import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'am';
export type Theme = 'light' | 'dark';

interface NotificationSettings {
  bookingUpdates: boolean;
  chatMessages: boolean;
  promotions: boolean;
  reminders: boolean;
}

interface SettingsState {
  language: Language;
  theme: Theme;
  notifications: NotificationSettings;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'light',
      notifications: {
        bookingUpdates: true,
        chatMessages: true,
        promotions: false,
        reminders: true,
      },
      setLanguage: (language) => set({ language }),
      setTheme: (theme) => set({ theme }),
      updateNotificationSettings: (settings) =>
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        })),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);