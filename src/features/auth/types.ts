export type AppUserRole = "student" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: AppUserRole;
  xp: number;
  level: number;
  streak_days: number;
  last_active: string;
  created_at: string;
}

export interface SessionUser {
  uid: string;
  email: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpPayload extends AuthCredentials {
  name: string;
  role: AppUserRole;
}
