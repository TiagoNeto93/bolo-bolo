import Link from "next/link";
import Image from "next/image";
import { getFeaturedProducts, getHomepageContent } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export default async function HomePage() {
  const [featured, cms] = await Promise.all([
    getFeaturedProducts(),
    getHomepageContent(),
  ]);

  return (
    <main className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center px-6 py-24 min-h-[85vh]">
        <div className="blob blob-honey w-72 h-72 -top-16 -left-16 sm:w-80 sm:h-80" />
        <div className="blob blob-terracotta w-56 h-56 top-1/3 -right-12 sm:w-64 sm:h-64" />
        <div className="blob blob-sage w-40 h-40 bottom-16 left-1/4 sm:w-48 sm:h-48" />
        <div className="pattern-dots absolute inset-0" />

        <div className="relative z-10 stagger-children text-center max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-dusty-rose font-medium">
            {cms?.heroTagline ?? "Bolos caseiros em Braga"}
          </p>
          <h1 className="mt-4 font-display text-7xl sm:text-8xl md:text-9xl font-bold text-espresso leading-none">
            Bolo<span className="text-terracotta">-</span>Bolo
          </h1>
          <div className="mx-auto mt-6 w-24 h-1 bg-gradient-to-r from-honey via-terracotta to-dusty-rose rounded-full" />
          <p className="mt-8 text-xl md:text-2xl text-warm-brown leading-relaxed max-w-lg mx-auto">
            {cms?.heroDescription ?? "Cheesecakes, bolos de chocolate e bolos de cenoura — feitos por mim, com amor, lá em casa."}
          </p>
          <div className="mt-10">
            <Link href="/contacto" className="btn-primary">
              {cms?.heroCta ?? "Faz a tua encomenda"}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured cakes */}
      {featured.length > 0 && (
        <section className="px-6 py-20 max-w-6xl mx-auto w-full">
          <div className="text-center mb-12 stagger-children">
            <p className="text-sm uppercase tracking-[0.25em] text-dusty-rose">
              Os meus favoritos
            </p>
            <h2 className="mt-2 font-heading text-3xl md:text-4xl text-espresso">
              Bolos em destaque
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((product: {
              _id: string;
              name: string;
              slug: string;
              description?: string;
              image?: object;
              category: string;
              sizes?: { label: string; price: number }[];
            }) => (
              <Link
                key={product._id}
                href={`/produtos/${product.slug}`}
                className="card-warm group block"
              >
                <div className="relative aspect-[4/3] bg-parchment overflow-hidden">
                  {product.image ? (
                    <Image
                      src={urlFor(product.image).width(600).height(450).fit("crop").url()}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-xl text-espresso group-hover:text-terracotta transition-colors duration-200">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="mt-1 text-sm text-warm-brown line-clamp-2 opacity-80">
                      {product.description}
                    </p>
                  )}
                  <span className="mt-3 inline-block text-sm text-terracotta font-medium">
                    Ver mais →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 text-warm-brown hover:text-terracotta transition-colors font-medium"
            >
              Ver todos os bolos →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
