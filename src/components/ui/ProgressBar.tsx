"use client";

import { motion } from "framer-motion";
import { useIntersectionReveal } from "../../hooks/useIntersectionReveal";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ProgressBar({ progress, className }: { progress: number; className?: string }) {
  const { ref, isInView } = useIntersectionReveal();

  return (
    <div ref={ref as any} className={cn("h-2 w-full bg-white/10 rounded-full overflow-hidden", className)}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: Math.min(Math.max(progress, 0), 100) / 100 } : { scaleX: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="h-full bg-[#6c63ff] origin-left rounded-full"
      />
    </div>
  );
}
