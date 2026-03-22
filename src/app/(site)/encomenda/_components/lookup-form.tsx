"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LookupForm() {
  const router = useRouter();
  const [ref, setRef] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = ref.trim().toUpperCase();
    if (trimmed) router.push(`/encomenda/${trimmed}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={ref}
        onChange={(e) => setRef(e.target.value)}
        placeholder="BB-20260322-4F2A"
        className="flex-1 px-4 py-3 rounded-full border border-parchment bg-white text-espresso placeholder:text-warm-brown/40 focus:outline-none focus:border-terracotta text-sm tracking-wide"
        required
      />
      <button type="submit" className="btn-primary whitespace-nowrap">
        Ver estado
      </button>
    </form>
  );
}
