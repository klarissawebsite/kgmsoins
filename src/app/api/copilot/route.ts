import { NextRequest, NextResponse } from "next/server";
import { COMPANY, KNOWLEDGE_BASE } from "@/lib/config";

type ChatMessage = { role: "user" | "assistant"; content: string };

type CopilotPayload = {
  message?: string;
  history?: ChatMessage[];
  page_path?: string;
  visitor_id?: string;
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function answerFor(message: string): string {
  const text = normalize(message);

  if (/(prix|tarif|cout|combien|40|60)/.test(text)) {
    return `${KNOWLEDGE_BASE.find((item) => item.topic === "tarifs")?.answer} Une evaluation telephonique gratuite permet de confirmer le service le plus adapte.`;
  }
  if (/(service|offrez|soins|infirm|accompagnement|hygiene|rendez)/.test(text)) {
    return `${KNOWLEDGE_BASE.find((item) => item.topic === "services")?.answer} Vous pouvez remplir le formulaire pour decrire la situation.`;
  }
  if (/(evaluation|formulaire|besoin|rappel|contact)/.test(text)) {
    return `${KNOWLEDGE_BASE.find((item) => item.topic === "evaluation")?.answer} Le bouton "Demander une evaluation gratuite" vous amene au formulaire.`;
  }
  if (/(hopital|hospitalisation|chirurgie|convalescence|retour)/.test(text)) {
    return "Oui. KGM Soins accompagne le retour a domicile apres une hospitalisation ou une chirurgie avec surveillance de l'etat general, conseils et soutien.";
  }

  return `${KNOWLEDGE_BASE.find((item) => item.topic === "mission")?.answer} Pour une reponse plus precise, decrivez votre situation dans le formulaire d'evaluation gratuite.`;
}

async function storeTranscript(payload: Record<string, unknown>) {
  const supabaseUrl = (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!supabaseUrl || !serviceRole) return;

  await fetch(`${supabaseUrl}/rest/v1/kgm_chat_messages`, {
    method: "POST",
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  }).catch((error) => {
    console.error("chat_store_failed", error);
  });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as CopilotPayload;
  const message = String(body.message ?? "").trim().slice(0, 1200);
  if (!message) {
    return NextResponse.json({ error: "message requis" }, { status: 400 });
  }

  const answer = answerFor(message);
  await storeTranscript({
    visitor_id: String(body.visitor_id ?? "anonymous").slice(0, 120),
    page_path: String(body.page_path ?? "/").slice(0, 300),
    message,
    answer,
    history: Array.isArray(body.history) ? body.history.slice(-8) : [],
    site: COMPANY.name,
  });

  return NextResponse.json({
    answer,
    suggested_actions: ["Demander une evaluation gratuite", "Voir les services"],
  });
}
