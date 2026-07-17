"use client";

import { useMemo, useRef, MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildAllShapes, FEATURE_COLORS } from "./shapes";
import { useIsTablet, useLowPower } from "@/lib/hooks";

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/**
 * A single particle cloud that morphs through the 7 feature shapes as the
 * `progressRef` (0..1) advances. Positions ease toward the interpolated
 * target each frame for an organic, flowing transition. Colour blends across
 * the per-feature palette.
 */
export default function MorphParticles({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const isTablet = useIsTablet();
  const lowPower = useLowPower();
  const count = lowPower ? 900 : isTablet ? 2200 : 4000;
  // Small points in low-power mode — large additive sprites cause the overdraw
  // that throttles iOS Safari.
  const pointSize = lowPower ? 0.05 : 0.05;

  const shapes = useMemo(() => buildAllShapes(count), [count]);
  const numShapes = shapes.length;

  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);

  // Live position buffer starts on shape 0.
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    arr.set(shapes[0]);
    return arr;
  }, [count, shapes]);

  const tmpColor = useMemo(() => new THREE.Color(), []);

  useFrame((_, delta) => {
    const p = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    const s = p * (numShapes - 1);
    const i0 = Math.min(Math.floor(s), numShapes - 1);
    const i1 = Math.min(i0 + 1, numShapes - 1);
    const frac = smoothstep(s - i0);

    const a = shapes[i0];
    const b = shapes[i1];

    const geom = pointsRef.current?.geometry;
    if (!geom) return;
    const attr = geom.getAttribute("position") as THREE.BufferAttribute;
    const live = attr.array as Float32Array;

    // Ease live positions toward the interpolated target.
    const ease = Math.min(1, delta * 6);
    for (let k = 0; k < live.length; k++) {
      const target = a[k] + (b[k] - a[k]) * frac;
      live[k] += (target - live[k]) * ease;
    }
    attr.needsUpdate = true;

    // Slow auto-rotation.
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.12;
      pointsRef.current.rotation.x = Math.sin(p * Math.PI) * 0.15;
    }

    // Blend colour.
    if (matRef.current) {
      tmpColor
        .copy(FEATURE_COLORS[i0])
        .lerp(FEATURE_COLORS[i1], frac);
      matRef.current.color.copy(tmpColor);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={pointSize}
        color={FEATURE_COLORS[0]}
        transparent
        opacity={1}
        sizeAttenuation
        blending={THREE.NormalBlending}
        depthWrite={false}
      />
    </points>
  );
}
