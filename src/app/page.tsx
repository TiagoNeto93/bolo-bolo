import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden flex flex-1 flex-col items-center justify-center px-6 py-16">
        {/* Decorative blobs */}
        <div className="blob blob-honey w-72 h-72 -top-16 -left-16 sm:w-80 sm:h-80" />
        <div className="blob blob-terracotta w-56 h-56 top-1/3 -right-12 sm:w-64 sm:h-64" />
        <div className="blob blob-sage w-40 h-40 bottom-16 left-1/4 sm:w-48 sm:h-48" />

        {/* Dot pattern */}
        <div className="pattern-dots absolute inset-0" />

        {/* Content */}
        <div className="relative z-10 stagger-children text-center max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-dusty-rose font-medium">
            Bolos caseiros em Braga
          </p>

          <h1 className="mt-4 font-display text-7xl sm:text-8xl md:text-9xl font-bold text-espresso leading-none">
            Bolo<span className="text-terracotta">-</span>Bolo
          </h1>

          <div className="mx-auto mt-6 w-24 h-1 bg-gradient-to-r from-honey via-terracotta to-dusty-rose rounded-full" />

          <p className="mt-8 text-xl md:text-2xl text-warm-brown leading-relaxed max-w-lg mx-auto">
            Cheesecakes, bolos de chocolate e bolos de cenoura
            &mdash; feitos por mim, com amor, la em casa.
          </p>

          <div className="mt-10">
            <Link href="/contacto" className="btn-primary">
              Faz a tua encomenda
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
