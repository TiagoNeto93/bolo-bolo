import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderItem = { produto: string; tamanho: string };

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nome, contacto, items, data, zona, notas } = body as {
    nome: string;
    contacto: string;
    items: OrderItem[];
    data: string;
    zona: string;
    notas: string;
  };

  if (!nome || !contacto) {
    return NextResponse.json({ error: "Campos obrigatórios em falta." }, { status: 400 });
  }

  const validItems = (items ?? []).filter((i) => i.produto);
  const firstProduct = validItems[0]?.produto;

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
    subject: `Nova encomenda${firstProduct ? ` — ${firstProduct}` : ""}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #F5F0E8; border-radius: 12px;">
        <h1 style="color: #3B2314; font-size: 24px; margin-bottom: 4px;">Nova encomenda</h1>
        <p style="color: #C4653A; font-size: 14px; margin-top: 0;">Bolo-Bolo</p>
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

  return NextResponse.json({ ok: true });
}
