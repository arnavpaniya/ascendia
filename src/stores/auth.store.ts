import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'student' | 'admin';
  xp: number;
  level: number;
  streak_days: number;
  last_active: string;
  created_at: string;
}

interface AuthStore {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => {
  const supabase = createClient();
  
  return {
    user: null,
    profile: null,
    loading: true,
    initialized: false,

    initialize: async () => {
      // Prevents re-running unnecessarily if already initialized successfully
      if (get().initialized) return;
      
      set({ loading: true });
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        set({ user: null, profile: null, loading: false, initialized: true });
        return;
      }

      set({ user: session.user });
      await get().fetchProfile(session.user.id);
      
      set({ loading: false, initialized: true });

      // Subscribe to auth changes once
      supabase.auth.onAuthStateChange(async (event, currentSession) => {
        if (event === 'SIGNED_OUT' || !currentSession) {
          set({ user: null, profile: null });
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          set({ user: currentSession.user });
          await get().fetchProfile(currentSession.user.id);
        }
      });
    },

    signOut: async () => {
      set({ loading: true });
      await supabase.auth.signOut();
      set({ user: null, profile: null, loading: false });
    },

    fetchProfile: async (userId: string) => {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (!error && profile) {
        set({ profile: profile as UserProfile });
      }
    }
  }
})
