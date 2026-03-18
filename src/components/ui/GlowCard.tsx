import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function GlowCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("glow-border rounded-2xl overflow-hidden relative group", className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10 w-full h-full p-6">{children}</div>
    </div>
  );
}
