"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

export function useIntersectionReveal(once: boolean = true, margin: string = "-50px") {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: margin as any });
  return { ref, isInView };
}
