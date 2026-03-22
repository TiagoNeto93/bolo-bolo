"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { pt } from "date-fns/locale";

registerLocale("pt", pt);

type Size = { label: string; price: number };

type Product = {
  _id: string;
  name: string;
  slug: string;
  sizes?: Size[];
};

type OrderItem = {
  produto: string;
  tamanho: string;
};

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-parchment bg-white text-espresso placeholder-warm-brown/40 focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta transition";

function parseSanityDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function OrderForm({
  products,
  blockedDates,
}: {
  products: Product[];
  blockedDates: string[];
}) {
  const excludedDates = blockedDates.map(parseSanityDate);
  const searchParams = useSearchParams();
  const router = useRouter();

  const preselected = searchParams.get("produto") ?? "";
  const preselectedSize = searchParams.get("tamanho") ?? "";

  const [form, setForm] = useState({ nome: "", contacto: "", notas: "" });
  const [items, setItems] = useState<OrderItem[]>([
    { produto: preselected, tamanho: preselectedSize },
  ]);
  const [data, setData] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleItemChange(index: number, field: keyof OrderItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        // Reset size when product changes
        if (field === "produto") return { produto: value, tamanho: "" };
        return { ...item, [field]: value };
      })
    );
  }

  function addItem() {
    setItems((prev) => [...prev, { produto: "", tamanho: "" }]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function getSizes(productName: string): Size[] {
    return products.find((p) => p.name === productName)?.sizes ?? [];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const dataStr = data
      ? `${String(data.getDate()).padStart(2, "0")}/${String(data.getMonth() + 1).padStart(2, "0")}/${data.getFullYear()}`
      : "";

    const res = await fetch("/api/encomenda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, items, data: dataStr }),
    });

    if (res.ok) {
      router.push("/contacto/confirmacao");
    } else {
      const json = await res.json();
      setError(json.error ?? "Algo correu mal. Tenta outra vez.");
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
          className={inputClass}
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
          className={inputClass}
        />
      </div>

      {/* Cake items */}
      <div>
        <label className="block text-sm font-medium text-espresso mb-3">
          Que bolos queres? <span className="text-terracotta">*</span>
        </label>
        <div className="flex flex-col gap-3">
          {items.map((item, i) => {
            const sizes = getSizes(item.produto);
            return (
              <div
                key={i}
                className="flex flex-col sm:flex-row gap-2 items-start p-4 rounded-xl bg-white border border-parchment"
              >
                <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full">
                  {/* Product select */}
                  <select
                    required
                    value={item.produto}
                    onChange={(e) => handleItemChange(i, "produto", e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-parchment bg-white text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta transition"
                  >
                    <option value="">Escolhe um bolo…</option>
                    {products.map((p) => (
                      <option key={p._id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  {/* Size select — only if product has sizes */}
                  {sizes.length > 0 && (
                    <select
                      required
                      value={item.tamanho}
                      onChange={(e) => handleItemChange(i, "tamanho", e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-parchment bg-white text-espresso focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta transition"
                    >
                      <option value="" disabled>Escolhe um tamanho…</option>
                      {sizes.map((s) => (
                        <option key={s.label} value={s.label}>
                          {s.label} — €{s.price}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Remove button */}
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(i)}
                    className="shrink-0 p-2 text-warm-brown hover:text-terracotta transition-colors cursor-pointer"
                    aria-label="Remover bolo"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addItem}
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-terracotta hover:text-terracotta-dark font-medium transition-colors cursor-pointer"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Adicionar outro bolo
        </button>
      </div>

      {/* Data */}
      <div>
        <label className="block text-sm font-medium text-espresso mb-1.5">
          Data desejada
        </label>
        <DatePicker
          locale="pt"
          selected={data}
          onChange={(date: Date | null) => setData(date)}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          excludeDates={excludedDates}
          placeholderText="dd/mm/aaaa"
          className={inputClass}
          wrapperClassName="w-full"
          calendarClassName="!font-body !rounded-xl !border-parchment !shadow-lg"
          autoComplete="off"
        />
        <p className="mt-1.5 text-xs text-warm-brown opacity-70">
          Confirmarei disponibilidade via WhatsApp.
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
          placeholder="Ex: sem glúten, decoração especial, sabores…"
          className={`${inputClass} resize-none`}
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
