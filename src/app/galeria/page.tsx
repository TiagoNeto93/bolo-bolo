import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeria",
  description: "Espreita os meus bolos em fotografia.",
};

export default function GaleriaPage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-24 max-w-6xl mx-auto">
      <h1 className="font-heading text-4xl md:text-5xl text-espresso">
        Galeria
      </h1>
      <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-6">
        {/* Masonry gallery from Sanity images */}
      </div>
    </main>
  );
}
