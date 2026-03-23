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

  const referencia = generateReferencia();
  const validItems = (items ?? []).filter((i) => i.produto);
  const firstProduct = validItems[0]?.produto;

  const isoDate = data
    ? (() => {
        const [d, m, y] = data.split("/");
        return `${y}-${m}-${d}`;
      })()
    : undefined;

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
      if (!isoDate) return;
      try {
        const [orderCount, deliverySettings, alreadyBlocked] = await Promise.all([
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
        if (orderCount >= max && alreadyBlocked === 0) {
          await writeClient.create({
            _type: "blockedDate",
            date: isoDate,
            reason: "Lotacao esgotada (bloqueio automatico)",
          });
        }
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

  return NextResponse.json({ ok: true, referencia });
}
