"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface AuthTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon: LucideIcon;
  trailingAction?: ReactNode;
}

export function AuthTextField({
  label,
  icon: Icon,
  className,
  trailingAction,
  ...props
}: AuthTextFieldProps) {
  return (
    <div className="flex flex-col space-y-1.5">
      {label ? <label className="ml-1 text-sm font-medium text-white/80">{label}</label> : null}
      <div className="group relative">
        <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-indigo-400" />
        <Input
          className={cn(
            "h-12 rounded-xl border-white/10 bg-white/5 pl-11 text-white placeholder:text-white/30 focus-visible:border-indigo-500/50 focus-visible:ring-indigo-500/50",
            trailingAction ? "pr-12" : "",
            className,
          )}
          {...props}
        />
        {trailingAction ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{trailingAction}</div>
        ) : null}
      </div>
    </div>
  );
}
