"use client";

import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { getRedirectPathForRole } from "@/features/auth/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function GuestRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, profile, loading, initialized } = useAuthStore((state) => ({
    user: state.user,
    profile: state.profile,
    loading: state.loading,
    initialized: state.initialized,
  }));

  useEffect(() => {
    if (!initialized || loading || !user) {
      return;
    }

    router.replace(getRedirectPathForRole(profile?.role ?? "student"));
  }, [initialized, loading, profile?.role, router, user]);

  if (!initialized || loading) {
    return <AuthLoadingScreen />;
  }

  if (user) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}
