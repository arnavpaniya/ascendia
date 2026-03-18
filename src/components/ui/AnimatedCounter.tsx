"use client";

import { useCounterAnimation } from "../../hooks/useCounterAnimation";

interface Props {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ from = 0, to, duration = 1.8, className = "" }: Props) {
  const value = useCounterAnimation(from, to, duration);
  
  return <span className={className}>{value.toLocaleString()}</span>;
}
