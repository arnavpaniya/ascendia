"use client";

import { motion } from "framer-motion";
import { GlowCard } from "@/components/ui/GlowCard";
import { Clock } from "lucide-react";

// Minimal mockup of Kanban boards
const columns = ["To Do", "In Progress", "Submitted", "Graded"];
const initialCards = [
  { id: 1, title: "Quantum State Vector Essay", col: "To Do", daysLeft: 2 },
  { id: 2, title: "Neural Net Optimizer Coding", col: "In Progress", daysLeft: 1 },
  { id: 3, title: "Macro Data Analysis", col: "Submitted", daysLeft: 5 },
  { id: 4, title: "Historical Timeline Quiz", col: "Graded", daysLeft: -2 },
];

export default function AssignmentsPage() {
  return (
    <div className="space-y-8 pb-12 h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-syne font-bold mb-2 text-glow">Assignments</h1>
        <p className="text-white/60">Drag and drop your tasks to update their status.</p>
      </div>

      <div className="flex gap-6 h-full overflow-x-auto pb-4 snap-x">
        {columns.map((col) => (
          <div key={col} className="w-80 shrink-0 snap-center h-full flex flex-col bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne font-bold text-lg">{col}</h3>
              <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/60">
                {initialCards.filter(c => c.col === col).length}
              </span>
            </div>
            
            <div className="flex-1 space-y-4 overflow-y-auto">
              {initialCards.filter(c => c.col === col).map(card => {
                const isLate = card.daysLeft < 0;
                const isSoon = card.daysLeft > 0 && card.daysLeft <= 2;
                const badgeColor = isLate ? "text-red-400 bg-red-400/20" : isSoon ? "text-[#f59e0b] bg-[#f59e0b]/20" : "text-emerald-400 bg-emerald-400/20";

                return (
                  <motion.div
                    key={card.id}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={1}
                    className="cursor-grab active:cursor-grabbing z-50 relative"
                  >
                    <GlowCard className="p-4 bg-[#0f172a]">
                      <h4 className="font-semibold text-sm mb-3">{card.title}</h4>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${badgeColor}`}>
                        <Clock className="w-3 h-3" />
                        {card.daysLeft > 0 ? `${card.daysLeft} days left` : "Past Due / Closed"}
                      </div>
                    </GlowCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
