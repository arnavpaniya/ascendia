"use client";

import { ROLE_OPTIONS } from "@/features/auth/constants";
import type { AppUserRole } from "@/features/auth/types";
import { BookOpen, Presentation } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const roleIcons = {
  student: BookOpen,
  teacher: Presentation,
};

interface AuthRoleSelectorProps {
  value: AppUserRole;
  onChange: (value: AppUserRole) => void;
}

export function AuthRoleSelector({ value, onChange }: AuthRoleSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {ROLE_OPTIONS.map((role) => {
        const Icon = roleIcons[role.value];
        const isActive = value === role.value;

        return (
          <motion.button
            key={role.value}
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onChange(role.value)}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all duration-300",
              isActive
                ? "border-indigo-500/60 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                : "border-white/10 bg-white/5 hover:bg-white/10",
            )}
          >
            <div className="mb-2 flex items-center gap-2 text-white">
              <Icon className={cn("h-4 w-4", isActive ? "text-indigo-300" : "text-white/70")} />
              <span className="text-sm font-semibold">{role.label}</span>
            </div>
            <p className="text-xs leading-5 text-white/55">{role.description}</p>
          </motion.button>
        );
      })}
    </div>
  );
}
