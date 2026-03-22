"use client";

import Image from "next/image";
import { useState } from "react";
import { urlFor } from "@/lib/sanity/image";

type SanityImage = {
  _key?: string;
  alt?: string;
  asset: { _ref: string };
};

export function ProductGallery({
  images,
  name,
}: {
  images: SanityImage[];
  name: string;
}) {
  const [selected, setSelected] = useState(0);

  const current = images[selected];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-parchment">
        <Image
          key={selected}
          src={urlFor(current).width(800).height(800).fit("crop").url()}
          alt={current.alt ?? name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img._key ?? i}
              onClick={() => setSelected(i)}
              className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                i === selected
                  ? "border-terracotta opacity-100"
                  : "border-transparent opacity-60 hover:opacity-90"
              }`}
            >
              <Image
                src={urlFor(img).width(160).height(160).fit("crop").url()}
                alt={img.alt ?? `${name} ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
