"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion, useIsMobile } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Wraps the app in a Lenis smooth-scroll instance and ties it into GSAP's
 * ScrollTrigger so scroll-driven 3D scenes stay perfectly in sync.
 * Disabled when the user prefers reduced motion, and on mobile — iOS native
 * momentum scrolling is smoother than JS-driven smoothing and avoids the
 * scroll/touch fight that causes choppiness on phones.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (reduced || isMobile) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduced, isMobile]);

  return <>{children}</>;
}
