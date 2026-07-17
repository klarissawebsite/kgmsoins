/**
 * Tiny shared bridge for the hero's scroll-scrub progress.
 *
 * The hero's pinned ScrollTrigger lives in React/DOM land, but the value it
 * produces (0→1 scrub progress across the pinned range) has to reach the
 * PlasmaOrb's `useFrame` loop — which runs inside a separate, dynamically
 * imported R3F canvas subtree. A module-level singleton is the simplest
 * dependency-free channel between the two: written once per scroll tick,
 * read once per frame.
 *
 * It defaults to 0, so when the trigger never runs (mobile / reduced-motion,
 * where the hero pin is intentionally skipped) the orb reads 0 forever and
 * behaves EXACTLY as it did before this feature existed.
 */
export const heroScroll = { progress: 0 };
