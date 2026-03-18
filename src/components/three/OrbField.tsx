"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function Orb({ color, position, speed, scale }: { color: string; position: [number, number, number]; speed: number; scale: number; }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const randomOffset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime() * speed + randomOffset;
      meshRef.current.position.x = position[0] + Math.sin(t) * 3;
      meshRef.current.position.y = position[1] + Math.sin(t) * Math.cos(t) * 3;
    }
  });

  return (
    <Sphere ref={meshRef as any} args={[1, 32, 32]} scale={scale} position={position}>
      <meshStandardMaterial emissive={color} emissiveIntensity={2} color={color} roughness={0.2} metalness={0.8} />
      <pointLight distance={10} intensity={2} color={color} />
    </Sphere>
  );
}

export function OrbField() {
  const orbs = useMemo(() => [
    { color: "#6c63ff", pos: [-4, 2, -5], scale: 1.5, speed: 0.2 },
    { color: "#38bdf8", pos: [4, -2, -8], scale: 2, speed: 0.15 },
    { color: "#f59e0b", pos: [0, 0, -10], scale: 1.2, speed: 0.25 },
    { color: "#6c63ff", pos: [-6, -3, -12], scale: 2.5, speed: 0.1 },
    { color: "#38bdf8", pos: [6, 3, -6], scale: 1.8, speed: 0.22 },
  ], []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.2} />
        {orbs.map((orb, i) => (
          <Orb key={i} color={orb.color} position={orb.pos as any} scale={orb.scale} speed={orb.speed} />
        ))}
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
