import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { createHash } from "crypto";
import { leadSchema } from "@/lib/validations/lead";
import { createServerClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/leads
 * Secure lead capture endpoint with:
 * - Rate limiting (5 req/min per IP)
 * - Honeypot anti-bot validation
 * - Zod schema validation
 * - IP hashing (LGPD compliance)
 * - Supabase insert with RLS
 * - Async n8n webhook trigger
 */
export async function POST(request: NextRequest) {
  // ── 0. Rate limiting ─────────────────────────────────────────────────────
  const forwarded = request.headers.get("x-forwarded-for");
  const clientIp = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Muitas tentativas. Aguarde um momento antes de tentar novamente.",
        retryAfter: rateLimit.retryAfter,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfter),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Window": "60",
        },
      }
    );
  }

  // ── 1. Parse body ────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Payload inválido. Envie um JSON válido." },
      { status: 400 }
    );
  }

  // ── 2. Honeypot check ────────────────────────────────────────────────────
  // If honeypot field is filled, silently accept but don't process
  // (bots won't know they were caught)
  if (
    typeof body === "object" &&
    body !== null &&
    "website" in body &&
    typeof (body as Record<string, unknown>).website === "string" &&
    (body as Record<string, unknown>).website !== ""
  ) {
    // Silently return success — bot thinks it worked
    return NextResponse.json({ success: true }, { status: 200 });
  }

  // ── 3. Zod validation ────────────────────────────────────────────────────
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Dados inválidos",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const lead = parsed.data;

  // ── 4. Hash IP (LGPD compliance) ─────────────────────────────────────────
  const rawIp = clientIp;
  const ipHash = createHash("sha256").update(rawIp).digest("hex");

  // ── 5. User agent ────────────────────────────────────────────────────────
  const userAgent = request.headers.get("user-agent") ?? "";

  // ── 6. Insert into Supabase (server client with service role) ────────────
  const supabase = createServerClient();
  const { error: dbError } = await supabase.from("leads").insert({
    nome: lead.nome,
    email: lead.email,
    empresa: lead.empresa ?? null,
    cargo: lead.cargo ?? null,
    telefone: lead.telefone ?? null,
    mensagem: lead.mensagem,
    servico: lead.servico ?? null,
    origem: "site",
    utm_source: lead.utm_source ?? null,
    utm_medium: lead.utm_medium ?? null,
    utm_campaign: lead.utm_campaign ?? null,
    utm_content: lead.utm_content ?? null,
    ip_hash: ipHash,
    user_agent: userAgent,
    consentimento: lead.consentimento,
    status: "novo",
  });

  if (dbError) {
    // Log error internally but don't expose details to client
    console.error("[leads] Supabase insert error:", dbError.message);
    return NextResponse.json(
      { error: "Erro ao registrar lead. Tente novamente." },
      { status: 500 }
    );
  }

  // ── 7. Trigger n8n webhook asynchronously (after response sent) ──────────
  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  if (webhookUrl && webhookSecret) {
    const payload = {
      event: "lead.novo",
      timestamp: new Date().toISOString(),
      data: {
        nome: lead.nome,
        email: lead.email,
        empresa: lead.empresa ?? null,
        cargo: lead.cargo ?? null,
        telefone: lead.telefone ?? null,
        mensagem: lead.mensagem,
        servico: lead.servico ?? null,
        utm_source: lead.utm_source ?? null,
        utm_medium: lead.utm_medium ?? null,
        utm_campaign: lead.utm_campaign ?? null,
        utm_content: lead.utm_content ?? null,
        origem: "site",
      },
    };

    after(async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      try {
        const res = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Secret": webhookSecret,
            "X-Event-Type": "lead.novo",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        if (!res.ok) {
          console.error(
            `[leads] n8n webhook returned ${res.status}:`,
            await res.text().catch(() => "unknown")
          );
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("[leads] n8n webhook error:", msg);
      } finally {
        clearTimeout(timeout);
      }
    });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

/**
 * GET /api/leads
 * Returns 405 — only POST is allowed
 */
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed" },
    { status: 405 }
  );
}
