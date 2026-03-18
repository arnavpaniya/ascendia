"use client";

import { useState, useEffect } from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";

export function useCounterAnimation(from: number, to: number, duration: number = 1.8) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [value, setValue] = useState(from);

  useEffect(() => {
    const controls = animate(count, to, { duration, ease: "easeOut" });
    const unsubscribe = rounded.on("change", (latest) => {
      setValue(latest);
    });
    
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, from, to, duration, rounded]);

  return value;
}
