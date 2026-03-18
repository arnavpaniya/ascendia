import { useState, useEffect } from "react";

export function useMouseParallax(sensitivity: number = 0.1) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalizing based on center of screen
      const x = (event.clientX / innerWidth - 0.5) * sensitivity;
      const y = (event.clientY / innerHeight - 0.5) * sensitivity;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [sensitivity]);

  return position;
}
