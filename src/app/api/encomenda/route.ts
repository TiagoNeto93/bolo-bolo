import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanity/write-client";
const resend = new Resend(process.env.RESEND_API_KEY);

// In-memory rate limit: 3 requests per IP per hour
// Resets on cold start — sufficient combined with the honeypot field
const ipRequests = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const max = 3;
  const timestamps = (ipRequests.get(ip) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  ipRequests.set(ip, timestamps);
  return timestamps.length > max;
}

type OrderItem = { produto: string; tamanho: string; productId: string };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateReferencia(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `BB-${date}-${rand}`;
}

export async function POST(req: NextRequest) {
  // Rate limiting — by IP, 3 requests per hour (in-memory)
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Demasiados pedidos. Tenta novamente mais tarde." },
      { status: 429 }
    );
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

  type SanityProduct = { _id: string; sizes: { label: string; price: number }[] };
  type SanityZone = { zone: string; price: number };

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

  // Pre-check: fetch product prices + delivery settings (always), and date capacity (when a date
  // was given). Must run BEFORE the create to avoid Sanity's eventual-consistency lag.
  let shouldAutoBlock = false;
  let precoEntrega = 0;
  let precoTotal: number | undefined;
  let requerRevisao = false;
  try {
    // Always fetch products + delivery settings so pricing works even without a date
    const [sanityProducts, deliverySettings] = await Promise.all([
      writeClient.fetch<SanityProduct[]>(
        `*[_type == "product"]{ _id, "sizes": sizes[]{ label, price } }`
      ),
      writeClient.fetch<{ maxEncomendas?: number; zones?: SanityZone[] }>(
        `*[_type == "deliveryInfo" && _id == "deliveryInfo"][0]{ maxEncomendas, zones }`
      ),
    ]);

    // Compute server-side prices — look up by productId (immutable), not name
    for (const item of validItems) {
      const product = sanityProducts.find((p) => p._id === item.productId);
      const size = product?.sizes?.find((s) => s.label === item.tamanho);
      (item as OrderItem & { preco?: number }).preco = size?.price;
    }
    const zonePrice = deliverySettings?.zones?.find((z) => z.zone === zona)?.price ?? 0;
    const itemsTotal = validItems.reduce(
      (sum, item) => sum + ((item as OrderItem & { preco?: number }).preco ?? 0),
      0
    );
    precoEntrega = zonePrice;
    // Only store a total if at least one item had a known price — avoids storing €0 for
    // products that have no sizes defined yet
    const hasKnownPrice = validItems.some(
      (item) => (item as OrderItem & { preco?: number }).preco != null
    );
    if (hasKnownPrice) precoTotal = itemsTotal + zonePrice;

    // Flag orders that need manual review:
    // - a productId didn't match any known product
    // - total couldn't be computed (products have no sizes defined)
    // - total is €0 (suspicious — may indicate missing or incorrect pricing)
    const hasUnknownProduct = validItems.some(
      (item) => item.productId && !sanityProducts.some((p) => p._id === item.productId)
    );
    requerRevisao = hasUnknownProduct || precoTotal == null || precoTotal === 0;

    // Auto-block check — only needed when a date was given
    if (isoDate) {
      const [preCount, alreadyBlocked] = await Promise.all([
        writeClient.fetch<number>(
          `count(*[_type == "encomenda" && data == $date && estado != "cancelada"])`,
          { date: isoDate }
        ),
        writeClient.fetch<number>(
          `count(*[_type == "blockedDate" && date == $date])`,
          { date: isoDate }
        ),
      ]);
      const max = deliverySettings?.maxEncomendas ?? 2;
      shouldAutoBlock = preCount + 1 >= max && alreadyBlocked === 0;
    }
  } catch (err) {
    console.error("Pre-check error:", err);
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
        produto: item.produto,
        tamanho: item.tamanho,
        productId: item.productId || undefined,
        preco: (item as OrderItem & { preco?: number }).preco,
      })),
      notas: notas || undefined,
      precoEntrega: precoEntrega > 0 ? precoEntrega : undefined,
      precoTotal: precoTotal,
      requerRevisao: requerRevisao || undefined,
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

  const safeNome = escapeHtml(nome);
  const safeData = data ? escapeHtml(data) : null;
  const safeZona = zona ? escapeHtml(zona) : null;
  const safeNotas = notas ? escapeHtml(notas) : null;
  const safeContacto = escapeHtml(contacto);

  const itemsHtml = validItems
    .map((item) => {
      const preco = (item as OrderItem & { preco?: number }).preco;
      return `<tr>
          <td style="padding: 6px 12px 6px 0; color: #3B2314; font-weight: bold;">${escapeHtml(item.produto)}</td>
          <td style="padding: 6px 12px 6px 0; color: #5C3D2E;">${item.tamanho ? escapeHtml(item.tamanho) : "—"}</td>
          <td style="padding: 6px 0; color: #3B2314; text-align: right;">${preco != null ? `€${preco}` : "—"}</td>
        </tr>`;
    })
    .join("");

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
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
            <td style="padding: 8px 0; color: #3B2314; font-weight: bold;">${safeNome}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #5C3D2E; font-size: 13px; vertical-align: top;">Contacto</td>
            <td style="padding: 8px 0; color: #3B2314; font-weight: bold;">${safeContacto}</td>
          </tr>
          ${safeData ? `
          <tr>
            <td style="padding: 8px 0; color: #5C3D2E; font-size: 13px; vertical-align: top;">Data desejada</td>
            <td style="padding: 8px 0; color: #3B2314; font-weight: bold;">${safeData}</td>
          </tr>` : ""}
          ${safeZona ? `
          <tr>
            <td style="padding: 8px 0; color: #5C3D2E; font-size: 13px; vertical-align: top;">Zona de entrega</td>
            <td style="padding: 8px 0; color: #3B2314; font-weight: bold;">${safeZona}</td>
          </tr>` : ""}
        </table>

        ${validItems.length > 0 ? `
        <h2 style="color: #3B2314; font-size: 16px; margin: 24px 0 12px;">Bolos</h2>
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: #EDE4D3;">
              <th style="padding: 8px 12px 8px 0; color: #5C3D2E; font-size: 12px; text-align: left; font-weight: 600;">Bolo</th>
              <th style="padding: 8px 12px 8px 0; color: #5C3D2E; font-size: 12px; text-align: left; font-weight: 600;">Tamanho</th>
              <th style="padding: 8px 0; color: #5C3D2E; font-size: 12px; text-align: right; font-weight: 600;">Preço</th>
            </tr>
          </thead>
          <tbody style="padding: 8px;">
            ${itemsHtml}
            ${precoEntrega > 0 ? `<tr><td colspan="2" style="padding: 6px 12px 6px 0; color: #5C3D2E; font-size: 13px;">Entrega (${safeZona})</td><td style="padding: 6px 0; color: #3B2314; text-align: right;">€${precoEntrega}</td></tr>` : ""}
            ${precoTotal != null ? `<tr style="border-top: 1px solid #EDE4D3;"><td colspan="2" style="padding: 8px 12px 8px 0; color: #3B2314; font-weight: bold;">Total</td><td style="padding: 8px 0; color: #C4653A; font-weight: bold; font-size: 15px; text-align: right;">€${precoTotal}</td></tr>` : ""}
          </tbody>
        </table>` : ""}

        ${safeNotas ? `
        <h2 style="color: #3B2314; font-size: 16px; margin: 24px 0 8px;">Notas</h2>
        <p style="color: #3B2314; margin: 0; background: white; padding: 12px; border-radius: 8px;">${safeNotas}</p>` : ""}

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
    const customerItemsHtml = validItems
      .map((item) => {
        const preco = (item as OrderItem & { preco?: number }).preco;
        return `<tr>
          <td style="padding: 5px 12px 5px 0; color: #3B2314;">${escapeHtml(item.produto)}</td>
          <td style="padding: 5px 12px 5px 0; color: #5C3D2E;">${item.tamanho ? escapeHtml(item.tamanho) : "—"}</td>
          <td style="padding: 5px 0; color: #3B2314; text-align: right;">${preco != null ? `€${preco}` : "—"}</td>
        </tr>`;
      })
      .join("");
    const mensagemExtra = await writeClient
      .fetch<{ emailMensagemExtra?: string }>(
        `*[_type == "homepage" && _id == "homepage"][0]{ emailMensagemExtra }`
      )
      .then((r) => r?.emailMensagemExtra ?? null)
      .catch(() => null);
    resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: contacto,
      subject: `Encomenda recebida — ${referencia}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #F5F0E8; border-radius: 12px;">
          <p style="font-family: sans-serif; font-size: 28px; font-weight: bold; color: #3B2314; margin: 0 0 4px;">Bolo<span style="color: #C4653A;">-</span>Bolo</p>
          <p style="color: #C4653A; font-size: 13px; margin: 0 0 24px;">Bolos caseiros em Braga</p>
          <hr style="border: none; border-top: 1px solid #EDE4D3; margin: 0 0 24px;" />
          <h1 style="color: #3B2314; font-size: 22px; margin: 0 0 12px;">A tua encomenda foi recebida!</h1>
          <p style="color: #5C3D2E; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
            Olá ${safeNome}, obrigada pela tua encomenda. Já a recebi e vou entrar em contacto contigo em breve pelo WhatsApp ou email para confirmarmos tudo ao pormenor.
          </p>
          ${validItems.length > 0 ? `
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; margin: 0 0 20px;">
            <thead>
              <tr style="background: #EDE4D3;">
                <th style="padding: 8px 12px 8px 0; color: #5C3D2E; font-size: 12px; text-align: left; font-weight: 600;">Bolo</th>
                <th style="padding: 8px 12px 8px 0; color: #5C3D2E; font-size: 12px; text-align: left; font-weight: 600;">Tamanho</th>
                <th style="padding: 8px 0; color: #5C3D2E; font-size: 12px; text-align: right; font-weight: 600;">Preço</th>
              </tr>
            </thead>
            <tbody>
              ${customerItemsHtml}
              ${precoEntrega > 0 ? `<tr><td colspan="2" style="padding: 5px 12px 5px 0; color: #5C3D2E; font-size: 13px;">Entrega (${safeZona})</td><td style="padding: 5px 0; color: #3B2314; text-align: right;">€${precoEntrega}</td></tr>` : ""}
              ${precoTotal != null ? `<tr style="border-top: 1px solid #EDE4D3;"><td colspan="2" style="padding: 8px 12px 8px 0; color: #3B2314; font-weight: bold;">Total</td><td style="padding: 8px 0; color: #C4653A; font-weight: bold; font-size: 15px; text-align: right;">€${precoTotal}</td></tr>` : ""}
            </tbody>
          </table>` : ""}
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
