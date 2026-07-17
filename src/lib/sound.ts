// Asset-free UI sound design via the Web Audio API. Off by default.

let ctx: AudioContext | null = null;
let enabled = false;

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function loadSoundPref(): boolean {
  try {
    enabled = localStorage.getItem("kgm_sound") === "1";
  } catch {
    enabled = false;
  }
  return enabled;
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function setSoundEnabled(v: boolean): void {
  enabled = v;
  try {
    localStorage.setItem("kgm_sound", v ? "1" : "0");
  } catch {
    /* ignore */
  }
  if (v) ensureCtx();
  window.dispatchEvent(new CustomEvent("kgm:sound", { detail: v }));
}

function blip(freq: number, dur: number, vol: number, type: OscillatorType): void {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g);
  g.connect(c.destination);
  const t = c.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export function playHover(): void {
  blip(880, 0.05, 0.025, "sine");
}

export function playClick(): void {
  blip(440, 0.11, 0.05, "triangle");
}
