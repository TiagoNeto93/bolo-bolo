import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getGalleryImages } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const metadata: Metadata = {
  title: "Galeria | Bolo-Bolo",
  description: "Espreita os meus bolos em fotografia.",
};

export default async function GaleriaPage() {
  const images = await getGalleryImages();

  return (
    <main className="flex-1 flex flex-col">
      <div className="px-6 py-16 max-w-6xl mx-auto w-full">
        <div className="stagger-children">
          <p className="text-sm uppercase tracking-[0.25em] text-dusty-rose">
            O meu trabalho
          </p>
          <h1 className="mt-2 font-heading text-4xl md:text-5xl text-espresso">
            Galeria
          </h1>
          <p className="mt-4 text-lg text-warm-brown max-w-xl">
            Cada bolo é feito com carinho, aqui ficam alguns dos meus favoritos.
          </p>
        </div>

        {images.length === 0 ? (
          <div className="mt-20 text-center text-warm-brown">
            <p className="text-xl font-heading">Em breve!</p>
            <p className="mt-2 opacity-70">Estou a preparar as fotos — volta mais tarde.</p>
          </div>
        ) : (
          <div className="mt-12 columns-1 sm:columns-2 lg:columns-3 gap-5">
            {images.map((img: { _id: string; image: object; alt?: string; title?: string }, i: number) => (
              <div key={img._id} className="break-inside-avoid mb-5 group relative overflow-hidden rounded-2xl bg-parchment">
                <Image
                  src={urlFor(img.image).width(600).url()}
                  alt={img.alt ?? img.title ?? "Bolo feito em casa"}
                  width={600}
                  height={0}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
                  style={{ height: "auto" }}
                  priority={i < 3}
                />
                {img.title && (
                  <div className="absolute inset-x-0 bottom-0 px-4 py-3 bg-gradient-to-t from-espresso/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium">{img.title}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/contacto" className="btn-primary">
            Quero encomendar um bolo
          </Link>
        </div>
      </div>
    </main>
  );
}
