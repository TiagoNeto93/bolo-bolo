import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Encomenda enviada | Bolo-Bolo",
};

export default function ConfirmacaoPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="stagger-children max-w-md">
        <div className="text-6xl mb-6">🎂</div>
        <h1 className="font-heading text-4xl text-espresso">
          Encomenda recebida!
        </h1>
        <p className="mt-5 text-lg text-warm-brown leading-relaxed">
          Obrigada pelo teu pedido. Vou entrar em contacto em breve pelo
          WhatsApp ou email para confirmar todos os detalhes.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/produtos" className="btn-primary">
            Ver mais bolos
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-parchment text-warm-brown hover:border-terracotta hover:text-terracotta transition-colors text-sm font-medium"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </main>
  );
}
