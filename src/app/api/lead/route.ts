import { NextRequest, NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RATE: Map<string, number[]> = new Map();
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 60_000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (RATE.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) return true;
  hits.push(now);
  RATE.set(ip, hits);
  return false;
}

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function nullable(v: unknown, max: number): string | null {
  const value = str(v, max);
  return value || null;
}

async function insertLead(payload: Record<string, unknown>) {
  const supabaseUrl = (process.env.SUPABASE_URL ?? "").replace(/\/$/, "");
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!supabaseUrl || !serviceRole) {
    throw new Error("Supabase is not configured");
  }

  const res = await fetch(`${supabaseUrl}/rest/v1/kgm_leads`, {
    method: "POST",
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(detail || `Supabase insert failed: ${res.status}`);
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Trop de demandes. Reessayez dans une minute." }, { status: 429 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const fullName = str(body.full_name, 160);
  const phone = str(body.phone, 40);
  const email = str(body.email, 254).toLowerCase();
  const message = str(body.message, 2200);

  if (fullName.length < 2 || phone.length < 7 || !EMAIL_RE.test(email) || message.length < 10) {
    return NextResponse.json({ error: "Champs requis invalides" }, { status: 400 });
  }

  const payload = {
    full_name: fullName,
    phone,
    email,
    request_for: nullable(body.request_for, 80),
    person_age: Number.parseInt(str(body.person_age, 4), 10) || null,
    primary_need: nullable(body.primary_need, 140),
    lives_alone: nullable(body.lives_alone, 30),
    mobility_difficulty: nullable(body.mobility_difficulty, 30),
    caregiver_present: nullable(body.caregiver_present, 30),
    medical_order: nullable(body.medical_order, 30),
    message,
    page_path: nullable(body.page_path, 300),
    user_agent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
    ip_hint: ip,
  };

  try {
    await insertLead(payload);
    return NextResponse.json({ status: "received" });
  } catch (error) {
    console.error("lead_insert_failed", error);
    return NextResponse.json({ error: "La demande n'a pas pu etre enregistree" }, { status: 502 });
  }
}
