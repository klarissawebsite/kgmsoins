"use client";

import { createElement, ElementType, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks";

type Line = string | { text: string; className?: string };

/**
 * Heading whose lines rise from behind a clean mask — REVEALED BY SCROLL.
 *
 * Where {@link RevealText} fires a one-shot Framer reveal when it enters view,
 * each line here is tied to scroll position via a *scrubbed* GSAP ScrollTrigger,
 * so the type tracks the scrollbar (the lusion.co "scroll authors the motion"
 * feel). Lines are overflow-masked and slide up (yPercent 110 → 0) with a
 * stagger as the heading moves through the `start`→`end` band.
 *
 * Reduced-motion users get the text statically (fully visible, no transforms).
 * The markup is identical on server and client, so there's no hydration
 * mismatch — the hidden start state is only set client-side, and only when
 * motion is allowed.
 */
export default function ScrollRevealHeading({
  lines,
  as = "h2",
  className = "",
  lineClassName = "",
  start = "top 85%",
  end = "top 45%",
  stagger = 0.12,
}: {
  lines: Line[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  start?: string;
  end?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    gsap.registerPlugin(ScrollTrigger);
    const inners = el.querySelectorAll<HTMLElement>("[data-reveal-line]");
    if (!inners.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        inners,
        { yPercent: 110 },
        {
          yPercent: 0,
          ease: "none",
          stagger,
          scrollTrigger: { trigger: el, start, end, scrub: true },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced, start, end, stagger]);

  return createElement(
    as,
    { ref, className },
    lines.map((line, i) => {
      const text = typeof line === "string" ? line : line.text;
      const lineCls = typeof line === "string" ? "" : line.className ?? "";
      return (
        <span key={i} className={`block overflow-hidden ${lineClassName}`}>
          <span
            data-reveal-line
            className={`block [padding-bottom:0.12em] will-change-transform ${lineCls}`}
          >
            {text}
          </span>
        </span>
      );
    }),
  );
}
