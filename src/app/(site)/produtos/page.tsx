import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bolos",
  description: "Cheesecakes, bolos de chocolate, bolos de cenoura e mais.",
};

export default function ProdutosPage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-24 max-w-5xl mx-auto">
      <h1 className="font-heading text-4xl md:text-5xl text-espresso">
        Os Meus Bolos
      </h1>
      <p className="mt-6 text-lg text-warm-brown">
        {/* Product grid will be populated from Sanity */}
      </p>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Product cards go here */}
      </div>
    </main>
  );
}
