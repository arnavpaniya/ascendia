"use client";

import { Bell, LogOut, Settings, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Topbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
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
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#080b12]/80 border-b border-white/5 h-16 flex items-center justify-end px-6">
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors outline-none focus:ring-2 focus:ring-white/10">
          <Bell className="w-5 h-5 text-white/80" />
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-1 right-1.5 w-2 h-2 bg-[#f59e0b] rounded-full border-2 border-[#080b12]"
          />
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#6c63ff] to-[#38bdf8] p-[2px] cursor-pointer outline-none hover:ring-2 focus:ring-2 focus:ring-[#6c63ff]/80 transition-all"
          >
            <div className="w-full h-full rounded-full bg-[#0f172a] overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-3 w-48 bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-1"
                style={{ transformOrigin: "top right" }}
              >
                <div className="px-4 py-3 border-b border-white/5 mb-1 bg-white/5">
                  <p className="text-xs font-medium text-white/50 uppercase tracking-wider font-syne">Manage Account</p>
                </div>
                
                <div className="flex flex-col p-1">
                  <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link href="/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                    <Settings className="w-4 h-4" /> Preferences
                  </Link>
                  
                  <div className="h-px bg-white/10 my-1 mx-2" />
                  
                  <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500/80 hover:text-red-500 hover:bg-red-500/10 rounded-xl w-full text-left transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
      </div>
    </header>
  );
}
