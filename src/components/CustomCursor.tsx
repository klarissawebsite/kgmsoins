"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 620, damping: 36, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 620, damping: 36, mass: 0.35 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse), (max-width: 767px)").matches) return;
    setEnabled(true);
    document.body.style.cursor = "none";

    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      setHover(!!target?.closest("a, button, input, textarea, select, [data-cursor]"));
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
      <motion.svg
        viewBox="0 0 44 44"
        className="-translate-x-1 -translate-y-1 drop-shadow-[0_8px_16px_rgba(47,118,136,0.24)]"
        animate={{ width: hover ? 42 : 30, height: hover ? 42 : 30, rotate: hover ? -8 : 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 24 }}
      >
        <motion.path
          d="M6 4 L37 20 L22 25 L15 39 Z"
          animate={{
            fill: hover ? "rgba(255,255,255,0.72)" : "rgba(63,148,168,0.95)",
            stroke: hover ? "rgba(47,118,136,0.95)" : "rgba(255,255,255,0.85)",
            strokeWidth: hover ? 2.4 : 1.4,
          }}
        />
      </motion.svg>
    </motion.div>
  );
}
