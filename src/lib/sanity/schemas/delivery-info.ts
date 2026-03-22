export const deliveryInfo = {
  name: "deliveryInfo",
  title: "Informacoes de Entrega",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    {
      name: "zones",
      title: "Zonas de entrega",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "zone",
              title: "Zona",
              type: "string",
              placeholder: "Ex: Braga centro",
            },
            {
              name: "price",
              title: "Preco de entrega (€)",
              type: "number",
              description: "0 para entrega gratuita",
            },
          ],
          preview: {
            select: { title: "zone", subtitle: "price" },
            prepare(value: Record<string, string | number>) {
              return {
                title: value.title,
                subtitle: value.subtitle === 0 ? "Entrega gratuita" : `€${value.subtitle}`,
              };
            },
          },
        },
      ],
    },
    {
      name: "leadTime",
      title: "Prazo minimo de encomenda",
      type: "string",
      placeholder: "Ex: 3 dias de antecedencia",
    },
    {
      name: "notes",
      title: "Notas adicionais",
      type: "text",
      rows: 3,
      description: "Informacoes extras sobre entrega (horarios, restricoes, etc.)",
    },
  ],
  preview: {
    prepare() {
      return { title: "Informacoes de Entrega" };
    },
  },
};
