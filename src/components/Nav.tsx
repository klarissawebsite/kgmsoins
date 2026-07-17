"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SoundToggle from "@/components/SoundToggle";

const links = [
  { href: "#pourquoi", label: "Pourquoi" },
  { href: "#services", label: "Services" },
  { href: "#demande", label: "Demande" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-night/5 bg-paper/82 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#top" className="flex items-center gap-3" aria-label="KGM Soins accueil">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-display text-sm font-semibold text-white shadow-glow-sm">
            KGM
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-night">KGM Soins</span>
        </a>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-6 pr-2 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-sm text-night/70 transition-colors duration-300 hover:text-brand-700"
              >
                {link.label}
              </a>
            ))}
          </div>
          <SoundToggle />
          <a
            href="#evaluation"
            className="rounded-full border border-night/15 bg-white/70 px-5 py-2 font-display text-sm font-medium text-night transition-all duration-300 hover:border-brand-400 hover:text-brand-700"
          >
            Evaluation gratuite
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
