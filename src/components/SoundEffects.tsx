"use client";

import { useEffect } from "react";
import { loadSoundPref, playClick, playHover } from "@/lib/sound";

/**
 * Wires global UI sounds: a soft blip when the pointer enters a new interactive
 * element, a fuller blip on click. No-ops unless sound is enabled (nav toggle).
 * Mounted on the homepage only.
 */
export default function SoundEffects() {
  useEffect(() => {
    loadSoundPref();
    let last: Element | null = null;

    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest("a, button, [data-cursor]") ?? null;
      if (el && el !== last) {
        last = el;
        playHover();
      } else if (!el) {
        last = null;
      }
    };
    const down = () => playClick();

    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    return () => {
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
    };
  }, []);

  return null;
}
