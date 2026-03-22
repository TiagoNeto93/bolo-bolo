import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { OrderForm } from "./_components/order-form";
import { getProducts, getBlockedDates, getDeliveryInfo } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Encomendas | Bolo-Bolo",
  description: "Queres encomendar um bolo? Fala comigo!",
};

export default async function ContactoPage() {
  const [products, blockedDates, deliveryInfo] = await Promise.all([
    getProducts(),
    getBlockedDates(),
    getDeliveryInfo(),
  ]);
  const zones: { zone: string; price: number }[] = deliveryInfo?.zones ?? [];

  return (
    <main className="flex-1 flex flex-col">
      <div className="px-6 py-16 max-w-2xl mx-auto w-full">
        <div className="stagger-children">
          <p className="text-sm uppercase tracking-[0.25em] text-dusty-rose">
            Vamos começar
          </p>
          <h1 className="mt-2 font-heading text-4xl md:text-5xl text-espresso">
            Fazer uma encomenda
          </h1>
          <p className="mt-4 text-lg text-warm-brown leading-relaxed">
            Preenche o formulário e eu entro em contacto pelo WhatsApp ou email
            para confirmar todos os detalhes.
          </p>
        </div>
        <Suspense>
          <OrderForm products={products} blockedDates={blockedDates} zones={zones} />
        </Suspense>
      </div>
    </main>
  );
}
