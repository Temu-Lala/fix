import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FixerApplication {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  bio: string;
  idType: 'passport' | 'nationalId';
  idNumber: string;
  idDocument?: string; // Base64 image
  profilePhoto?: string; // Base64 image
  categories: string[];
  experience: string;
  certifications: string[];
  serviceArea: number; // radius in km
  hourlyRate: number;
  availability: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

interface FixerApplicationState {
  application: FixerApplication | null;
  applicationStatus: 'none' | 'pending' | 'approved' | 'rejected';
  isLoading: boolean;
  error: string | null;
  submitApplication: (application: Omit<FixerApplication, 'id' | 'status' | 'submittedAt'>) => Promise<void>;
  updateApplicationStatus: (status: 'pending' | 'approved' | 'rejected') => void;
  clearApplication: () => void;
}

export const useFixerApplicationStore = create<FixerApplicationState>()(
  persist(
    (set, get) => ({
      application: null,
      applicationStatus: 'none',
      isLoading: false,
      error: null,
      
      submitApplication: async (applicationData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const newApplication: FixerApplication = {
            ...applicationData,
            id: Date.now().toString(),
            status: 'pending',
            submittedAt: new Date().toISOString(),
          };
          
          set({ 
            application: newApplication, 
            applicationStatus: 'pending',
            isLoading: false 
          });
        } catch (error) {
          set({ error: 'Failed to submit application', isLoading: false });
        }
      },
      
      updateApplicationStatus: (status) => {
        set((state) => ({
          applicationStatus: status,
          application: state.application ? {
            ...state.application,
            status,
            reviewedAt: new Date().toISOString(),
          } : null,
        }));
      },
      
      clearApplication: () => {
        set({ 
          application: null, 
          applicationStatus: 'none',
          error: null 
        });
      },
    }),
    {
      name: 'fixer-application-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);