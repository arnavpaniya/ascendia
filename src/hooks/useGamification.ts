"use client";

import confetti from "canvas-confetti";
import { useCallback } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { calculateLevel } from "@/utils/xp.utils";

export function useGamification() {
  const fireConfetti = useCallback(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#7c6df0", "#38bdf8", "#f59e0b", "#f472b6"]
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#7c6df0", "#38bdf8", "#f59e0b", "#f472b6"]
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const triggerLevelUp = useCallback((newTitle: string, userLevel: number) => {
    fireConfetti();
    // In a full implementation, you'd trigger a global toast or modal here
    console.log(`Leveled up to ${userLevel}: ${newTitle}!!`);
  }, [fireConfetti]);

  return { fireConfetti, triggerLevelUp };
}
