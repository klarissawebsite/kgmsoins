"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the viewport is below `breakpoint` (default 768px).
 * Used to swap heavy Three.js scenes for static fallbacks on mobile.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpoint]);

  return isMobile;
}

/** Tablet range — keeps 3D but reduces particle counts / disables mouse parallax. */
export function useIsTablet(): boolean {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (max-width: 1279px)");
    const update = () => setIsTablet(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isTablet;
}

/** Respects the user's reduced-motion preference. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

/** True once the component has mounted on the client (avoids SSR hydration mismatch). */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * Detects when the browser is rendering WebGL in software (no GPU acceleration)
 * — e.g. Chrome with hardware acceleration disabled / GPU blocklisted, which
 * falls back to SwiftShader or "Microsoft Basic Render Driver" (WARP). In that
 * state we drastically cut scene cost so the page stays usable.
 */
export function useIsSoftwareRenderer(): boolean {
  const [software, setSoftware] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = (canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
      if (!gl) {
        setSoftware(true);
        return;
      }
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = dbg
        ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
        : "";
      setSoftware(
        /swiftshader|llvmpipe|software|basic render|microsoft basic/i.test(
          renderer
        )
      );
    } catch {
      setSoftware(false);
    }
  }, []);

  return software;
}

/** True on phones OR when the GPU isn't accelerating WebGL — use to scale down 3D. */
export function useLowPower(): boolean {
  const isMobile = useIsMobile();
  const isSoftware = useIsSoftwareRenderer();
  return isMobile || isSoftware;
}
