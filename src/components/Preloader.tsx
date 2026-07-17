"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Intro loading screen (Lusion-style). Driven by a FIXED timeline (not asset
 * loading) so it can never trap the user — it always counts 0→100 over ~1.9s,
 * then curtain-wipes away. A hard failsafe dismisses it no matter what.
 */
const DURATION = 1900; // ms to reach 100%

export default function Preloader() {
  const [shown, setShown] = useState(true);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    let raf = 0;
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      setPct(100);
      setTimeout(() => setShown(false), 200);
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      setPct((1 - Math.pow(1 - t, 3)) * 100); // easeOutCubic
      if (t < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);

    // Absolute failsafe — dismiss even if rAF is throttled/paused.
    const failsafe = setTimeout(finish, DURATION + 1200);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(failsafe);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!shown) document.documentElement.style.overflow = "";
  }, [shown]);

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          data-preloader
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-paper"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-2xl font-semibold tracking-[0.45em] text-night"
          >
            KGM SOINS
          </motion.div>
          <div className="mt-7 h-px w-52 overflow-hidden bg-night/10">
            <div
              className="h-full bg-gradient-to-r from-[#3F94A8] to-[#74A46E]"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-4 font-body text-xs tabular-nums tracking-widest text-night/40">
            {Math.round(pct)}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
