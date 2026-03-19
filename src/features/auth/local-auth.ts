"use client";

import type { AppUserRole, SessionUser, UserProfile } from "@/features/auth/types";
import { ensureDemoData, saveUserProfile } from "@/lib/mock-data";

function buildUser(role: AppUserRole): UserProfile {
  const now = new Date().toISOString();
  const id = `${role}-${Date.now()}`;

  return {
    id,
    email: `${role}@ascendia.local`,
    full_name: role === "teacher" ? "Demo Teacher" : "Demo Student",
    avatar_url: null,
    role,
    xp: role === "teacher" ? 420 : 180,
    level: role === "teacher" ? 5 : 2,
    streak_days: role === "teacher" ? 9 : 3,
    last_active: now,
    created_at: now,
  };
}

export async function createRoleSession(role: AppUserRole): Promise<{
  user: SessionUser;
  profile: UserProfile;
}> {
  ensureDemoData();

  const profile = buildUser(role);
  saveUserProfile(profile);

  return {
    user: {
      uid: profile.id,
      email: profile.email,
    },
    profile,
  };
}
