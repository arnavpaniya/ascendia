import { create } from 'zustand'
import { auth, db } from '@/lib/firebase/config'
import { onAuthStateChanged, signOut as firebaseSignOut, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

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
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => {
  return {
    user: null,
    profile: null,
    loading: true,
    initialized: false,

    initialize: async () => {
      if (get().initialized) return;
      
      set({ loading: true });
      
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          set({ user: firebaseUser });
          await get().fetchProfile(firebaseUser.uid);
          set({ loading: false, initialized: true });
        } else {
          set({ user: null, profile: null, loading: false, initialized: true });
        }
      });
    },

    signOut: async () => {
      set({ loading: true });
      await firebaseSignOut(auth);
      set({ user: null, profile: null, loading: false });
    },

    fetchProfile: async (userId: string) => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          set({ 
            profile: { 
              id: userId,
              email: data.email,
              full_name: data.full_name,
              avatar_url: data.avatar_url,
              role: data.role,
              xp: data.xp || 0,
              level: data.level || 1,
              streak_days: data.streak_days || 0,
              last_active: data.last_active,
              created_at: data.createdAt || data.created_at
            } as UserProfile 
          });
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    }
  }
})
