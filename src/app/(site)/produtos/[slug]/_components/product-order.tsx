"use client";

import Link from "next/link";
import { useState } from "react";

type Size = { label: string; price: number };

export function ProductOrder({
  productName,
  sizes,
}: {
  productName: string;
  sizes: Size[];
}) {
  const [selected, setSelected] = useState<string>(
    sizes.length === 1 ? sizes[0].label : ""
  );

  const href =
    `/contacto?produto=${encodeURIComponent(productName)}` +
    (selected ? `&tamanho=${encodeURIComponent(selected)}` : "");

  return (
    <div className="mt-8">
      {sizes.length > 0 && (
        <>
          <h2 className="font-heading text-xl text-espresso mb-3">
            Tamanhos e preços
          </h2>
          <div className="flex flex-col gap-2">
            {sizes.map((size) => (
              <button
                key={size.label}
                type="button"
                onClick={() => setSelected(size.label)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                  selected === size.label
                    ? "border-terracotta bg-terracotta/5 ring-1 ring-terracotta"
                    : "border-parchment bg-white hover:border-terracotta/50"
                }`}
              >
                <span className="text-warm-brown">{size.label}</span>
                <span className="font-medium text-terracotta">€{size.price}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="mt-8">
        <Link
          href={href}
          className={`btn-primary ${sizes.length > 0 && !selected ? "opacity-50 pointer-events-none" : ""}`}
          aria-disabled={sizes.length > 0 && !selected}
        >
          Fazer encomenda
        </Link>
        {sizes.length > 0 && !selected && (
          <p className="mt-2 text-sm text-warm-brown opacity-70">
            Escolhe um tamanho para continuar.
          </p>
        )}
      </div>

      <p className="mt-4 text-sm text-warm-brown opacity-70">
        Confirmo disponibilidade e datas via WhatsApp.
      </p>
    </div>
  );
}
