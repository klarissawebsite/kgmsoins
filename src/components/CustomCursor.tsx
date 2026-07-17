"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor: a small glowing accent dot that follows with light spring, and
 * morphs into a hollow ring over interactive elements (so it actually signals
 * "clickable"). Disabled on touch. Mounted only on the form-free homepage, so
 * hiding the native cursor is safe.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 35, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 35, mass: 0.4 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
    document.body.style.cursor = "none";

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      setHover(!!(t && t.closest("a, button, [data-cursor]")));
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[250] will-change-transform"
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full"
        animate={
          hover
            ? { width: 46, height: 46, backgroundColor: "rgba(124,92,255,0)", borderWidth: 1.5, borderColor: "rgba(124,92,255,0.85)" }
            : { width: 10, height: 10, backgroundColor: "#7C5CFF", borderWidth: 0, borderColor: "rgba(124,92,255,0)" }
        }
        transition={{ type: "spring", stiffness: 350, damping: 26 }}
        style={{ boxShadow: hover ? "none" : "0 0 14px 2px rgba(124,92,255,0.55)" }}
      />
    </motion.div>
  );
}
