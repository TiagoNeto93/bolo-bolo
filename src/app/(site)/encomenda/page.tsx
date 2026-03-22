import type { Metadata } from "next";
import LookupForm from "./_components/lookup-form";

export const metadata: Metadata = {
  title: "Estado da encomenda | Bolo-Bolo",
};

export default function EncomendaPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="max-w-md w-full">
        <h1 className="font-heading text-4xl text-espresso">
          Estado da encomenda
        </h1>
        <p className="mt-4 text-warm-brown leading-relaxed">
          Introduz a tua referência para ver o estado atual da encomenda.
        </p>
        <LookupForm />
      </div>
    </main>
  );
}
