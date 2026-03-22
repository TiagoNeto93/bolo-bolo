import type { Metadata } from "next";
import Link from "next/link";
import { getEncomendaByReferencia } from "@/lib/sanity/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Estado da encomenda | Bolo-Bolo",
};

const ESTADO_LABELS: Record<string, string> = {
  pendente: "A aguardar confirmação",
  confirmada: "Confirmada",
  em_preparacao: "Em preparação",
  entregue: "Entregue",
  cancelada: "Cancelada",
};

const ESTADO_STYLES: Record<string, string> = {
  pendente: "bg-honey/20 text-espresso border-honey/40",
  confirmada: "bg-sage/20 text-espresso border-sage/40",
  em_preparacao: "bg-terracotta/15 text-terracotta border-terracotta/30",
  entregue: "bg-sage/30 text-espresso border-sage/50",
  cancelada: "bg-parchment text-warm-brown/60 border-parchment",
};

export default async function EncomendaStatusPage({
  params,
}: {
  params: Promise<{ referencia: string }>;
}) {
  const { referencia } = await params;
  const encomenda = await getEncomendaByReferencia(referencia);

  if (!encomenda) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="max-w-md stagger-children">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="font-heading text-3xl text-espresso">
            Encomenda não encontrada
          </h1>
          <p className="mt-4 text-warm-brown leading-relaxed">
            Não encontrámos nenhuma encomenda com a referência{" "}
            <span className="font-semibold text-espresso tracking-wide">
              {referencia}
            </span>
            . Confirma se copiaste corretamente.
          </p>
          <Link href="/encomenda" className="btn-primary mt-8 inline-flex">
            Tentar novamente
          </Link>
        </div>
      </main>
    );
  }

  const estadoLabel = ESTADO_LABELS[encomenda.estado] ?? encomenda.estado;
  const estadoStyle =
    ESTADO_STYLES[encomenda.estado] ?? "bg-parchment text-warm-brown border-parchment";

  const [y, m, d] = (encomenda.data ?? "").split("-").map(Number);
  const dataFormatada =
    encomenda.data
      ? new Date(y, m - 1, d).toLocaleDateString("pt-PT", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md w-full stagger-children">
        <h1 className="font-heading text-4xl text-espresso">
          Estado da encomenda
        </h1>

        <div className="mt-8 bg-white rounded-3xl border border-parchment p-6 text-left space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <span className="font-semibold text-espresso tracking-wide text-sm">
              {encomenda.referencia}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${estadoStyle}`}
            >
              {estadoLabel}
            </span>
          </div>

          <hr className="border-parchment" />

          <div className="space-y-2 text-sm text-warm-brown">
            <p>
              <span className="text-espresso font-medium">Nome:</span>{" "}
              {encomenda.nome}
            </p>
            {dataFormatada && (
              <p>
                <span className="text-espresso font-medium">
                  Data desejada:
                </span>{" "}
                {dataFormatada}
              </p>
            )}
          </div>
        </div>

        <p className="mt-6 text-xs text-warm-brown/60">
          Para alterações ou dúvidas, contacta-nos via WhatsApp com esta
          referência.
        </p>

        <Link
          href="/encomenda"
          className="mt-8 inline-flex items-center text-sm text-terracotta hover:underline"
        >
          ← Ver outra encomenda
        </Link>
      </div>
    </main>
  );
}
