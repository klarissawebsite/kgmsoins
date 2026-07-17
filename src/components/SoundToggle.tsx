"use client";

import { useEffect, useState } from "react";
import { isSoundEnabled, loadSoundPref, setSoundEnabled } from "@/lib/sound";

/** Nav pill that toggles UI sound (and unlocks the audio context on click). */
export default function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(loadSoundPref());
  }, []);

  const toggle = () => {
    const v = !isSoundEnabled();
    setSoundEnabled(v);
    setOn(v);
  };

  return (
    <button
      onClick={toggle}
      aria-label={on ? "Couper le son de l'interface" : "Activer le son de l'interface"}
      className="flex items-center gap-2 rounded-full border border-night/15 px-4 py-2 font-display text-xs font-medium text-night/70 transition-all duration-300 hover:border-brand-500/60 hover:text-brand-600"
    >
      <span className="flex h-3 items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`w-[2px] rounded-full bg-current ${on ? "animate-soundbar" : ""}`}
            style={{ height: on ? undefined : "4px", animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </span>
      {on ? "Son" : "Muet"}
    </button>
  );
}
