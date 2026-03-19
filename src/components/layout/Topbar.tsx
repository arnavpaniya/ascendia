"use client";

import { Bell, LogOut, Settings, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth.store";

export function Topbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-end border-b border-white/5 bg-[#080b12]/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 outline-none transition-colors hover:bg-white/5 focus:ring-2 focus:ring-white/10">
          <Bell className="h-5 w-5 text-white/80" />
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute right-1.5 top-1 h-2 w-2 rounded-full border-2 border-[#080b12] bg-[#f59e0b]"
          />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="h-9 w-9 cursor-pointer rounded-full bg-gradient-to-tr from-[#6c63ff] to-[#38bdf8] p-[2px] outline-none transition-all hover:ring-2 focus:ring-2 focus:ring-[#6c63ff]/80"
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0f172a] text-sm font-semibold text-white">
              {(profile?.full_name || profile?.email || "A").charAt(0).toUpperCase()}
            </div>
          </button>

          <AnimatePresence>
            {isOpen ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a]/95 py-1 shadow-2xl backdrop-blur-2xl"
                style={{ transformOrigin: "top right" }}
              >
                <div className="mb-1 border-b border-white/5 bg-white/5 px-4 py-3">
                  <p className="font-syne text-xs font-medium uppercase tracking-wider text-white/50">Manage Account</p>
                  {profile ? (
                    <div className="mt-2">
                      <p className="truncate text-sm font-semibold text-white">{profile.full_name || "Ascendia User"}</p>
                      <p className="truncate text-xs text-white/50">{profile.email}</p>
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col p-1">
                  <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white">
                    <Settings className="h-4 w-4" /> Preferences
                  </Link>

                  <div className="mx-2 my-1 h-px bg-white/10" />

                  <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-500/80 transition-colors hover:bg-red-500/10 hover:text-red-500">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
