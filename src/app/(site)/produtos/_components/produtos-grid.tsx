"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { urlFor } from "@/lib/sanity/image";

type Size = { label: string; price: number };

type Product = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: object;
  category: string;
  sizes?: Size[];
};

const CATEGORIES = [
  { value: "all", label: "Todos" },
  { value: "cheesecakes", label: "Cheesecakes" },
  { value: "chocolate", label: "Chocolate" },
  { value: "cenoura", label: "Cenoura" },
  { value: "outros", label: "Outros" },
];

const CATEGORY_LABELS: Record<string, string> = {
  cheesecakes: "Cheesecake",
  chocolate: "Chocolate",
  cenoura: "Cenoura",
  outros: "Outros",
};

function startingPrice(sizes?: Size[]): string {
  if (!sizes?.length) return "";
  const prices = sizes.map((s) => s.price).filter(Boolean);
  if (!prices.length) return "";
  return `A partir de €${Math.min(...prices)}`;
}

export function ProdutosGrid({ products }: { products: Product[] }) {
  const [active, setActive] = useState("all");

  const filtered =
    active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <section className="px-6 py-16 max-w-6xl mx-auto w-full">
      <div className="stagger-children">
        <p className="text-sm uppercase tracking-[0.25em] text-dusty-rose">
          O que faço
        </p>
        <h1 className="mt-2 font-heading text-4xl md:text-5xl text-espresso">
          Os Meus Bolos
        </h1>
        <p className="mt-4 text-lg text-warm-brown max-w-xl">
          Cada bolo é feito à mão, com ingredientes frescos. Escolhe o teu e
          faz uma encomenda.
        </p>
      </div>

      {/* Category filter */}
      <div className="mt-10 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActive(cat.value)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
              active === cat.value
                ? "bg-terracotta text-white shadow-md"
                : "bg-white border border-parchment text-warm-brown hover:border-terracotta hover:text-terracotta"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-20 text-center text-warm-brown">
          <p className="text-xl font-heading">Nenhum bolo por aqui... ainda!</p>
          <p className="mt-2 text-base opacity-70">
            Volta em breve — estou sempre a criar coisas novas.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((product) => (
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
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-5">
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-parchment text-warm-brown">
                  {CATEGORY_LABELS[product.category] ?? product.category}
                </span>

                <h2 className="mt-2 font-heading text-xl text-espresso group-hover:text-terracotta transition-colors duration-200">
                  {product.name}
                </h2>

                {product.description && (
                  <p className="mt-1 text-sm text-warm-brown line-clamp-2 opacity-80">
                    {product.description}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-terracotta">
                    {startingPrice(product.sizes)}
                  </span>
                  <span className="text-sm text-warm-brown group-hover:text-terracotta transition-colors">
                    Ver mais →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
