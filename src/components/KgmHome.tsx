"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/ui/MagneticButton";
import { RevealText } from "@/components/ui/RevealText";
import {
  COMPANY,
  FAQ_ITEMS,
  FORM_NEEDS,
  HERO_COPY,
  SEO_TERMS,
  SERVICES,
  WHY_POINTS,
} from "@/lib/config";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";
import { heroScroll } from "@/lib/heroScroll";

const SceneCanvas = dynamic(() => import("@/components/three/SceneCanvas"), { ssr: false });
const PlasmaOrb = dynamic(() => import("@/components/three/PlasmaOrb"), { ssr: false });

type Status = "idle" | "sending" | "sent" | "error";

const inputCls =
  "w-full rounded-lg border border-brand-100 bg-white px-4 py-3 font-body text-sm text-night outline-none transition focus:border-brand-400 placeholder:text-night-faint";

function Field({
  name,
  label,
  type = "text",
  required = false,
  children,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-body text-xs font-semibold uppercase tracking-[0.16em] text-night-muted">
        {label}
      </span>
      {children ?? <input name={name} type={type} required={required} className={inputCls} />}
    </label>
  );
}

function SectionTitle({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="font-body text-xs uppercase tracking-[0.28em] text-brand-600">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-night sm:text-4xl md:text-5xl">
        <RevealText text={title} />
      </h2>
      {copy && <p className="mt-5 font-body text-base leading-relaxed text-night-muted sm:text-lg">{copy}</p>}
    </div>
  );
}

