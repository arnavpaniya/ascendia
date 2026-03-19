"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, ClipboardList, Trophy, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth.store";

const baseStudentNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "Assignments", href: "/assignments", icon: ClipboardList },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Settings", href: "/settings", icon: Settings },
];

const teacherNavItems = [
  { name: "Teacher Hub", href: "/dashboard/teacher", icon: LayoutDashboard },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);

  const navItems = profile?.role === "teacher" ? teacherNavItems : baseStudentNavItems;

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-[#0f172a]/50 px-4 py-6 backdrop-blur-xl md:flex">
      <div className="mb-10 flex items-center gap-3 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6c63ff]">
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="h-4 w-4 rounded-sm bg-white"
          />
        </div>
        <span className="font-syne text-xl font-bold tracking-tight">Ascendia</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname !== "/" && item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                isActive ? "text-white" : "text-white/60 hover:text-white",
              )}
            >
              {isActive ? (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl border border-[#6c63ff]/20 bg-[#6c63ff]/10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              ) : null}

              <div className="relative z-10 flex w-full items-center gap-3">
                <motion.div whileHover={{ scale: 1.15, rotate: 5 }}>
                  <item.icon className={cn("h-5 w-5", isActive ? "text-[#6c63ff] drop-shadow-[0_0_8px_rgba(108,99,255,0.8)]" : "")} />
                </motion.div>
                <span className="text-sm font-medium">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/5 pt-6">
        {profile ? (
          <div className="mb-4 rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
            <p className="truncate text-sm font-semibold text-white">{profile.full_name || "Ascendia User"}</p>
            <p className="truncate text-xs text-white/50">{profile.email}</p>
          </div>
        ) : null}

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500/80 transition-colors hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut className="h-5 w-5" /> Logout
        </button>
      </div>
    </aside>
  );
}
