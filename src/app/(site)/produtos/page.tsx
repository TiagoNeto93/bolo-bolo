import type { Metadata } from "next";
import { getProducts } from "@/lib/sanity/queries";
import { ProdutosGrid } from "./_components/produtos-grid";

export const metadata: Metadata = {
  title: "Os Meus Bolos | Bolo-Bolo",
  description:
    "Cheesecakes, bolos de chocolate, bolos de cenoura — feitos em casa, com amor.",
};

export default async function ProdutosPage() {
  const products = await getProducts();

  return (
    <main className="flex-1 flex flex-col">
      <ProdutosGrid products={products} />
    </main>
  );
}
