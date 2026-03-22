export const galleryImage = {
  name: "galleryImage",
  title: "Imagem da Galeria",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Titulo",
      type: "string",
    },
    {
      name: "image",
      title: "Imagem",
      type: "image",
      options: { hotspot: true },
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "alt",
      title: "Texto alternativo",
      type: "string",
    },
  ],
};
