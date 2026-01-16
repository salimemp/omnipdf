import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, Document, ConversionJob, UserSubscriptionTier, TIER_FEATURES } from '@omnipdf/shared/src/types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Documents state
  documents: Document[];
  addDocument: (doc: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  clearDocuments: () => void;
  
  // Conversions state
  conversions: ConversionJob[];
  addConversion: (conversion: ConversionJob) => void;
  updateConversion: (id: string, updates: Partial<ConversionJob>) => void;
  removeConversion: (id: string) => void;
  clearConversions: () => void;
  
  // UI state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Settings
  settings: {
    defaultOutputFormat: string;
    autoDeleteAfter: number;
    notifications: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
    fontSize: 'sm' | 'md' | 'lg' | 'xl';
  };
  updateSettings: (settings: Partial<AppState['settings']>) => void;
  
  // Localization
  locale: string;
  setLocale: (locale: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // Documents state
      documents: [],
      addDocument: (doc) =>
        set((state) => ({
          documents: [...state.documents, doc],
        })),
      updateDocument: (id, updates) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc
          ),
        })),
      removeDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
        })),
      clearDocuments: () => set({ documents: [] }),
      
      // Conversions state
      conversions: [],
      addConversion: (conversion) =>
        set((state) => ({
          conversions: [...state.conversions, conversion],
        })),
      updateConversion: (id, updates) =>
        set((state) => ({
          conversions: state.conversions.map((conv) =>
            conv.id === id ? { ...conv, ...updates } : conv
          ),
        })),
      removeConversion: (id) =>
        set((state) => ({
          conversions: state.conversions.filter((conv) => conv.id !== id),
        })),
      clearConversions: () => set({ conversions: [] }),
      
      // UI state
      sidebarOpen: true,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      // Settings
      settings: {
        defaultOutputFormat: 'pdf',
        autoDeleteAfter: 24,
        notifications: true,
        reducedMotion: false,
        highContrast: false,
        fontSize: 'md',
      },
      updateSettings: (settings) =>
        set((state) => ({
          settings: { ...state.settings, ...settings },
        })),
      
      // Localization
      locale: 'en',
      setLocale: (locale) => set({ locale }),
      currency: 'USD',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'omnipdf-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        settings: state.settings,
        locale: state.locale,
        currency: state.currency,
      }),
    }
  )
);

// Selectors
export const selectUserTier = (state: AppState): UserSubscriptionTier => 
  state.user?.subscription_tier || 'free';

export const selectUserFeatures = (state: AppState) => 
  TIER_FEATURES[selectUserTier(state)];

export const selectIsPro = (state: AppState) => 
  selectUserTier(state) === 'pro' || selectUserTier(state) === 'enterprise';

export const selectIsEnterprise = (state: AppState) => 
  selectUserTier(state) === 'enterprise';
