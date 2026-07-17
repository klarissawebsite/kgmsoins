"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * A large, soft accent glow that lags the cursor — a "light follows you" ambient
 * layer behind the content (z-5), so the whole page feels alive/reactive.
 * Desktop only; pure CSS, no WebGL cost.
 */
export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 120, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 30, mass: 0.6 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[5] will-change-transform"
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 620,
          height: 620,
          background:
            "radial-gradient(circle, rgba(124,92,255,0.12) 0%, rgba(168,139,250,0.06) 40%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}
