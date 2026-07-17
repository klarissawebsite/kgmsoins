import * as THREE from "three";

/**
 * Procedural target shapes for the morphing particle cloud.
 * Each generator returns a Float32Array of `count * 3` positions, roughly
 * normalized to a ~3-unit radius so morphs stay visually consistent.
 */

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** 1 — Lead Management: branching network tree radiating from center. */
export function networkTree(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const branches = 7;
  for (let i = 0; i < count; i++) {
    const b = i % branches;
    const angle = (b / branches) * Math.PI * 2;
    const depth = Math.pow(Math.random(), 0.6); // cluster toward tips
    const spread = 0.25 * depth;
    const r = depth * 3;
    const sub = (Math.random() - 0.5) * spread * 3;
    pos[i * 3] = Math.cos(angle) * r + Math.cos(angle + Math.PI / 2) * sub;
    pos[i * 3 + 1] = Math.sin(angle) * r + Math.sin(angle + Math.PI / 2) * sub;
    pos[i * 3 + 2] = rand(-0.4, 0.4);
  }
  return pos;
}

/** 2 — Email Outreach: a flowing ribbon / wave sheet. */
export function ribbon(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 4;
    const x = (i / count - 0.5) * 6;
    const y = Math.sin(t) * 1.2;
    const z = Math.cos(t * 0.8) * 0.8 + rand(-0.15, 0.15);
    pos[i * 3] = x;
    pos[i * 3 + 1] = y + rand(-0.2, 0.2);
    pos[i * 3 + 2] = z;
  }
  return pos;
}

/** 3 — Inbound AI Calls: audio waveform bars along an axis. */
export function waveform(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const x = (i / count - 0.5) * 6;
    const env = Math.sin((i / count) * Math.PI); // taper at ends
    const amp =
      env * (Math.sin(i * 0.5) * 0.5 + Math.sin(i * 0.17) * 0.5 + 0.6) * 1.6;
    const y = (Math.random() - 0.5) * 2 * amp;
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = rand(-0.3, 0.3);
  }
  return pos;
}

/** 4 — Outbound AI Calls: concentric signal rings. */
export function signalRings(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const rings = 5;
  for (let i = 0; i < count; i++) {
    const ring = i % rings;
    const radius = 0.6 + ring * 0.6;
    const angle = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(angle) * radius;
    pos[i * 3 + 1] = Math.sin(angle) * radius;
    pos[i * 3 + 2] = rand(-0.2, 0.2);
  }
  return pos;
}

/** 5 — Job Tracking: a structured checklist grid. */
export function checklistGrid(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const cols = 5;
  const rows = 6;
  const cellW = 1.1;
  const cellH = 0.7;
  for (let i = 0; i < count; i++) {
    const cell = i % (cols * rows);
    const cx = cell % cols;
    const cy = Math.floor(cell / cols);
    const jitter = 0.18;
    pos[i * 3] = (cx - (cols - 1) / 2) * cellW + rand(-jitter, jitter);
    pos[i * 3 + 1] = ((rows - 1) / 2 - cy) * cellH + rand(-jitter, jitter);
    pos[i * 3 + 2] = rand(-0.25, 0.25);
  }
  return pos;
}

/** 6 — Inventory: a filled 3D cube lattice. */
export function cubeLattice(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  const n = Math.ceil(Math.cbrt(count));
  const size = 3.4;
  for (let i = 0; i < count; i++) {
    const ix = i % n;
    const iy = Math.floor(i / n) % n;
    const iz = Math.floor(i / (n * n)) % n;
    pos[i * 3] = (ix / (n - 1) - 0.5) * size + rand(-0.05, 0.05);
    pos[i * 3 + 1] = (iy / (n - 1) - 0.5) * size + rand(-0.05, 0.05);
    pos[i * 3 + 2] = (iz / (n - 1) - 0.5) * size + rand(-0.05, 0.05);
  }
  return pos;
}

/** 7 — Approval Workflows: a flowing arrow / chevron chain. */
export function arrowChain(count: number): Float32Array {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const x = (t - 0.5) * 6;
    // chevron zig-zag
    const phase = (t * 6) % 1;
    const y = (phase < 0.5 ? phase : 1 - phase) * 2 - 0.5;
    pos[i * 3] = x;
    pos[i * 3 + 1] = y + rand(-0.12, 0.12);
    pos[i * 3 + 2] = rand(-0.25, 0.25);
  }
  return pos;
}

export const SHAPE_BUILDERS = [
  networkTree,
  ribbon,
  waveform,
  signalRings,
  checklistGrid,
  cubeLattice,
  arrowChain,
];

/** Per-feature dominant colour. A violet/indigo ramp tuned to read as solid
 *  particles on the light (near-white) theme — i.e. dark enough to contrast. */
export const FEATURE_COLORS = [
  new THREE.Color("#6A46E8"), // leads
  new THREE.Color("#7C5CFF"), // email
  new THREE.Color("#5836CC"), // inbound
  new THREE.Color("#8B5CF6"), // outbound
  new THREE.Color("#6D28D9"), // jobs
  new THREE.Color("#5B21B6"), // inventory
  new THREE.Color("#9B82FF"), // approvals
];

/** Precompute all shape arrays once for a given particle count. */
export function buildAllShapes(count: number): Float32Array[] {
  return SHAPE_BUILDERS.map((fn) => fn(count));
}
