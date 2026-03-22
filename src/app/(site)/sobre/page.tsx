import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { getAboutContent } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const metadata: Metadata = {
  title: "Sobre Mim | Bolo-Bolo",
  description: "Conhece a minha história e como comecei a fazer bolos em casa.",
};

export default async function SobrePage() {
  const about = await getAboutContent();

  return (
    <main className="flex-1 flex flex-col">
      <div className="px-6 py-16 max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Photo */}
          {about?.photo && (
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-parchment lg:sticky lg:top-8">
              <Image
                src={urlFor(about.photo).width(800).height(1067).fit("crop").url()}
                alt="A baker"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Text */}
          <div className="stagger-children">
            <p className="text-sm uppercase tracking-[0.25em] text-dusty-rose">
              A minha história
            </p>
            <h1 className="mt-2 font-heading text-4xl md:text-5xl text-espresso">
              {about?.heading ?? "Sobre Mim"}
            </h1>

            {about?.body && (
              <div className="mt-8 prose prose-warm">
                <PortableText value={about.body} />
              </div>
            )}

            {!about?.body && (
              <p className="mt-8 text-lg text-warm-brown opacity-60 italic">
                Em breve — estou a escrever a minha história!
              </p>
            )}

            <div className="mt-10">
              <Link href="/contacto" className="btn-primary">
                Fazer uma encomenda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
