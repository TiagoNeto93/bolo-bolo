export const encomenda = {
  name: "encomenda",
  title: "Encomenda",
  type: "document",
  fields: [
    {
      name: "referencia",
      title: "Referência",
      type: "string",
      readOnly: true,
    },
    {
      name: "estado",
      title: "Estado",
      type: "string",
      options: {
        list: [
          { title: "Pendente", value: "pendente" },
          { title: "Confirmada", value: "confirmada" },
          { title: "Em preparação", value: "em_preparacao" },
          { title: "Entregue", value: "entregue" },
          { title: "Cancelada", value: "cancelada" },
        ],
        layout: "dropdown",
      },
      initialValue: "pendente",
    },
    { name: "nome", title: "Nome", type: "string" },
    { name: "contacto", title: "Contacto", type: "string" },
    { name: "data", title: "Data desejada", type: "date" },
    { name: "zona", title: "Zona de entrega", type: "string" },
    {
      name: "items",
      title: "Bolos",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "produto", title: "Produto", type: "string" },
            { name: "tamanho", title: "Tamanho", type: "string" },
            { name: "productId", title: "ID do produto", type: "string", readOnly: true },
            { name: "preco", title: "Preço (€)", type: "number", readOnly: true },
          ],
        },
      ],
    },
    { name: "notas", title: "Notas", type: "text" },
    { name: "precoEntrega", title: "Custo de entrega (€)", type: "number", readOnly: true },
    { name: "precoTotal", title: "Total (€)", type: "number", readOnly: true },
    {
      name: "requerRevisao",
      title: "⚠ Requer revisão",
      type: "boolean",
      readOnly: true,
      description: "Definido automaticamente quando: um produto não existe no catálogo, o total não foi calculado, ou o total é €0.",
    },
  ],
  preview: {
    select: {
      referencia: "referencia",
      estado: "estado",
      nome: "nome",
      data: "data",
      precoTotal: "precoTotal",
      requerRevisao: "requerRevisao",
    },
    prepare({ referencia, estado, nome, data, precoTotal, requerRevisao }: Record<string, any>) {
      const estadoLabel: Record<string, string> = {
        pendente: "Pendente",
        confirmada: "Confirmada",
        em_preparacao: "Em preparação",
        entregue: "Entregue",
        cancelada: "Cancelada",
      };
      const total = precoTotal != null ? ` · €${precoTotal}` : "";
      const alerta = requerRevisao ? "⚠ " : "";
      return {
        title: `${alerta}${referencia ?? "—"} · ${nome ?? "—"}${total}`,
        subtitle: `${estadoLabel[estado] ?? "Pendente"} · ${data ?? "sem data"}`,
      };
    },
  },
};
