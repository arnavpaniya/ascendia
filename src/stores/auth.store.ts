import { create } from "zustand";
import { auth } from "@/lib/firebase/config";
import { ensureUserProfileDocument, signOutUser } from "@/features/auth/firebase-auth";
import type { UserProfile } from "@/features/auth/types";
import { onAuthStateChanged, type Unsubscribe, type User as FirebaseUser } from "firebase/auth";

interface AuthStore {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

let authUnsubscribe: Unsubscribe | null = null;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    if (authUnsubscribe || get().initialized) {
      return;
    }

    set({ loading: true });

    authUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          set({ user: null, profile: null, loading: false, initialized: true });
          return;
        }

        const profile = await ensureUserProfileDocument(firebaseUser);
        set({
          user: firebaseUser,
          profile,
          loading: false,
          initialized: true,
        });
      } catch (error) {
        console.error("Failed to initialize auth state:", error);
        set({
          user: firebaseUser,
          profile: null,
          loading: false,
          initialized: true,
        });
      }
    });
  },

  refreshProfile: async () => {
    const currentUser = get().user;
    if (!currentUser) {
      return;
    }

    set({ loading: true });

    try {
      const profile = await ensureUserProfileDocument(currentUser);
      set({ profile, loading: false });
    } catch (error) {
      console.error("Failed to refresh user profile:", error);
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });

    try {
      await signOutUser();
      set({ user: null, profile: null, loading: false });
    } catch (error) {
      console.error("Failed to sign out:", error);
      set({ loading: false });
    }
  },
}));
