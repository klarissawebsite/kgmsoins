"use client";

export default function AmbientBackground({
  theme = "light",
}: {
  theme?: "dark" | "light";
}) {
  if (theme === "dark") {
    return (
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-bg">
        <div className="dot-grid absolute inset-0 opacity-[0.18]" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[linear-gradient(180deg,#fbfcfa_0%,#ffffff_42%,#eef7f4_100%)]">
      <div className="dot-grid-light absolute inset-0 opacity-55" />
    </div>
  );
}
