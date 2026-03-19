"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { AuthRoleSelector } from "@/features/auth/components/AuthRoleSelector";
import { createRoleSession } from "@/features/auth/local-auth";
import { getRedirectPathForRole } from "@/features/auth/utils";
import type { AppUserRole } from "@/features/auth/types";
import { useAuthStore } from "@/stores/auth.store";

export default function GetStartedPage() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const [role, setRole] = useState<AppUserRole>("student");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    setLoading(true);

    try {
      const session = await createRoleSession(role);
      setSession(session);
      router.push(getRedirectPathForRole(role));
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c] px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 md:p-10 shadow-2xl backdrop-blur-2xl"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-syne font-bold text-white">Choose Your Workspace</h1>
          <p className="mt-3 text-sm text-white/60">
            Pick how you want to enter Ascendia. Students go to learning tools, teachers go to the teaching dashboard.
          </p>
        </div>

        <AuthRoleSelector value={role} onChange={setRole} />

        <button
          type="button"
          onClick={handleContinue}
          disabled={loading}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-base font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all hover:opacity-95 disabled:opacity-70"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue"}
        </button>
      </motion.div>
    </div>
  );
}
