"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PURPLE = new THREE.Color("#6c63ff");
const CYAN = new THREE.Color("#00d4ff");

/**
 * A pulsing core orb: glowing inner sphere, a slowly rotating wireframe
 * icosahedron shell, and expanding signal rings. Reads great under bloom.
 */
export default function CTAOrb() {
  const core = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 1.5) * 0.06;
    if (core.current) core.current.scale.setScalar(pulse);
    if (shell.current) {
      shell.current.rotation.y = t * 0.25;
      shell.current.rotation.x = t * 0.12;
    }
    // Expanding rings loop.
    const cycle = (t % 3) / 3;
    [ring1, ring2].forEach((r, i) => {
      const p = (cycle + i * 0.5) % 1;
      if (r.current) {
        const s = 1 + p * 2.2;
        r.current.scale.setScalar(s);
        const mat = r.current.material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - p) * 0.5;
      }
    });
  });

  return (
    <group>
      {/* Inner glow core */}
      <mesh ref={core}>
        <sphereGeometry args={[0.9, 48, 48]} />
        <meshBasicMaterial color={PURPLE} transparent opacity={0.85} />
      </mesh>

      {/* Soft halo */}
      <mesh>
        <sphereGeometry args={[1.25, 32, 32]} />
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Wireframe shell */}
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshBasicMaterial
          color={CYAN}
          wireframe
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Expanding rings */}
      <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.66, 64]} />
        <meshBasicMaterial
          color={CYAN}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.6, 1.66, 64]} />
        <meshBasicMaterial
          color={PURPLE}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
