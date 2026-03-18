import { ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Props {
  children: ReactNode;
  pulse?: boolean;
  color?: "primary" | "accent" | "highlight" | "default";
  className?: string;
}

export function Pill({ children, pulse = false, color = "default", className }: Props) {
  const colorMap = {
    primary: "bg-[#6c63ff]/20 text-[#6c63ff] border-[#6c63ff]/30",
    accent: "bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/30",
    highlight: "bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]/30",
    default: "bg-white/5 text-white/80 border-white/10"
  };

  const dotColorMap = {
    primary: "bg-[#6c63ff]",
    accent: "bg-[#f59e0b]",
    highlight: "bg-[#38bdf8]",
    default: "bg-white/80"
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full border backdrop-blur-md w-fit",
      colorMap[color],
      className
    )}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", dotColorMap[color])}></span>
          <span className={cn("relative inline-flex rounded-full h-2 w-2", dotColorMap[color])}></span>
        </span>
      )}
      {children}
    </span>
  );
}
