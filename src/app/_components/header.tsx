"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/produtos", label: "Bolos" },
  { href: "/galeria", label: "Galeria" },
  { href: "/sobre", label: "Sobre Mim" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-linen/90 backdrop-blur-sm shadow-[0_1px_3px_rgba(59,35,20,0.06)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-semibold text-espresso transition-colors hover:text-terracotta hover:animate-[wiggle_0.4s_ease-in-out]"
        >
          Bolo<span className="text-terracotta">-</span>Bolo
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="link-warm text-sm font-medium text-warm-brown hover:text-terracotta transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/contacto"
              className="bg-terracotta text-white font-display text-sm font-medium rounded-full px-5 py-2 transition-all hover:bg-terracotta-dark hover:scale-105"
            >
              Encomendas
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={`md:hidden flex flex-col gap-1.5 p-2 -mr-2 ${menuOpen ? "hamburger-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-linen border-t border-parchment/50">
          <ul className="stagger-children flex flex-col px-6 py-6 gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block font-display text-xl text-espresso hover:text-terracotta transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contacto"
                className="btn-primary inline-block text-center mt-2"
                onClick={() => setMenuOpen(false)}
              >
                Encomendas
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
