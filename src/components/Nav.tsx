"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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
          ? "border-b border-night/5 bg-paper/95 shadow-sm"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-10 md:py-4">
        <a href="#top" className="flex items-center gap-3" aria-label="KGM Soins accueil">
          <Image
            src="/assets/kgm-logo.png"
            alt=""
            width={467}
            height={534}
            priority
            sizes="48px"
            className="h-11 w-10 shrink-0 object-contain sm:h-12 sm:w-11"
          />
          <span className="font-display text-base font-semibold leading-tight tracking-tight text-night sm:text-lg">
            KGM Soins
          </span>
        </a>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
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
          <a
            href="#evaluation"
            className="whitespace-nowrap rounded-full border border-night/15 bg-white/76 px-4 py-2.5 text-center font-display text-xs font-semibold leading-none text-night shadow-sm transition-colors duration-200 hover:border-brand-400 hover:text-brand-700 sm:px-5 sm:text-sm"
          >
            Évaluation gratuite
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
