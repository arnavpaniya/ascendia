"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, ClipboardList, Trophy, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Assignments", href: "/assignments", icon: ClipboardList },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside className="w-64 h-screen hidden md:flex flex-col border-r bg-[#0f172a]/50 backdrop-blur-xl border-white/5 sticky top-0 py-6 px-4 shrink-0">
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-8 h-8 rounded-lg bg-[#6c63ff] flex items-center justify-center shrink-0">
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-4 h-4 bg-white rounded-sm"
          />
        </div>
        <span className="font-syne font-bold text-xl tracking-tight">Ascendia</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname !== "/" && item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                isActive ? "text-white" : "text-white/60 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#6c63ff]/10 border border-[#6c63ff]/20 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              <div className="relative z-10 flex items-center gap-3 w-full">
                <motion.div whileHover={{ scale: 1.15, rotate: 5 }}>
                  <item.icon className={cn("w-5 h-5", isActive ? "text-[#6c63ff] drop-shadow-[0_0_8px_rgba(108,99,255,0.8)]" : "")} />
                </motion.div>
                <span className="font-medium text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-white/5">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
}
