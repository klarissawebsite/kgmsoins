import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Dark theme (kept for the /preview demo route — do not change) ──
        bg: "#07070f",
        "bg-soft": "#0d0d1a",
        accent: {
          DEFAULT: "#6c63ff",
          purple: "#6c63ff",
          cyan: "#00d4ff",
        },
        ink: {
          DEFAULT: "#ffffff",
          muted: "#7a7a9a",
          faint: "#4a4a66",
        },
        // Light theme (KGM Soins homepage).
        paper: {
          DEFAULT: "#FBFCFA",
          soft: "#EEF5F1",
          deep: "#DDEAE4",
        },
        night: {
          DEFAULT: "#17313A",
          muted: "#526A70",
          faint: "#8BA0A3",
        },
        brand: {
          50: "#F0F8FA",
          100: "#D9EEF2",
          200: "#B8DDE5",
          300: "#8EC7D4",
          400: "#66AFC0",
          500: "#3F94A8",
          600: "#2F7688",
          700: "#245D6C",
          DEFAULT: "#3F94A8",
        },
        sage: {
          50: "#F2F7F0",
          100: "#DDEBDA",
          200: "#BFD8B9",
          300: "#98BF90",
          400: "#74A46E",
          500: "#56834F",
          600: "#43683E",
          DEFAULT: "#74A46E",
        },
      },
      boxShadow: {
        glow: "0 22px 55px -24px rgba(63,148,168,0.42)",
        "glow-sm": "0 10px 30px -14px rgba(63,148,168,0.32)",
        card: "0 1px 2px rgba(23,49,58,0.04), 0 18px 42px -22px rgba(23,49,58,0.18)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "scroll-cue": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "30%": { opacity: "1" },
          "100%": { transform: "translateY(12px)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease forwards",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "scroll-cue": "scroll-cue 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
