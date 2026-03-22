export const homepage = {
  name: "homepage",
  title: "Pagina Inicial",
  type: "document",
  // Singleton — only one document
  __experimental_actions: ["update", "publish"],
  fields: [
    {
      name: "heroTagline",
      title: "Tagline do hero",
      type: "string",
      description: "Texto pequeno acima do titulo (ex: Bolos caseiros em Braga)",
    },
    {
      name: "heroDescription",
      title: "Descricao do hero",
      type: "text",
      rows: 2,
      description: "Texto abaixo do titulo Bolo-Bolo",
    },
    {
      name: "heroCta",
      title: "Texto do botao CTA",
      type: "string",
      description: "Ex: Faz a tua encomenda",
    },
  ],
  preview: {
    prepare() {
      return { title: "Pagina Inicial" };
    },
  },
};
