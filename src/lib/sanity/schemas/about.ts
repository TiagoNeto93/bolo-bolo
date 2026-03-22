export const about = {
  name: "about",
  title: "Sobre Mim",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    {
      name: "heading",
      title: "Titulo",
      type: "string",
    },
    {
      name: "photo",
      title: "Foto",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "body",
      title: "Texto",
      type: "array",
      of: [{ type: "block" }],
      description: "A tua historia — escreve como quiseres",
    },
  ],
  preview: {
    prepare() {
      return { title: "Sobre Mim" };
    },
  },
};
