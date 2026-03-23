import type { Metadata } from "next";
import Link from "next/link";
import OvenAnimation from "./_components/oven-animation";
import { getHomepageContent } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Encomenda enviada | Bolo-Bolo",
};

const DEFAULT_TITULO = "Obrigado pela preferência, a tua encomenda está no forno";
const DEFAULT_TEXTO = "Estás oficialmente cada vez mais perto de uma garfada de felicidade! 🍰✨\nAgora só tens de aguentar até que o bolo esteja pronto.\nFalo contigo em breve, por WhatsApp ou email para combinarmos tudo ao pormenor.";

export default async function ConfirmacaoPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const [{ ref }, cms] = await Promise.all([
    searchParams,
    getHomepageContent(),
  ]);

  const titulo = cms?.confirmacaoTitulo ?? DEFAULT_TITULO;
  const texto = cms?.confirmacaoTexto ?? DEFAULT_TEXTO;

  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="stagger-children max-w-md">
        <OvenAnimation />
        <h1 className="font-heading text-4xl text-espresso mt-4">
          {titulo}
        </h1>
        <p className="mt-5 text-warm-brown leading-relaxed whitespace-pre-line">
          {texto}
        </p>
        {ref && (
          <div className="mt-6 px-5 py-4 bg-parchment rounded-2xl border border-honey/30 text-sm text-warm-brown">
            A tua referência é{" "}
            <span className="font-semibold text-espresso tracking-wide">{ref}</span>
            {" "}— guarda-a para qualquer questão.{" "}
            <Link
              href={`/encomenda/${ref}`}
              className="text-terracotta hover:underline font-medium"
            >
              Ver estado da encomenda →
            </Link>
          </div>
        )}
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