export default function KgmHome() {
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const heroCopyRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (reduced || isMobile) return;
    const section = heroRef.current;
    const copy = heroCopyRef.current;
    if (!section || !copy) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=65%",
          pin: true,
          scrub: 0.7,
          onUpdate: (self) => {
            heroScroll.progress = self.progress;
          },
          onLeaveBack: () => {
            heroScroll.progress = 0;
          },
        },
      });
      tl.to(copy, { yPercent: -8, autoAlpha: 0, filter: "blur(6px)", ease: "none" }, 0);
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    const settle = window.setTimeout(refresh, 2200);
    window.addEventListener("load", refresh);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("load", refresh);
      ctx.revert();
      heroScroll.progress = 0;
    };
  }, [isMobile, reduced]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <section ref={heroRef} id="accueil" className="relative min-h-[92svh] overflow-hidden pt-20">
        <Image
          src="/assets/kgm-hero-home-care.png"
          alt="Soignante accompagnant une personne agee a domicile"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[68%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,252,250,0.96)_0%,rgba(251,252,250,0.82)_38%,rgba(251,252,250,0.18)_72%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper to-transparent" />
        <div className="pointer-events-none absolute -right-[12vmin] top-[18%] h-[52vmin] w-[52vmin] opacity-70">
          <SceneCanvas cameraZ={6.6} effects={false}>
            <PlasmaOrb />
          </SceneCanvas>
        </div>

        <div ref={heroCopyRef} className="relative z-10 mx-auto flex min-h-[82svh] w-full max-w-7xl flex-col justify-center px-6 md:px-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-body text-xs uppercase tracking-[0.32em] text-brand-700"
          >
            {HERO_COPY.eyebrow}
          </motion.p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[1.03] tracking-tight text-night sm:text-6xl md:text-7xl lg:text-8xl">
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              KGM Soins
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="block text-gradient"
            >
              {HERO_COPY.title}
            </motion.span>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.68 }}
            className="mt-7 max-w-2xl font-body text-base leading-relaxed text-night-muted sm:text-lg"
          >
            {HERO_COPY.text}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <MagneticButton href="#evaluation">Demander une evaluation gratuite</MagneticButton>
            <a
              href="#services"
              className="rounded-full border border-night/15 bg-white/70 px-6 py-3 text-center font-display text-sm font-medium text-night backdrop-blur transition hover:border-brand-300 hover:text-brand-700"
            >
              Voir les services
            </a>
          </motion.div>
        </div>
      </section>

      <section id="pourquoi" className="relative w-full py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-[0.9fr_1.1fr] md:px-10">
          <SectionTitle
            eyebrow="Pourquoi KGM Soins ?"
            title="Preserver la dignite, l'autonomie et la qualite de vie."
            copy="Chez KGM Soins, recevoir des soins a domicile signifie aussi etre ecoute, rassure et accompagne avec respect. Chaque intervention soutient autant la personne que sa famille."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {WHY_POINTS.map((point, index) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.06 }}
                className="rounded-lg border border-brand-100 bg-white/82 p-6 shadow-card"
              >
                <span className="font-display text-sm text-brand-600">0{index + 1}</span>
                <p className="mt-4 font-body text-base leading-relaxed text-night-muted">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="relative w-full bg-white/72 py-24 md:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
          <SectionTitle
            eyebrow="Nos services"
            title="Quatre facons d'aider une personne a rester chez elle en securite."
            copy="Les services sont presentes simplement pour vous orienter. L'evaluation gratuite sert a confirmer le niveau d'aide le plus adapte."
          />
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {SERVICES.map((service, index) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="rounded-lg border border-brand-100 bg-paper p-7 shadow-card"
              >
                <div className="flex items-start justify-between gap-5">
                  <h3 className="font-display text-2xl font-semibold text-night">{service.title}</h3>
                  <span className="shrink-0 rounded-full bg-sage-100 px-3 py-1 font-body text-xs font-semibold text-sage-600">
                    {service.label}
                  </span>
                </div>
                <p className="mt-4 font-body text-sm leading-relaxed text-night-muted">{service.copy}</p>
                <ul className="mt-6 space-y-3">
                  {service.points.map((point) => (
                    <li key={point} className="flex gap-3 font-body text-sm text-night-muted">
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-400" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="expertise" className="relative w-full overflow-hidden py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 md:px-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-card md:aspect-[5/6]"
          >
            <Image
              src="/assets/kgm-accompagnement.png"
              alt="Accompagnement securitaire a domicile"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </motion.div>
          <div>
            <SectionTitle
              eyebrow="Notre expertise"
              title="Une experience clinique mise au service du maintien a domicile."
              copy="KGM Soins met l'accent sur l'evaluation, la prevention, la securite et la relation humaine. L'objectif n'est pas seulement de realiser un soin, mais de rendre le quotidien plus stable et plus rassurant."
            />
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ["24/7", "Disponibilite indiquee publiquement"],
                ["4", "Categories de services claires"],
                ["0 $", "Evaluation telephonique"],
              ].map(([value, label]) => (
                <div key={label} className="border-t border-brand-100 pt-5">
                  <p className="font-display text-3xl font-semibold text-brand-700">{value}</p>
                  <p className="mt-2 font-body text-xs uppercase tracking-[0.14em] text-night-faint">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="tarifs" className="relative w-full bg-paper-soft py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-[0.9fr_1.1fr] md:px-10">
          <SectionTitle
            eyebrow="Tarifs"
            title="Des tarifs de depart, puis une orientation adaptee."
            copy="Nous evitons les grilles rigides parce que chaque situation familiale, clinique et quotidienne est differente."
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="rounded-lg border border-brand-100 bg-white p-7 shadow-card">
              <p className="font-body text-xs uppercase tracking-[0.22em] text-brand-600">Accompagnement</p>
              <p className="mt-5 font-display text-4xl font-semibold text-night">A partir de 40 $/heure</p>
            </div>
            <div className="rounded-lg border border-brand-100 bg-white p-7 shadow-card">
              <p className="font-body text-xs uppercase tracking-[0.22em] text-brand-600">Soins infirmiers</p>
              <p className="mt-5 font-display text-4xl font-semibold text-night">A partir de 60 $</p>
            </div>
            <div className="rounded-lg border border-sage-200 bg-sage-50 p-7 shadow-card sm:col-span-2">
              <p className="font-display text-2xl font-semibold text-night">Forfaits personnalises</p>
              <p className="mt-2 font-body text-sm uppercase tracking-[0.22em] text-sage-600">Bientot disponibles</p>
              <p className="mt-5 font-body text-sm leading-relaxed text-night-muted">
                Les tarifs varient selon les besoins. Une evaluation telephonique gratuite permet de vous orienter vers le service le plus adapte.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="evaluation" className="relative w-full py-24 md:py-32">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-[0.85fr_1.15fr] md:px-10">
          <SectionTitle
            eyebrow="Parlons de vos besoins"
            title="Demander une evaluation gratuite."
            copy="Le formulaire sert de premier depistage. Une personne de KGM Soins pourra ensuite clarifier la situation et proposer une prochaine etape."
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="rounded-lg border border-brand-100 bg-white p-6 shadow-card md:p-8"
          >
            {status === "sent" ? (
              <div className="flex min-h-80 flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 font-display text-lg text-sage-600">
                  OK
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-night">Votre demande a ete recue.</h3>
                <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-night-muted">
                  Merci. KGM Soins pourra vous recontacter pour completer l&apos;evaluation et confirmer le service le plus adapte.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field name="full_name" label="Nom et prenom" required />
                  <Field name="phone" label="Telephone" type="tel" required />
                </div>
                <Field name="email" label="Courriel" type="email" required />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field name="request_for" label="Pour qui demandez-vous nos services ?">
                    <select name="request_for" required className={inputCls} defaultValue="">
                      <option value="" disabled>Selectionner</option>
                      <option>Moi-meme</option>
                      <option>Parent</option>
                      <option>Conjoint(e)</option>
                      <option>Autre proche</option>
                    </select>
                  </Field>
                  <Field name="person_age" label="Quel age a la personne ?" type="number" required />
                </div>
                <Field name="primary_need" label="Quel est votre principal besoin ?">
                  <select name="primary_need" required className={inputCls} defaultValue="">
                    <option value="" disabled>Selectionner</option>
                    {FORM_NEEDS.map((need) => <option key={need}>{need}</option>)}
                  </select>
                </Field>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {[
                    ["lives_alone", "La personne vit-elle seule ?"],
                    ["mobility_difficulty", "A-t-elle des difficultes a se deplacer ?"],
                    ["caregiver_present", "Y a-t-il un proche aidant ?"],
                    ["medical_order", "Ordonnance medicale pour soins infirmiers ?"],
                  ].map(([name, label]) => (
                    <Field key={name} name={name} label={label}>
                      <select name={name} className={inputCls} defaultValue="">
                        <option value="">Je ne sais pas</option>
                        <option>Oui</option>
                        <option>Non</option>
                      </select>
                    </Field>
                  ))}
                </div>
                <Field name="message" label="Decrivez votre situation">
                  <textarea name="message" required rows={5} maxLength={2200} className={inputCls} />
                </Field>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-full bg-brand-600 px-6 py-4 font-display text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-60"
                >
                  {status === "sending" ? "Envoi en cours..." : "Demander une evaluation gratuite"}
                </button>
                {status === "error" && (
                  <p className="text-center font-body text-xs text-red-600">
                    La demande n&apos;a pas pu etre envoyee. Veuillez reessayer dans quelques instants.
                  </p>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <section id="contact" className="relative w-full bg-white/72 py-20">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 md:grid-cols-3 md:px-10">
          <div className="md:col-span-2">
            <p className="font-body text-xs uppercase tracking-[0.28em] text-brand-600">Contact</p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-night md:text-4xl">
              Une question avant de remplir le formulaire ?
            </h2>
            <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-night-muted">
              Le site est pret pour vos coordonnees officielles. Des que vous me confirmez le telephone et le courriel a afficher, ils pourront apparaitre ici et dans les metadonnees.
            </p>
          </div>
          <div className="rounded-lg border border-brand-100 bg-paper p-6 shadow-card">
            <p className="font-display text-xl font-semibold text-night">{COMPANY.name}</p>
            <p className="mt-3 font-body text-sm text-night-muted">{COMPANY.region}</p>
            <p className="mt-2 font-body text-sm text-night-muted">{COMPANY.hours}</p>
          </div>
        </div>
      </section>

      <section id="faq" className="relative w-full py-20">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-10">
          <SectionTitle eyebrow="Questions frequentes" title="Des reponses simples pour les familles." />
          <div className="mt-10 space-y-4">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="rounded-lg border border-brand-100 bg-white p-5 shadow-card">
                <summary className="cursor-pointer font-display text-lg font-semibold text-night">{item.q}</summary>
                <p className="mt-4 font-body text-sm leading-relaxed text-night-muted">{item.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 font-body text-xs leading-relaxed text-night-faint">
            Expressions utiles: {SEO_TERMS.join(", ")}.
          </p>
        </div>
      </section>
    </>
  );
}
