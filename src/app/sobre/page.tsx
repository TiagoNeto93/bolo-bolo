import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Mim",
  description: "Conhece a minha historia e como comecei a fazer bolos em casa.",
};

export default function SobrePage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-24 max-w-3xl mx-auto">
      <h1 className="font-heading text-4xl md:text-5xl text-espresso">
        Sobre Mim
      </h1>
      <p className="mt-6 text-lg text-warm-brown leading-relaxed">
        {/* Content will come from Sanity CMS */}
        Comecou como uma brincadeira na cozinha...
      </p>
    </main>
  );
}
