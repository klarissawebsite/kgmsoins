"use client";

import { useRef, MouseEvent, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useIsMobile } from "@/lib/hooks";

type Props = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  strength?: number;
};

/**
 * A button/link that drifts toward the cursor (magnetic pull) and softly
 * returns on leave. Pull is disabled on touch devices.
 */
export default function MagneticButton({
  href,
  onClick,
  children,
  className = "",
  strength = 0.4,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const isMobile = useIsMobile();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  // Inner content drifts slightly more than the shell for depth.
  const innerX = useTransform(sx, (v) => v * 0.35);
  const innerY = useTransform(sy, (v) => v * 0.35);

  const handleMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 font-display font-medium tracking-tight cursor-pointer ${className}`}
    >
      {/* Animated gradient fill */}
      <span className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-700 opacity-100 transition-opacity duration-500" />
      <span className="absolute inset-0 bg-gradient-to-r from-brand-700 to-brand-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {/* Glow */}
      <span className="absolute inset-0 rounded-full opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-60 bg-gradient-to-r from-brand-500 to-brand-700" />
      <motion.span
        style={{ x: innerX, y: innerY }}
        className="relative z-10 flex items-center gap-2 text-white"
      >
        {children}
      </motion.span>
    </motion.a>
  );
}
