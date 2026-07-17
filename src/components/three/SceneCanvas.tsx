"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { useIsTablet, useLowPower } from "@/lib/hooks";

type Props = {
  children: ReactNode;
  /** Camera distance on Z. */
  cameraZ?: number;
  /** Field of view. */
  fov?: number;
  /** Bloom intensity. */
  bloom?: number;
  /** Enable postprocessing (turn off on weak hardware). */
  effects?: boolean;
  className?: string;
  dpr?: [number, number];
};

/**
 * Shared R3F canvas with a tuned bloom pass.
 *
 * Crucially, the render loop is PAUSED when the canvas scrolls out of view
 * (frameloop "never") and resumed when it returns. Without this, every scene
 * on the page keeps rendering every frame even off-screen — ~3× the GPU work
 * and the main cause of mobile jank. DPR + bloom also scale down on smaller
 * devices.
 */
export default function SceneCanvas({
  children,
  cameraZ = 6,
  fov = 50,
  bloom = 1.1,
  effects = true,
  className = "",
  dpr,
}: Props) {
  const isTablet = useIsTablet();
  const lowPower = useLowPower();

  const wrapRef = useRef<HTMLDivElement>(null);
  // Start hidden so the IntersectionObserver is the single source of truth for
  // what renders. Without this, on first paint (before mobile detection
  // resolves) all three canvases mount at once and spin up three WebGL contexts
  // at full framerate, two of which are torn down a frame later — a needless
  // load-time spike on phones. The observer flips the in-view canvas on within
  // a frame, so there's no visible delay.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      // Resume a little before it enters view so there's no blank frame.
      { rootMargin: "250px 0px 250px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Bloom (EffectComposer) is the heaviest pass — disabled on phones AND on
  // software-rendered (non-GPU) browsers. Particles use additive blending and
  // still glow without it. Resolution is capped lower on low-power targets.
  const useEffects = effects && !lowPower;
  const effectiveDpr: [number, number] =
    dpr ?? (lowPower ? [1, 1] : [1, 1.75]);
  const bloomStrength = isTablet ? bloom * 0.7 : bloom;

  // On low-power targets (mobile / software rendering) we fully UNMOUNT the
  // canvas when off-screen so only one WebGL context exists at a time — iOS
  // Safari throttles hard when juggling several. On capable desktops we keep
  // it mounted and just pause the render loop (smoother, no re-init cost).
  const shouldRender = lowPower ? visible : true;

  return (
    <div ref={wrapRef} className={`h-full w-full ${className}`}>
      {shouldRender && (
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={effectiveDpr}
        gl={{
          antialias: !lowPower,
          alpha: true,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, cameraZ], fov }}
      >
        <Suspense fallback={null}>
          {children}
          {useEffects && (
            <EffectComposer multisampling={0}>
              <Bloom
                intensity={bloomStrength}
                luminanceThreshold={0.2}
                luminanceSmoothing={0.9}
                mipmapBlur
                radius={0.8}
              />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
      )}
    </div>
  );
}
