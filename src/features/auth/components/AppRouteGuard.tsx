"use client";

import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { useAuthStore } from "@/stores/auth.store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";

export function AppRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const initialized = useAuthStore((state) => state.initialized);
  const redirectingRef = useRef(false);

  const redirectTo = useMemo(() => {
    if (!initialized || loading) {
      return null;
    }

    if (!profile) {
      return pathname === "/" ? null : "/";
    }

    if (pathname.startsWith("/dashboard/teacher") && profile.role !== "teacher") {
      return pathname === "/dashboard" ? null : "/dashboard";
    }

    return null;
  }, [initialized, loading, pathname, profile]);

  useEffect(() => {
    if (!redirectTo || redirectingRef.current) {
      return;
    }

    redirectingRef.current = true;
    router.replace(redirectTo);
  }, [redirectTo, router]);

  if (!initialized || loading || !profile || redirectTo) {
    return <AuthLoadingScreen />;
  }

  return <>{children}</>;
}
