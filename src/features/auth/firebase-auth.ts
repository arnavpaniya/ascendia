import { auth, db, googleProvider } from "@/lib/firebase/config";
import type { AppUserRole, AuthCredentials, SignUpPayload, UserProfile } from "@/features/auth/types";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

function getNowIso() {
  return new Date().toISOString();
}

function createProfileDocument(user: User, role: AppUserRole, fullName?: string | null): UserProfile {
  const now = getNowIso();

  return {
    id: user.uid,
    email: user.email ?? "",
    full_name: fullName ?? user.displayName ?? null,
    avatar_url: user.photoURL ?? null,
    role,
    xp: 0,
    level: 1,
    streak_days: 0,
    last_active: now,
    created_at: now,
  };
}

function normalizeProfile(user: User, data: Record<string, unknown>): UserProfile {
  const now = getNowIso();

  return {
    id: user.uid,
    email: String(data.email ?? user.email ?? ""),
    full_name:
      typeof data.full_name === "string"
        ? data.full_name
        : user.displayName ?? null,
    avatar_url:
      typeof data.avatar_url === "string"
        ? data.avatar_url
        : user.photoURL ?? null,
    role: data.role === "admin" ? "admin" : "student",
    xp: typeof data.xp === "number" ? data.xp : 0,
    level: typeof data.level === "number" ? data.level : 1,
    streak_days: typeof data.streak_days === "number" ? data.streak_days : 0,
    last_active:
      typeof data.last_active === "string"
        ? data.last_active
        : now,
    created_at:
      typeof data.created_at === "string"
        ? data.created_at
        : typeof data.createdAt === "string"
          ? data.createdAt
          : now,
  };
}

export async function ensureUserProfileDocument(
  user: User,
  options?: { role?: AppUserRole; fullName?: string | null },
) {
  const userRef = doc(db, "users", user.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const profile = createProfileDocument(user, options?.role ?? "student", options?.fullName);
    await setDoc(userRef, {
      email: profile.email,
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
      role: profile.role,
      xp: profile.xp,
      level: profile.level,
      streak_days: profile.streak_days,
      last_active: profile.last_active,
      created_at: profile.created_at,
      createdAt: profile.created_at,
    });
    return profile;
  }

  const profile = normalizeProfile(user, snapshot.data());
  await updateDoc(userRef, {
    email: profile.email,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    last_active: getNowIso(),
  });

  return {
    ...profile,
    last_active: getNowIso(),
  };
}

export async function signInWithEmail(credentials: AuthCredentials) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    credentials.email,
    credentials.password,
  );
  const profile = await ensureUserProfileDocument(userCredential.user);

  return { user: userCredential.user, profile };
}

export async function signUpWithEmail(payload: SignUpPayload) {
  const userCredential = await createUserWithEmailAndPassword(auth, payload.email, payload.password);
  await updateProfile(userCredential.user, { displayName: payload.name });
  const profile = await ensureUserProfileDocument(userCredential.user, {
    role: payload.role,
    fullName: payload.name,
  });

  return { user: userCredential.user, profile };
}

export async function signInWithGoogle(role: AppUserRole) {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const profile = await ensureUserProfileDocument(userCredential.user, {
    role,
    fullName: userCredential.user.displayName,
  });

  return { user: userCredential.user, profile };
}

export async function signOutUser() {
  await signOut(auth);
}
