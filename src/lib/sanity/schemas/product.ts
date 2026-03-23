export const product = {
  name: "product",
  title: "Bolo",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Nome do bolo",
      type: "string",
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "category",
      title: "Categoria",
      type: "string",
      options: {
        list: [
          { title: "Cheesecake", value: "cheesecakes" },
          { title: "Bolo de Chocolate", value: "chocolate" },
          { title: "Bolo de Cenoura", value: "cenoura" },
          { title: "Outros", value: "outros" },
        ],
        layout: "radio",
      },
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "description",
      title: "Descricao",
      type: "text",
      rows: 3,
    },
    {
      name: "images",
      title: "Fotos",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Texto alternativo",
              type: "string",
            },
          ],
        },
      ],
      validation: (rule: { min: (n: number) => unknown }) => rule.min(1),
    },
    {
      name: "sizes",
      title: "Tamanhos e preco",
      description: "Adiciona os tamanhos disponiveis e o preco de cada um",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Tamanho",
              type: "string",
              placeholder: "Ex: 20cm (8-10 pessoas)",
            },
            {
              name: "price",
              title: "Preco (€)",
              type: "number",
            },
          ],
          preview: {
            select: { title: "label", subtitle: "price" },
            prepare(value: Record<string, string | number>) {
              return { title: value.title, subtitle: value.subtitle ? `€${value.subtitle}` : "Sem preco" };
            },
          },
        },
      ],
    },
    {
      name: "flavours",
      title: "Sabores disponiveis",
      description: "Sabores ou variacoes que o cliente pode escolher",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    },
    {
      name: "featured",
      title: "Destaque na homepage",
      type: "boolean",
      initialValue: false,
      description: "Mostrar este bolo na pagina inicial",
    },
    {
      name: "destaque",
      title: "Especial da epoca",
      type: "boolean",
      initialValue: false,
      description: "Marcar como especial sazonal (ex: Pascoa, Natal). Aparece numa secao propria na homepage.",
    },
    {
      name: "etiqueta",
      title: "Etiqueta do especial (opcional)",
      type: "string",
      description: "Ex: Especial de Pascoa, Edicao Limitada. Se vazio, mostra 'Destaque'.",
    },
    {
      name: "available",
      title: "Disponivel para encomenda",
      type: "boolean",
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "category",
      media: "images.0",
    },
    prepare(value: Record<string, string>) {
      const labels: Record<string, string> = {
        cheesecakes: "Cheesecake",
        chocolate: "Bolo de Chocolate",
        cenoura: "Bolo de Cenoura",
        outros: "Outros",
      };
      return {
        title: value.title,
        subtitle: labels[value.subtitle] ?? value.subtitle,
        media: value.media,
      };
    },
  },
};
