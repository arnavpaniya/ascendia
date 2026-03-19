import type { AppUserRole } from "@/features/auth/types";
import { AUTH_REDIRECTS } from "@/features/auth/constants";

export function getRedirectPathForRole(role: AppUserRole = "student") {
  return AUTH_REDIRECTS[role] ?? AUTH_REDIRECTS.student;
}
