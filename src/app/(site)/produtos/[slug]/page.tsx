import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/sanity/queries";
import { ProductGallery } from "./_components/product-gallery";

type PageProps = { params: Promise<{ slug: string }> };

const CATEGORY_LABELS: Record<string, string> = {
  cheesecakes: "Cheesecake",
  chocolate: "Bolo de Chocolate",
  cenoura: "Bolo de Cenoura",
  outros: "Outros",
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Bolo-Bolo`,
    description: product.description ?? "Feito em casa, com amor.",
  };
}

export default async function ProdutoPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !product.available) notFound();

  const hasSizes = product.sizes?.length > 0;
  const hasFlavours = product.flavours?.length > 0;
  const hasImages = product.images?.length > 0;

  return (
    <main className="flex-1 flex flex-col">
      <div className="px-6 py-12 max-w-6xl mx-auto w-full">
        {/* Back link */}
        <Link
          href="/produtos"
          className="inline-flex items-center gap-1.5 text-sm text-warm-brown hover:text-terracotta transition-colors mb-10"
        >
          <span>←</span>
          <span>Voltar ao catálogo</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left — image gallery */}
          {hasImages ? (
            <ProductGallery images={product.images} name={product.name} />
          ) : (
            <div className="aspect-square rounded-2xl bg-parchment flex items-center justify-center opacity-40">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
            </div>
          )}

          {/* Right — product info */}
          <div className="stagger-children">
            {/* Category badge */}
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-parchment text-warm-brown">
              {CATEGORY_LABELS[product.category] ?? product.category}
            </span>

            {/* Name */}
            <h1 className="mt-3 font-heading text-4xl md:text-5xl text-espresso leading-tight">
              {product.name}
            </h1>

            {/* Description */}
            {product.description && (
              <p className="mt-5 text-lg text-warm-brown leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Sizes + prices */}
            {hasSizes && (
              <div className="mt-8">
                <h2 className="font-heading text-xl text-espresso mb-3">
                  Tamanhos e preços
                </h2>
                <div className="flex flex-col gap-2">
                  {product.sizes.map(
                    (size: { label: string; price: number }, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-parchment"
                      >
                        <span className="text-warm-brown">{size.label}</span>
                        <span className="font-medium text-terracotta">
                          €{size.price}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Flavours */}
            {hasFlavours && (
              <div className="mt-8">
                <h2 className="font-heading text-xl text-espresso mb-3">
                  Sabores disponíveis
                </h2>
                <div className="flex flex-wrap gap-2">
                  {product.flavours.map((flavour: string) => (
                    <span
                      key={flavour}
                      className="px-3 py-1 rounded-full text-sm bg-parchment text-warm-brown border border-parchment"
                    >
                      {flavour}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 items-start">
              <Link
                href={`/contacto?produto=${slug}`}
                className="btn-primary"
              >
                Fazer encomenda
              </Link>
            </div>

            <p className="mt-4 text-sm text-warm-brown opacity-70">
              Confirmo disponibilidade e datas via WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
