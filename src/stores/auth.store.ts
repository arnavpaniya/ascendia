import { getStoredUserProfile } from "@/lib/mock-data";
import type { SessionUser, UserProfile } from "@/features/auth/types";
import { create } from "zustand";

const PROTOTYPE_SESSION_KEY = "ascendia.prototype.session";

interface StoredSession {
  user: SessionUser;
  profile: UserProfile;
}

interface AuthStore {
  user: SessionUser | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  initialize: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setSession: (session: StoredSession) => void;
  signOut: () => Promise<void>;
}

function readStoredSession(): StoredSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(PROTOTYPE_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    window.localStorage.removeItem(PROTOTYPE_SESSION_KEY);
    return null;
  }
}

function writeStoredSession(session: StoredSession | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(PROTOTYPE_SESSION_KEY);
    return;
  }

  window.localStorage.setItem(PROTOTYPE_SESSION_KEY, JSON.stringify(session));
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    if (get().initialized) {
      return;
    }

    set({ loading: true });

    const session = readStoredSession();

    if (!session) {
      set({ user: null, profile: null, loading: false, initialized: true });
      return;
    }

    set({
      user: session.user,
      profile: session.profile,
      loading: false,
      initialized: true,
    });
  },

  refreshProfile: async () => {
    const currentUser = get().user;
    if (!currentUser) {
      return;
    }

    set({ loading: true });

    try {
      const profile = await getStoredUserProfile(currentUser.uid);
      if (!profile) {
        writeStoredSession(null);
        set({ user: null, profile: null, loading: false });
        return;
      }

      const nextSession = {
        user: currentUser,
        profile,
      };

      writeStoredSession(nextSession);
      set({ profile, loading: false });
    } catch (error) {
      console.error("Failed to refresh prototype profile:", error);
      set({ loading: false });
    }
  },

  setSession: (session) => {
    writeStoredSession(session);
    set({
      user: session.user,
      profile: session.profile,
      loading: false,
      initialized: true,
    });
  },

  signOut: async () => {
    writeStoredSession(null);
    set({ user: null, profile: null, loading: false, initialized: true });
  },
}));
