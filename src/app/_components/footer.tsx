import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-espresso text-parchment mt-auto">
      {/* Soft top edge */}
      <div
        className="absolute -top-8 left-0 right-0 h-8 bg-espresso"
        style={{ clipPath: "ellipse(60% 100% at 50% 100%)" }}
      />

      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Brand + personal message */}
        <div className="text-center mb-12">
          <p className="font-display text-3xl font-semibold text-white">
            Bolo<span className="text-terracotta">-</span>Bolo
          </p>
          <p className="mt-3 text-dusty-rose text-sm max-w-xs mx-auto">
            Feito com amor, la em casa, em Braga.
            Obrigada por passares por aqui!
          </p>
        </div>

        {/* Links */}
        <nav className="dark-links flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-parchment/80">
          <Link href="/produtos" className="link-warm hover:text-white transition-colors">
            Bolos
          </Link>
          <Link href="/galeria" className="link-warm hover:text-white transition-colors">
            Galeria
          </Link>
          <Link href="/sobre" className="link-warm hover:text-white transition-colors">
            Sobre Mim
          </Link>
          <Link href="/contacto" className="link-warm hover:text-white transition-colors">
            Encomendas
          </Link>
        </nav>

        {/* Divider */}
        <div className="mx-auto mt-10 w-16 h-px bg-warm-brown/30" />

        {/* Copyright */}
        <p className="mt-6 text-center text-xs text-warm-brown/60">
          &copy; {new Date().getFullYear()} Bolo-Bolo
        </p>
      </div>
    </footer>
  );
}
