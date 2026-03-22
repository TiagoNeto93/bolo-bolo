export const pageContent = {
  name: "pageContent",
  title: "Conteudo de Pagina",
  type: "document",
  fields: [
    {
      name: "page",
      title: "Pagina",
      type: "string",
      options: {
        list: [
          { title: "Inicio", value: "home" },
          { title: "Sobre", value: "sobre" },
          { title: "Contacto", value: "contacto" },
        ],
      },
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "heading",
      title: "Titulo",
      type: "string",
    },
    {
      name: "body",
      title: "Corpo",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "heroImage",
      title: "Imagem principal",
      type: "image",
      options: { hotspot: true },
    },
  ],
};
