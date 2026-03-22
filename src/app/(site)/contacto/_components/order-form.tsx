"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export function OrderForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    contacto: "",
    produto: searchParams.get("produto") ?? "",
    data: "",
    notas: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/encomenda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/contacto/confirmacao");
    } else {
      const data = await res.json();
      setError(data.error ?? "Algo correu mal. Tenta outra vez.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-6">
      {/* Nome */}
      <div>
        <label className="block text-sm font-medium text-espresso mb-1.5">
          O teu nome <span className="text-terracotta">*</span>
        </label>
        <input
          type="text"
          name="nome"
          required
          value={form.nome}
          onChange={handleChange}
          placeholder="Ex: Ana Silva"
          className="w-full px-4 py-3 rounded-xl border border-parchment bg-white text-espresso placeholder-warm-brown/40 focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta transition"
        />
      </div>

      {/* Contacto */}
      <div>
        <label className="block text-sm font-medium text-espresso mb-1.5">
          Email ou telemóvel <span className="text-terracotta">*</span>
        </label>
        <input
          type="text"
          name="contacto"
          required
          value={form.contacto}
          onChange={handleChange}
          placeholder="Ex: ana@email.com ou +351 912 345 678"
          className="w-full px-4 py-3 rounded-xl border border-parchment bg-white text-espresso placeholder-warm-brown/40 focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta transition"
        />
      </div>

      {/* Bolo */}
      <div>
        <label className="block text-sm font-medium text-espresso mb-1.5">
          Que bolo queres?
        </label>
        <input
          type="text"
          name="produto"
          value={form.produto}
          onChange={handleChange}
          placeholder="Ex: Cheesecake de morango, Bolo de chocolate..."
          className="w-full px-4 py-3 rounded-xl border border-parchment bg-white text-espresso placeholder-warm-brown/40 focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta transition"
        />
      </div>

      {/* Data */}
      <div>
        <label className="block text-sm font-medium text-espresso mb-1.5">
          Data desejada
        </label>
        <input
          type="date"
          name="data"
          value={form.data}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          className="w-full px-4 py-3 rounded-xl border border-parchment bg-white text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta transition"
        />
        <p className="mt-1.5 text-xs text-warm-brown opacity-70">
          {form.data
            ? `Data selecionada: ${form.data.split("-").reverse().join("/")}`
            : "Confirmarei disponibilidade via WhatsApp."}
        </p>
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-espresso mb-1.5">
          Notas ou pedidos especiais
        </label>
        <textarea
          name="notas"
          value={form.notas}
          onChange={handleChange}
          rows={4}
          placeholder="Ex: sem glúten, decoração especial, tamanho, sabores..."
          className="w-full px-4 py-3 rounded-xl border border-parchment bg-white text-espresso placeholder-warm-brown/40 focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta transition resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-primary self-start disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? "A enviar..." : "Enviar encomenda"}
      </button>
    </form>
  );
}
