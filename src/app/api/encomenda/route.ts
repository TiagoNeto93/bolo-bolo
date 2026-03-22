import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nome, contacto, produto, data, notas } = body;
  const dataFormatada = data ? data.split("-").reverse().join("/") : null;

  if (!nome || !contacto) {
    return NextResponse.json({ error: "Campos obrigatórios em falta." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Bolo-Bolo <onboarding@resend.dev>",
    to: process.env.BAKER_EMAIL!,
    subject: `Nova encomenda${produto ? ` — ${produto}` : ""}`,
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
          ${produto ? `
          <tr>
            <td style="padding: 8px 0; color: #5C3D2E; font-size: 13px; vertical-align: top;">Bolo</td>
            <td style="padding: 8px 0; color: #3B2314; font-weight: bold;">${produto}</td>
          </tr>` : ""}
          ${dataFormatada ? `
          <tr>
            <td style="padding: 8px 0; color: #5C3D2E; font-size: 13px; vertical-align: top;">Data desejada</td>
            <td style="padding: 8px 0; color: #3B2314; font-weight: bold;">${dataFormatada}</td>
          </tr>` : ""}
          ${notas ? `
          <tr>
            <td style="padding: 8px 0; color: #5C3D2E; font-size: 13px; vertical-align: top;">Notas</td>
            <td style="padding: 8px 0; color: #3B2314;">${notas}</td>
          </tr>` : ""}
        </table>
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
