import type { Metadata } from "next";
import Link from "next/link";
import { getDeliveryInfo } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Entrega | Bolo-Bolo",
  description: "Informações sobre zonas de entrega, preços e prazos.",
};

export default async function EntregaPage() {
  const info = await getDeliveryInfo();

  return (
    <main className="flex-1 flex flex-col">
      <div className="px-6 py-16 max-w-3xl mx-auto w-full">
        <div className="stagger-children">
          <p className="text-sm uppercase tracking-[0.25em] text-dusty-rose">
            Como funciona
          </p>
          <h1 className="mt-2 font-heading text-4xl md:text-5xl text-espresso">
            Entrega
          </h1>
          <p className="mt-4 text-lg text-warm-brown">
            Faço entregas em Braga e arredores. Confirmo sempre a disponibilidade
            antes de fechar a encomenda.
          </p>
        </div>

        {/* Lead time */}
        {info?.leadTime && (
          <div className="mt-10 flex items-start gap-4 p-5 rounded-2xl bg-white border border-parchment">
            <div className="shrink-0 w-10 h-10 rounded-full bg-honey/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-honey">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-espresso">Prazo mínimo</p>
              <p className="mt-0.5 text-warm-brown">
              Mínimo de {info.leadTime} {info.leadTime === 1 ? "dia" : "dias"} de antecedência
            </p>
            </div>
          </div>
        )}

        {/* Zones */}
        {info?.zones?.length > 0 && (
          <div className="mt-10">
            <h2 className="font-heading text-2xl text-espresso mb-4">
              Zonas e preços
            </h2>
            <div className="flex flex-col gap-2">
              {info.zones.map((z: { zone: string; price: number }, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-5 py-4 rounded-xl bg-white border border-parchment"
                >
                  <span className="text-warm-brown">{z.zone}</span>
                  <span className="font-medium text-terracotta">
                    {z.price === 0 ? "Gratuita" : `€${z.price}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {info?.notes && (
          <div className="mt-10 p-5 rounded-2xl bg-parchment/60 border border-parchment">
            <h2 className="font-heading text-xl text-espresso mb-2">
              Notas adicionais
            </h2>
            <p className="text-warm-brown leading-relaxed whitespace-pre-line">
              {info.notes}
            </p>
          </div>
        )}

        {!info && (
          <p className="mt-10 text-warm-brown opacity-60 italic">
            Informações de entrega em breve.
          </p>
        )}

        <div className="mt-12">
          <Link href="/contacto" className="btn-primary">
            Fazer uma encomenda
          </Link>
        </div>
      </div>
    </main>
  );
}
