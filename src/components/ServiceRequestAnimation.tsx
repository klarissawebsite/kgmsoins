"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/lib/hooks";

const requestSteps = [
  {
    role: "Famille",
    text: "Bonjour, je cherche de l'aide pour ma tante après son retour à domicile.",
    align: "left",
  },
  {
    role: "KGM Soins",
    text: "Bien sûr. Est-ce surtout pour l'accompagnement, les soins infirmiers ou la convalescence ?",
    align: "right",
  },
  {
    role: "Famille",
    text: "Elle vit seule et se déplace difficilement. Une évaluation aiderait beaucoup.",
    align: "left",
  },
  {
    role: "KGM Soins",
    text: "Demande reçue. On vous oriente vers le bon service avec une évaluation gratuite.",
    align: "right",
  },
] as const;

export default function ServiceRequestAnimation() {
  const [visibleCount, setVisibleCount] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const timers: number[] = [];
    const reveal = () => {
      setVisibleCount(0);
      requestSteps.forEach((_, index) => {
        timers.push(window.setTimeout(() => setVisibleCount(index + 1), 650 + index * 1450));
      });
    };

    reveal();
    const cycle = window.setInterval(reveal, 8200);
    return () => {
      window.clearInterval(cycle);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const typing = visibleCount < requestSteps.length;
  const maxVisible = isMobile ? 2 : 3;
  const visibleSteps = requestSteps.slice(Math.max(0, visibleCount - maxVisible), visibleCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[390px]"
      aria-label="Simulation de demande de service à domicile"
    >
      <div className="relative overflow-hidden rounded-[1.6rem] border border-brand-100 bg-white/90 p-3 shadow-[0_18px_44px_rgba(23,49,58,0.12)]">
        <div className="flex items-center justify-between rounded-[1.2rem] bg-paper-soft px-4 py-3">
          <div>
            <p className="font-body text-[11px] uppercase tracking-[0.2em] text-brand-700">Évaluation</p>
            <p className="mt-1 font-display text-sm font-semibold text-night">KGM Soins</p>
          </div>
          <motion.div
            className="h-3 w-3 rounded-full bg-sage-400"
            animate={{ scale: [1, 1.45, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="relative h-[300px] overflow-hidden px-1 py-5 sm:h-[390px]">
          <div className="absolute inset-x-1 bottom-5 space-y-3">
            <AnimatePresence>
              {visibleSteps.map((step) => (
                <motion.div
                  key={`${step.role}-${step.text}`}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex ${step.align === "right" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[86%] rounded-2xl px-4 py-3 ${
                      step.align === "right"
                        ? "bg-brand-600 text-white"
                        : "border border-brand-100 bg-paper text-night"
                    }`}
                  >
                    <p className={`font-body text-[10px] uppercase tracking-[0.16em] ${step.align === "right" ? "text-white/70" : "text-brand-700"}`}>
                      {step.role}
                    </p>
                    <p className="mt-1 font-body text-sm leading-relaxed">{step.text}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {typing && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.24 }}
                  className={`flex ${visibleCount % 2 === 1 ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-center gap-1.5 rounded-2xl border border-brand-100 bg-white px-4 py-3">
                    {[0, 1, 2].map((dot) => (
                      <motion.span
                        key={dot}
                        className="h-1.5 w-1.5 rounded-full bg-brand-500"
                        animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: dot * 0.14 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[1.1rem] border border-brand-100 bg-white px-4 py-3">
          <p className="truncate font-body text-sm text-night-faint">Décrire la situation...</p>
          <motion.span
            className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-500 text-sm font-semibold text-white"
            animate={{ x: [0, 2, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            →
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}
