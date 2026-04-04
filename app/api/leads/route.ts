import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { createHash } from "crypto";
import { leadSchema } from "@/lib/validations/lead";
import { createServerClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  // 1. Parse do body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  // 2. Validação com Zod
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const lead = parsed.data;

  // 3. Hash do IP para LGPD compliance (não armazenamos o IP raw)
  const forwarded = request.headers.get("x-forwarded-for");
  const rawIp = forwarded ? forwarded.split(",")[0].trim() : "unknown";
  const ipHash = createHash("sha256").update(rawIp).digest("hex");

  // 4. User agent
  const userAgent = request.headers.get("user-agent") ?? "";

  // 5. Inserir no Supabase via server client (service role)
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
    console.error("[leads] Supabase insert error:", dbError.message);
    return NextResponse.json(
      { error: "Erro ao registrar. Tente novamente." },
      { status: 500 }
    );
  }

  // 6. Trigger n8n webhook após a resposta ser enviada (next/server after)
  const webhookUrl = process.env.N8N_LEAD_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_WEBHOOK_SECRET;

  if (webhookUrl && webhookSecret) {
    const payload = {
      event: "lead.novo",
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
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Secret": webhookSecret,
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
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

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
