"use client";

import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { getRedirectPathForRole } from "@/features/auth/utils";
import { useAuthStore } from "@/stores/auth.store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

export function GuestRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const initialized = useAuthStore((state) => state.initialized);
  const redirectingRef = useRef(false);

  const redirectTo = useMemo(() => {
    if (!initialized || loading || !profile) {
      return null;
    }

    const nextPath = getRedirectPathForRole(profile.role ?? "student");
    return pathname === nextPath ? null : nextPath;
  }, [initialized, loading, pathname, profile]);

  useEffect(() => {
    if (!redirectTo || redirectingRef.current) {
      return;
    }

    redirectingRef.current = true;
    router.replace(redirectTo);
  }, [redirectTo, router]);

  if (!initialized || loading) {
    return <AuthLoadingScreen />;
  }

  if (profile || redirectTo) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}
