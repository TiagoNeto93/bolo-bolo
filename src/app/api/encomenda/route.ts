import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/write-client";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiter — only active when Upstash env vars are set
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(3, "1 h"),
        prefix: "bolo-bolo:encomenda",
      })
    : null;

type OrderItem = { produto: string; tamanho: string };

function generateReferencia(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `BB-${date}-${rand}`;
}

export async function POST(req: NextRequest) {
  // Rate limiting — by IP, 3 requests per hour
  if (ratelimit) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json(
        { error: "Demasiados pedidos. Tenta novamente mais tarde." },
        { status: 429 }
      );
    }
  }

  const body = await req.json();
  const { nome, contacto, items, data, zona, notas, website } = body as {
    nome: string;
    contacto: string;
    items: OrderItem[];
    data: string;
    zona: string;
    notas: string;
    website: string; // honeypot — must be empty
  };

  // Honeypot — bots fill hidden fields, humans don't
  if (website) {
    return NextResponse.json({ ok: true, referencia: "BB-00000000-0000" });
  }

  if (!nome || !contacto) {
    return NextResponse.json({ error: "Campos obrigatórios em falta." }, { status: 400 });
  }

  const isValidContacto = contacto.includes("@")
    ? /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contacto.trim())
    : /^\d{9,15}$/.test(contacto.trim().replace(/[\s\-().+]/g, ""));
  if (!isValidContacto) {
    return NextResponse.json({ error: "Contacto inválido." }, { status: 400 });
  }

  const referencia = generateReferencia();
  const validItems = (items ?? []).filter((i) => i.produto);
  const firstProduct = validItems[0]?.produto;

  const isoDate = data
    ? (() => {
        const [d, m, y] = data.split("/");
        return `${y}-${m}-${d}`;
      })()
    : undefined;

  // Pre-check: determine whether this order will hit the daily limit.
  // Must run BEFORE the create to avoid Sanity's eventual-consistency lag
  // (a count query immediately after a mutation may not see the new doc).
  let shouldAutoBlock = false;
  if (isoDate) {
    try {
      const [preCount, deliverySettings, alreadyBlocked] = await Promise.all([
        writeClient.fetch<number>(
          `count(*[_type == "encomenda" && data == $date && estado != "cancelada"])`,
          { date: isoDate }
        ),
        writeClient.fetch<{ maxEncomendas?: number }>(
          `*[_type == "deliveryInfo" && _id == "deliveryInfo"][0]{ maxEncomendas }`
        ),
        writeClient.fetch<number>(
          `count(*[_type == "blockedDate" && date == $date])`,
          { date: isoDate }
        ),
      ]);
      const max = deliverySettings?.maxEncomendas ?? 2;
      shouldAutoBlock = preCount + 1 >= max && alreadyBlocked === 0;
    } catch (err) {
      console.error("Auto-block pre-check error:", err);
    }
  }

  // Write to Sanity — non-blocking: log error but don't fail the request
  writeClient
    .create({
      _type: "encomenda",
      referencia,
      estado: "pendente",
      nome,
      contacto,
      data: isoDate,
      zona: zona || undefined,
      items: validItems.map((item) => ({
        _key: Math.random().toString(36).slice(2, 10),
        ...item,
      })),
      notas: notas || undefined,
    })
    .then(async () => {
      if (!shouldAutoBlock || !isoDate) return;
      try {
        await writeClient.create({
          _type: "blockedDate",
          date: isoDate,
          reason: "Lotacao esgotada (bloqueio automatico)",
        });
      } catch (err) {
        console.error("Auto-block error:", err);
      }
    })
    .catch((err) => console.error("Sanity write error:", err));

  const itemsHtml = validItems
    .map(
      (item) =>
        `<tr>
          <td style="padding: 6px 12px 6px 0; color: #3B2314; font-weight: bold;">${item.produto}</td>
          <td style="padding: 6px 0; color: #5C3D2E;">${item.tamanho || "—"}</td>
        </tr>`
    )
    .join("");

  const { error } = await resend.emails.send({
    from: "Bolo-Bolo <onboarding@resend.dev>",
    to: process.env.BAKER_EMAIL!,
    subject: `Nova encomenda ${referencia}${firstProduct ? ` — ${firstProduct}` : ""}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #F5F0E8; border-radius: 12px;">
        <h1 style="color: #3B2314; font-size: 24px; margin-bottom: 4px;">Nova encomenda</h1>
        <p style="color: #C4653A; font-size: 14px; margin-top: 0;">Bolo-Bolo · Referência: <strong>${referencia}</strong></p>
        <hr style="border: none; border-top: 1px solid #EDE4D3; margin: 24px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #5C3D2E; font-size: 13px; width: 120px; vertical-align: top;">Nome</td>
            <td style="padding: 8px 0; color: #3B2314; font-weight: bold;">${nome}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #5C3D2E; font-size: 13px; vertical-align: top;">Contacto</td>
            <td style="padding: 8px 0; color: #3B2314; font-weight: bold;">${contacto}</td>
          </tr>
          ${data ? `
          <tr>
            <td style="padding: 8px 0; color: #5C3D2E; font-size: 13px; vertical-align: top;">Data desejada</td>
            <td style="padding: 8px 0; color: #3B2314; font-weight: bold;">${data}</td>
          </tr>` : ""}
          ${zona ? `
          <tr>
            <td style="padding: 8px 0; color: #5C3D2E; font-size: 13px; vertical-align: top;">Zona de entrega</td>
            <td style="padding: 8px 0; color: #3B2314; font-weight: bold;">${zona}</td>
          </tr>` : ""}
        </table>

        ${validItems.length > 0 ? `
        <h2 style="color: #3B2314; font-size: 16px; margin: 24px 0 12px;">Bolos</h2>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #EDE4D3;">
              <th style="padding: 8px 12px 8px 0; color: #5C3D2E; font-size: 12px; text-align: left; font-weight: 600;">Bolo</th>
              <th style="padding: 8px 0; color: #5C3D2E; font-size: 12px; text-align: left; font-weight: 600;">Tamanho</th>
            </tr>
          </thead>
          <tbody style="padding: 8px;">
            ${itemsHtml}
          </tbody>
        </table>` : ""}

        ${notas ? `
        <h2 style="color: #3B2314; font-size: 16px; margin: 24px 0 8px;">Notas</h2>
        <p style="color: #3B2314; margin: 0; background: white; padding: 12px; border-radius: 8px;">${notas}</p>` : ""}

        <hr style="border: none; border-top: 1px solid #EDE4D3; margin: 24px 0;" />
        <p style="color: #5C3D2E; font-size: 13px; margin: 0;">Responde diretamente a esta encomenda pelo WhatsApp ou email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Erro ao enviar email." }, { status: 500 });
  }

  // Customer confirmation email — only if contacto looks like an email
  if (contacto.includes("@")) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bolo-bolo.pt";
    const statusUrl = `${siteUrl}/encomenda/${referencia}`;
    const mensagemExtra = await writeClient
      .fetch<{ emailMensagemExtra?: string }>(
        `*[_type == "homepage" && _id == "homepage"][0]{ emailMensagemExtra }`
      )
      .then((r) => r?.emailMensagemExtra ?? null)
      .catch(() => null);
    resend.emails.send({
      from: "Bolo-Bolo <onboarding@resend.dev>",
      to: contacto,
      subject: `Encomenda recebida — ${referencia}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #F5F0E8; border-radius: 12px;">
          <p style="font-family: sans-serif; font-size: 28px; font-weight: bold; color: #3B2314; margin: 0 0 4px;">Bolo<span style="color: #C4653A;">-</span>Bolo</p>
          <p style="color: #C4653A; font-size: 13px; margin: 0 0 24px;">Bolos caseiros em Braga</p>
          <hr style="border: none; border-top: 1px solid #EDE4D3; margin: 0 0 24px;" />
          <h1 style="color: #3B2314; font-size: 22px; margin: 0 0 12px;">A tua encomenda foi recebida!</h1>
          <p style="color: #5C3D2E; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
            Olá ${nome}, obrigada pela tua encomenda. Já a recebi e vou entrar em contacto contigo em breve pelo WhatsApp ou email para confirmarmos tudo ao pormenor.
          </p>
          <div style="background: white; border-radius: 10px; padding: 16px 20px; margin: 0 0 24px;">
            <p style="color: #5C3D2E; font-size: 13px; margin: 0 0 4px;">A tua referência</p>
            <p style="color: #3B2314; font-size: 22px; font-weight: bold; letter-spacing: 0.05em; margin: 0;">${referencia}</p>
          </div>
          <p style="color: #5C3D2E; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
            Guarda esta referência — podes usá-la para acompanhar o estado da encomenda a qualquer altura.
          </p>
          <a href="${statusUrl}" style="display: inline-block; background: #C4653A; color: white; font-family: sans-serif; font-size: 15px; font-weight: 600; padding: 14px 28px; border-radius: 9999px; text-decoration: none;">
            Ver estado da encomenda →
          </a>
          ${mensagemExtra ? `
          <p style="color: #C4653A; font-size: 14px; font-style: italic; margin: 20px 0 0;">${mensagemExtra}</p>` : ""}
          <hr style="border: none; border-top: 1px solid #EDE4D3; margin: 28px 0 20px;" />
          <p style="color: #9e7b6b; font-size: 12px; margin: 0;">Bolo-Bolo · Braga, Portugal</p>
        </div>
      `,
    }).catch((err) => console.error("Customer email error:", err));
  }

  return NextResponse.json({ ok: true, referencia });
}
