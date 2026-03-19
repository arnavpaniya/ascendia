import { db } from "@/lib/firebase/config";
import type {
  AppUserRole,
  AuthCredentials,
  SessionUser,
  SignUpPayload,
  UserProfile,
} from "@/features/auth/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const USERS_COLLECTION = "users";
const PROTOTYPE_AUTH_LOGS_COLLECTION = "prototype_auth_logs";

function getNowIso() {
  return new Date().toISOString();
}

function toSessionUser(profile: UserProfile): SessionUser {
  return {
    uid: profile.id,
    email: profile.email,
  };
}

function normalizeProfile(id: string, data: Record<string, unknown>): UserProfile {
  const now = getNowIso();

  return {
    id,
    email: String(data.email ?? ""),
    full_name: typeof data.full_name === "string" ? data.full_name : null,
    avatar_url: typeof data.avatar_url === "string" ? data.avatar_url : null,
    role: data.role === "admin" ? "admin" : "student",
    xp: typeof data.xp === "number" ? data.xp : 0,
    level: typeof data.level === "number" ? data.level : 1,
    streak_days: typeof data.streak_days === "number" ? data.streak_days : 0,
    last_active: typeof data.last_active === "string" ? data.last_active : now,
    created_at:
      typeof data.created_at === "string"
        ? data.created_at
        : typeof data.createdAt === "string"
          ? data.createdAt
          : now,
  };
}

async function savePrototypeAuthLog(payload: Record<string, unknown>) {
  await addDoc(collection(db, PROTOTYPE_AUTH_LOGS_COLLECTION), {
    ...payload,
    created_at: getNowIso(),
    createdAt: serverTimestamp(),
  });
}

async function findProfileByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const usersQuery = query(
    collection(db, USERS_COLLECTION),
    where("email", "==", normalizedEmail),
    limit(1),
  );
  const snapshot = await getDocs(usersQuery);

  if (snapshot.empty) {
    return null;
  }

  const match = snapshot.docs[0];
  return normalizeProfile(match.id, match.data());
}

async function upsertPrototypeProfile(input: {
  email: string;
  fullName?: string | null;
  role?: AppUserRole;
}) {
  const normalizedEmail = input.email.trim().toLowerCase();
  const existingProfile = await findProfileByEmail(normalizedEmail);
  const now = getNowIso();

  if (existingProfile) {
    const nextProfile: UserProfile = {
      ...existingProfile,
      email: normalizedEmail,
      full_name: input.fullName ?? existingProfile.full_name,
      role: input.role ?? existingProfile.role,
      last_active: now,
    };

    await updateDoc(doc(db, USERS_COLLECTION, existingProfile.id), {
      email: nextProfile.email,
      full_name: nextProfile.full_name,
      role: nextProfile.role,
      last_active: nextProfile.last_active,
    });

    return nextProfile;
  }

  const userRef = doc(collection(db, USERS_COLLECTION));
  const profile: UserProfile = {
    id: userRef.id,
    email: normalizedEmail,
    full_name: input.fullName ?? null,
    avatar_url: null,
    role: input.role ?? "student",
    xp: 0,
    level: 1,
    streak_days: 0,
    last_active: now,
    created_at: now,
  };

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
    auth_mode: "prototype",
  });

  return profile;
}

export async function fetchPrototypeProfile(userId: string) {
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, userId));
  if (!snapshot.exists()) {
    return null;
  }

  return normalizeProfile(snapshot.id, snapshot.data());
}

export async function prototypeSignIn(credentials: AuthCredentials) {
  const profile = await upsertPrototypeProfile({
    email: credentials.email,
  });

  await savePrototypeAuthLog({
    type: "login",
    email: profile.email,
    user_id: profile.id,
    password_length: credentials.password.length,
    role: profile.role,
  });

  return {
    user: toSessionUser(profile),
    profile,
  };
}

export async function prototypeSignUp(payload: SignUpPayload) {
  const profile = await upsertPrototypeProfile({
    email: payload.email,
    fullName: payload.name,
    role: payload.role,
  });

  await savePrototypeAuthLog({
    type: "signup",
    email: profile.email,
    user_id: profile.id,
    full_name: payload.name,
    password_length: payload.password.length,
    role: payload.role,
  });

  return {
    user: toSessionUser(profile),
    profile,
  };
}

export async function prototypeQuickAccess(role: AppUserRole) {
  const now = Date.now();
  const profile = await upsertPrototypeProfile({
    email: `demo-${role}-${now}@ascendia.local`,
    fullName: role === "admin" ? "Demo Teacher" : "Demo Student",
    role,
  });

  await savePrototypeAuthLog({
    type: "quick_access",
    email: profile.email,
    user_id: profile.id,
    role: profile.role,
  });

  return {
    user: toSessionUser(profile),
    profile,
  };
}
