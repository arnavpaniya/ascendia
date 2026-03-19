import type { AppUserRole } from "@/features/auth/types";

export const AUTH_REDIRECTS: Record<AppUserRole, string> = {
  student: "/dashboard",
  admin: "/dashboard/admin",
};

export const ROLE_OPTIONS: Array<{
  value: AppUserRole;
  label: string;
  description: string;
}> = [
  {
    value: "student",
    label: "Student",
    description: "Track lessons, courses, and your study progress.",
  },
  {
    value: "admin",
    label: "Teacher",
    description: "Manage courses, learners, and platform content.",
  },
];
