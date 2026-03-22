export const product = {
  name: "product",
  title: "Produto",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Nome",
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
      name: "description",
      title: "Descricao",
      type: "text",
    },
    {
      name: "image",
      title: "Imagem",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "price",
      title: "Preco",
      type: "number",
    },
    {
      name: "category",
      title: "Categoria",
      type: "string",
      options: {
        list: [
          { title: "Cheesecakes", value: "cheesecakes" },
          { title: "Bolos de Chocolate", value: "chocolate" },
          { title: "Bolos de Cenoura", value: "cenoura" },
          { title: "Outros", value: "outros" },
        ],
      },
    },
    {
      name: "available",
      title: "Disponivel",
      type: "boolean",
      initialValue: true,
    },
  ],
};
