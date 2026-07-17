"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useIsTablet, useLowPower } from "@/lib/hooks";

const PURPLE = new THREE.Color("#6c63ff");
const CYAN = new THREE.Color("#00d4ff");

/**
 * Builds a Fibonacci-sphere point cloud, connects nearby points with lines,
 * and colours everything along a purple→cyan vertical gradient.
 */
function buildSphere(count: number, radius: number, linkDist: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const pts: THREE.Vector3[] = [];

  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const v = new THREE.Vector3(x, y, z).multiplyScalar(radius);
    pts.push(v);

    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;

    const t = (y + 1) / 2; // 0 bottom → 1 top
    const c = PURPLE.clone().lerp(CYAN, t);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  // Connect nearby points. Cap links so weak GPUs stay smooth.
  const linePos: number[] = [];
  const lineCol: number[] = [];
  const maxLinks = count * 3;
  let links = 0;
  for (let i = 0; i < count && links < maxLinks; i++) {
    for (let j = i + 1; j < count && links < maxLinks; j++) {
      if (pts[i].distanceTo(pts[j]) < linkDist) {
        linePos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        const ti = (pts[i].y / radius + 1) / 2;
        const tj = (pts[j].y / radius + 1) / 2;
        const ci = PURPLE.clone().lerp(CYAN, ti);
        const cj = PURPLE.clone().lerp(CYAN, tj);
        lineCol.push(ci.r, ci.g, ci.b, cj.r, cj.g, cj.b);
        links++;
      }
    }
  }

  return {
    positions,
    colors,
    linePositions: new Float32Array(linePos),
    lineColors: new Float32Array(lineCol),
  };
}

export default function NeuralSphere() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const isTablet = useIsTablet();
  const lowPower = useLowPower();

  const count = lowPower ? 500 : isTablet ? 900 : 1800;
  const radius = 2.4;
  const linkDist = lowPower ? 0.5 : isTablet ? 0.42 : 0.34;
  // Keep nodes small in low-power mode — large additive points cause heavy
  // overdraw, the main iOS bottleneck.
  const nodeSize = lowPower ? 0.05 : 0.045;

  const geo = useMemo(
    () => buildSphere(count, radius, linkDist),
    [count, radius, linkDist]
  );

  useFrame((_, delta) => {
    if (!group.current) return;
    // Constant slow spin.
    group.current.rotation.y += delta * 0.08;
    // Mouse parallax tilt — eased.
    const targetX = pointer.y * 0.25;
    const targetZ = pointer.x * 0.15;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.04;
  });

  return (
    <group ref={group}>
      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[geo.linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[geo.lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[geo.positions, 3]}
          />
          <bufferAttribute attach="attributes-color" args={[geo.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={nodeSize}
          vertexColors
          transparent
          opacity={1}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Soft inner core glow */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial
          color={PURPLE}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
