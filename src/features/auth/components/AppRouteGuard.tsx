"use client";

import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { useAuthStore } from "@/stores/auth.store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AppRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading, initialized } = useAuthStore((state) => ({
    user: state.user,
    profile: state.profile,
    loading: state.loading,
    initialized: state.initialized,
  }));

  useEffect(() => {
    if (!initialized || loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    if (pathname.startsWith("/dashboard/admin") && profile && profile.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [initialized, loading, pathname, profile, router, user]);

  if (!initialized || loading || !user || !profile) {
    return <AuthLoadingScreen />;
  }

  if (pathname.startsWith("/dashboard/admin") && profile.role !== "admin") {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}
