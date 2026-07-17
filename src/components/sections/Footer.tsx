import { COMPANY, SEO_TERMS, SERVICES } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-brand-100 bg-night text-white">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:px-10">
        <div>
          <p className="font-display text-2xl font-semibold">{COMPANY.name}</p>
          <p className="mt-4 max-w-md font-body text-sm leading-relaxed text-white/70">
            Soins a domicile, accompagnement et soutien au maintien a domicile pour les familles de Montreal et des environs.
          </p>
          <p className="mt-4 font-body text-sm text-white/60">{COMPANY.hours}</p>
        </div>
        <div>
          <p className="font-body text-xs uppercase tracking-[0.22em] text-white/45">Services</p>
          <div className="mt-4 space-y-2">
            {SERVICES.map((service) => (
              <a key={service.id} href="#services" className="block font-body text-sm text-white/70 hover:text-white">
                {service.title}
              </a>
            ))}
          </div>
        </div>
        <div>
          <p className="font-body text-xs uppercase tracking-[0.22em] text-white/45">Recherche</p>
          <p className="mt-4 font-body text-sm leading-relaxed text-white/60">{SEO_TERMS.join(", ")}</p>
          <a href="#evaluation" className="mt-5 inline-block rounded-full bg-white px-5 py-2 font-display text-sm font-semibold text-night">
            Evaluation gratuite
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-5 text-center font-body text-xs text-white/45">
        © {new Date().getFullYear()} {COMPANY.name}. Tous droits reserves.
      </div>
    </footer>
  );
}
