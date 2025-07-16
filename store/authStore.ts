import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Mock user data
          const user: User = {
            id: '1',
            name: 'John Doe',
            email,
            phone: '+251911123456',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Login failed. Please try again.', isLoading: false });
        }
      },
      
      register: async (name: string, email: string, password: string, phone: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Mock user data
          const user: User = {
            id: '1',
            name,
            email,
            phone,
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ error: 'Registration failed. Please try again.', isLoading: false });
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },
      
      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);