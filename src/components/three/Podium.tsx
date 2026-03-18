"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Cylinder, Environment } from "@react-three/drei";
import * as THREE from "three";

function Pillar({ position, height, color, glowColor }: { position: [number, number, number]; height: number; color: string; glowColor: string }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <group position={position}>
      <Cylinder args={[1, 1, height, 32]} position={[0, height / 2, 0]}>
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </Cylinder>
      <pointLight ref={lightRef as any} position={[0, height + 0.5, 0]} color={glowColor} distance={5} />
    </group>
  );
}

export function Podium() {
  return (
    <div className="w-full h-64 relative z-10">
      <Canvas camera={{ position: [0, 4, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <Environment preset="city" />
        
        {/* Bronze - 3rd */}
        <Pillar position={[-2.5, 0, 0]} height={2} color="#cd7f32" glowColor="#cd7f32" />
        
        {/* Silver - 2nd */}
        <Pillar position={[2.5, 0, 0]} height={2.5} color="#c0c0c0" glowColor="#c0c0c0" />
        
        {/* Gold - 1st */}
        <Pillar position={[0, 0, 0.5]} height={3.5} color="#ffd700" glowColor="#ffd700" />
      </Canvas>
    </div>
  );
}
