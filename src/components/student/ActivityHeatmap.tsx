"use client";

import { motion } from "framer-motion";
import { useIntersectionReveal } from "@/hooks/useIntersectionReveal";

export function ActivityHeatmap() {
  const { ref, isInView } = useIntersectionReveal();

  // Mocking 7 days, 5 weeks of data (approx last 30 days)
  const days = ["Mon", "Wed", "Fri"];
  const matrix = Array.from({ length: 7 }, () =>
    Array.from({ length: 5 }, () => Math.floor(Math.random() * 4))
  );

  const getColor = (intensity: number) => {
    switch (intensity) {
      case 0: return "bg-white/5";
      case 1: return "bg-[#7c6df0]/30";
      case 2: return "bg-[#7c6df0]/60";
      case 3: return "bg-[#7c6df0]";
      default: return "bg-white/5";
    }
  };

  return (
    <div ref={ref as any} className="flex gap-2 p-2">
      {/* Day labels */}
      <div className="flex flex-col justify-between text-[10px] text-white/40 font-mono py-1 pr-2">
        <span>Mon</span>
        <span>Wed</span>
        <span>Fri</span>
      </div>

      {/* Heatmap Grid */}
      <div className="flex gap-1.5 flex-1">
        {matrix[0].map((_, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-1.5 flex-1">
            {matrix.map((row, rowIndex) => {
              const intensity = matrix[rowIndex][colIndex];
              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                  transition={{ delay: (colIndex * 7 + rowIndex) * 0.01 }}
                  className={`aspect-square rounded-[3px] ${getColor(intensity)} hover:ring-1 hover:ring-white/30 transition-all cursor-pointer relative group`}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black px-2 py-1 rounded text-xs font-bold pointer-events-none whitespace-nowrap z-50">
                    {intensity === 0 ? "No study" : `${intensity * 25}m studied`}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
