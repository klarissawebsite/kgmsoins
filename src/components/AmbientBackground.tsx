"use client";

import { motion } from "framer-motion";
import { useIsMobile } from "@/lib/hooks";

/**
 * Fixed full-viewport ambience that sits BEHIND all content (content is z-10).
 *
 * `theme="light"` is the KGM homepage: a clean daylight wash with slowly
 * drifting soft-blue and sage glows. Pure CSS (no WebGL cost); a cheaper static
 * variant renders on mobile where animated blur is the biggest cause of jank.
 */
export default function AmbientBackground({
  theme = "dark",
}: {
  theme?: "dark" | "light";
}) {
  const isMobile = useIsMobile();

  /* ───────────────────────────── Light theme ───────────────────────────── */
  if (theme === "light") {
    if (isMobile) {
      return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-paper" />
          <div className="absolute -left-[15%] top-[4%] h-[45vh] w-[45vh] rounded-full bg-brand-200/35 blur-[70px]" />
          <div className="absolute right-[-12%] top-[42%] h-[42vh] w-[42vh] rounded-full bg-sage-200/45 blur-[70px]" />
          <div className="dot-grid-light absolute inset-0 opacity-60" />
        </div>
      );
    }

    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-paper via-white to-paper-soft" />
        <motion.div
          className="absolute -left-[12%] top-[2%] h-[55vh] w-[55vh] rounded-full bg-brand-200/35 blur-[120px]"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[-10%] top-[32%] h-[50vh] w-[50vh] rounded-full bg-sage-200/45 blur-[120px]"
          animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[4%] left-[28%] h-[45vh] w-[45vh] rounded-full bg-brand-300/18 blur-[130px]"
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="dot-grid-light absolute inset-0 opacity-70" />
      </div>
    );
  }

  /* ──────────────────────── Dark theme (unchanged) ─────────────────────── */
  if (isMobile) {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-bg" />
        <div className="absolute -left-[15%] top-[5%] h-[45vh] w-[45vh] rounded-full bg-accent-purple/[0.10] blur-[60px]" />
        <div className="absolute right-[-10%] top-[40%] h-[40vh] w-[40vh] rounded-full bg-accent-cyan/[0.08] blur-[60px]" />
        <div className="dot-grid absolute inset-0 opacity-[0.18]" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-bg" />

      {/* Drifting glow orbs */}
      <motion.div
        className="absolute -left-[15%] top-[5%] h-[55vh] w-[55vh] rounded-full bg-accent-purple/[0.10] blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-10%] top-[35%] h-[50vh] w-[50vh] rounded-full bg-accent-cyan/[0.08] blur-[120px]"
        animate={{ x: [0, -50, 0], y: [0, 60, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[5%] left-[30%] h-[45vh] w-[45vh] rounded-full bg-accent-purple/[0.07] blur-[130px]"
        animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Faint dot grid for texture */}
      <div className="dot-grid absolute inset-0 opacity-[0.25]" />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "180px 180px",
        }}
      />
    </div>
  );
}
