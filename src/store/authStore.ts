import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ✅ Union type pour gérer les deux formats
type UserRole = 'ADMIN' | 'FARMER' | 'INVESTOR' | 'AGRICULTEUR' | 'INVESTISSEUR';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user: User, token: string) => {
        if (!token) {
          console.error('❌ Store - Token manquant !');
          return;
        }

        console.log('💾 Store - Sauvegarde auth:', {
          user: user.email,
          role: user.role,
          token: token.substring(0, 20) + '...'
        });
        
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`;
        set({ user, token, isAuthenticated: true });
        
        console.log('✅ Store - Auth sauvegardée');
      },

      logout: () => {
        console.log('🚪 Store - Déconnexion');
        document.cookie = 'token=; path=/; max-age=0';
        set({ user: null, token: null, isAuthenticated: false });
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      },

      checkAuth: async () => {
        const state = get();
        const token = state.token;
        
        if (!token) {
          console.log('❌ Store - Pas de token');
          return false;
        }

        try {
          console.log('🔍 Store - Vérification du token...');
          
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Token invalide');
          }

          const userData = await response.json();
          set({ user: userData, isAuthenticated: true });
          
          console.log('✅ Store - Token valide');
          return true;
        } catch (error) {
          console.error('❌ Store - Erreur de vérification:', error);
          set({ user: null, token: null, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
