"use client";

import { Podium } from "@/components/three/Podium";
import { GlowCard } from "@/components/ui/GlowCard";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StaggerList } from "@/components/ui/StaggerList";
import { Trophy } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Elena R.", xp: 15400, percent: 100 },
  { rank: 2, name: "Marcus T.", xp: 14200, percent: 92 },
  { rank: 3, name: "Sarah K.", xp: 13900, percent: 90 },
  { rank: 4, name: "David M.", xp: 12850, percent: 83 },
  { rank: 5, name: "Valiant Scholar", xp: 12450, percent: 80 },
  { rank: 6, name: "Jessica L.", xp: 11900, percent: 77 },
];

export default function LeaderboardPage() {
  return (
    <div className="space-y-8 pb-12 w-full max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-syne font-bold mb-2 flex items-center justify-center gap-3">
          <Trophy className="text-[#f59e0b]" /> Global Leaderboard
        </h1>
        <p className="text-white/60">Top scholars this week</p>
      </div>

      <div className="relative pt-10">
        <Podium />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-80px] w-full flex justify-center gap-16 md:gap-32 pointer-events-none z-20">
           <div className="flex flex-col items-center mt-12 mr-6">
             <div className="w-12 h-12 rounded-full border-4 border-[#cd7f32] bg-[#0f172a] shadow-[0_0_20px_#cd7f32]"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Third" alt="3rd" /></div>
             <span className="text-xs font-bold mt-2">Sarah</span>
           </div>
           <div className="flex flex-col items-center -mt-6">
             <div className="w-16 h-16 rounded-full border-4 border-[#ffd700] bg-[#0f172a] shadow-[0_0_30px_#ffd700]"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=First" alt="1st" /></div>
             <span className="text-sm font-bold mt-2">Elena</span>
           </div>
           <div className="flex flex-col items-center mt-6 ml-6">
             <div className="w-14 h-14 rounded-full border-4 border-[#c0c0c0] bg-[#0f172a] shadow-[0_0_20px_#c0c0c0]"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Second" alt="2nd" /></div>
             <span className="text-xs font-bold mt-2">Marcus</span>
           </div>
        </div>
      </div>

      <StaggerList className="space-y-3 mt-8">
        {leaderboardData.slice(3).map((user) => (
          <GlowCard key={user.rank} className="p-4 flex items-center gap-4">
            <div className="w-8 flex justify-center shrink-0">
              <span className="font-syne font-bold text-white/50">#{user.rank}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 shrink-0 overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-full h-full" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="font-semibold">{user.name}</span>
                <span className="text-sm text-[#f59e0b] font-medium">{user.xp.toLocaleString()} XP</span>
              </div>
              <ProgressBar progress={user.percent} />
            </div>
          </GlowCard>
        ))}
      </StaggerList>
    </div>
  );
}
