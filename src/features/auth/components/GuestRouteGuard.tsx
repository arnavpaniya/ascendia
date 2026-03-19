"use client";

import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { getRedirectPathForRole } from "@/features/auth/utils";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function GuestRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { profile, loading, initialized } = useAuthStore((state) => ({
    profile: state.profile,
    loading: state.loading,
    initialized: state.initialized,
  }));

  useEffect(() => {
    if (!initialized || loading || !profile) {
      return;
    }

    router.replace(getRedirectPathForRole(profile?.role ?? "student"));
  }, [initialized, loading, profile?.role, router, profile]);

  if (!initialized || loading) {
    return <AuthLoadingScreen />;
  }

  if (profile) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}
