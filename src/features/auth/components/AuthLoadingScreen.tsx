"use client";

import { Loader2 } from "lucide-react";

export function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07080f] text-white">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
    </div>
  );
}
