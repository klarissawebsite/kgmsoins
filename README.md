# KGM Soins

Refonte Next.js du site KGM Soins, basee sur le systeme UI/UX Aurex mais adaptee aux soins a domicile, au maintien a domicile et a l'accompagnement humain.

## Stack

- Next.js App Router
- Tailwind CSS
- Framer Motion, GSAP, Lenis
- Three.js hero animation
- Supabase REST pour les demandes d'evaluation et les messages du chatbot

## Assets

Les assets modifiables sont dans `public/assets`:

- `kgm-hero-home-care.png`
- `kgm-accompagnement.png`
- `kgm-mark.svg`
- `care-path.svg`

## Variables requises

- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Les secrets doivent etre configures dans Vercel/Railway, jamais committes.

## Supabase

Le SQL de base est dans `supabase/schema.sql`.

## Deploiement

Le projet est prevu pour Vercel avec integration GitHub. Une fois le projet Vercel connecte au repo GitHub, chaque push sur la branche principale declenche un redeploiement.
