import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Encomendas",
  description: "Queres encomendar um bolo? Fala comigo!",
};

export default function ContactoPage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-24 max-w-3xl mx-auto">
      <h1 className="font-heading text-4xl md:text-5xl text-espresso">
        Encomendas
      </h1>
      <p className="mt-6 text-lg text-warm-brown leading-relaxed">
        Queres encomendar um bolo? Fala comigo!
      </p>
      <div className="mt-12">
        {/* Contact form / order form will go here */}
      </div>
    </main>
  );
}
