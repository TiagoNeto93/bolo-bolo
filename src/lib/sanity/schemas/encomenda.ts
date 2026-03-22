export const encomenda = {
  name: "encomenda",
  title: "Encomenda",
  type: "document",
  __experimental_actions: ["update", "publish"],
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
          ],
        },
      ],
    },
    { name: "notas", title: "Notas", type: "text" },
  ],
  preview: {
    select: {
      referencia: "referencia",
      estado: "estado",
      nome: "nome",
      data: "data",
    },
    prepare({ referencia, estado, nome, data }: Record<string, any>) {
      const estadoLabel: Record<string, string> = {
        pendente: "Pendente",
        confirmada: "Confirmada",
        em_preparacao: "Em preparação",
        entregue: "Entregue",
        cancelada: "Cancelada",
      };
      return {
        title: `${referencia ?? "—"} · ${nome ?? "—"}`,
        subtitle: `${estadoLabel[estado] ?? "Pendente"} · ${data ?? "sem data"}`,
      };
    },
  },
};
