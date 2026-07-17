"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const word = {
  hidden: { y: "120%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/**
 * Splits text into words and reveals them with a staggered upward slide from
 * behind a clean mask once in view. (`as` is kept for API compatibility.)
 */
export function RevealText({
  text,
  className = "",
  once = true,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  once?: boolean;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.5 }}
      className={`inline-block ${className}`}
    >
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ paddingBottom: "0.08em" }}
        >
          <motion.span variants={word} className="inline-block">
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/** Cinematic fade-up: rises, un-blurs and settles to scale as it enters view. */
export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0, filter: "blur(12px)", scale: 0.97 }}
      whileInView={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
