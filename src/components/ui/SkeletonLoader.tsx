import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-white/5 rounded-2xl relative overflow-hidden", className)} />
  );
}
