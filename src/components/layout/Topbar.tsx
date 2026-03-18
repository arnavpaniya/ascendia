"use client";

import { Bell } from "lucide-react";
import { motion } from "framer-motion";

export function Topbar() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#080b12]/80 border-b border-white/5 h-16 flex items-center justify-end px-6">
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
          <Bell className="w-5 h-5 text-white/80" />
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-1 right-1.5 w-2 h-2 bg-[#f59e0b] rounded-full border-2 border-[#080b12]"
          />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#6c63ff] to-[#38bdf8] p-[2px]">
          <div className="w-full h-full rounded-full bg-[#0f172a] overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
